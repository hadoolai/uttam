-- ==============================================================================
-- HadoolAI - Production Viewer Reviews & Comments Schema for Supabase PostgreSQL
-- ==============================================================================
-- WHERE TO RUN THIS SQL:
-- 1. Log in to your Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Select your HadoolAI project.
-- 3. Click "SQL Editor" in the left sidebar navigation.
-- 4. Click "+ New query", paste this entire script, and click "Run".
-- ==============================================================================

-- 1. Create the article_reviews table
CREATE TABLE IF NOT EXISTS article_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT check_rating_range CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT check_status_valid CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT check_helpful_positive CHECK (helpful_count >= 0),
  CONSTRAINT check_name_not_empty CHECK (char_length(trim(name)) >= 2 AND char_length(name) <= 60),
  CONSTRAINT check_comment_not_empty CHECK (char_length(trim(comment)) >= 10 AND char_length(comment) <= 2000),
  CONSTRAINT check_slug_not_empty CHECK (char_length(trim(article_slug)) >= 1 AND char_length(article_slug) <= 150)
);

-- 2. Optimize search and filtering queries with indexes
CREATE INDEX IF NOT EXISTS idx_article_reviews_slug_status 
  ON article_reviews(article_slug, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_article_reviews_created 
  ON article_reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_article_reviews_status 
  ON article_reviews(status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE article_reviews ENABLE ROW LEVEL SECURITY;

-- Policy A: Allow anyone (public/anon) to read only approved reviews
DROP POLICY IF EXISTS "Allow public read approved reviews" ON article_reviews;
CREATE POLICY "Allow public read approved reviews"
  ON article_reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Policy B: Allow public/anon to submit new reviews strictly with status = 'pending'
DROP POLICY IF EXISTS "Allow public insert pending reviews" ON article_reviews;
CREATE POLICY "Allow public insert pending reviews"
  ON article_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending' AND helpful_count = 0);

-- Policy C: Allow service_role (backend API) full access to read, approve, update, delete
DROP POLICY IF EXISTS "Allow service_role full access" ON article_reviews;
CREATE POLICY "Allow service_role full access"
  ON article_reviews
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Atomic function to safely increment helpful_count
CREATE OR REPLACE FUNCTION increment_review_helpful(target_review_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE article_reviews
  SET helpful_count = helpful_count + 1
  WHERE id = target_review_id AND status = 'approved'
  RETURNING helpful_count INTO new_count;

  RETURN COALESCE(new_count, 0);
END;
$$;

-- Grant execution to public anon and authenticated users
GRANT EXECUTE ON FUNCTION increment_review_helpful(UUID) TO anon, authenticated, service_role;

-- ==============================================================================
-- HOW TO MODERATE REVIEWS IN SUPABASE:
--
-- View Pending Reviews:
--   SELECT * FROM article_reviews WHERE status = 'pending' ORDER BY created_at DESC;
--
-- Approve a Review (Make it visible publicly on the article):
--   UPDATE article_reviews SET status = 'approved' WHERE id = 'PASTE-UUID-HERE';
--
-- Reject a Review:
--   UPDATE article_reviews SET status = 'rejected' WHERE id = 'PASTE-UUID-HERE';
-- ==============================================================================
