import { validateHelpfulInput } from '../../src/utils/reviewValidation';
import { incrementHelpfulCount } from '../../src/server/supabase';

// Simple in-memory rate limiter for helpful clicks
const helpfulHistory = new Map<string, number[]>();

function isHelpfulFlooding(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxClicks = 15;

  const timestamps = helpfulHistory.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxClicks) {
    return true;
  }

  validTimestamps.push(now);
  helpfulHistory.set(ip, validTimestamps);
  return false;
}

export const handler = async (event: any) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' }),
    };
  }

  try {
    const clientIp =
      event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      event.headers['client-ip'] ||
      'unknown-ip';

    if (isHelpfulFlooding(clientIp)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ error: 'Too many requests. Please slow down.' }),
      };
    }

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

    const validation = validateHelpfulInput(body);
    if (!validation.isValid || !validation.reviewId || !validation.articleSlug) {
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({ error: validation.error || 'Invalid payload.' }),
      };
    }

    const result = await incrementHelpfulCount(validation.reviewId, validation.articleSlug);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        helpful_count: result.helpful_count,
      }),
    };
  } catch (err: any) {
    console.error('[Reviews API Error - Helpful]:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Unable to register helpful feedback right now.',
      }),
    };
  }
};
