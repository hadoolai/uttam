import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Video, 
  PenTool, 
  Image as ImageIcon, 
  Zap, 
  Mic, 
  Code, 
  ShieldCheck, 
  Scale, 
  Star, 
  TrendingUp, 
  BookOpen, 
  Layers,
  ChevronRight,
  ExternalLink,
  Flame
} from 'lucide-react';
import { toolsData, getFeaturedTools, getTrendingTools } from '../data/tools';
import { categories } from '../data/categories';
import { comparisonsData } from '../data/comparisons';
import { articlesData } from '../data/articles';
import { ToolCard } from '../components/ToolCard';
import { ToolLogo } from '../components/ToolLogo';
import { RatingStars } from '../components/RatingStars';
import { SeoHead } from '../components/SeoHead';
import { SITE_URL } from '../utils/constants';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (toolId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenSearch,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [quizTask, setQuizTask] = useState<string>('video');
  const [quizBudget, setQuizBudget] = useState<string>('any');

  const featuredTools = getFeaturedTools();
  const trendingTools = getTrendingTools();

  // Explicit featured tools requested by user
  const requestedFeaturedTools = [
    'chatgpt',
    'claude',
    'gemini',
    'runway',
    'kling',
    'elevenlabs',
    'notebooklm',
    'bilibili'
  ].map(slug => toolsData.find(t => t.id === slug || t.slug === slug)).filter(Boolean) as typeof toolsData;

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      // Direct question to AI Chatbot with Google Search grounding
      onNavigate(`/chat?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      onOpenSearch();
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video': return <Video size={20} className="text-indigo-600 dark:text-indigo-400" />;
      case 'PenTool': return <PenTool size={20} className="text-emerald-600 dark:text-emerald-400" />;
      case 'Image': return <ImageIcon size={20} className="text-amber-600 dark:text-amber-400" />;
      case 'Zap': return <Zap size={20} className="text-purple-600 dark:text-purple-400" />;
      case 'Mic': return <Mic size={20} className="text-rose-600 dark:text-rose-400" />;
      case 'Code': return <Code size={20} className="text-sky-600 dark:text-sky-400" />;
      default: return <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />;
    }
  };

  // Filtered tools for tabbed section
  const tabFilteredTools = activeCategoryTab === 'all'
    ? requestedFeaturedTools
    : toolsData.filter(t => t.category === activeCategoryTab).slice(0, 8);

  // Recommendation logic
  const recommendedTools = toolsData.filter(t => {
    if (quizTask && t.category !== quizTask) return false;
    if (quizBudget === 'free' && t.pricingType !== 'Free' && !t.freePlanDetails.toLowerCase().includes('free')) return false;
    return true;
  }).slice(0, 2);

  // SEO Schemas for Home (WebSite + Organization)
  const homeSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'HadoolAI',
      url: SITE_URL,
      description: 'Reviews, comparisons, pricing, tutorials and AI-powered answers — all in one place.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/ai-tools?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'HadoolAI',
      url: SITE_URL,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      description: 'Independent AI benchmark laboratory evaluating generative AI software, video generators, writing assistants, and productivity tools.',
      sameAs: [
        'https://twitter.com/hadoolai',
        'https://github.com/hadoolai'
      ]
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      <SeoHead
        title="Discover the Best AI Tools | Reviews, Comparisons & Pricing"
        description="Reviews, comparisons, pricing, tutorials and AI-powered answers — all in one place on HadoolAI."
        canonicalUrl={`${SITE_URL}/`}
        schema={homeSchemas}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-white via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Editorial Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>2026 AI Tools Guide & Benchmark Reviews</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Discover the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">AI Tools</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Reviews, comparisons, pricing, tutorials and AI-powered answers — all in one place.
          </p>

          {/* New Article Banner Links */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('/articles/bilibili-app-review-2026')}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition cursor-pointer group"
              id="hero-new-bilibili-review-btn"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>New: Bilibili App Full Review</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/articles/top-usa-tech-trends-2026')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs transition cursor-pointer"
              id="hero-new-top-usa-tech-searches-btn"
            >
              <span>Top USA Tech Searches 2026</span>
            </button>
          </div>

          {/* Primary and Secondary Hero CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/ai-tools')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer"
              id="hero-explore-cta-btn"
            >
              <span>Explore AI Tools</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/chat')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold text-sm shadow-xs transition-all cursor-pointer"
              id="hero-ask-ai-cta-btn"
            >
              <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span>Ask AI</span>
            </button>
          </div>

          {/* Hero Prominent AI Search / Chat Box */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={handleHeroSearchSubmit} className="relative flex items-center shadow-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
              <div className="pl-3.5 text-slate-400 dark:text-slate-500">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Ask anything about AI tools, technology, software, pricing, features or how-to guides..."
                className="w-full px-3 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent text-sm sm:text-base focus:outline-hidden font-medium"
                id="hero-search-input"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs shrink-0"
                id="hero-search-submit-btn"
              >
                <span>Ask AI</span>
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Popular Search Tags */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">Popular:</span>
              {['ChatGPT', 'Claude 3.7', 'Google Gemini', 'Runway', 'Kling AI', 'ElevenLabs', 'NotebookLM', 'Bilibili'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onNavigate(`/chat?q=${encodeURIComponent(`Tell me about ${tag} features, pricing and how it compares to others`)}`)}
                  className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-800 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/80 dark:border-slate-800">
            <div className="p-3 text-center">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">250+</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">AI Tools Evaluated</div>
            </div>
            <div className="p-3 text-center">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">100%</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Independent Testing</div>
            </div>
            <div className="p-3 text-center">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">45k+</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Weekly Readers</div>
            </div>
            <div className="p-3 text-center">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">Live Search</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Grounded Assistant</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED AI TOOLS SECTION */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={14} />
              <span>Editor's Top Picks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
              Featured AI Tools
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
              Hand-tested software that consistently outperforms competition in benchmark tests, speed, and real-world value.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Featured 8' },
              { id: 'video', label: 'Video' },
              { id: 'writing', label: 'Writing' },
              { id: 'image', label: 'Image' },
              { id: 'productivity', label: 'Productivity' },
              { id: 'research', label: 'Research' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategoryTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategoryTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tabFilteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={(slug) => onNavigate(`/reviews/${slug}`)}
              onCategorySelect={(catId) => onNavigate(`/ai-tools?category=${catId}`)}
              isBookmarked={bookmarkedIds.includes(tool.id)}
              onToggleBookmark={onToggleBookmark}
              layout="grid"
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => onNavigate('/ai-tools')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-semibold text-sm transition-all shadow-xs cursor-pointer"
          >
            <span>Explore All 250+ AI Tools</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* 3. BEST AI TOOLS BY CATEGORY */}
      <section className="py-14 sm:py-20 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              Browse Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight mt-1">
              Best AI Tools by Category
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Browse comprehensive rankings organized by your specific creative or business workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onNavigate(`/category/${cat.id}`)}
                className="group relative bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
                id={`category-card-${cat.id}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full">
                      {cat.toolsCount} Tools
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name} Tools
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore category</span>
                  <ChevronRight size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LATEST REVIEWS SECTION */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck size={14} />
              <span>In-Depth Evaluations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
              Latest In-Depth Reviews
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Exhaustive testing, feature deep-dives, benchmark tests, and honest pros and cons.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/reviews')}
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 cursor-pointer"
          >
            <span>View All Reviews</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Reviews List Layout */}
        <div className="space-y-4">
          {toolsData.slice(0, 4).map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={(slug) => onNavigate(`/ai-tools/${slug}`)}
              onCategorySelect={(catId) => onNavigate(`/category/${catId}`)}
              isBookmarked={bookmarkedIds.includes(tool.id)}
              onToggleBookmark={onToggleBookmark}
              layout="list"
            />
          ))}
        </div>
      </section>

      {/* 5. POPULAR COMPARISONS SECTION */}
      <section className="py-14 sm:py-20 bg-slate-900 dark:bg-slate-950 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Scale size={14} />
                <span>Head-to-Head Battles</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
                Popular Comparisons
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Side-by-side matrices evaluating features, pricing, free tiers, and realistic accuracy.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/comparisons')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              <span>Compare Any Tools</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisonsData.map((comp) => {
              const toolA = toolsData.find(t => t.id === comp.toolAId);
              const toolB = toolsData.find(t => t.id === comp.toolBId);
              if (!toolA || !toolB) return null;

              return (
                <div
                  key={comp.id}
                  onClick={() => onNavigate(`/comparisons/${comp.slug}`)}
                  className="group bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-indigo-500/50 p-6 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm"
                  id={`comparison-card-${comp.id}`}
                >
                  <div>
                    {/* Tool Logos Side-by-Side */}
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 p-1 flex items-center justify-center overflow-hidden">
                          <ToolLogo src={toolA.logo} name={toolA.name} className="w-full h-full object-contain rounded-lg" loading="lazy" />
                        </div>
                        <div>
                          <div className="font-bold text-base text-white">{toolA.name}</div>
                          <RatingStars score={toolA.rating.overall} size="sm" />
                        </div>
                      </div>

                      <div className="px-2.5 py-1 rounded-full bg-slate-750 border border-slate-700 text-[11px] font-bold text-indigo-400">
                        VS
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <div className="font-bold text-base text-white">{toolB.name}</div>
                          <RatingStars score={toolB.rating.overall} size="sm" />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 p-1 flex items-center justify-center overflow-hidden">
                          <ToolLogo src={toolB.logo} name={toolB.name} className="w-full h-full object-contain rounded-lg" loading="lazy" />
                        </div>
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {comp.summaryVerdict}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-400">
                    <span>View full comparison matrix</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE AI TOOL FINDER WIDGET */}
      <section className="py-14 sm:py-20 bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold mb-3">
                <Sparkles size={13} /> Interactive Matchmaker
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                Not sure which AI tool you need?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                Select your primary goal to get an instant tailored recommendation from our testing lab.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  What is your primary task?
                </label>
                <select
                  value={quizTask}
                  onChange={(e) => setQuizTask(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  id="tool-finder-task-select"
                >
                  <option value="video">Generate or Edit Video (Cinematic, B-roll)</option>
                  <option value="writing">Long-Form Writing, Copy & Code</option>
                  <option value="image">Create Concept Art & Graphic Design</option>
                  <option value="productivity">Organize Docs & Automate Workflows</option>
                  <option value="audio">Voice Cloning & Studio Voiceovers</option>
                  <option value="coding">AI Code Generation & Repo Indexing</option>
                  <option value="research">Real-time Web Research & Citations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  What is your budget preference?
                </label>
                <select
                  value={quizBudget}
                  onChange={(e) => setQuizBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  id="tool-finder-budget-select"
                >
                  <option value="any">Any Budget (Best Quality Overall)</option>
                  <option value="free">Has Free Tier or Free Credits</option>
                </select>
              </div>
            </div>

            {/* Recommendation Result Cards */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Top Recommendation for Your Selection:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => onNavigate(`/ai-tools/${tool.slug}`)}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-750 hover:border-indigo-200 transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-1 flex items-center justify-center overflow-hidden shrink-0">
                        <ToolLogo src={tool.logo} name={tool.name} className="w-full h-full object-contain rounded-md" loading="lazy" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{tool.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{tool.finalVerdict.badge}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 shrink-0">
                      Review <ArrowRight size={13} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LATEST ARTICLES & TUTORIALS */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen size={14} />
              <span>Tutorials & Research</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
              Latest Articles & Guides
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Learn prompt engineering, benchmark methodology, and how to master AI workflows.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/blog')}
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 cursor-pointer"
          >
            <span>All Articles</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articlesData.slice(0, 3).map((article) => (
            <div
              key={article.id}
              onClick={() => onNavigate(`/blog/${article.slug}`)}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
              id={`article-card-${article.id}`}
            >
              <div>
                <div className="aspect-16/9 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {article.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span>{article.publishDate}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">By HadoolAI Editorial Team</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
