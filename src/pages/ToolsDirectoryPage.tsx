import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Sparkles, 
  X, 
  RotateCcw,
  Check
} from 'lucide-react';
import { toolsData } from '../data/tools';
import { categories } from '../data/categories';
import { CategoryId, PricingType } from '../data/types';
import { ToolCard } from '../components/ToolCard';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SITE_URL } from '../utils/constants';

interface ToolsDirectoryPageProps {
  initialCategory?: string;
  initialQuery?: string;
  onNavigate: (path: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (toolId: string) => void;
}

export const ToolsDirectoryPage: React.FC<ToolsDirectoryPageProps> = ({
  initialCategory = 'all',
  initialQuery = '',
  onNavigate,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedEase, setSelectedEase] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter and Sort Logic
  const filteredTools = useMemo(() => {
    return toolsData
      .filter((tool) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = tool.name.toLowerCase().includes(q);
          const matchesTagline = tool.tagline.toLowerCase().includes(q);
          const matchesCategory = tool.categoryName.toLowerCase().includes(q);
          const matchesBestFor = tool.bestFor.some(b => b.toLowerCase().includes(q));
          const matchesPros = tool.pros.some(p => p.toLowerCase().includes(q));
          if (!matchesName && !matchesTagline && !matchesCategory && !matchesBestFor && !matchesPros) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
          return false;
        }

        // Pricing filter
        if (selectedPricing !== 'all') {
          if (selectedPricing === 'Free' && tool.pricingType !== 'Free') return false;
          if (selectedPricing === 'Freemium' && tool.pricingType !== 'Freemium') return false;
          if (selectedPricing === 'Paid' && tool.pricingType !== 'Paid') return false;
        }

        // Min rating filter
        if (minRating > 0 && tool.rating.overall < minRating) {
          return false;
        }

        // Ease of use
        if (selectedEase !== 'all' && tool.easeOfUse !== selectedEase) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating.overall - a.rating.overall;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedPricing, minRating, selectedEase, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPricing('all');
    setMinRating(0);
    setSelectedEase('all');
    setSortBy('rating');
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedPricing !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (selectedEase !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const directorySchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'All AI Tools Directory | Verified Software & Ratings',
      description: 'Explore, filter and search through the complete verified directory of AI tools for video, writing, coding, productivity, and image generation.',
      url: `${SITE_URL}/ai-tools`
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
          name: 'AI Tools Directory',
          item: `${SITE_URL}/ai-tools`
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title="All AI Tools Directory | Filter, Search & Compare 250+ Software"
        description="Explore, filter and search through the complete verified directory of AI tools for video, writing, coding, productivity, and image generation."
        canonicalUrl={`${SITE_URL}/ai-tools`}
        schema={directorySchemas}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: 'AI Tools Directory' }]}
          onNavigate={onNavigate}
        />

        {/* Header Title Section */}
        <div className="mt-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            AI Tools Directory
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
            Search, filter, and compare the world’s top generative AI software with verified editorial benchmarks.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools by name, features, or tasks..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                id="directory-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Sort and View Mode */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <SlidersHorizontal size={14} />
                <span>Filters ({activeFiltersCount})</span>
              </button>

              <div className="flex items-center gap-2">
                <label htmlFor="directory-sort-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">
                  Sort:
                </label>
                <select
                  id="directory-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>

              {/* Layout Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    layoutMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Grid view"
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    layoutMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="List view"
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block bg-white border border-slate-200 rounded-2xl p-5 shadow-xs sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal size={15} /> Filters
              </span>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} /> Reset all
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Category
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[11px] text-slate-700">{toolsData.length}</span>
                </button>
                {categories.map((cat) => {
                  const count = toolsData.filter(t => t.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[11px] text-slate-700">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing Filter */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Pricing Model
              </label>
              <div className="space-y-1">
                {['all', 'Free', 'Freemium', 'Paid'].map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => setSelectedPricing(price)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedPricing === price ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{price === 'all' ? 'Any Price Model' : price}</span>
                    {selectedPricing === price && <Check size={13} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Minimum Rating
              </label>
              <div className="space-y-1">
                {[
                  { label: 'All Ratings', value: 0 },
                  { label: '4.8★ and above', value: 4.8 },
                  { label: '4.5★ and above', value: 4.5 },
                  { label: '4.0★ and above', value: 4.0 },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMinRating(item.value)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      minRating === item.value ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {minRating === item.value && <Check size={13} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Ease of Use */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Ease of Use
              </label>
              <div className="grid grid-cols-3 gap-1">
                {['all', 'Beginner', 'Intermediate'].map((ease) => (
                  <button
                    key={ease}
                    type="button"
                    onClick={() => setSelectedEase(ease)}
                    className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedEase === ease 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {ease === 'all' ? 'All' : ease}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Showing <strong>{filteredTools.length}</strong> AI tools</span>
              {activeFiltersCount > 0 && (
                <span>Filtered by {activeFiltersCount} criteria</span>
              )}
            </div>

            {filteredTools.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <Search size={22} />
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-900">No AI tools match your criteria</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  Try clearing your search term or adjusting category and price filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} /> Reset Filters
                </button>
              </div>
            ) : layoutMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onSelect={(slug) => onNavigate(`/reviews/${slug}`)}
                    onCategorySelect={(catId) => setSelectedCategory(catId)}
                    isBookmarked={bookmarkedIds.includes(tool.id)}
                    onToggleBookmark={onToggleBookmark}
                    layout="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onSelect={(slug) => onNavigate(`/reviews/${slug}`)}
                    onCategorySelect={(catId) => setSelectedCategory(catId)}
                    isBookmarked={bookmarkedIds.includes(tool.id)}
                    onToggleBookmark={onToggleBookmark}
                    layout="list"
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
