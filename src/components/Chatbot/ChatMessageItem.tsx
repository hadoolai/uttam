import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  User,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Globe,
  BookOpen,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage } from '../../utils/useChatAssistant';

interface ChatMessageItemProps {
  message: ChatMessage;
  onNavigate: (path: string) => void;
  onRegenerate?: () => void;
  isLastAssistant?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onNavigate,
  onRegenerate,
  isLastAssistant,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const isAssistant = message.role === 'assistant';

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyCode = async (codeText: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedCodeIndex(idx);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    } catch {
      // ignore
    }
  };

  let codeCounter = 0;

  return (
    <div
      className={`flex items-start gap-3 ${
        isAssistant ? 'justify-start' : 'justify-end'
      } group`}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm ring-2 ring-indigo-50">
          <Sparkles size={16} />
        </div>
      )}

      {/* Message Body Card */}
      <div
        className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs transition-all ${
          isAssistant
            ? 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
            : 'bg-indigo-600 text-white font-medium rounded-tr-xs shadow-indigo-600/10'
        }`}
      >
        {/* Header meta for Assistant */}
        {isAssistant && (
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-[11px] text-slate-600">
            <span className="font-semibold text-indigo-600 flex items-center gap-1">
              HadoolAI AI Assistant
            </span>
            <span>{message.timestamp}</span>
          </div>
        )}

        {/* Message Content */}
        {!isAssistant ? (
          <div>
            <p className="whitespace-pre-wrap">{message.content}</p>
            <span className="block text-[10px] text-indigo-200 text-right mt-1 font-normal">
              {message.timestamp}
            </span>
          </div>
        ) : (
          <div className="chatbot-content space-y-3">
            {message.content ? (
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children }) => {
                    const isInternal = href && href.startsWith('/');
                    if (isInternal) {
                      return (
                        <a
                          href={href}
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(href);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-indigo-300 hover:decoration-indigo-600 cursor-pointer inline-flex items-center gap-0.5"
                        >
                          {children}
                        </a>
                      );
                    }
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-indigo-300 hover:decoration-indigo-600 inline-flex items-center gap-0.5"
                      >
                        {children} <ExternalLink size={11} className="inline opacity-70" />
                      </a>
                    );
                  },
                  h1: ({ children }) => (
                    <h2 className="font-heading font-extrabold text-slate-900 text-lg mt-3 mb-2 pb-1 border-b border-slate-100">
                      {children}
                    </h2>
                  ),
                  h2: ({ children }) => (
                    <h3 className="font-heading font-bold text-slate-900 text-base mt-3 mb-1.5">
                      {children}
                    </h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className="font-heading font-bold text-slate-900 text-sm mt-2.5 mb-1">
                      {children}
                    </h4>
                  ),
                  h4: ({ children }) => (
                    <h5 className="font-heading font-semibold text-slate-900 text-xs mt-2 mb-1">
                      {children}
                    </h5>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0 text-slate-700 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-1 mb-2.5 text-slate-700">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 space-y-1 mb-2.5 text-slate-700">{children}</ol>
                  ),
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-bold text-slate-900">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-3 border-indigo-500 pl-3.5 italic text-slate-700 my-2 bg-indigo-50/50 py-1.5 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3 border border-slate-200 rounded-xl shadow-2xs">
                      <table className="min-w-full divide-y divide-slate-200 text-xs">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="bg-slate-100 font-bold px-3 py-2 text-left text-slate-900">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3 py-2 border-t border-slate-100 text-slate-700">
                      {children}
                    </td>
                  ),
                  code: ({ node, className, children, ...props }) => {
                    const isInline = !className && !String(children).includes('\n');
                    if (isInline) {
                      return (
                        <code
                          className="bg-slate-100 text-indigo-700 font-mono text-xs px-1.5 py-0.5 rounded border border-slate-200"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    const codeIndex = codeCounter++;
                    const codeString = String(children).replace(/\n$/, '');
                    return (
                      <div className="relative my-3 rounded-xl overflow-hidden bg-slate-900 text-slate-100 text-xs font-mono border border-slate-800">
                        <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400">
                          <span>Code snippet</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(codeString, codeIndex)}
                            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedCodeIndex === codeIndex ? (
                              <>
                                <Check size={12} className="text-emerald-400" />
                                <span className="text-emerald-400 font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3.5 overflow-x-auto leading-normal">
                          <code>{children}</code>
                        </pre>
                      </div>
                    );
                  },
                }}
              >
                {message.content}
              </Markdown>
            ) : (
              /* Thinking Indicator */
              <div className="flex items-center gap-2 py-2 text-slate-500">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                <span className="text-xs font-medium text-slate-500 ml-1">
                  Thinking and gathering facts...
                </span>
              </div>
            )}

            {/* Pulsing Streaming Cursor */}
            {message.isStreaming && message.content && (
              <span className="inline-block w-1.5 h-4 bg-indigo-600 ml-0.5 animate-pulse align-middle" />
            )}

            {/* Sources Section (when search grounding sources exist) */}
            {message.sources && message.sources.length > 0 && !message.isStreaming && (
              <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-4 -mb-4 p-3.5 rounded-b-2xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <Globe size={14} className="text-indigo-600" />
                  <span>Sources & Citations</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px]">
                    {message.sources.length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {message.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-2 p-2 bg-white hover:bg-indigo-50/70 border border-slate-200 rounded-xl transition-all text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {source.title}
                          </span>
                          <span className="text-[11px] text-slate-600 ml-1.5">
                            ({source.domain})
                          </span>
                        </div>
                      </div>
                      <ExternalLink
                        size={12}
                        className="text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Toolbar on Assistant Message */}
        {isAssistant && message.content && !message.isStreaming && (
          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Copy response"
                aria-label="Copy answer"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {isLastAssistant && onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Regenerate answer"
                  aria-label="Regenerate answer"
                >
                  <RotateCcw size={12} />
                  <span>Regenerate</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-600">
              <span>Google Grounded</span>
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
          <User size={16} />
        </div>
      )}
    </div>
  );
};
