-- Create result_snapshots table
create table if not exists result_snapshots (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Core Identity (Optional but recommended)
  session_id text not null, -- To link with analytics events
  email text, -- Optional, if user provides it later
  
  -- Result Data
  product_type text check (product_type in ('quick', 'deep')) not null,
  ier_score int not null,
  global_state text not null, -- critical, fragile, caution, stable
  
  -- Deep Specifics (JSONB for flexibility)
  dimensions jsonb, -- Stores the score for each dimension
  dominant_pattern text,
  risk_trajectory text, -- JSON string or simple text summary
  
  -- Meta
  source text default 'web' -- web, email, retry
);

-- Create feedback_responses table
create table if not exists feedback_responses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Link to Result
  result_id uuid references result_snapshots(id) on delete set null,
  
  -- User Data
  email text, -- Optional
  consent boolean default true, -- Implicit consent for stats
  
  -- Context Snapshot (Redundant but useful for fast queries without joining)
  ier_score int, 
  global_state text,
  product_type text,
  
  -- The Feedback
  emotion text,
  usefulness text,
  comment text
);

-- Enable RLS
alter table result_snapshots enable row level security;
alter table feedback_responses enable row level security;

-- Policies (Service Role has full access by default, but we might want to allow anon insert if using direct client)
-- Since we are using API Routes with Service Role, we don't strictly need public/anon policies, 
-- but it's good practice to be explicit if we ever switch to client-side.
-- For now, let's keep it locked to Service Role (implicit denial for anon) to enforce API usage.

-- Indexes
create index if not exists idx_snapshots_session_id on result_snapshots(session_id);
create index if not exists idx_snapshots_created_at on result_snapshots(created_at desc);
create index if not exists idx_feedback_result_id on feedback_responses(result_id);
