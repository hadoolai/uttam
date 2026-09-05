import React from 'react';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShieldCheck, Sparkles, Award, Scale, CheckCircle2, Users, Target } from 'lucide-react';
import { SITE_URL } from '../utils/constants';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const aboutSchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About HadoolAI | Testing Methodology & Mission',
      description: 'Learn about our independent testing methodology, benchmark lab, and editorial standards for evaluating generative AI software on HadoolAI.',
      url: `${SITE_URL}/about`
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
          name: 'About Us',
          item: `${SITE_URL}/about`
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title="About HadoolAI | Our Testing Methodology & Mission"
        description="Learn about our independent testing methodology, benchmark lab, and editorial standards for evaluating generative AI software on HadoolAI."
        canonicalUrl={`${SITE_URL}/about`}
        schema={aboutSchemas}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: 'About Us' }]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
            Our Mission & Lab
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight mt-3">
            About HadoolAI
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
            HadoolAI was created with a single uncompromising mission: to provide creators, software engineers, and business leaders with <strong>100% independent, hands-on evaluations</strong> of artificial intelligence tools.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">0% Sponsored Scores</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never accept paid reviews or sponsored rankings. Every score is determined purely by empirical test data.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Scale size={20} />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">Standardized Benchmarks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We run identical prompt matrices across models to measure latency, temporal consistency, reasoning, and token accuracy.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Target size={20} />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">Real-World ROI</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We evaluate whether a tool actually saves time and money for everyday workflows or is merely a novelty wrapper.
            </p>
          </div>
        </div>

        {/* Evaluation Rubric */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8 space-y-6">
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Our 5-Point Testing Rubric
          </h2>
          <div className="space-y-4 text-sm text-slate-700">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 text-base mb-1">1. Output Quality & Hallucination Resistance (30%)</h4>
              <p className="text-xs text-slate-600">Testing accuracy, coherence, prompt adherence, visual resolution, and artifact rate.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 text-base mb-1">2. Features & Workflow Depth (25%)</h4>
              <p className="text-xs text-slate-600">Assessing API support, team workspaces, multi-file management, and export formats.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 text-base mb-1">3. User Experience & Learning Curve (15%)</h4>
              <p className="text-xs text-slate-600">Measuring how quickly a newcomer can achieve production results without frustration.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 text-base mb-1">4. Value for Money & Free Tier Generosity (20%)</h4>
              <p className="text-xs text-slate-600">Auditing subscription fairness, credit burn rates, hidden fees, and refund terms.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 text-base mb-1">5. Privacy, Security & Enterprise Readiness (10%)</h4>
              <p className="text-xs text-slate-600">Verifying data retention policies, SOC-2 compliance, and model training opt-outs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
