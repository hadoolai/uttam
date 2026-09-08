export interface Review {
  id: string;
  article_slug: string;
  name: string;
  rating: number; // 1 to 5
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  helpful_count: number;
  created_at: string;
}

export interface ReviewRatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ReviewSummary {
  total_reviews: number;
  average_rating: number;
  distribution: ReviewRatingDistribution;
}

export interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface GetReviewsResponse {
  reviews: Review[];
  summary: ReviewSummary;
  pagination: ReviewPagination;
}

export interface CreateReviewPayload {
  article_slug: string;
  name: string;
  rating: number;
  comment: string;
  honeypot?: string;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  reviewId?: string;
}

export interface HelpfulReviewResponse {
  success: boolean;
  helpful_count: number;
  message?: string;
}
