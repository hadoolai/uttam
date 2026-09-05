import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ExternalLink, Sparkles, BookOpen, Layers } from 'lucide-react';
import { toolsData } from '../data/tools';
import { categories } from '../data/categories';
import { articlesData } from '../data/articles';
import { RatingStars } from './RatingStars';
import { ToolLogo } from './ToolLogo';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Filter tools
  const matchingTools = normalizedQuery
    ? toolsData.filter(
        t =>
          t.name.toLowerCase().includes(normalizedQuery) ||
          t.tagline.toLowerCase().includes(normalizedQuery) ||
          t.categoryName.toLowerCase().includes(normalizedQuery) ||
          t.bestFor.some(b => b.toLowerCase().includes(normalizedQuery)) ||
          t.keyFeatures.some(f => f.title.toLowerCase().includes(normalizedQuery))
      )
    : toolsData.slice(0, 4);

  // Filter articles
  const matchingArticles = normalizedQuery
    ? articlesData.filter(
        a =>
          a.title.toLowerCase().includes(normalizedQuery) ||
          a.excerpt.toLowerCase().includes(normalizedQuery) ||
          a.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
      )
    : articlesData.slice(0, 2);

  // Filter categories
  const matchingCategories = normalizedQuery
    ? categories.filter(c => c.name.toLowerCase().includes(normalizedQuery) || c.description.toLowerCase().includes(normalizedQuery))
    : [];

  const handleItemClick = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        id="global-search-modal"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Search size={20} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI tools (e.g., Runway, ChatGPT, Voice Cloning, Video, Canva)..."
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-base focus:outline-hidden font-medium"
            id="search-modal-input"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-700 bg-slate-200/80 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors shrink-0 font-medium cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-5 divide-y divide-slate-100">
          {/* Quick Categories */}
          {matchingCategories.length > 0 && (
            <div className="pt-2 first:pt-0">
              <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase block mb-2 px-2">
                Categories
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {matchingCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleItemClick(`/${cat.slug}`)}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-left transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    <Layers size={14} className="text-indigo-500 shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Tools List */}
          <div className="pt-3 first:pt-0">
            <div className="flex items-center justify-between mb-2.5 px-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                {normalizedQuery ? `AI Tools (${matchingTools.length})` : 'Popular AI Tools'}
              </span>
              {!normalizedQuery && (
                <span className="text-[11px] text-slate-700">Editor recommendations</span>
              )}
            </div>

            {matchingTools.length === 0 ? (
              <div className="text-center py-6 text-slate-700 text-sm">
                No tools found matching "{query}". Try searching for categories like "video", "writing", or "image".
              </div>
            ) : (
              <div className="space-y-1.5">
                {matchingTools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleItemClick(`/reviews/${tool.slug}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                        <ToolLogo 
                          src={tool.logo} 
                          name={tool.name}
                          className="w-full h-full object-contain rounded-md"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 group-hover:text-indigo-600 text-sm">
                            {tool.name}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {tool.categoryName}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            {tool.pricingType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 truncate mt-0.5">
                          {tool.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <RatingStars score={tool.rating.overall} size="sm" showNumeric={false} />
                      <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Articles Section */}
          {matchingArticles.length > 0 && (
            <div className="pt-3">
              <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase block mb-2 px-2">
                Guides & Articles
              </span>
              <div className="space-y-1.5">
                {matchingArticles.map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => handleItemClick(art.canonicalUrl?.includes('/reviews/') ? `/reviews/${art.slug}` : art.canonicalUrl?.includes('/comparisons/') ? `/comparisons/${art.slug}` : `/articles/${art.slug}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookOpen size={16} className="text-indigo-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 truncate">
                          {art.title}
                        </p>
                        <span className="text-[11px] text-slate-700">{art.category} • {art.readTime}</span>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono shadow-2xs">ESC</kbd> to close</span>
            <span>Browse all <button type="button" onClick={() => handleItemClick('/ai-tools')} className="text-indigo-600 font-semibold hover:underline cursor-pointer">AI Tools &rarr;</button></span>
          </div>
          <span className="hidden sm:inline">HadoolAI Search</span>
        </div>
      </div>
    </div>
  );
};
