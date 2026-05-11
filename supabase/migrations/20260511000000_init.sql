-- Users table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  email text,
  plan text default 'free',
  credits_remaining int default 10,
  created_at timestamptz default now()
);

-- Reviews table
create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  language text,
  score int,
  issues jsonb,
  original_code text,
  rewritten_code text,
  verdict text,
  created_at timestamptz default now()
);

-- Row level security
alter table profiles enable row level security;
alter table reviews enable row level security;

create policy "Users see own profile" on profiles for select using (auth.uid() = id);
create policy "Users see own reviews" on reviews for select using (auth.uid() = user_id);
