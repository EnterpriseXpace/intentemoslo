-- Create the analytics_events table
create table if not exists analytics_events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  event_name text not null,
  anon_id text not null,
  session_id text not null,
  product_type text check (product_type in ('quick', 'deep')),
  url text,
  metadata jsonb default '{}'::jsonb,
  
  -- Constraints
  constraint valid_event_name check (
    event_name in (
      'checklist_started', 'checklist_question_answered', 'checklist_completed',
      'processing_started', 'pre_result_viewed', 'checkout_clicked', 'payment_completed',
      'result_viewed', 'email_submitted', 'diagnostic_repeated', 'session_started'
    )
  )
);

-- Enable RLS
alter table analytics_events enable row level security;

-- Policy: Allow Service Role full access (implicit, but good to be explicit about no public access)
-- No public policies needed as we only write via Service Role in API

-- Indexes for performance
create index if not exists idx_analytics_created_at on analytics_events(created_at desc);
create index if not exists idx_analytics_session_id on analytics_events(session_id);
create index if not exists idx_analytics_event_name on analytics_events(event_name);
create index if not exists idx_analytics_anon_id on analytics_events(anon_id);
