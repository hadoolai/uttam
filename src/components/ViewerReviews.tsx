import React, { useState, useEffect, useId } from 'react';
import { Star, ThumbsUp, CheckCircle, AlertCircle, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { Review, ReviewSummary } from '../types/reviews';

interface ViewerReviewsProps {
  articleSlug?: string;
  articleTitle?: string;
  className?: string;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  5: '5 stars - Excellent, highly recommend',
  4: '4 stars - Very good, helpful information',
  3: '3 stars - Average, room for improvement',
  2: '2 stars - Below expectations',
  1: '1 star - Disappointing or unhelpful',
};

export const ViewerReviews: React.FC<ViewerReviewsProps> = ({
  articleSlug: propArticleSlug,
  articleTitle,
  className = '',
}) => {
  // Automatically detect slug if not provided via props
  const detectedSlug = React.useMemo(() => {
    if (propArticleSlug && propArticleSlug.trim()) {
      return propArticleSlug.trim().toLowerCase();
    }
    const path = window.location.pathname.replace(/\/$/, '');
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1] || 'general';
    return lastPart.replace(/\.html$/, '').toLowerCase();
  }, [propArticleSlug]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({
    total_reviews: 0,
    average_rating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam field
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Track reviews marked as helpful in this browser
  const [helpfulGiven, setHelpfulGiven] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('hadool_helpful_reviews');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const nameInputId = useId();
  const commentInputId = useId();

  // 1. Fetch approved reviews from API
  const fetchReviews = async (pageNum: number = 1, append: boolean = false) => {
    if (!detectedSlug) return;
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setLoadError(null);
    }

    try {
      // Netlify function or Express API alias
      const apiUrl = `/api/reviews?article=${encodeURIComponent(detectedSlug)}&page=${pageNum}&limit=10`;
      const res = await fetch(apiUrl);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const fetchedReviews: Review[] = data.reviews || [];
      const fetchedSummary: ReviewSummary = data.summary || {
        total_reviews: 0,
        average_rating: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };

      if (append) {
        setReviews((prev) => [...prev, ...fetchedReviews]);
      } else {
        setReviews(fetchedReviews);
      }

      setSummary(fetchedSummary);
      setHasMore(Boolean(data.pagination?.hasMore));
      setPage(pageNum);
    } catch (err: any) {
      console.error('[ViewerReviews] Failed to load reviews:', err);
      if (!append) {
        setLoadError('Unable to load viewer reviews at this moment.');
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchReviews(1, false);
    // Reset form success/error when switching articles
    setSubmitSuccess(null);
    setSubmitError(null);
  }, [detectedSlug]);

  // 2. Submit new review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    // Validation checks
    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName) {
      setSubmitError('Please enter your name.');
      return;
    }
    if (trimmedName.length < 2) {
      setSubmitError('Name must be at least 2 characters.');
      return;
    }
    if (trimmedName.length > 60) {
      setSubmitError('Name cannot exceed 60 characters.');
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      setSubmitError('Please select a star rating from 1 to 5 stars.');
      return;
    }
    if (!trimmedComment) {
      setSubmitError('Please write your review comment.');
      return;
    }
    if (trimmedComment.length < 10) {
      setSubmitError('Review comment must be at least 10 characters.');
      return;
    }
    if (trimmedComment.length > 2000) {
      setSubmitError('Review comment cannot exceed 2,000 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_slug: detectedSlug,
          name: trimmedName,
          rating,
          comment: trimmedComment,
          honeypot: honeypot.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      // Success
      setSubmitSuccess(
        data.message || 'Thank you! Your review has been submitted and is waiting for approval.'
      );
      // Reset form fields
      setName('');
      setRating(0);
      setHoverRating(0);
      setComment('');
      setHoneypot('');
    } catch (err: any) {
      setSubmitError(err.message || 'Sorry, we could not submit your review right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Mark review as helpful
  const handleHelpfulClick = async (reviewId: string) => {
    if (helpfulGiven[reviewId]) return;

    // Optimistically update local helpful count & store in state
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r))
    );

    const updatedMap = { ...helpfulGiven, [reviewId]: true };
    setHelpfulGiven(updatedMap);
    try {
      localStorage.setItem('hadool_helpful_reviews', JSON.stringify(updatedMap));
    } catch {
      // Ignore localStorage exceptions
    }

    try {
      const res = await fetch('/api/reviews-helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review_id: reviewId,
          article_slug: detectedSlug,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.helpful_count === 'number') {
          setReviews((prev) =>
            prev.map((r) => (r.id === reviewId ? { ...r, helpful_count: data.helpful_count } : r))
          );
        }
      }
    } catch (err) {
      console.error('[ViewerReviews] Failed to register helpful click:', err);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <section
      id="viewer-reviews-section"
      aria-label="Viewer Reviews and Comments"
      className={`bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs mb-10 transition-all ${className}`}
    >
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <MessageSquare size={16} />
              <span>Community Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
              Viewer Reviews & Comments
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Share your experience, feedback, or opinion about this article.
            </p>
          </div>

          {/* Quick Average Badge */}
          {summary.total_reviews > 0 && (
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <div className="text-2xl font-black font-heading text-amber-900 leading-none">
                {summary.average_rating.toFixed(1)}
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= Math.round(summary.average_rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }
                    />
                  ))}
                </div>
                <div className="text-[11px] font-semibold text-amber-800">
                  Based on {summary.total_reviews} {summary.total_reviews === 1 ? 'review' : 'reviews'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats & Distribution (Only if approved reviews exist) */}
      {summary.total_reviews > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Average Rating Big Box */}
            <div className="md:col-span-4 text-center md:text-left md:border-r border-slate-200 md:pr-6">
              <div className="text-4xl sm:text-5xl font-black font-heading text-slate-900">
                {summary.average_rating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={18}
                    className={
                      s <= Math.round(summary.average_rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }
                  />
                ))}
              </div>
              <div className="text-xs font-medium text-slate-500">
                Based on {summary.total_reviews} verified reader{' '}
                {summary.total_reviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>

            {/* Distribution Bars */}
            <div className="md:col-span-8 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.distribution[star as keyof typeof summary.distribution] || 0;
                const percentage = summary.total_reviews > 0 ? (count / summary.total_reviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-7 font-bold text-slate-700 flex items-center gap-0.5">
                      {star} <Star size={11} className="fill-amber-400 text-amber-400 inline" />
                    </span>
                    <div className="flex-1 bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium text-slate-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Form */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 sm:p-7 mb-10">
        <h3 className="text-lg font-heading font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Sparkles size={18} className="text-indigo-600" />
          <span>Write Your Review</span>
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Your feedback helps other readers evaluate this guide. All submissions are moderated before publishing.
        </p>

        {/* Success Alert */}
        {submitSuccess && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 text-sm animate-fade-in"
          >
            <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-bold">Review Submitted Successfully!</p>
              <p className="text-xs text-emerald-700 mt-0.5">{submitSuccess}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {submitError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 text-sm animate-fade-in"
          >
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-bold">Submission Issue</p>
              <p className="text-xs text-red-700 mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitReview} noValidate className="space-y-5">
          {/* Honeypot anti-spam field (hidden from genuine users) */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="website_url_hp">Leave this field blank</label>
            <input
              id="website_url_hp"
              type="text"
              name="website_url_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor={nameInputId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              id={nameInputId}
              type="text"
              required
              maxLength={60}
              placeholder="e.g., Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Star Rating Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/30"
                role="radiogroup"
                aria-label="Star Rating"
              >
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= activeRating;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      role="radio"
                      aria-checked={rating === starValue}
                      aria-label={`${starValue} Star${starValue > 1 ? 's' : ''}`}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 rounded-lg text-slate-300 hover:text-amber-400 focus:outline-none focus:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star
                        size={26}
                        className={`transition-all duration-150 ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 scale-110'
                            : 'text-slate-300 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Rating description preview */}
              <span className="text-xs font-semibold text-slate-600 min-h-[1.5rem] flex items-center">
                {activeRating > 0 ? (
                  RATING_DESCRIPTIONS[activeRating]
                ) : (
                  <span className="text-slate-400 italic">Click a star to rate (1–5)</span>
                )}
              </span>
            </div>
          </div>

          {/* Comment Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor={commentInputId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Review <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{comment.length} / 2,000</span>
            </div>
            <textarea
              id={commentInputId}
              required
              rows={4}
              maxLength={2000}
              placeholder="What did you think of this article? Did the tips work for you? Share your experience, constructive critique, or helpful additions..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-all resize-y min-h-[100px]"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Minimum 10 characters. Plain text only. HTML or script code will be stripped.
            </p>
          </div>

          {/* Submit Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-[11px] text-slate-400">
              No email or phone required. Data stored securely in Supabase.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs hover:shadow-sm cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <span>Submit Review</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Reader Reviews List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
            <span>Reader Reviews</span>
            {summary.total_reviews > 0 && (
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                {summary.total_reviews}
              </span>
            )}
          </h3>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-indigo-600" />
            <p className="text-xs font-medium">Loading viewer reviews...</p>
          </div>
        )}

        {/* Load Error */}
        {!isLoading && loadError && (
          <div className="py-6 text-center text-slate-500 text-xs bg-slate-50 border border-slate-200 rounded-xl">
            <p>{loadError}</p>
            <button
              type="button"
              onClick={() => fetchReviews(1, false)}
              className="mt-2 text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State (Strictly NO fake reviews!) */}
        {!isLoading && !loadError && reviews.length === 0 && (
          <div className="text-center py-10 px-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <MessageSquare size={22} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">No reviews yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Be the first to share your experience, ask a question, or leave feedback on this guide.
            </p>
          </div>
        )}

        {/* Reviews Cards List */}
        {!isLoading && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((rev) => {
              const hasMarkedHelpful = Boolean(helpfulGiven[rev.id]);
              const formattedDate = new Date(rev.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={rev.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-slate-900">
                          {rev.name}
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-1.5 py-0.5 rounded-md">
                          Verified Reader
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{formattedDate}</div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`${rev.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={15}
                          className={
                            s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Text: Rendered safely as plain text to prevent injection */}
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-3 font-normal">
                    {rev.comment}
                  </p>

                  {/* Helpful Button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(rev.id)}
                      disabled={hasMarkedHelpful}
                      aria-label={`Mark review as helpful. Currently ${rev.helpful_count} people found this helpful.`}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        hasMarkedHelpful
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <ThumbsUp size={13} className={hasMarkedHelpful ? 'fill-emerald-600 text-emerald-600' : ''} />
                      <span>{hasMarkedHelpful ? 'Helpful' : 'Helpful'}</span>
                      <span className="font-bold text-[11px] ml-0.5">({rev.helpful_count})</span>
                    </button>

                    <span className="text-[11px] text-slate-400 italic">
                      Article: {detectedSlug}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Reviews Button */}
        {!isLoading && hasMore && (
          <div className="text-center mt-6">
            <button
              type="button"
              disabled={isLoadingMore}
              onClick={() => fetchReviews(page + 1, true)}
              className="inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 text-slate-800 text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 size={14} className="animate-spin text-indigo-600" />
                  <span>Loading More Reviews...</span>
                </>
              ) : (
                <span>Load More Reviews</span>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
