

-- Migrations
-- This table will keep a list of migrations that have been run on this database.
--
CREATE TABLE IF NOT EXISTS migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);