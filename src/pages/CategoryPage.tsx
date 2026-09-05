import React, { useState } from 'react';
import { CategoryMeta } from '../data/types';
import { toolsData } from '../data/tools';
import { articlesData } from '../data/articles';
import { ToolCard } from '../components/ToolCard';
import { ToolLogo } from '../components/ToolLogo';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RatingStars } from '../components/RatingStars';
import { SITE_URL } from '../utils/constants';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  SlidersHorizontal,
  BookOpen
} from 'lucide-react';

interface CategoryPageProps {
  category: CategoryMeta;
  onNavigate: (path: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (toolId: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  onNavigate,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');

  const categoryTools = toolsData.filter(t => t.category === category.id);
  const topPick = categoryTools.find(t => t.editorsPick) || categoryTools[0];

  const filteredTools = categoryTools
    .filter(t => {
      if (selectedPricing === 'Free' && t.pricingType !== 'Free') return false;
      if (selectedPricing === 'Freemium' && t.pricingType !== 'Freemium') return false;
      if (selectedPricing === 'Paid' && t.pricingType !== 'Paid') return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating.overall - a.rating.overall;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const relatedArticles = articlesData.filter(a => 
    a.tags.some(tag => tag.toLowerCase().includes(category.name.toLowerCase())) ||
    a.category.toLowerCase().includes(category.id)
  );

  const canonicalUrl = `${SITE_URL}/${category.slug}`;

  const categorySchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Best ${category.name} Tools & Software (2026)`,
      description: category.description,
      url: canonicalUrl,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: categoryTools.map((t, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: t.name,
          url: `${SITE_URL}/reviews/${t.slug}`
        }))
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'AI Tools',
          item: `${SITE_URL}/ai-tools`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `${category.name} Tools`,
          item: canonicalUrl
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title={`Best ${category.name} Tools & Software (2026 Ranked)`}
        description={category.description}
        canonicalUrl={canonicalUrl}
        schema={categorySchemas}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'AI Tools', href: '/ai-tools' },
            { label: `${category.name} Tools` }
          ]}
          onNavigate={onNavigate}
        />

        {/* Category Hero Banner */}
        <div className="mt-4 mb-10 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
              <Sparkles size={13} />
              <span>{category.toolsCount} Verified Tools Ranked</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
              Best {category.name} Tools & Software
            </h1>
            <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
              {category.description}
            </p>
            <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-600 shrink-0" />
              <span><strong>Editorial Benchmark:</strong> {category.heroHighlight}</span>
            </div>
          </div>
        </div>

        {/* Category Top Pick Highlight Spotlight */}
        {topPick && (
          <div className="mb-12 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-3">
                <Sparkles size={13} />
                <span>#1 Editor's Overall Pick in {category.name}</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shrink-0 overflow-hidden shadow-md flex items-center justify-center">
                  <ToolLogo src={topPick.logo} name={topPick.name} className="w-full h-full object-contain rounded-xl" loading="eager" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
                    {topPick.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <RatingStars score={topPick.rating.overall} size="sm" />
                    <span className="text-xs text-slate-300">({topPick.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {topPick.description}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {topPick.pros.slice(0, 2).map((pro, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg text-slate-200">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    {pro}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => onNavigate(`/reviews/${topPick.slug}`)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-md"
              >
                <span>Read Full In-Depth Review</span>
                <ArrowRight size={15} />
              </button>
              <a
                href={topPick.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-colors"
              >
                <span>Visit {topPick.name} Official</span>
              </a>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Pricing:
            </span>
            {['all', 'Free', 'Freemium', 'Paid'].map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => setSelectedPricing(price)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedPricing === price
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {price === 'all' ? 'All Plans' : price}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label htmlFor="category-sort-select" className="text-xs font-semibold text-slate-500">
              Sort by:
            </label>
            <select
              id="category-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={(slug) => onNavigate(`/reviews/${slug}`)}
              isBookmarked={bookmarkedIds.includes(tool.id)}
              onToggleBookmark={onToggleBookmark}
              layout="grid"
            />
          ))}
        </div>

        {/* Related Category Articles */}
        {relatedArticles.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={18} className="text-indigo-600" />
              <h2 className="text-xl font-heading font-bold text-slate-900">
                Related {category.name} Guides & Tutorials
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => onNavigate(`/articles/${article.slug}`)}
                  className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex gap-4 items-center"
                >
                  <img src={article.coverImage} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 uppercase">{article.category}</span>
                    <h3 className="font-heading font-bold text-sm text-slate-900 line-clamp-2 mt-0.5">
                      {article.title}
                    </h3>
                    <span className="text-xs text-slate-500 mt-1 block">{article.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
