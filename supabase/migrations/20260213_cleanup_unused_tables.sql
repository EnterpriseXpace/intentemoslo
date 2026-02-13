-- CLEANUP MIGRATION: Drop unused tables
-- Run this in Supabase -> SQL Editor -> Run
-- CAUTION: This will permanently delete data in these tables. Ensure you have backups if needed.

BEGIN;

-- Legacy tables replaced by 'purchases', 'result_snapshots', 'subscribers'
DROP TABLE IF EXISTS public.checklist_answers;
DROP TABLE IF EXISTS public.checklist_assessments;
DROP TABLE IF EXISTS public.checklist_payments;
DROP TABLE IF EXISTS public.checklist_results;
DROP TABLE IF EXISTS public.checklist_sessions;

-- Legacy tables from old features/templates
DROP TABLE IF EXISTS public.chat_messages;
DROP TABLE IF EXISTS public.contact_submissions;
DROP TABLE IF EXISTS public.daily_checkins;
DROP TABLE IF EXISTS public.leads;

-- Potential user profile table (Verify if linked to auth.users before running, though unused in src)
DROP TABLE IF EXISTS public.user_profiles;

COMMIT;

-- Reload schema cache to reflect changes
NOTIFY pgrst, 'reload config';
