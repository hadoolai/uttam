export type CategoryId = 
  | 'all'
  | 'video'
  | 'writing'
  | 'image'
  | 'productivity'
  | 'audio'
  | 'coding'
  | 'research';

export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Free Trial';

export interface PricingTier {
  name: string;
  price: string;
  billingPeriod?: string;
  features: string[];
  isPopular?: boolean;
}

export interface ReviewScore {
  overall: number; // 0 to 5, e.g. 4.8
  features: number;
  easeOfUse: number;
  outputQuality: number;
  valueForMoney: number;
  support: number;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface UserReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified?: boolean;
}

export interface AITool {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: CategoryId;
  categoryName: string;
  logo: string;
  bannerImage: string;
  websiteUrl: string;
  affiliateUrl?: string;
  rating: ReviewScore;
  reviewCount: number;
  pricingType: PricingType;
  startingPrice: string;
  freePlanDetails: string;
  pricingTiers: PricingTier[];
  keyFeatures: {
    title: string;
    description: string;
  }[];
  pros: string[];
  cons: string[];
  bestFor: string[];
  easeOfUse: 'Beginner' | 'Intermediate' | 'Advanced';
  platforms: string[];
  apiAvailable: boolean;
  howToUseSteps: {
    step: number;
    title: string;
    description: string;
  }[];
  alternatives: string[]; // tool slugs or names
  finalVerdict: {
    summary: string;
    badge: string; // e.g. "Editor's Choice 2026"
    shouldYouBuy: string;
  };
  faqs: ToolFAQ[];
  userReviews: UserReview[];
  featured?: boolean;
  trending?: boolean;
  editorsPick?: boolean;
  releaseYear: number;
  lastUpdated: string;
}

export interface Comparison {
  id: string;
  slug: string;
  toolAId: string;
  toolBId: string;
  title: string;
  tagline: string;
  summaryVerdict: string;
  winnerId: string;
  categoryWinner: {
    category: string;
    winnerId: string;
    reason: string;
  }[];
  updatedDate: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or rich HTML sections
  category: string;
  readTime: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
    bio?: string;
  };
  publishDate: string;
  updatedDate?: string;
  coverImage: string;
  featured?: boolean;
  tags: string[];
  relatedToolIds: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  toolsCount: number;
  heroHighlight: string;
}
