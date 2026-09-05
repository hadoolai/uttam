import React, { useState } from 'react';
import { articlesData } from '../data/articles';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BookOpen, Sparkles, ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { SITE_URL } from '../utils/constants';

interface ArticlesPageProps {
  onNavigate: (path: string) => void;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({ onNavigate }) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const allTags = Array.from(new Set(articlesData.flatMap(a => a.tags)));

  const filteredArticles = selectedTag === 'all'
    ? articlesData
    : articlesData.filter(a => a.tags.includes(selectedTag));

  const articlesSchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'AI Guides, Tutorials & Benchmark Insights (2026)',
      description: 'In-depth tutorials, prompt engineering masterclasses, video generation benchmarks, and generative AI research.',
      url: `${SITE_URL}/articles`
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
          name: 'Guides & Articles',
          item: `${SITE_URL}/articles`
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title="AI Guides, Tutorials & Benchmark Insights (2026)"
        description="In-depth tutorials, prompt engineering masterclasses, video generation benchmarks, and generative AI research."
        canonicalUrl={`${SITE_URL}/articles`}
        schema={articlesSchemas}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: 'Articles & Tutorials' }]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
            <BookOpen size={14} />
            <span>AI Knowledge Base & Benchmarks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            AI Guides, Tutorials & Insights
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Practical tutorials, model prompt frameworks, workflow breakdowns, and testing logs written by practitioners.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <button
            type="button"
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedTag === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Guides ({articlesData.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === tag ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onNavigate(article.canonicalUrl?.includes('/reviews/') ? `/reviews/${article.slug}` : article.canonicalUrl?.includes('/comparisons/') ? `/comparisons/${article.slug}` : `/articles/${article.slug}`)}
              className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-3xl overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/9 w-full bg-slate-100 overflow-hidden relative">
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

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span>{article.publishDate}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">By HadoolAI Editorial Team</span>
                <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Guide <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
