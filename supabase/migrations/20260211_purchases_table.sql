-- Create purchases table for Stripe transactions
create table if not exists purchases (
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

-- Enable RLS
alter table purchases enable row level security;

-- Create policy for reading (server-side only for now, or authenticated users)
-- For now, valid access is checked via API, so we don't need public read policies yet.
-- But if we use Supabase client directly, we might need them.
-- Keeping it restrictive: no public access.

-- Index for fast lookups
create index if not exists purchases_client_session_id_idx on purchases(client_session_id);
create index if not exists purchases_customer_email_idx on purchases(customer_email);
