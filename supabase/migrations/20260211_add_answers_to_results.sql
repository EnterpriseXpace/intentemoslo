-- Add answers_json column to result_snapshots table
-- This allows storing the raw answers (R1=5, D1=3, etc) for future analytics
-- The column is nullable to support existing rows without breaking
-- The type is JSONB for efficient querying and flexibility

ALTER TABLE public.result_snapshots 
ADD COLUMN IF NOT EXISTS answers_json JSONB;

-- Comment for documentation
COMMENT ON COLUMN public.result_snapshots.answers_json IS 'Raw user answers (e.g. {"R1": 5, "type": "quick"}) stored as JSON for future re-calculation or analytics.';
