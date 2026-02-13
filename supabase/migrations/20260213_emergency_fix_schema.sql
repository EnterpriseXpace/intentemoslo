-- EMERGENCY SCHEMA FIX
-- Run this in Supabase -> SQL Editor -> Run

-- 1. Ensure table exists
CREATE TABLE IF NOT EXISTS public.purchases (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Rename columns if old names exist (Migration Strategy)
DO $$
BEGIN
    -- Rename 'stripe_session_id' -> 'session_id'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'purchases' AND column_name = 'stripe_session_id') THEN
        ALTER TABLE public.purchases RENAME COLUMN stripe_session_id TO session_id;
    END IF;

    -- Rename 'email' -> 'customer_email'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'purchases' AND column_name = 'email') THEN
        ALTER TABLE public.purchases RENAME COLUMN email TO customer_email;
    END IF;
END $$;

-- 3. Add columns if missing (Idempotent)
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS session_id text UNIQUE;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS product_type text CHECK (product_type IN ('quick', 'deep'));
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS amount numeric;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('completed', 'refunded', 'pending'));
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS metadata jsonb;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS client_session_id text;

-- 4. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS purchases_session_id_idx ON public.purchases(session_id);
CREATE INDEX IF NOT EXISTS purchases_customer_email_idx ON public.purchases(customer_email);

-- 5. RELOAD SCHEMA CACHE (Critical for "column not found in schema cache" errors)
NOTIFY pgrst, 'reload config';
