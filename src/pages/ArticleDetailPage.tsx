import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Article } from '../data/types';
import { getToolBySlug } from '../data/tools';
import { articlesData } from '../data/articles';
import { ToolLogo } from '../components/ToolLogo';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Calendar, Clock, User, ArrowRight, Share2, Tag, Sparkles, BookOpen, ChevronDown, HelpCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { SITE_URL } from '../utils/constants';

interface ArticleDetailPageProps {
  article: Article;
  onNavigate: (path: string) => void;
  onToast: (msg: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  article,
  onNavigate,
  onToast
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onToast('Article link copied to clipboard!');
  };

  const otherArticles = articlesData
    .filter(a => a.id !== article.id)
    .slice(0, 2);

  const isReview = article.canonicalUrl?.includes('/reviews/') || article.category === 'Platform Review' || article.category === 'Tool Review';
  const isComparison = article.canonicalUrl?.includes('/comparisons/') || article.category === 'Platform Comparison';
  const isBlog = article.canonicalUrl?.includes('/blog/');
  const parentBreadcrumb = isBlog
    ? { label: 'Blog', href: '/articles' }
    : isReview
    ? { label: 'Reviews', href: '/reviews' }
    : isComparison
    ? { label: 'Comparisons', href: '/comparisons' }
    : { label: 'Guides & Articles', href: '/articles' };

  const canonicalUrl = article.canonicalUrl || (isReview
    ? `${SITE_URL}/reviews/${article.slug}`
    : isComparison
    ? `${SITE_URL}/comparisons/${article.slug}`
    : `${SITE_URL}/articles/${article.slug}`);

