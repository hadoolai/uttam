import React from 'react';
import { AITool } from '../data/types';
import { RatingStars } from './RatingStars';
import { ToolLogo } from './ToolLogo';
import { Bookmark, ExternalLink, ArrowRight, CheckCircle2, XCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface ToolCardProps {
  tool: AITool;
  onSelect: (slug: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (toolId: string) => void;
  layout?: 'grid' | 'compact' | 'list';
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelect,
  onCategorySelect,
  isBookmarked = false,
  onToggleBookmark,
  layout = 'grid'
}) => {
  const getPricingBadgeColor = (type: string) => {
    switch (type) {
      case 'Free':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60';
      case 'Freemium':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60';
      case 'Paid':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60';
    }
  };

  if (layout === 'compact') {
    return (
      <div 
        className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition-all duration-200 hover:shadow-md flex items-center justify-between gap-4"
        id={`tool-card-compact-${tool.id}`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-1">
            <ToolLogo 
              src={tool.logo} 
              name={tool.name}
              className="w-full h-full object-contain rounded-md"
              loading="lazy" 
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 
                onClick={() => onSelect(tool.slug)}
                className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors text-base truncate"
              >
                {tool.name}
              </h3>
              {tool.editorsPick && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded">
                  <Sparkles size={11} /> Top Pick
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5 max-w-sm">
              {tool.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <RatingStars score={tool.rating.overall} size="sm" />
          <button
            type="button"
            onClick={() => onSelect(tool.slug)}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Review <ArrowRight size={12} />
          </button>
        </div>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div 
        className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 transition-all duration-200 hover:shadow-md flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
        id={`tool-card-list-${tool.id}`}
      >
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-1.5 shadow-xs">
            <ToolLogo 
              src={tool.logo} 
              name={tool.name}
              className="w-full h-full object-contain rounded-lg"
              loading="lazy" 
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 
                onClick={() => onSelect(tool.slug)}
                className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors"
              >
                {tool.name}
              </h3>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPricingBadgeColor(tool.pricingType)}`}>
                {tool.pricingType} • {tool.startingPrice}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                {tool.categoryName}
              </span>
              {tool.editorsPick && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={12} /> Editor's Choice
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-2.5">
              {tool.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 size={13} /> {tool.pros[0]}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Ease: <strong>{tool.easeOfUse}</strong></span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Platforms: {tool.platforms.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
          <div className="text-left md:text-right">
            <RatingStars score={tool.rating.overall} reviewsCount={tool.reviewCount} size="md" />
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Editorial Score</span>
          </div>
          <div className="flex items-center gap-2">
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(tool.id)}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark tool"}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isBookmarked 
                    ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-400' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                }`}
              >
                <Bookmark size={16} className={isBookmarked ? 'fill-amber-500' : ''} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onSelect(tool.slug)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Read Review <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid Card
  return (
    <div 
      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
      id={`tool-card-grid-${tool.id}`}
    >
      <div>
        {/* Top Header: Logo, Category, Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-1.5 shadow-xs">
              <ToolLogo 
                src={tool.logo} 
                name={tool.name}
                className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                loading="lazy" 
              />
            </div>
            <div>
              <h3 
                onClick={() => onSelect(tool.slug)}
                className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors leading-tight font-heading"
              >
                {tool.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                {onCategorySelect ? (
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategorySelect(tool.category);
                    }}
                    className="text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {tool.categoryName}
                  </button>
                ) : (
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    {tool.categoryName}
                  </span>
                )}
                {tool.editorsPick && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-1.5 py-0.2 rounded">
                    <Sparkles size={10} /> Pick
                  </span>
                )}
              </div>
            </div>
          </div>

          {onToggleBookmark && (
            <button
              type="button"
              onClick={() => onToggleBookmark(tool.id)}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark tool"}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-400' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Bookmark size={15} className={isBookmarked ? 'fill-amber-500' : ''} />
            </button>
          )}
        </div>

        {/* Short Tagline */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4 min-h-[34px]">
          {tool.tagline}
        </p>

        {/* Pricing Badge & Rating Row */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
          <RatingStars score={tool.rating.overall} reviewsCount={tool.reviewCount} size="sm" />
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getPricingBadgeColor(tool.pricingType)}`}>
            {tool.pricingType} • {tool.startingPrice}
          </span>
        </div>

        {/* Key Pros and Cons preview */}
        <div className="space-y-1.5 mb-5 text-xs text-slate-600 dark:text-slate-300">
          {tool.pros.slice(0, 2).map((pro, index) => (
            <div key={`pro-${index}`} className="flex items-start gap-1.5 leading-snug">
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{pro}</span>
            </div>
          ))}
          {tool.cons.length > 0 && (
            <div className="flex items-start gap-1.5 leading-snug text-slate-500 dark:text-slate-400">
              <XCircle size={13} className="text-rose-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{tool.cons[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions: Direct Review Link & Try Tool Button */}
      <div className="pt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelect(tool.slug)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white bg-slate-50 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 py-2.5 px-3 rounded-xl transition-all cursor-pointer"
          id={`btn-read-review-${tool.id}`}
        >
          <span>Read Review</span>
          <ArrowRight size={13} />
        </button>
        <a
          href={tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:text-white bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 dark:hover:bg-indigo-600 border border-indigo-200 dark:border-indigo-800 rounded-xl transition-colors cursor-pointer"
          title={`Try ${tool.name} official site`}
          aria-label={`Try ${tool.name} official site`}
        >
          <span>Try Tool</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};
