import { useState, useEffect, useRef, useCallback } from 'react';
import { trackEvent } from './analytics';

export interface GroundingSource {
  title: string;
  url: string;
  domain: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  sources?: GroundingSource[];
  searchQueries?: string[];
}

const STORAGE_KEY = 'hadoolai_assistant_history_v2';

export function useChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Speech recognition setup if available in browser
  const isSpeechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback((onResult: (transcript: string) => void) => {
    if (!isSpeechSupported) return;
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onResult(transcript);
        }
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  }, [isSpeechSupported]);

  const stopListening = useCallback(() => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages([]);
    setErrorMessage(null);
    setStatusMessage(null);
    setLastUserPrompt(null);
    setIsLoading(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    trackEvent('chatbot_clear_history', {});
  }, []);

  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setStatusMessage(null);
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 && msg.isStreaming
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
      trackEvent('chatbot_stop_generation', {});
    }
  }, []);

  const sendMessage = useCallback(
    async (queryText: string) => {
      const query = queryText.trim();
      if (!query || isLoading) return;

      setErrorMessage(null);
      setLastUserPrompt(query);
      setStatusMessage('Searching the web...');

      const userMessageId = 'user_' + Date.now();
      const assistantMessageId = 'ast_' + (Date.now() + 1);

      const newUserMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const newAssistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true,
      };

      const updatedHistory = [...messages, newUserMessage];
      setMessages([...updatedHistory, newAssistantMessage]);
      setIsLoading(true);

      trackEvent('chatbot_message_sent', {
        message_index: updatedHistory.length,
      });

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: updatedHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        if (!response.body) {
          throw new Error('Readable stream not supported');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let accumulatedText = '';
        let extractedSources: GroundingSource[] = [];
        let extractedQueries: string[] = [];

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.replace(/^data:\s*/, '');
              if (dataStr === '[DONE]') break;
              try {
                const parsed = JSON.parse(dataStr);

                if (parsed.status) {
                  setStatusMessage(parsed.status);
                }

                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setStatusMessage(null); // Clear search status once text starts streaming
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: accumulatedText }
                        : msg
                    )
                  );
                }

                if (parsed.sources && Array.isArray(parsed.sources)) {
                  extractedSources = parsed.sources;
                }

                if (parsed.searchQueries && Array.isArray(parsed.searchQueries)) {
                  extractedQueries = parsed.searchQueries;
                }

                if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch (err: any) {
                if (err?.name === 'AbortError') return;
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  isStreaming: false,
                  content: accumulatedText || 'I am here to help you explore AI tools!',
                  sources: extractedSources.length > 0 ? extractedSources : undefined,
                  searchQueries: extractedQueries.length > 0 ? extractedQueries : undefined,
                }
              : msg
          )
        );
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }
        console.error('Chat Assistant Error:', err);
        setErrorMessage('Sorry, I couldn’t complete that request right now. Please try again.');
        // Remove empty assistant placeholder if failed completely
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessageId || msg.content.length > 0)
        );
      } finally {
        setIsLoading(false);
        setStatusMessage(null);
        abortControllerRef.current = null;
      }
    },
    [messages, isLoading]
  );

  const regenerateLastMessage = useCallback(() => {
    if (!lastUserPrompt) return;
    // Remove last assistant message if present
    setMessages((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].role === 'assistant') {
        return prev.slice(0, -1);
      }
      return prev;
    });
    sendMessage(lastUserPrompt);
  }, [lastUserPrompt, sendMessage]);

  return {
    messages,
    isLoading,
    statusMessage,
    errorMessage,
    lastUserPrompt,
    isListening,
    isSpeechSupported,
    sendMessage,
    stopGenerating,
    clearChat,
    regenerateLastMessage,
    startListening,
    stopListening,
  };
}
