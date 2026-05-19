-- Step 1: Update profiles table
alter table profiles
  rename column credits_remaining to balance;

alter table profiles
  add column if not exists stripe_customer_id text unique;

alter table profiles
  add column if not exists reset_date timestamptz,
  add column if not exists plan_tier text default 'free';

-- Step 2: Drop original_code from reviews (zero code retention)
alter table reviews
  drop column if exists original_code;

-- Step 3: Add new review output columns
alter table reviews
  add column if not exists master_score integer,
  add column if not exists risk_level text,
  add column if not exists ai_probability integer,
  add column if not exists credits_used integer,
  add column if not exists humanised_code text,
  add column if not exists specialist_scores jsonb;

-- Step 4: Create credit_transactions table
create table if not exists credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null check (type in ('deduct', 'topup', 'subscription')),
  amount integer not null,
  review_id uuid references reviews(id) on delete set null,
  created_at timestamptz default now() not null
);

alter table credit_transactions enable row level security;

-- Step 5: RLS policies — profiles
create policy "Users insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Step 6: RLS policies — reviews
create policy "Users insert own reviews"
  on reviews for insert
  with check (auth.uid() = user_id);

-- Step 7: RLS policies — credit_transactions
create policy "Users see own transactions"
  on credit_transactions for select
  using (auth.uid() = user_id);

create policy "Users insert own transactions"
  on credit_transactions for insert
  with check (auth.uid() = user_id);

-- Step 8: Auto-create profile trigger for new signups
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, plan, plan_tier, balance, reset_date)
  values (
    new.id,
    new.email,
    'free',
    'free',
    10,
    now() + interval '30 days'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atomic credit deduction — called by the review API after saving a review
-- Uses a CAS-style check: only decrements if balance won't go below zero.
create or replace function public.deduct_credits(p_user_id uuid, p_amount integer)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update profiles
  set balance = balance - p_amount
  where id = p_user_id
    and balance >= p_amount;

  if not found then
    raise exception 'insufficient_credits' using errcode = 'P0001';
  end if;
end;
$$;
