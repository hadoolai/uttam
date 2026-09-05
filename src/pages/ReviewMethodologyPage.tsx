import React from 'react';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { 
  ShieldCheck, 
  Scale, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Clock, 
  Layers, 
  Cpu, 
  DollarSign, 
  UserCheck 
} from 'lucide-react';
import { SITE_URL } from '../utils/constants';

interface ReviewMethodologyPageProps {
  onNavigate: (path: string) => void;
}

export const ReviewMethodologyPage: React.FC<ReviewMethodologyPageProps> = ({ onNavigate }) => {
  const methodologySchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'AI Tool Review Methodology & Testing Rubric | HadoolAI',
      description: 'Our standardized 5-pillar evaluation framework for testing and ranking generative artificial intelligence software with zero sponsored bias.',
      url: `${SITE_URL}/how-we-review`
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
          name: 'How We Review',
          item: `${SITE_URL}/how-we-review`
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title="AI Tool Review Methodology & Testing Rubric | HadoolAI"
        description="Our standardized 5-pillar evaluation framework for testing and ranking generative artificial intelligence software with zero sponsored bias."
        canonicalUrl={`${SITE_URL}/how-we-review`}
        schema={methodologySchemas}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'About Us', href: '/about' },
            { label: 'How We Review AI Tools' }
          ]}
          onNavigate={onNavigate}
        />

        {/* Hero Area */}
        <div className="mt-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
            <ShieldCheck size={14} />
            <span>Empirical Evaluation Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            How We Review & Benchmark AI Tools
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
            At HadoolAI, we believe software recommendations must be rooted in <strong>rigorous testing, objective evaluation criteria, and complete transparency</strong>. We do not accept paid reviews, sponsored placements, or vendor-edited copy.
          </p>
        </div>

        {/* 5-Pillar Weighting System */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8 space-y-6">
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Our 5-Pillar Scoring Rubric (100% Total)
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Every tool reviewed on HadoolAI is evaluated across five weighted categories, producing a final composite score from 0.0 to 5.0 stars:
          </p>

          <div className="space-y-4">
            {/* Pillar 1 */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Cpu size={18} className="text-indigo-600" />
                  <span>1. Output Quality & Hallucination Resistance</span>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  Weight: 30%
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We test fidelity, factual accuracy, aesthetic consistency, prompt adherence, hallucination rates, and temporal stability (for video/audio). We execute standard identical prompt matrices across competing models to isolate real differences.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Layers size={18} className="text-indigo-600" />
                  <span>2. Features & Workflow Depth</span>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  Weight: 25%
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We assess workspace collaboration, API access, multi-file editing, export resolutions, aspect ratio flexibility, and integration into existing professional software (like Premiere, Photoshop, VS Code, or Google Workspace).
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <DollarSign size={18} className="text-indigo-600" />
                  <span>3. Value for Money & Free Tier Generosity</span>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  Weight: 20%
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We audit credit consumption rates, monthly renewal policies, hidden compute upcharges, watermarking restrictions, and whether the free plan provides genuine utility or acts solely as an aggressive paywall.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <UserCheck size={18} className="text-indigo-600" />
                  <span>4. Ease of Use & Onboarding Speed</span>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  Weight: 15%
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We test how quickly a newcomer can achieve production-ready results without studying complex syntax or reading endless documentation.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <ShieldCheck size={18} className="text-indigo-600" />
                  <span>5. Commercial Safety, Privacy & Enterprise Terms</span>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  Weight: 10%
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We inspect training data disclosures, model opt-out policies, commercial copyright licensing, and whether user inputs are used to train public foundation models.
              </p>
            </div>
          </div>
        </div>

        {/* Ethical Standards */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8 space-y-6">
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Our Strict Editorial Integrity Guarantees
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">No Paid Placements</h4>
                <p className="text-xs text-slate-600 mt-1">Vendors cannot pay for higher ratings, "Editor's Choice" badges, or guaranteed top-spot listings.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Quarterly Score Audits</h4>
                <p className="text-xs text-slate-600 mt-1">AI models improve rapidly; our editorial staff re-runs test benchmarks every 90 days to update scores.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Clear Affiliate Disclosure</h4>
                <p className="text-xs text-slate-600 mt-1">If we use an affiliate referral link, it is clearly disclosed. Affiliate partnerships have zero impact on evaluation scores.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Balanced Pros & Cons</h4>
                <p className="text-xs text-slate-600 mt-1">Every tool review explicitly states who should use it AND who should avoid it to prevent buyer regret.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
