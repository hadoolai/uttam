import React from 'react';
import { ShieldAlert, Info, ExternalLink, Scale, CheckCircle2 } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { SITE_URL } from '../utils/constants';

interface DisclaimerPageProps {
  onNavigate: (path: string) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <SeoHead
        title="Disclaimer & Disclosure Policy | HadoolAI"
        description="Official disclaimer, affiliate relationship disclosure, and AI chatbot guidance for HadoolAI."
        canonicalUrl={`${SITE_URL}/disclaimer`}
      />

      <section className="py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white dark:from-slate-900 to-slate-50 dark:to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
            <Scale size={14} />
            <span>Transparency & Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 font-heading">
            Disclaimer & Disclosures
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Last updated: February 2026. Please read this disclosure regarding AI software evaluations, affiliate partnerships, and AI assistant outputs.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          
          {/* General Information */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-500" />
              1. General Information Purpose Only
            </h2>
            <p className="mb-2">
              The content provided on <strong>HadoolAI</strong> (accessible via <code>https://hadoolai.co.in</code>) is for general educational, analytical, and informational purposes only. While our editorial team rigorously tests and verifies features, benchmark speeds, and pricing tiers, artificial intelligence technologies evolve rapidly.
            </p>
            <p>
              Prices, features, usage quotas, model versions, and terms of service of third-party AI software may change without prior notice. Always verify final subscription terms on the official provider website before making financial commitments.
            </p>
          </div>

          {/* AI Chatbot & Google Search Grounding */}
          <div className="p-5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40">
            <h2 className="text-xl font-bold text-indigo-950 dark:text-indigo-200 font-heading mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-500" />
              2. AI Assistant & Real-time Web Search Grounding
            </h2>
            <p className="text-sm text-indigo-950/80 dark:text-indigo-200/80 mb-3">
              Our website includes an interactive AI Assistant powered by Google Gemini and official Google Search grounding.
            </p>
            <ul className="text-xs sm:text-sm space-y-2 text-indigo-900/80 dark:text-indigo-200/70 list-disc pl-5">
              <li>Responses are generated dynamically using large language models and public web citations.</li>
              <li>AI responses should not be considered legal, financial, tax, or medical advice.</li>
              <li>We make no guarantees of absolute completeness or accuracy of real-time web citations, although our models strive to cite authoritative sources.</li>
              <li>Users are encouraged to click the provided source citation links to review primary documentation directly.</li>
            </ul>
          </div>

          {/* Affiliate Disclosure */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              3. Affiliate Relationship Disclosure (FTC & Global Compliance)
            </h2>
            <p className="mb-2">
              Some outbound links on HadoolAI are affiliate links. This means that if you click on an outbound link and subsequently purchase a paid subscription or license, HadoolAI may receive an affiliate referral commission at <strong>no extra cost to you</strong>.
            </p>
            <p className="mb-2">
              Our editorial integrity commitment:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Zero Paid Placements for Higher Scores:</strong> No company or developer can pay to boost their rating, manipulate benchmark results, or alter our pros & cons evaluation.</li>
              <li><strong>Unbiased Verdicts:</strong> If a tool is slow, overpriced, or prone to artifacts, we document it clearly regardless of whether an affiliate program exists.</li>
              <li><strong>Equal Evaluation:</strong> Free and open-source tools (e.g., NotebookLM, Hugging Face models) receive equal prominence alongside commercial SaaS products.</li>
            </ul>
          </div>

          {/* Advertising & AdSense Compliance */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading mb-3">
              4. Advertising Policy (Google AdSense)
            </h2>
            <p className="mb-2">
              HadoolAI may display non-intrusive advertisements served through Google AdSense or compliant programmatic networks. We enforce strict policies prohibiting deceptive download buttons, pop-ups, and disguised advertorials.
            </p>
            <p>
              Advertisers have no influence over editorial articles, tool benchmark scores, or the answers provided by our AI assistant.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading mb-3">
              5. Limitation of Liability
            </h2>
            <p>
              In no event shall HadoolAI, its operators, researchers, or contributors be held liable for any direct, indirect, incidental, or consequential damages resulting from the use of, or inability to use, any software, service, or workflow recommended on this website.
            </p>
          </div>

          {/* Contact Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Questions or corrections regarding our disclaimer? Contact our editorial compliance desk at{' '}
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Contact Us
              </button>
              .
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};
