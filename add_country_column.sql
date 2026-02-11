-- Add country column to analytics_events table
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS country TEXT;
