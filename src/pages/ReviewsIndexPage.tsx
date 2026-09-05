import React, { useState } from 'react';
import { toolsData } from '../data/tools';
import { categories } from '../data/categories';
import { ToolCard } from '../components/ToolCard';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShieldCheck, Sparkles, SlidersHorizontal, Search } from 'lucide-react';
import { SITE_URL } from '../utils/constants';

interface ReviewsIndexPageProps {
  onNavigate: (path: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (toolId: string) => void;
}

export const ReviewsIndexPage: React.FC<ReviewsIndexPageProps> = ({
  onNavigate,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredTools = toolsData.filter(t => {
    if (selectedCat !== 'all' && t.category !== selectedCat) return false;
    if (searchFilter.trim() && !t.name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  const reviewsSchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Comprehensive AI Software Reviews (2026)',
      description: 'Read detailed, expert editorial reviews of generative AI software. Tested on features, performance, UI, pricing, and pros & cons.',
      url: `${SITE_URL}/reviews`
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
          name: 'Reviews',
          item: `${SITE_URL}/reviews`
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title="AI Tool Reviews (2026) | In-Depth Benchmarks & Honest Scores"
        description="Read detailed, expert editorial reviews of generative AI software. Tested on features, performance, UI, pricing, and pros & cons."
        canonicalUrl={`${SITE_URL}/reviews`}
        schema={reviewsSchemas}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: 'In-Depth Reviews' }]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
            <ShieldCheck size={14} />
            <span>100% Independent Editorial Lab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            Comprehensive AI Software Reviews
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Every review is backed by hands-on testing, standardized prompt benchmarks, pricing audits, and verified user feedback.
          </p>
        </div>

        {/* Search and Category Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCat('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCat === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Reviews ({toolsData.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCat(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCat === c.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter reviews..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 mb-16">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={(slug) => onNavigate(`/reviews/${slug}`)}
              onCategorySelect={(catId) => onNavigate(`/ai-tools?category=${catId}`)}
              isBookmarked={bookmarkedIds.includes(tool.id)}
              onToggleBookmark={onToggleBookmark}
              layout="list"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
