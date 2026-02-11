-- Create subscribers table
create table if not exists subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  source text,
  created_at timestamp with time zone default now(),
  is_confirmed boolean default false
);

-- Add comment for documentation
comment on table subscribers is 'Stores email subscribers from various sources (e.g., result page, footer).';

-- Enable RLS (Row Level Security) - optional but good practice, though we only use service role key for now
alter table subscribers enable row level security;

-- Policy: Allow inserts (public can subscribe) - strictly speaking we handle this via API which uses service role or anon key.
-- Since we are using Next.js API route, we will likely use the service role key to bypass RLS for insertion or ensure anon has insert rights.
-- For MVP simple: we will rely on the API route to handle insertion.
-- But it's good practice to allow anon insert if using client-side directly, but we are using API route.
-- Let's keep RLS enabled but since we use server-side execution, we'll bypass it with service role or use anon policy if we were calling from client. 
-- For now, no specific policy needed if we use service role in API.

