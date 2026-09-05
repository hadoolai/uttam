import React, { useState } from 'react';
import { AITool, UserReview } from '../data/types';
import { toolsData, getToolBySlug } from '../data/tools';
import { articlesData } from '../data/articles';
import { RatingStars } from '../components/RatingStars';
import { ToolLogo } from '../components/ToolLogo';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  ArrowRight, 
  Zap, 
  DollarSign, 
  Award, 
  ThumbsUp,
  Bookmark,
  Share2,
  Calendar,
  User,
  Plus,
  BookOpen,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import { getAccessToken, googleSignIn } from '../utils/googleAuth';
import { saveTextDocumentToDrive } from '../utils/googleDriveService';
import { SITE_URL } from '../utils/constants';

interface ToolReviewPageProps {
  tool: AITool;
  onNavigate: (path: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (toolId: string) => void;
  onToast: (msg: string) => void;
}

export const ToolReviewPage: React.FC<ToolReviewPageProps> = ({
  tool,
  onNavigate,
  isBookmarked,
  onToggleBookmark,
  onToast
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [userReviews, setUserReviews] = useState<UserReview[]>(tool.userReviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onToast('Review link copied to clipboard!');
  };

  const handleSaveToDrive = async () => {
    setIsSavingToDrive(true);
    try {
      let token = await getAccessToken();
      if (!token) {
        const result = await googleSignIn();
        token = result?.accessToken || null;
      }

      if (!token) {
        onNavigate('/drive');
        return;
      }

      const markdownContent = `# ${tool.name} Review & Evaluation
*Exported from HadoolAI on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*

## Overview
- **Tool Name:** ${tool.name}
- **Category:** ${tool.categoryName}
- **Overall Rating:** ⭐ ${tool.rating.overall}/5.0 (${tool.reviewCount} reviews)
- **Pricing:** ${tool.pricingType} • ${tool.startingPrice}
- **Official Website:** ${tool.websiteUrl}

## Tagline & Summary
> ${tool.tagline}

${tool.description}

## Pros & Cons
### Strengths:
${tool.pros.map(p => `- ${p}`).join('\n')}

### Limitations:
${tool.cons.map(c => `- ${c}`).join('\n')}

## Best For
${tool.bestFor.map(b => `- ${b}`).join('\n')}

## Detailed Feature Ratings
- **Features & Depth:** ${tool.rating.features}/5.0
- **Ease of Use & UI:** ${tool.rating.easeOfUse}/5.0
- **Output Quality:** ${tool.rating.outputQuality}/5.0
- **Value for Money:** ${tool.rating.valueForMoney}/5.0
- **Support & Updates:** ${tool.rating.support}/5.0

## Final Editorial Verdict
**${tool.finalVerdict.badge}**
${tool.finalVerdict.summary}

### Should You Buy?
${tool.finalVerdict.shouldYouBuy}

---
*Source: HadoolAI — Independent AI Tool Research & Benchmarks (https://hadoolai.co.in/reviews/${tool.slug})*
`;

      await saveTextDocumentToDrive(
        token,
        `HadoolAI_${tool.name}_Review`,
        markdownContent,
        'text/markdown'
      );

      onToast(`Saved ${tool.name} review to your Google Drive!`);
    } catch (err: any) {
      console.error('Error saving review to Drive:', err);
      onToast(err.message || 'Could not save review to Google Drive.');
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;

    const newRev: UserReview = {
      id: `usr-${Date.now()}`,
      author: newReviewAuthor,
      role: newReviewRole || 'Verified User',
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle || 'Great AI Tool',
      comment: newReviewComment,
      verified: true
    };

    setUserReviews([newRev, ...userReviews]);
    setShowReviewForm(false);
    setNewReviewAuthor('');
    setNewReviewRole('');
    setNewReviewTitle('');
    setNewReviewComment('');
    onToast('Thank you! Your review has been submitted.');
  };

  const relatedArticles = articlesData.filter(a =>
    a.relatedToolIds.includes(tool.slug) ||
    a.relatedToolIds.includes(tool.id) ||
    a.category.toLowerCase().includes(tool.category.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(tool.name.toLowerCase()) || t.toLowerCase().includes(tool.category.toLowerCase()))
  ).slice(0, 3);

  const canonicalUrl = `${SITE_URL}/reviews/${tool.slug}`;

  // Structured Schema for SoftwareApplication + Review + BreadcrumbList + FAQPage
  const reviewSchema: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      operatingSystem: tool.platforms.join(', '),
      applicationCategory: tool.categoryName,
      description: tool.description,
      url: tool.websiteUrl,
      image: tool.logo,
      offers: {
        '@type': 'Offer',
        price: tool.startingPrice.replace(/[^0-9.]/g, '') || '0',
        priceCurrency: 'USD'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tool.rating.overall,
        reviewCount: tool.reviewCount,
        bestRating: '5',
        worstRating: '1'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        image: tool.logo,
        applicationCategory: tool.categoryName
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: tool.rating.overall,
        bestRating: '5',
        worstRating: '1'
      },
      author: {
        '@type': 'Organization',
        name: 'HadoolAI Editorial Board'
      },
      publisher: {
        '@type': 'Organization',
        name: 'HadoolAI'
      },
      reviewBody: tool.finalVerdict.summary
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
          name: 'AI Tools',
          item: `${SITE_URL}/ai-tools`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `${tool.categoryName} Tools`,
          item: `${SITE_URL}/${tool.category === 'video' ? 'ai-video-tools' : tool.category === 'writing' ? 'ai-writing-tools' : tool.category === 'image' ? 'ai-image-tools' : tool.category === 'productivity' ? 'ai-productivity-tools' : tool.category === 'audio' ? 'ai-audio-tools' : tool.category === 'coding' ? 'ai-coding-tools' : 'ai-research-tools'}`
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: `${tool.name} Review`,
          item: canonicalUrl
        }
      ]
    }
  ];

  if (tool.faqs && tool.faqs.length > 0) {
    reviewSchema.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title={`${tool.name} Review (2026): Features, Pricing, Pros & Cons`}
        description={`Comprehensive, independent review of ${tool.name}. Evaluated on ${tool.categoryName} output quality, ease of use, pricing (${tool.startingPrice}), and alternatives.`}
        canonicalUrl={canonicalUrl}
        ogType="article"
        ogImage={tool.logo}
        schema={reviewSchema}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'AI Tools', href: '/ai-tools' },
            { label: tool.categoryName, href: `/ai-tools?category=${tool.category}` },
            { label: `${tool.name} Review` }
          ]}
          onNavigate={onNavigate}
        />

        {/* 1. HERO REVIEW HEADER */}
        <div className="mt-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-slate-100 border border-slate-200 p-2 shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                <ToolLogo src={tool.logo} name={tool.name} className="w-full h-full object-contain rounded-xl" loading="eager" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                    {tool.categoryName}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                    {tool.pricingType} • {tool.startingPrice}
                  </span>
                  {tool.editorsPick && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                      <Sparkles size={13} /> {tool.finalVerdict.badge}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
                  {tool.name} Review (2026)
                </h1>

                <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                  {tool.tagline}
                </p>

                {/* Rating summary bar */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <RatingStars score={tool.rating.overall} reviewsCount={tool.reviewCount} size="md" />
                  </div>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> Last updated: {tool.lastUpdated}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck size={14} /> Tested & Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row md:flex-col items-center gap-2.5 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-xs"
                id="btn-visit-official-site"
              >
                <span>Try {tool.name}</span>
                <ExternalLink size={14} />
              </a>

              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(tool.id)}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    isBookmarked 
                      ? 'bg-amber-50 border-amber-300 text-amber-700' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark size={14} className={isBookmarked ? 'fill-amber-500' : ''} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToDrive}
                  disabled={isSavingToDrive}
                  className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  title="Save Review to Google Drive"
                  aria-label="Save Review to Google Drive"
                >
                  {isSavingToDrive ? <RefreshCw size={14} className="animate-spin text-blue-600" /> : <HardDrive size={14} className="text-blue-600" />}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors cursor-pointer"
                  title="Share Review"
                  aria-label="Share Review"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Snapshot Specs Card */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Free Tier</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{tool.freePlanDetails.includes('No') ? 'Paid Only' : 'Available'}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Starting Price</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{tool.startingPrice}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ease of Use</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{tool.easeOfUse}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">API Available</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{tool.apiAvailable ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>

        {/* 2. OVERALL SCORE BREAKDOWN */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award size={20} className="text-indigo-600" />
            <span>HadoolAI Editorial Score Breakdown</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-900 text-white rounded-2xl p-6 text-center flex flex-col items-center justify-center">
              <div className="text-5xl font-heading font-extrabold text-white tracking-tight">
                {tool.rating.overall.toFixed(1)}
              </div>
              <div className="mt-2">
                <RatingStars score={tool.rating.overall} size="lg" showNumeric={false} />
              </div>
              <div className="mt-2 text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                Overall Performance Rating (out of 5.0)
              </div>
              <div className="mt-3 text-xs text-slate-400 max-w-xs">
                Calculated across 40+ hours of rigorous stress testing and benchmark comparisons.
              </div>
            </div>

            <div className="space-y-3.5">
              {[
                { label: 'Features & Capabilities', score: tool.rating.features },
                { label: 'Ease of Use & UI', score: tool.rating.easeOfUse },
                { label: 'Output Quality & Accuracy', score: tool.rating.outputQuality },
                { label: 'Value for Money', score: tool.rating.valueForMoney },
                { label: 'Customer Support & Ecosystem', score: tool.rating.support },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{item.label}</span>
                    <span className="text-slate-900 font-bold">{item.score.toFixed(1)} / 5.0</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. PROS & CONS */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros */}
          <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="font-heading font-bold text-lg text-emerald-950 flex items-center gap-2 mb-4">
              <CheckCircle2 size={20} className="text-emerald-600" />
              <span>What We Love (Pros)</span>
            </h3>
            <ul className="space-y-3">
              {tool.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="font-heading font-bold text-lg text-rose-950 flex items-center gap-2 mb-4">
              <XCircle size={20} className="text-rose-600" />
              <span>Room for Improvement (Cons)</span>
            </h3>
            <ul className="space-y-3">
              {tool.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. DETAILED OVERVIEW & DESCRIPTION */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-4">
            About {tool.name}
          </h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6">
            {tool.description}
          </p>

          <h3 className="text-base font-bold text-slate-900 mb-3">
            Who is {tool.name} best for?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tool.bestFor.map((target, idx) => (
              <div key={idx} className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs font-semibold text-indigo-950 flex items-start gap-2">
                <Sparkles size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                <span>{target}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. KEY FEATURES */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Zap size={20} className="text-indigo-600" />
            <span>Key Features & Capabilities</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tool.keyFeatures.map((feat, i) => (
              <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="font-heading font-bold text-base text-slate-900 mb-1.5">
                  {feat.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. PRICING TIERS & PLANS */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-slate-900 flex items-center gap-2">
                <DollarSign size={20} className="text-indigo-600" />
                <span>{tool.name} Pricing & Plans</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">Verified current pricing plans (updated monthly).</p>
            </div>
            <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              Free plan: {tool.freePlanDetails.includes('No') ? 'None' : 'Yes'}
            </div>
          </div>

          <div className="p-4 bg-indigo-50/50 border border-indigo-200/80 rounded-2xl mb-6 text-xs text-indigo-950 leading-relaxed">
            <strong>Free Plan Breakdown:</strong> {tool.freePlanDetails}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tool.pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  tier.isPopular 
                    ? 'border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500 shadow-xs' 
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-base text-slate-900">{tier.name}</h3>
                    {tier.isPopular && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-2xl font-heading font-extrabold text-slate-900">{tier.price}</span>
                    {tier.billingPeriod && (
                      <span className="text-[11px] text-slate-500 font-medium">{tier.billingPeriod}</span>
                    )}
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 mt-4 mb-6">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 text-center text-xs font-bold rounded-xl transition-colors ${
                    tier.isPopular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  Choose {tier.name}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 7. STEP-BY-STEP "HOW TO USE" */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-6">
            How to Get Started with {tool.name}
          </h2>
          <div className="space-y-4">
            {tool.howToUseSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-heading font-bold text-sm flex items-center justify-center shrink-0">
                  {step.step}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. ALTERNATIVES & COMPETITORS */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-4">
            Top Alternatives to {tool.name}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Looking for other options? Here are the highest-rated alternatives in the {tool.categoryName} category.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tool.alternatives.map((altSlug) => {
              const altTool = getToolBySlug(altSlug);
              if (!altTool) return null;
              return (
                <div
                  key={altTool.id}
                  onClick={() => onNavigate(`/reviews/${altTool.slug}`)}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                      <ToolLogo src={altTool.logo} name={altTool.name} className="w-full h-full object-contain rounded-lg" loading="lazy" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {altTool.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <RatingStars score={altTool.rating.overall} size="sm" />
                        <span className="text-[11px] text-slate-400">• {altTool.pricingType}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={15} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* RELATED GUIDES & ARTICLES */}
        {relatedArticles.length > 0 && (
          <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-600" />
                  <span>Related Guides & Benchmarks</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">Deepen your knowledge with in-depth tutorials and prompt workflows.</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/articles')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hidden sm:inline-flex items-center gap-1 cursor-pointer"
              >
                All Guides &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => onNavigate(`/articles/${article.slug}`)}
                  className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                      {article.category}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors mt-2.5 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{article.readTime}</span>
                    <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. FINAL VERDICT */}
        <div className="mt-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold mb-3">
              <ShieldCheck size={14} /> Final Editorial Verdict
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Should You Choose {tool.name}?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-3">
              {tool.finalVerdict.summary}
            </p>
            <div className="mt-5 p-4 bg-white/10 rounded-2xl border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong>Recommendation:</strong> {tool.finalVerdict.shouldYouBuy}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-colors shadow-lg cursor-pointer"
              >
                <span>Visit {tool.name} Official Website</span>
                <ExternalLink size={15} />
              </a>
              <button
                type="button"
                onClick={() => onNavigate('/comparisons')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-colors cursor-pointer"
              >
                <span>Compare Side-by-Side</span>
              </button>
            </div>
          </div>
        </div>

        {/* 10. FAQ ACCORDION */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle size={20} className="text-indigo-600" />
            <span>Frequently Asked Questions about {tool.name}</span>
          </h2>
          <div className="space-y-3">
            {tool.faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full p-4 text-left font-bold text-sm text-slate-900 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {openFaqIndex === i ? <ChevronUp size={16} className="text-indigo-600" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {openFaqIndex === i && (
                  <div className="p-4 pt-1 text-xs sm:text-sm text-slate-600 bg-slate-50/50 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 11. USER REVIEWS & COMMUNITY RATINGS */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-slate-900">
                User Reviews ({userReviews.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Real verified ratings from professionals in the field.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Write a Review</span>
            </button>
          </div>

          {/* New Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-in fade-in duration-200">
              <h4 className="font-bold text-sm text-slate-900">Submit Your Review of {tool.name}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Role / Industry</label>
                  <input
                    type="text"
                    value={newReviewRole}
                    onChange={(e) => setNewReviewRole(e.target.value)}
                    placeholder="e.g. Video Editor / Developer"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Below Average</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="Summary of your experience..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Detailed Experience *</label>
                <textarea
                  rows={3}
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="How does this tool perform in your workflow? What are its strongest and weakest areas?"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </form>
          )}

          {/* User Reviews List */}
          <div className="space-y-4">
            {userReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{rev.author}</span>
                        {rev.verified && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            Verified User
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.role} • {rev.date}</span>
                    </div>
                  </div>
                  <RatingStars score={rev.rating} size="sm" showNumeric={false} />
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 mt-2">{rev.title}</h5>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
