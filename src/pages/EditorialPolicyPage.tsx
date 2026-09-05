import React from 'react';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShieldCheck, BookOpen, UserCheck, AlertTriangle, RefreshCw, FileCheck } from 'lucide-react';
import { SITE_URL } from '../utils/constants';

interface EditorialPolicyPageProps {
  onNavigate: (path: string) => void;
}

export const EditorialPolicyPage: React.FC<EditorialPolicyPageProps> = ({ onNavigate }) => {
  const editorialSchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Editorial Policy & Content Standards | HadoolAI',
      description: 'Our editorial guidelines on independent human review, factual verification, correction protocols, and AI disclosure.',
      url: `${SITE_URL}/editorial-policy`
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
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Editorial Policy',
          item: `${SITE_URL}/editorial-policy`
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title="Editorial Policy & Content Standards | HadoolAI"
        description="Our editorial guidelines on independent human review, factual verification, correction protocols, and AI disclosure."
        canonicalUrl={`${SITE_URL}/editorial-policy`}
        schema={editorialSchemas}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'About Us', href: '/about' },
            { label: 'Editorial Policy' }
          ]}
          onNavigate={onNavigate}
        />

        {/* Header */}
        <div className="mt-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
            <BookOpen size={14} />
            <span>Transparency & Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            HadoolAI Editorial Policy
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
            Our mission is to be the web's most trustworthy guide to artificial intelligence software. This document outlines our standards for journalistic independence, accuracy, testing authenticity, and correction procedures.
          </p>
        </div>

        {/* Content Sections */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8 space-y-8 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <UserCheck size={20} className="text-indigo-600" />
              <h2>1. 100% Human Editorial Oversight</h2>
            </div>
            <p>
              While we cover artificial intelligence tools, <strong>every article, review, rating, and comparison on HadoolAI is researched, written, edited, and fact-checked by human software analysts</strong>. We prohibit the automated mass-generation of unedited AI articles.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <ShieldCheck size={20} className="text-emerald-600" />
              <h2>2. Commercial Independence & Scoring Integrity</h2>
            </div>
            <p>
              Our editorial scores and ranking positions cannot be purchased. We do not participate in pay-for-play reviews or private affiliate bidding for higher leaderboard placements. If a software tool has flaws, usability bottlenecks, or bad customer refund terms, we report them openly.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <RefreshCw size={20} className="text-indigo-600" />
              <h2>3. Continuous Updates & Version Auditing</h2>
            </div>
            <p>
              Generative AI is the fastest moving sector in technology. Pricing plans, token limits, and model versions change weekly. Every article on HadoolAI displays its original publication date and its most recent editorial audit date.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <AlertTriangle size={20} className="text-amber-600" />
              <h2>4. Factual Verification & Corrections Policy</h2>
            </div>
            <p>
              If a vendor updates pricing or a reader flags a factual discrepancy in one of our benchmark reviews, our editorial team investigates and issues updates promptly with transparent timestamps. You can submit corrections directly via our <button type="button" onClick={() => onNavigate('/contact')} className="text-indigo-600 underline font-semibold cursor-pointer">Contact Page</button>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
