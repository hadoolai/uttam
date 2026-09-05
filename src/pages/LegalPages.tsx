import React from 'react';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SITE_URL } from '../utils/constants';

interface LegalPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title="Privacy Policy | HadoolAI"
        description="Our privacy policy detailing how we protect user data, respect reader anonymity, and handle cookies on HadoolAI."
        canonicalUrl={`${SITE_URL}/privacy`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: 'Privacy Policy' }]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 mb-6">
            Privacy Policy
          </h1>
          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <p>Last Updated: February 2026</p>

            <h3 className="font-bold text-slate-900 text-base">1. Information We Collect</h3>
            <p>
              HadoolAI does not require registration to browse reviews, compare tools, or read guides. When you subscribe to our newsletter or submit a review, we collect only the contact information you explicitly provide (such as your email address and name).
            </p>

            <h3 className="font-bold text-slate-900 text-base">2. Local Storage and Saved Bookmarks</h3>
            <p>
              Tool bookmarks and favorites are stored entirely within your browser's local client storage (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs">localStorage</code>) and are not transmitted to any remote advertising networks.
            </p>

            <h3 className="font-bold text-slate-900 text-base">3. Affiliate and External Links Disclosure</h3>
            <p>
              Some outbound links to third-party AI software may contain affiliate tracking codes. If you purchase a paid subscription through these links, HadoolAI may receive a small commission at no additional cost to you. This does not influence our editorial scores or benchmark rankings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title="Terms & Conditions | HadoolAI"
        description="Terms of service and content usage guidelines for HadoolAI."
        canonicalUrl={`${SITE_URL}/terms`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: 'Terms & Conditions' }]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 mb-6">
            Terms & Conditions
          </h1>
          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <p>Last Updated: February 2026</p>

            <h3 className="font-bold text-slate-900 text-base">1. Editorial Content & Benchmarks</h3>
            <p>
              All reviews, ratings, pricing breakdowns, and benchmark scores published on HadoolAI are provided for informational and educational purposes. While we strive to maintain 100% accuracy, third-party AI pricing models and API features can change frequently.
            </p>

            <h3 className="font-bold text-slate-900 text-base">2. Intellectual Property</h3>
            <p>
              All written articles, testing rubrics, proprietary comparisons, and editorial analyses are the copyrighted intellectual property of HadoolAI. Product logos and trademarks belong to their respective corporate owners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
