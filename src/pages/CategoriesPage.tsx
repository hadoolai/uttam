import React from 'react';
import { 
  Video, 
  PenTool, 
  Image as ImageIcon, 
  Zap, 
  Mic, 
  Code, 
  Search, 
  ArrowRight, 
  Layers, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { categories } from '../data/categories';
import { getToolsByCategory } from '../data/tools';
import { SeoHead } from '../components/SeoHead';
import { SITE_URL } from '../utils/constants';

interface CategoriesPageProps {
  onNavigate: (path: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="w-6 h-6 text-indigo-400" />;
      case 'PenTool':
        return <PenTool className="w-6 h-6 text-emerald-400" />;
      case 'Image':
        return <ImageIcon className="w-6 h-6 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-purple-400" />;
      case 'Mic':
        return <Mic className="w-6 h-6 text-rose-400" />;
      case 'Code':
        return <Code className="w-6 h-6 text-sky-400" />;
      default:
        return <Search className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <SeoHead
        title="AI Tool Categories | Browse Software by Use Case"
        description="Explore curated categories of AI tools including AI video generators, writing assistants, image synthesizers, coding editors, and productivity agents on HadoolAI."
        canonicalUrl={`${SITE_URL}/categories`}
      />

      {/* Hero Header */}
      <section className="relative py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white dark:from-slate-900 to-slate-50 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
            <Layers size={14} />
            <span>Structured Tool Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 font-heading">
            AI Software Categories
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Browse our independently tested tools categorized by operational discipline, workflow utility, and creative output.
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const tools = getToolsByCategory(category.id);
            const previewTools = tools.slice(0, 4);

            return (
              <div
                key={category.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700/60 group-hover:scale-105 transition-transform">
                      {getIcon(category.iconName)}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {tools.length} Tools
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-heading mb-2">
                    {category.name}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Top Tools in this category */}
                  <div className="mb-6">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                      Popular Software
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {previewTools.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => onNavigate(`/ai-tools/${t.slug}`)}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 border border-slate-200/60 dark:border-slate-700/40 transition-colors cursor-pointer"
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onNavigate(`/category/${category.id}`)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Explore All {category.name}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Trust & Methodology Callout */}
      <section className="py-12 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ShieldCheck className="w-8 h-8 mx-auto text-indigo-500 mb-3" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading mb-2">
            Independent Categorization & Honest Scoring
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            We do not accept payment to rank any tool higher in our categories or directories. Every rating is determined through rigorous hands-on benchmark tests, pricing evaluations, and real-world workflow trials.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/how-we-review')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Read Our Review Methodology & Scoring Criteria →
          </button>
        </div>
      </section>
    </div>
  );
};
