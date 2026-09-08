import { validateReviewInput } from '../../src/utils/reviewValidation';
import { getApprovedReviewsForArticle, insertPendingReview } from '../../src/server/supabase';

// Simple in-memory rate limiter per IP for Netlify function executions
const submissionHistory = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxSubmissions = 3;

  const timestamps = submissionHistory.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxSubmissions) {
    return true;
  }

  validTimestamps.push(now);
  submissionHistory.set(ip, validTimestamps);
  return false;
}

export const handler = async (event: any) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  // -------------------------------------------------------------
  // GET: Fetch approved reviews & summary for an article slug
  // -------------------------------------------------------------
  if (event.httpMethod === 'GET') {
    try {
      const queryParams = event.queryStringParameters || {};
      const articleSlug = queryParams.article || queryParams.article_slug || '';

      if (!articleSlug || typeof articleSlug !== 'string') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Missing required query parameter: "article" (e.g. ?article=seedance-2-review-2026)',
          }),
        };
      }

      const cleanSlug = articleSlug.trim().toLowerCase();
      if (!/^[a-zA-Z0-9_-]+$/.test(cleanSlug)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid article slug format.' }),
        };
      }

      const page = Math.max(1, parseInt(queryParams.page || '1', 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(queryParams.limit || '10', 10) || 10));

      const { reviews, summary, total } = await getApprovedReviewsForArticle(cleanSlug, page, limit);

      const totalPages = Math.ceil(total / limit);
      const hasMore = page * limit < total;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          reviews,
          summary,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore,
          },
        }),
      };
    } catch (err: any) {
      console.error('[Reviews API Error - GET]:', err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Unable to load reviews right now. Please try again later.',
        }),
      };
    }
  }

  // -------------------------------------------------------------
  // POST: Submit a new review for moderation (status = 'pending')
  // -------------------------------------------------------------
  if (event.httpMethod === 'POST') {
    try {
      // 1. Rate Limiting Protection
      const clientIp =
        event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        event.headers['client-ip'] ||
        'unknown-ip';

      if (isRateLimited(clientIp)) {
        return {
          statusCode: 429,
          headers,
          body: JSON.stringify({
            error: 'You have submitted multiple reviews recently. Please wait a few minutes before submitting again.',
          }),
        };
      }

      // 2. Parse & Validate Payload
      let body: any = {};
      try {
        body = JSON.parse(event.body || '{}');
      } catch {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid JSON request body.' }),
        };
      }

      const validation = validateReviewInput(body);
      if (!validation.isValid || !validation.sanitizedPayload) {
        return {
          statusCode: 422,
          headers,
          body: JSON.stringify({
            error: validation.errors[0] || 'Invalid review data.',
            details: validation.errors,
          }),
        };
      }

      // 3. Save to database strictly with status = 'pending'
      const { id } = await insertPendingReview(validation.sanitizedPayload);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Thank you! Your review has been submitted and is waiting for approval.',
          reviewId: id,
        }),
      };
    } catch (err: any) {
      console.error('[Reviews API Error - POST]:', err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Sorry, we couldn't submit your review right now. Please try again.",
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed. Use GET or POST.' }),
  };
};