  // Article Schema
  const articleSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: article.coverImage,
    datePublished: article.publishDate,
    dateModified: article.updatedDate || article.publishDate,
    author: {
      '@type': 'Organization',
      name: 'HadoolAI Editorial Team',
      url: `${SITE_URL}/`
    },
    publisher: {
      '@type': 'Organization',
      name: 'HadoolAI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
      }
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema: Record<string, unknown> = {
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
        name: parentBreadcrumb.label,
        item: `${SITE_URL}${parentBreadcrumb.href}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl
      }
    ]
  };

  // FAQ Schema (only for visible FAQs)
  const schemas: Record<string, unknown>[] = [articleSchema, breadcrumbSchema];

  if (article.faqs && article.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });
  }

  const metaTitle = article.metaTitle || (article.title.includes('HadoolAI') ? article.title : `${article.title} | HadoolAI`);
  const metaDescription = article.metaDescription || article.excerpt;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title={metaTitle}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
        ogType="article"
        ogImage={article.coverImage}
        schema={schemas}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            parentBreadcrumb,
            { label: article.title }
          ]}
          onNavigate={onNavigate}
        />

        {/* Article Header */}
        <header className="mt-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock size={13} /> {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Author info & Metadata */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-900 text-sm">
                By HadoolAI Editorial Team
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500">
                <span>Published: {article.publishDate}</span>
                {article.updatedDate && (
                  <>
                    <span>•</span>
                    <span className="text-indigo-600 font-medium flex items-center gap-1">
                      <RefreshCw size={11} className="inline" /> Updated: {article.updatedDate}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Share2 size={14} />
              <span>Share Guide</span>
            </button>
          </div>
        </header>

        {/* Cover Image */}
        <div className="w-full aspect-16/9 rounded-3xl overflow-hidden mb-8 border border-slate-200 shadow-sm">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Main Content Body */}
        <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <div className="markdown-body prose prose-slate max-w-none">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ src, alt }) => {
                  const isBanner = alt?.toLowerCase().includes('banner') || alt?.toLowerCase().includes('cover') || alt?.toLowerCase().includes('screenshot');
                  if (isBanner) {
                    return (
                      <span className="block my-6 overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
                        <img src={src} alt={alt || ''} className="w-full h-auto object-cover max-h-96" loading="lazy" />
                      </span>
                    );
                  }
                  return (
                    <span className="inline-flex items-center gap-2 my-2 p-2 rounded-xl border border-slate-200 bg-white shadow-xs">
                      <img
                        src={src}
                        alt={alt || ''}
                        className="h-10 w-auto max-w-[140px] object-contain"
                        loading="lazy"
                      />
                    </span>
                  );
                },
                a: ({ href, children }) => {
                  const isInternal = href && href.startsWith('/');
                  const text = typeof children === 'string' ? children.trim().toLowerCase() : '';
                  const isTryButton = text.includes('try now') || text.includes('try ') || text.includes('visit official') || text.includes('official website');
                  const isReviewButton = text.includes('read full review') || text.includes('read review');

                  if (isTryButton) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 my-1 mr-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors no-underline cursor-pointer"
                      >
                        <span>{children}</span>
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    );
                  }

                  if (isReviewButton) {
                    return (
                      <a
                        href={href}
                        onClick={(e) => {
                          if (isInternal) {
                            e.preventDefault();
                            onNavigate(href!);
                          }
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 my-1 mr-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors no-underline cursor-pointer"
                      >
                        <span>{children}</span>
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    );
                  }

                  if (isInternal) {
                    return (
                      <a
                        href={href}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(href!);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-indigo-300 hover:decoration-indigo-600 transition-colors cursor-pointer"
                      >
                        {children}
                      </a>
                    );
                  }
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-indigo-300 hover:decoration-indigo-600 transition-colors"
                    >
                      {children}
                    </a>
                  );
                },
                h2: ({ children }) => (
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-heading font-bold text-slate-900 mt-6 mb-3">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-lg font-heading font-semibold text-slate-800 mt-4 mb-2">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-slate-700 text-base leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 space-y-2 text-slate-700 mb-6">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="my-6 p-4 rounded-2xl bg-indigo-50/70 border-l-4 border-indigo-600 text-slate-800 font-medium italic">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-sm text-slate-700">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="p-3 sm:p-4 font-semibold text-slate-900">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="p-3 sm:p-4 text-slate-700 align-top">{children}</td>
                ),
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 rounded-md bg-slate-100 font-mono text-xs text-indigo-700 font-semibold">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto my-4">
                    {children}
                  </pre>
                )
              }}
            >
              {article.content}
            </Markdown>
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <Tag size={15} className="text-slate-400" />
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Editorial Attribution */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs mb-8">
          <div className="font-heading font-bold text-base text-slate-900">
            By HadoolAI Editorial Team
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>Published: {article.publishDate}</span>
            {article.updatedDate && (
              <>
                <span>•</span>
                <span>Updated: {article.updatedDate}</span>
              </>
            )}
          </div>
        </div>

        {/* Dedicated Interactive FAQ Section if present */}
        {article.faqs && article.faqs.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
            <h3 className="text-xl font-heading font-bold text-slate-900 mb-2 flex items-center gap-2">
              <HelpCircle size={20} className="text-indigo-600" />
              <span>Frequently Asked Questions</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Quick answers to the most common questions regarding {article.title.split(':')[0]} and key features.
            </p>

            <div className="space-y-3">
              {article.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-indigo-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related AI Tools Widget */}
        {article.relatedToolIds.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
            <h3 className="text-lg font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" />
              <span>Featured Tools Mentioned in This Guide</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.relatedToolIds.map((slug) => {
                const tool = getToolBySlug(slug);
                if (!tool) return null;
                return (
                  <div
                    key={tool.id}
                    onClick={() => onNavigate(`/reviews/${tool.slug}`)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                        <ToolLogo src={tool.logo} name={tool.name} className="w-full h-full object-contain rounded-lg" loading="lazy" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">{tool.name}</div>
                        <div className="text-xs text-slate-500 truncate">{tool.tagline}</div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-600 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Articles & Guides */}
        {otherArticles.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" />
                <span>Related AI Guides & Tutorials</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('/articles')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                All Articles &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherArticles.map((other) => (
                <div
                  key={other.id}
                  onClick={() => onNavigate(`/articles/${other.slug}`)}
                  className="group p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                      {other.category}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors mt-2 line-clamp-2">
                      {other.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {other.excerpt}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{other.readTime}</span>
                    <span className="text-indigo-600 font-bold flex items-center gap-1">Read &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
