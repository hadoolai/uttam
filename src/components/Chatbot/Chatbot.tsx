import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Square,
  RotateCcw,
  Bot,
  ShieldCheck,
  ArrowRight,
  Maximize2,
  Mic,
  MicOff,
  Globe,
  Plus,
} from 'lucide-react';
import { useChatAssistant } from '../../utils/useChatAssistant';
import { ChatMessageItem } from './ChatMessageItem';
import { trackEvent } from '../../utils/analytics';

interface ChatbotProps {
  onNavigate: (path: string) => void;
  currentPath?: string;
}

const SUGGESTED_QUESTIONS = [
  'What is the latest AI news?',
  'Best AI tools for writing?',
  'ChatGPT vs Gemini?',
  'Who won the latest cricket match?',
  'Best AI video generator in 2026?',
  'How does GST work?',
];

export const Chatbot: React.FC<ChatbotProps> = ({ onNavigate, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const {
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
  } = useChatAssistant();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new message or status arrives
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, statusMessage]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      trackEvent('chatbot_open', {
        source: 'floating_button',
        messages_count: messages.length,
      });
    }
  };

  const handleSend = (text?: string) => {
    const q = (text || inputMessage).trim();
    if (!q || isLoading) return;
    setInputMessage('');
    sendMessage(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
      });
    }
  };

  // If user is on the dedicated full /chat page, do not render duplicate floating assistant UI
  // Note: Placed after all hooks to comply with React's Rules of Hooks
  if (currentPath === '/chat' || currentPath === '/assistant' || currentPath === '/ai-assistant') {
    return null;
  }

  return (
    <>
      {/* Floating Bottom-Right Chat Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="hadoolai-floating-chat-btn"
          type="button"
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close HadoolAI Assistant' : 'Ask HadoolAI Assistant'}
          className={`group flex items-center gap-2.5 px-4 py-3 rounded-full font-bold shadow-xl transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 cursor-pointer ${
            isOpen
              ? 'bg-slate-900 text-white hover:bg-slate-800 ring-2 ring-slate-700'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white hover:from-indigo-500 hover:to-violet-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5'
          }`}
        >
          <div className="relative">
            {isOpen ? (
              <X size={20} className="transition-transform group-hover:rotate-90 duration-200" />
            ) : (
              <div className="relative">
                <Sparkles size={19} className="animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-indigo-600 animate-ping" />
              </div>
            )}
          </div>
          <span className="text-sm font-heading tracking-tight">
            {isOpen ? 'Close' : 'Ask HadoolAI'}
          </span>
        </button>
      </div>

      {/* Floating Chat Panel (Desktop: Popup Box; Mobile: Near Full-Screen) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="HadoolAI AI Assistant chat window"
          className="fixed bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[450px] max-w-[480px] h-[600px] max-h-[calc(100vh-95px)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-white shadow-sm">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-heading font-bold text-sm tracking-tight text-white">
                    HadoolAI AI Assistant
                  </h2>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-300 font-medium">
                  Google Search Grounding & Reviews
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Expand to full /chat page */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('/chat');
                }}
                title="Open full chat page"
                aria-label="Open full chat page"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <Maximize2 size={15} />
              </button>

              {/* New chat / Clear history */}
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  title="New chat"
                  aria-label="Start new conversation"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close assistant"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Privacy & Search Indicator Notice */}
          <div className="bg-indigo-50/80 border-b border-indigo-100 px-3.5 py-1 text-[11px] text-indigo-900 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1 font-medium">
              <Globe size={12} className="text-indigo-600" />
              <span>Google Search Grounding Active</span>
            </span>
            <span className="text-[10px] text-indigo-700">English • Hindi • Hinglish</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            {messages.length === 0 ? (
              /* Welcome State */
              <div className="py-4 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-2xs">
                  <Bot size={26} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Hi! I'm HadoolAI AI Assistant 👋
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-[320px] mx-auto leading-relaxed">
                    Ask me anything! I search the live web when needed and evaluate AI tools from HadoolAI.
                  </p>
                </div>

                {/* Suggested Questions */}
                <div className="pt-2 text-left">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2 px-1">
                    Suggested Questions
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(q)}
                        className="text-left text-xs bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>{q}</span>
                        <ArrowRight
                          size={13}
                          className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Message Thread */
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <ChatMessageItem
                    key={msg.id}
                    message={msg}
                    onNavigate={(p) => {
                      setIsOpen(false);
                      onNavigate(p);
                    }}
                    onRegenerate={regenerateLastMessage}
                    isLastAssistant={
                      index === messages.length - 1 ||
                      (index === messages.length - 2 && messages[messages.length - 1].role === 'user')
                    }
                  />
                ))}

                {/* Real-Time Search Status */}
                {isLoading && statusMessage && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold w-fit animate-pulse">
                    <Globe size={12} className="text-indigo-600 animate-spin" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-2">
                    <p>{errorMessage}</p>
                    {lastUserPrompt && (
                      <button
                        type="button"
                        onClick={regenerateLastMessage}
                        className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Stop Generating Button */}
          {isLoading && (
            <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 flex justify-center">
              <button
                type="button"
                onClick={stopGenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 shadow-2xs transition-all cursor-pointer"
              >
                <Square size={11} className="fill-current text-rose-500" />
                <span>Stop generating</span>
              </button>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-end gap-1.5 bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 rounded-2xl p-1.5 transition-all"
            >
              <textarea
                ref={inputRef}
                id="hadoolai-floating-chat-input"
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask HadoolAI Assistant..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-500 px-2 py-1.5 resize-none focus:outline-none max-h-24 disabled:opacity-50"
              />

              {isSpeechSupported && (
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  title={isListening ? 'Stop recording voice' : 'Dictate with microphone'}
                  aria-label="Voice input"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                </button>
              )}

              <button
                type="submit"
                id="hadoolai-floating-chat-submit"
                disabled={!inputMessage.trim() || isLoading}
                aria-label="Send message"
                className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer disabled:cursor-not-allowed"
              >
                <Send size={14} />
              </button>
            </form>
            <div className="mt-1.5 px-1 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>HadoolAI Assistant</span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('/chat');
                }}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                Open full screen ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
