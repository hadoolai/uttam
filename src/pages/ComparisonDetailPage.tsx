import React from 'react';
import { Comparison } from '../data/types';
import { toolsData, getToolBySlug } from '../data/tools';
import { RatingStars } from '../components/RatingStars';
import { ToolLogo } from '../components/ToolLogo';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SITE_URL } from '../utils/constants';
import { 
  Scale, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  ShieldCheck,
  Trophy,
  Calendar
} from 'lucide-react';

interface ComparisonDetailPageProps {
  comparison: Comparison;
  onNavigate: (path: string) => void;
}

export const ComparisonDetailPage: React.FC<ComparisonDetailPageProps> = ({
  comparison,
  onNavigate
}) => {
  const toolA = toolsData.find(t => t.id === comparison.toolAId) || toolsData[0];
  const toolB = toolsData.find(t => t.id === comparison.toolBId) || toolsData[1];
  const winnerTool = toolsData.find(t => t.id === comparison.winnerId) || toolA;

  const canonicalUrl = `${SITE_URL}/comparisons/${comparison.slug}`;

  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      headline: comparison.title,
      description: comparison.summaryVerdict,
      image: toolA.logo,
      datePublished: '2026-01-15',
      dateModified: comparison.updatedDate || '2026-08-30',
      author: {
        '@type': 'Organization',
        name: 'HadoolAI Editorial Board'
      },
      publisher: {
        '@type': 'Organization',
        name: 'HadoolAI',
        logo: {
          '@type': 'ImageObject',
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
        }
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
          name: 'Comparisons',
          item: `${SITE_URL}/comparisons`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `${toolA.name} vs ${toolB.name}`,
          item: canonicalUrl
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title={`${comparison.title} | In-Depth Head-to-Head Benchmark`}
        description={comparison.summaryVerdict}
        canonicalUrl={canonicalUrl}
        ogType="article"
        ogImage={toolA.logo}
        schema={schemas}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Comparisons', href: '/comparisons' },
            { label: `${toolA.name} vs ${toolB.name}` }
          ]}
          onNavigate={onNavigate}
        />

        {/* Hero Header */}
        <div className="mt-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
            <Scale size={14} />
            <span>Head-to-Head Benchmark ({comparison.updatedDate})</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            {comparison.title}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-2 leading-relaxed">
            {comparison.tagline}
          </p>

          {/* Side-by-Side Faceoff Card */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Tool A Card */}
            <div className="p-6 bg-indigo-50/40 border border-indigo-200 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0">
                    <ToolLogo src={toolA.logo} name={toolA.name} className="w-full h-full object-contain rounded-lg" loading="eager" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-slate-900">{toolA.name}</h3>
                    <RatingStars score={toolA.rating.overall} reviewsCount={toolA.reviewCount} size="sm" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 mb-4">{toolA.tagline}</p>
                <div className="space-y-1 text-xs text-slate-700">
                  <div><strong>Pricing:</strong> {toolA.pricingType} ({toolA.startingPrice})</div>
                  <div><strong>Free tier:</strong> {toolA.freePlanDetails.slice(0, 70)}...</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate(`/reviews/${toolA.slug}`)}
                  className="flex-1 py-2 text-center text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer"
                >
                  Read Review
                </button>
                <a
                  href={toolA.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Site ↗
                </a>
              </div>
            </div>

            {/* Tool B Card */}
            <div className="p-6 bg-purple-50/40 border border-purple-200 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0">
                    <ToolLogo src={toolB.logo} name={toolB.name} className="w-full h-full object-contain rounded-lg" loading="eager" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-slate-900">{toolB.name}</h3>
                    <RatingStars score={toolB.rating.overall} reviewsCount={toolB.reviewCount} size="sm" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 mb-4">{toolB.tagline}</p>
                <div className="space-y-1 text-xs text-slate-700">
                  <div><strong>Pricing:</strong> {toolB.pricingType} ({toolB.startingPrice})</div>
                  <div><strong>Free tier:</strong> {toolB.freePlanDetails.slice(0, 70)}...</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-purple-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate(`/reviews/${toolB.slug}`)}
                  className="flex-1 py-2 text-center text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl cursor-pointer"
                >
                  Read Review
                </button>
                <a
                  href={toolB.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Site ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Category-by-Category Winner Breakdown */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            <span>Category Winner Breakdown</span>
          </h2>

          <div className="space-y-4">
            {comparison.categoryWinner.map((cat, idx) => {
              const catWinner = cat.winnerId === toolA.id ? toolA : toolB;
              return (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{cat.category}</span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{cat.reason}</p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shrink-0 self-start sm:self-auto">
                    <Trophy size={14} className="text-emerald-600" />
                    <span>Winner: {catWinner.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Verdict Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold mb-3">
            <Trophy size={14} />
            <span>Overall Winner: {winnerTool.name}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Final Verdict
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-3">
            {comparison.summaryVerdict}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate(`/reviews/${winnerTool.slug}`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              <span>Read {winnerTool.name} Full Review</span>
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/comparisons')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              <span>Compare Other Tools</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
