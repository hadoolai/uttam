import { CreateReviewPayload } from '../types/reviews';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedPayload?: {
    article_slug: string;
    name: string;
    rating: number;
    comment: string;
  };
}

/**
 * Sanitize untrusted text to prevent HTML / JavaScript script injection
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strips dangerous HTML tags completely from text
 */
export function stripHtmlTags(input: string): string {
  if (!input) return '';
  return input.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Validates and sanitizes a review submission payload.
 */
export function validateReviewInput(payload: any): ValidationResult {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object') {
    return { isValid: false, errors: ['Invalid request payload. Expected a JSON object.'] };
  }

  // 1. Honeypot check (anti-bot)
  if (payload.honeypot && typeof payload.honeypot === 'string' && payload.honeypot.trim() !== '') {
    return { isValid: false, errors: ['Spam protection triggered. Submission rejected.'] };
  }

  // 2. Article slug validation
  let slug = typeof payload.article_slug === 'string' ? payload.article_slug.trim() : '';
  if (!slug) {
    errors.push('Article slug is required.');
  } else if (slug.length > 150) {
    errors.push('Article slug exceeds maximum allowed length.');
  } else if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    errors.push('Invalid article slug format.');
  }

  // 3. Name validation
  let rawName = typeof payload.name === 'string' ? payload.name.trim() : '';
  // Strip any HTML tags from name
  const cleanName = stripHtmlTags(rawName);
  if (!cleanName) {
    errors.push('Please enter your name.');
  } else if (cleanName.length < 2) {
    errors.push('Name must be at least 2 characters.');
  } else if (cleanName.length > 60) {
    errors.push('Name cannot exceed 60 characters.');
  }

  // 4. Rating validation
  const ratingNum = Number(payload.rating);
  if (
    typeof payload.rating === 'undefined' ||
    payload.rating === null ||
    isNaN(ratingNum) ||
    !Number.isInteger(ratingNum) ||
    ratingNum < 1 ||
    ratingNum > 5
  ) {
    errors.push('Please select a valid star rating between 1 and 5.');
  }

  // 5. Comment validation
  let rawComment = typeof payload.comment === 'string' ? payload.comment.trim() : '';
  const cleanComment = stripHtmlTags(rawComment);
  if (!cleanComment) {
    errors.push('Please write your review comment.');
  } else if (cleanComment.length < 10) {
    errors.push('Review comment must be at least 10 characters.');
  } else if (cleanComment.length > 2000) {
    errors.push('Review comment cannot exceed 2,000 characters.');
  }

  // Check for suspicious payload patterns (e.g. repeated spam links)
  const linkCount = (cleanComment.match(/https?:\/\//gi) || []).length;
  if (linkCount > 2) {
    errors.push('Comments containing multiple promotional links are not allowed.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedPayload: {
      article_slug: slug.toLowerCase(),
      name: cleanName,
      rating: ratingNum,
      comment: cleanComment,
    },
  };
}

/**
 * Validates review helpful action payload
 */
export function validateHelpfulInput(payload: any): { isValid: boolean; error?: string; reviewId?: string; articleSlug?: string } {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Invalid payload.' };
  }

  const reviewId = typeof payload.review_id === 'string' ? payload.review_id.trim() : '';
  if (!reviewId) {
    return { isValid: false, error: 'Review ID is required.' };
  }

  const articleSlug = typeof payload.article_slug === 'string' ? payload.article_slug.trim() : '';
  if (!articleSlug) {
    return { isValid: false, error: 'Article slug is required.' };
  }

  return { isValid: true, reviewId, articleSlug: articleSlug.toLowerCase() };
}
