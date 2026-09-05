import React, { useState } from 'react';
import { comparisonsData } from '../data/comparisons';
import { articlesData } from '../data/articles';
import { toolsData, getToolBySlug } from '../data/tools';
import { AITool } from '../data/types';
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
  Zap,
  DollarSign
} from 'lucide-react';

interface ComparisonsPageProps {
  onNavigate: (path: string) => void;
}

export const ComparisonsPage: React.FC<ComparisonsPageProps> = ({ onNavigate }) => {
  const [toolAId, setToolAId] = useState<string>('chatgpt');
  const [toolBId, setToolBId] = useState<string>('gemini');

  const selectedToolA = toolsData.find(t => t.id === toolAId) || toolsData[0];
  const selectedToolB = toolsData.find(t => t.id === toolBId) || toolsData[1];

  const handleSwap = () => {
    setToolAId(toolBId);
    setToolBId(toolAId);
  };

  const comparisonsSchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'AI Tools Comparisons & Battles | Side-by-Side Benchmark Tables',
      description: 'Compare leading generative AI tools side-by-side. Benchmark pricing, free plans, multimodal features, speed, and real-world accuracy.',
      url: `${SITE_URL}/comparisons`
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
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title="AI Tools Comparisons | Side-by-Side Benchmark Tables & Head-to-Head Tests"
        description="Compare leading generative AI tools side-by-side. Benchmark pricing, free plans, multimodal features, speed, and real-world accuracy."
        canonicalUrl={`${SITE_URL}/comparisons`}
        schema={comparisonsSchemas}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: 'Comparisons' }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="mt-4 mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
            <Scale size={14} />
            <span>Side-by-Side Matrix Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            AI Tools Comparisons & Battles
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Unbiased head-to-head comparisons evaluating output fidelity, pricing tiers, token context, and everyday usability.
          </p>
        </div>

        {/* 1. INTERACTIVE SIDE-BY-SIDE COMPARE TOOL */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-14">
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-heading font-bold text-slate-900">
                Interactive Custom Tool Compare
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Select any two tools from our database to compare specs instantly.</p>
            </div>
            <button
              type="button"
              onClick={handleSwap}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              ⇄ Swap Tools
            </button>
          </div>

          {/* Selectors Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <label htmlFor="compare-tool-a-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Tool 1:
              </label>
              <select
                id="compare-tool-a-select"
                value={toolAId}
                onChange={(e) => setToolAId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {toolsData.map(t => (
                  <option key={t.id} value={t.id} disabled={t.id === toolBId}>
                    {t.name} ({t.categoryName})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <label htmlFor="compare-tool-b-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Tool 2:
              </label>
              <select
                id="compare-tool-b-select"
                value={toolBId}
                onChange={(e) => setToolBId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {toolsData.map(t => (
                  <option key={t.id} value={t.id} disabled={t.id === toolAId}>
                    {t.name} ({t.categoryName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* COMPARISON TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400 w-1/4">Criteria</th>
                  <th className="py-4 px-4 w-3/8 bg-indigo-50/40 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0">
                        <ToolLogo src={selectedToolA.logo} name={selectedToolA.name} className="w-full h-full object-contain rounded-lg" loading="lazy" />
                      </div>
                      <div>
                        <div className="font-heading font-bold text-base text-slate-900">{selectedToolA.name}</div>
                        <RatingStars score={selectedToolA.rating.overall} size="sm" />
                      </div>
                    </div>
                  </th>
                  <th className="py-4 px-4 w-3/8 bg-purple-50/40 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0">
                        <ToolLogo src={selectedToolB.logo} name={selectedToolB.name} className="w-full h-full object-contain rounded-lg" loading="lazy" />
                      </div>
                      <div>
                        <div className="font-heading font-bold text-base text-slate-900">{selectedToolB.name}</div>
                        <RatingStars score={selectedToolB.rating.overall} size="sm" />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {/* Overall Rating */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-900 text-xs uppercase tracking-wider">Overall Rating</td>
                  <td className="py-4 px-4 bg-indigo-50/20 font-bold text-indigo-700 text-base">{selectedToolA.rating.overall.toFixed(1)} / 5.0</td>
                  <td className="py-4 px-4 bg-purple-50/20 font-bold text-purple-700 text-base">{selectedToolB.rating.overall.toFixed(1)} / 5.0</td>
                </tr>

                {/* Starting Price */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-900 text-xs uppercase tracking-wider">Pricing</td>
                  <td className="py-4 px-4 bg-indigo-50/20 font-semibold text-slate-900">{selectedToolA.pricingType} • {selectedToolA.startingPrice}</td>
                  <td className="py-4 px-4 bg-purple-50/20 font-semibold text-slate-900">{selectedToolB.pricingType} • {selectedToolB.startingPrice}</td>
                </tr>

                {/* Free Plan */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-900 text-xs uppercase tracking-wider">Free Plan</td>
                  <td className="py-4 px-4 bg-indigo-50/20 text-xs text-slate-700 leading-relaxed">{selectedToolA.freePlanDetails}</td>
                  <td className="py-4 px-4 bg-purple-50/20 text-xs text-slate-700 leading-relaxed">{selectedToolB.freePlanDetails}</td>
                </tr>

                {/* Main Features */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-900 text-xs uppercase tracking-wider">Main Key Features</td>
                  <td className="py-4 px-4 bg-indigo-50/20">
                    <ul className="space-y-1 text-xs text-slate-700">
                      {selectedToolA.keyFeatures.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-indigo-600 shrink-0 mt-0.5" />
                          <span><strong>{f.title}:</strong> {f.description.slice(0, 75)}...</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-4 bg-purple-50/20">
                    <ul className="space-y-1 text-xs text-slate-700">
                      {selectedToolB.keyFeatures.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-purple-600 shrink-0 mt-0.5" />
                          <span><strong>{f.title}:</strong> {f.description.slice(0, 75)}...</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>

                {/* Ease of Use */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-900 text-xs uppercase tracking-wider">Ease of Use</td>
                  <td className="py-4 px-4 bg-indigo-50/20 font-medium text-slate-800">{selectedToolA.easeOfUse} ({selectedToolA.rating.easeOfUse}/5.0)</td>
                  <td className="py-4 px-4 bg-purple-50/20 font-medium text-slate-800">{selectedToolB.easeOfUse} ({selectedToolB.rating.easeOfUse}/5.0)</td>
                </tr>

                {/* Best Use Case */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-900 text-xs uppercase tracking-wider">Best Use Case</td>
                  <td className="py-4 px-4 bg-indigo-50/20 text-xs text-slate-700 leading-relaxed">{selectedToolA.bestFor.join(', ')}</td>
                  <td className="py-4 px-4 bg-purple-50/20 text-xs text-slate-700 leading-relaxed">{selectedToolB.bestFor.join(', ')}</td>
                </tr>

                {/* Top Pros */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-900 text-xs uppercase tracking-wider">Top Advantage</td>
                  <td className="py-4 px-4 bg-indigo-50/20 text-xs font-semibold text-emerald-700">{selectedToolA.pros[0]}</td>
                  <td className="py-4 px-4 bg-purple-50/20 text-xs font-semibold text-emerald-700">{selectedToolB.pros[0]}</td>
                </tr>

                {/* Action Links */}
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-900 text-xs uppercase tracking-wider">Actions</td>
                  <td className="py-4 px-4 bg-indigo-50/20 rounded-b-2xl">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/reviews/${selectedToolA.slug}`)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Read Review
                      </button>
                      <a
                        href={selectedToolA.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                      >
                        Visit Site
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-4 bg-purple-50/20 rounded-b-2xl">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/reviews/${selectedToolB.slug}`)}
                        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Read Review
                      </button>
                      <a
                        href={selectedToolB.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                      >
                        Visit Site
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. CURATED HEAD-TO-HEAD COMPARISON ARTICLES */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={18} className="text-indigo-600" />
            <h2 className="text-2xl font-heading font-bold text-slate-900">
              Curated Head-to-Head Battles & Verdicts
            </h2>
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
                  className="bg-white border border-slate-200 hover:border-indigo-300 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  id={`curated-battle-${comp.id}`}
                >
                  <div>
                    {/* Tool Badges Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0">
                          <ToolLogo src={toolA.logo} name={toolA.name} className="w-full h-full object-contain rounded-lg" loading="lazy" />
                        </div>
                        <span className="font-bold text-sm text-slate-900">{toolA.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        VS
                      </span>
                      <div className="flex items-center gap-3 text-right">
                        <span className="font-bold text-sm text-slate-900">{toolB.name}</span>
                        <div className="w-11 h-11 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0">
                          <ToolLogo src={toolB.logo} name={toolB.name} className="w-full h-full object-contain rounded-lg" loading="lazy" />
                        </div>
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-slate-900 hover:text-indigo-600 transition-colors">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {comp.summaryVerdict}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                    <span>Read Full Battle Verdict</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}

            {/* Platform Comparison Articles */}
            {articlesData
              .filter(a => a.category === 'Platform Comparison' || a.slug === 'bilibili-vs-youtube')
              .map((article) => (
                <div
                  key={article.id}
                  onClick={() => onNavigate(`/comparisons/${article.slug}`)}
                  className="bg-white border border-slate-200 hover:border-indigo-300 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  id={`curated-battle-${article.id}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                        Platform & Ecosystem Battle
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-slate-900 hover:text-indigo-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                    <span>Read Platform Breakdown</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
