import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Review, ReviewSummary, ReviewRatingDistribution } from '../types/reviews';

let supabaseClient: SupabaseClient | null = null;

/**
 * Checks if Supabase server credentials are configured in the environment
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && url.trim() && key && key.trim() && !url.includes('YOUR_') && !key.includes('YOUR_'));
}

/**
 * Returns a singleton Supabase administrative client (Service Role)
 * NEVER expose this client to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL!.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();

    supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseClient;
}

/**
 * In-memory fallback cache for development/testing when Supabase env vars are not yet configured.
 * Does NOT contain any fake reviews. Starts completely empty.
 */
interface MemoryReview {
  id: string;
  article_slug: string;
  name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  helpful_count: number;
  created_at: string;
}
const devMemoryStore: MemoryReview[] = [];

/**
 * Fetches approved reviews and aggregate summary for a specific article slug
 */
export async function getApprovedReviewsForArticle(
  articleSlug: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  reviews: Review[];
  summary: ReviewSummary;
  total: number;
  isConfigured: boolean;
}> {
  const normalizedSlug = articleSlug.trim().toLowerCase();
  const client = getSupabaseAdmin();

  if (!client) {
    // Supabase credentials not set: query memory fallback
    const approved = devMemoryStore.filter(
      (r) => r.article_slug === normalizedSlug && r.status === 'approved'
    );
    const total = approved.length;
    const distribution: ReviewRatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalScore = 0;

    for (const r of approved) {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating as keyof ReviewRatingDistribution]++;
        totalScore += r.rating;
      }
    }

    const averageRating = total > 0 ? parseFloat((totalScore / total).toFixed(1)) : 0;
    const startIndex = (page - 1) * limit;
    const pagedReviews = approved
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(startIndex, startIndex + limit);

    return {
      reviews: pagedReviews,
      summary: {
        total_reviews: total,
        average_rating: averageRating,
        distribution,
      },
      total,
      isConfigured: false,
    };
  }

  // 1. Fetch total counts and score distribution across all approved reviews for this slug
  const { data: allApproved, error: aggError } = await client
    .from('article_reviews')
    .select('rating')
    .eq('article_slug', normalizedSlug)
    .eq('status', 'approved');

  if (aggError) {
    console.error('[Supabase Error] Failed to aggregate reviews:', aggError.message);
    throw new Error('Could not retrieve reviews data from database.');
  }

  const distribution: ReviewRatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalScore = 0;
  const total = allApproved ? allApproved.length : 0;

  if (allApproved) {
    for (const row of allApproved) {
      const r = Number(row.rating);
      if (r >= 1 && r <= 5) {
        distribution[r as keyof ReviewRatingDistribution]++;
        totalScore += r;
      }
    }
  }

  const averageRating = total > 0 ? parseFloat((totalScore / total).toFixed(1)) : 0;

  // 2. Fetch paginated slice of approved reviews
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: reviewsData, error: listError } = await client
    .from('article_reviews')
    .select('id, article_slug, name, rating, comment, status, helpful_count, created_at')
    .eq('article_slug', normalizedSlug)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (listError) {
    console.error('[Supabase Error] Failed to list approved reviews:', listError.message);
    throw new Error('Could not fetch review list from database.');
  }

  return {
    reviews: (reviewsData as Review[]) || [],
    summary: {
      total_reviews: total,
      average_rating: averageRating,
      distribution,
    },
    total,
    isConfigured: true,
  };
}

/**
 * Inserts a new review into Supabase with status = 'pending'
 */
export async function insertPendingReview(payload: {
  article_slug: string;
  name: string;
  rating: number;
  comment: string;
}): Promise<{ id: string; status: string }> {
  const normalizedSlug = payload.article_slug.trim().toLowerCase();
  const client = getSupabaseAdmin();

  if (!client) {
    // Development fallback store when credentials are not yet supplied
    const newId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newReview: MemoryReview = {
      id: newId,
      article_slug: normalizedSlug,
      name: payload.name,
      rating: payload.rating,
      comment: payload.comment,
      status: 'pending', // Pending by default as requested!
      helpful_count: 0,
      created_at: new Date().toISOString(),
    };
    devMemoryStore.push(newReview);
    console.log(`[Review System] Review recorded in pending state (ID: ${newId}). Set SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY to persist directly to Supabase.`);
    return { id: newId, status: 'pending' };
  }

  const { data, error } = await client
    .from('article_reviews')
    .insert([
      {
        article_slug: normalizedSlug,
        name: payload.name,
        rating: payload.rating,
        comment: payload.comment,
        status: 'pending', // Strictly pending for moderation!
        helpful_count: 0,
      },
    ])
    .select('id, status')
    .single();

  if (error) {
    console.error('[Supabase Error] Failed to insert pending review:', error.message);
    throw new Error('Failed to record review in database.');
  }

  return { id: data.id, status: data.status };
}

/**
 * Increments helpful_count for an approved review
 */
export async function incrementHelpfulCount(
  reviewId: string,
  articleSlug: string
): Promise<{ success: boolean; helpful_count: number }> {
  const client = getSupabaseAdmin();

  if (!client) {
    const review = devMemoryStore.find((r) => r.id === reviewId && r.article_slug === articleSlug.toLowerCase());
    if (review) {
      review.helpful_count += 1;
      return { success: true, helpful_count: review.helpful_count };
    }
    return { success: false, helpful_count: 0 };
  }

  // 1. Try atomic RPC if function exists
  const { data: rpcData, error: rpcError } = await client.rpc('increment_review_helpful', {
    target_review_id: reviewId,
  });

  if (!rpcError && typeof rpcData === 'number') {
    return { success: true, helpful_count: rpcData };
  }

  // 2. Fallback to transactional read-and-increment
  const { data: current, error: fetchError } = await client
    .from('article_reviews')
    .select('helpful_count')
    .eq('id', reviewId)
    .eq('article_slug', articleSlug.toLowerCase())
    .eq('status', 'approved')
    .single();

  if (fetchError || !current) {
    throw new Error('Review not found or not approved.');
  }

  const newCount = (current.helpful_count || 0) + 1;

  const { error: updateError } = await client
    .from('article_reviews')
    .update({ helpful_count: newCount })
    .eq('id', reviewId);

  if (updateError) {
    throw new Error('Failed to update helpful count.');
  }

  return { success: true, helpful_count: newCount };
}

/**
 * Moderation utility for testing or admin scripts
 * Updates review status ('approved' | 'rejected' | 'pending')
 */
export async function updateReviewStatus(
  reviewId: string,
  newStatus: 'approved' | 'rejected' | 'pending'
): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const r = devMemoryStore.find((item) => item.id === reviewId);
    if (r) {
      r.status = newStatus;
      return true;
    }
    return false;
  }

  const { error } = await client
    .from('article_reviews')
    .update({ status: newStatus })
    .eq('id', reviewId);

  if (error) {
    console.error('[Supabase Error] Status update failed:', error.message);
    return false;
  }
  return true;
}
