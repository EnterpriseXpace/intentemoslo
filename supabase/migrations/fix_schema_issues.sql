-- FIX: Create 'purchases' table if missing
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  session_id text unique not null,
  customer_email text,
  product_type text not null check (product_type in ('quick', 'deep')),
  amount numeric,
  status text check (status in ('completed', 'refunded', 'pending')),
  client_session_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb
);

-- FIX: Enable RLS on purchases
alter table public.purchases enable row level security;

-- FIX: Add missing 'answers_json' column to 'result_snapshots'
alter table public.result_snapshots 
add column if not exists answers_json jsonb;

-- FIX: Index for faster lookups
create index if not exists purchases_client_session_id_idx on public.purchases(client_session_id);
create index if not exists purchases_customer_email_idx on public.purchases(customer_email);

-- COMMENT: Add column comment
comment on column public.result_snapshots.answers_json is 'Raw user answers (e.g. {"R1": 5, "type": "quick"}) stored as JSON for future re-calculation or analytics.';
