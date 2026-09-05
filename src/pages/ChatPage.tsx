import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  RotateCcw,
  Square,
  Mic,
  MicOff,
  Globe,
  Plus,
  ShieldCheck,
  Zap,
  Newspaper,
  Compass,
  Code,
  PenTool,
  HelpCircle,
  Search,
  MessageSquare,
  Check,
} from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { useChatAssistant } from '../utils/useChatAssistant';
import { ChatMessageItem } from '../components/Chatbot/ChatMessageItem';
import { trackEvent } from '../utils/analytics';

interface ChatPageProps {
  onNavigate: (path: string) => void;
}

const SUGGESTED_CARDS = [
  {
    icon: Newspaper,
    title: 'Latest AI News',
    desc: 'Current releases, breakthroughs & model updates',
    prompt: 'What is the latest AI news and updates in 2026?',
    badge: 'Real-time Web',
  },
  {
    icon: Compass,
    title: 'AI Tool Recommendations',
    desc: 'Find the best tools for your specific workflow',
    prompt: 'Which AI writing tools does HadoolAI recommend for content creators?',
    badge: 'HadoolAI Knowledge',
  },
  {
    icon: HelpCircle,
    title: 'Technology Questions',
    desc: 'Concepts, algorithms & how systems work',
    prompt: 'Explain quantum computing simply with a real-world analogy.',
    badge: 'Explanations',
  },
  {
    icon: PenTool,
    title: 'Writing & Drafting',
    desc: 'Draft articles, outreach emails & scripts',
    prompt: 'Write a persuasive, professional client pitch email for freelance work.',
    badge: 'Creative Help',
  },
  {
    icon: Code,
    title: 'Coding & Debugging',
    desc: 'Explain errors, write scripts & optimize code',
    prompt: 'Explain JavaScript promises vs async/await with clean code examples.',
    badge: 'Code Solutions',
  },
  {
    icon: Zap,
    title: 'Live Sports & Markets',
    desc: 'Live scores, financial trends & world events',
    prompt: 'Who won the latest international cricket match and what was the score?',
    badge: 'Google Search',
  },
];

const QUICK_PROMPTS = [
  'What is ChatGPT?',
  'Best AI tools for writing?',
  'Explain quantum computing simply',
  'Who won the latest cricket match?',
  'How can I create a website with AI?',
  'What is the current price of Bitcoin?',
  'ChatGPT vs Gemini?',
  'Best free AI tools?',
];

export const ChatPage: React.FC<ChatPageProps> = ({ onNavigate }) => {
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

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, statusMessage]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputMessage]);

  const handleSend = (text?: string) => {
    const q = (text || inputMessage).trim();
    if (!q || isLoading) return;
    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SeoHead
        title="HadoolAI AI Assistant — AI Chatbot"
        description="Ask HadoolAI AI Assistant questions, search current web information and get useful answers with sources."
        canonicalUrl="https://hadoolai.co.in/chat"
      />

      {/* Top Page Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                  HadoolAI AI Assistant
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Grounded in Google Search & HadoolAI Verified Reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearChat}
              disabled={messages.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200/80 transition-all cursor-pointer"
              title="Start a fresh conversation"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Chat</span>
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition-colors cursor-pointer"
                title="Clear conversation history"
                aria-label="Clear chat history"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between">
        {messages.length === 0 ? (
          /* Welcome State */
          <div className="py-6 sm:py-10 space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-50 to-indigo-100 border border-indigo-200 text-indigo-600 shadow-xs mb-2">
                <Sparkles size={28} className="animate-pulse" />
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Ask HadoolAI Anything
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Get helpful answers, search the web when needed, and explore verified information with sources.
              </p>

              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                <Globe size={13} className="text-indigo-600" />
                <span>Google Search Grounding Active</span>
                <span className="text-slate-300">•</span>
                <span>English, Hindi & Hinglish</span>
              </div>
            </div>

            {/* Suggested Topic Cards (2x3 Grid) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 px-1">
                Explore Suggested Topics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SUGGESTED_CARDS.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(card.prompt)}
                      className="group text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Icon size={16} />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                            {card.badge}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {card.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-snug">
                          {card.desc}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-indigo-600 group-hover:underline mt-3 inline-block">
                        Try prompt →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Pill Prompts */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 px-1">
                Popular Quick Questions
              </h3>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="text-xs bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 font-medium px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Message Stream */
          <div className="space-y-6 pb-6">
            {messages.map((msg, index) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                onNavigate={onNavigate}
                onRegenerate={regenerateLastMessage}
                isLastAssistant={
                  index === messages.length - 1 ||
                  (index === messages.length - 2 && messages[messages.length - 1].role === 'user')
                }
              />
            ))}

            {/* Live Search / Thinking Status Indicator */}
            {isLoading && statusMessage && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/70 text-indigo-800 text-xs font-semibold w-fit animate-in fade-in duration-200 shadow-2xs">
                <Search size={14} className="animate-spin text-indigo-600" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Error Message with Retry */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm space-y-2.5">
                <p className="font-medium">{errorMessage}</p>
                {lastUserPrompt && (
                  <button
                    type="button"
                    onClick={regenerateLastMessage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Try again</span>
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Sticky Input Footer Area */}
        <div className="sticky bottom-4 z-20 pt-2">
          {/* Stop Generating Floating Action */}
          {isLoading && (
            <div className="flex justify-center mb-2">
              <button
                type="button"
                onClick={stopGenerating}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 shadow-md transition-all cursor-pointer"
              >
                <Square size={12} className="fill-rose-500 text-rose-500" />
                <span>Stop generating</span>
              </button>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-300/80 shadow-lg p-2 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={textareaRef}
                id="hadoolai-chatpage-input"
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything (e.g. latest AI news, write an article, compare tools, today's cricket match)..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 px-3 py-2.5 resize-none focus:outline-none min-h-[44px] max-h-44 disabled:opacity-50"
              />

              {/* Voice Input Button */}
              {isSpeechSupported && (
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  title={isListening ? 'Stop recording voice' : 'Dictate with microphone'}
                  aria-label="Voice input"
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              )}

              {/* Send Button */}
              <button
                type="submit"
                id="hadoolai-chatpage-submit"
                disabled={!inputMessage.trim() || isLoading}
                aria-label="Send message"
                className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center shrink-0 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </form>

            {/* Input Utility Badges */}
            <div className="mt-1.5 px-3 pb-1 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Globe size={12} className="text-indigo-600" />
                <span>Google Search Grounding Enabled</span>
              </span>
              <span className="hidden sm:inline">
                Enter to send • Shift + Enter for new line
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
