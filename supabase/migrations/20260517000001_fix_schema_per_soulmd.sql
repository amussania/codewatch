-- Migration: Fix database schema per SOUL.md v3
-- Removes original_code and rewritten_code from reviews
-- Creates credits, projects, and credit_transactions tables
-- Updates profiles to match SOUL.md users table spec
-- Adds RLS policies for all new tables
-- Author: Kimi Build Agent | Date: 2026-05-17

-- ═══════════════════════════════════════════════════════════════
-- 1. ALTER EXISTING TABLES
-- ═══════════════════════════════════════════════════════════════

-- Remove source code columns from reviews (SOUL.md Rule 1)
alter table reviews drop column if exists original_code;
alter table reviews drop column if exists rewritten_code;

-- Add missing columns to reviews per SOUL.md spec
alter table reviews add column if not exists project_id uuid references profiles(id);
alter table reviews add column if not exists line_count integer;
alter table reviews add column if not exists specialists_run text[];
alter table reviews add column if not exists master_score integer;
alter table reviews add column if not exists rewrite_available boolean default false;
alter table reviews add column if not exists credits_used integer;

-- Rename 'score' to 'master_score' if it exists and master_score doesn't
-- (idempotent: only runs if old column exists and new doesn't)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'reviews' and column_name = 'score'
  ) and not exists (
    select 1 from information_schema.columns
    where table_name = 'reviews' and column_name = 'master_score'
  ) then
    alter table reviews rename column score to master_score;
  end if;
end $$;

-- Add Stripe fields to profiles (extends auth.users per SOUL.md)
alter table profiles add column if not exists stripe_customer_id text;
alter table profiles add column if not exists stripe_subscription_id text;

-- ═══════════════════════════════════════════════════════════════
-- 2. CREATE CREDITS TABLE (Split Wallet)
-- ═══════════════════════════════════════════════════════════════

create table if not exists credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null unique,
  plan_credits integer default 0,
  topup_credits integer default 0,
  total_used integer default 0,
  reset_date timestamptz,
  plan_tier text default 'free',
  last_topup_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table credits enable row level security;

-- Users can only see their own credits
create policy "Users see own credits" on credits
  for select using (auth.uid() = user_id);

-- No direct insert/update/delete from client — all via server/RPC
create policy "No client writes on credits" on credits
  for all using (false);

-- ═══════════════════════════════════════════════════════════════
-- 3. CREATE PROJECTS TABLE
-- ═══════════════════════════════════════════════════════════════

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  name text not null,
  business_context text,
  custom_rules text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table projects enable row level security;

-- Users can CRUD their own projects
create policy "Users CRUD own projects" on projects
  for all using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- 4. CREATE CREDIT_TRANSACTIONS TABLE (Audit Trail)
-- ═══════════════════════════════════════════════════════════════

create table if not exists credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  type text not null check (type in ('deduct', 'topup', 'subscription', 'reset', 'refund', 'signup_bonus')),
  amount integer not null,
  wallet text check (wallet in ('plan', 'topup', null)),
  review_id uuid references reviews(id),
  stripe_payment_id text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table credit_transactions enable row level security;

-- Users can only see their own transactions
create policy "Users see own transactions" on credit_transactions
  for select using (auth.uid() = user_id);

-- No direct insert from client — all via server/RPC
create policy "No client writes on transactions" on credit_transactions
  for insert using (false);

-- ═══════════════════════════════════════════════════════════════
-- 5. UPDATE REVIEWS RLS POLICIES
-- ═══════════════════════════════════════════════════════════════

-- Drop existing restrictive policies and recreate
drop policy if exists "Users see own reviews" on reviews;

create policy "Users see own reviews" on reviews
  for select using (auth.uid() = user_id);

-- No direct insert from client — all via server/RPC
create policy "No client writes on reviews" on reviews
  for insert using (false);

-- ═══════════════════════════════════════════════════════════════
-- 6. CREATE DATABASE FUNCTIONS (Atomic Operations)
-- ═══════════════════════════════════════════════════════════════

-- Function: Deduct credits atomically for a review
-- Returns the updated credit balances or raises an exception if insufficient
-- This is the atomic guarantee per SOUL.md Section 6
create or replace function deduct_credits_for_review(
  p_user_id uuid,
  p_credits_needed integer,
  p_review_id uuid
)
returns table (plan_credits_remaining integer, topup_credits_remaining integer)
language plpgsql
security definer
as $$
declare
  v_plan_credits integer;
  v_topup_credits integer;
  v_deducted_from_plan integer := 0;
  v_deducted_from_topup integer := 0;
begin
  -- Lock the row and get current balances
  select c.plan_credits, c.topup_credits
  into v_plan_credits, v_topup_credits
  from credits c
  where c.user_id = p_user_id
  for update;

  -- Check if user has enough total credits
  if (v_plan_credits + v_topup_credits) < p_credits_needed then
    raise exception 'Insufficient credits. Required: %, Available: %',
      p_credits_needed, (v_plan_credits + v_topup_credits)
      using errcode = 'P0001'; -- Custom error code for 402 handling
  end if;

  -- Deduct from plan credits first
  if v_plan_credits >= p_credits_needed then
    v_deducted_from_plan := p_credits_needed;
  else
    v_deducted_from_plan := v_plan_credits;
    v_deducted_from_topup := p_credits_needed - v_plan_credits;
  end if;

  -- Update credits
  update credits
  set
    plan_credits = plan_credits - v_deducted_from_plan,
    topup_credits = topup_credits - v_deducted_from_topup,
    total_used = total_used + p_credits_needed,
    updated_at = now()
  where user_id = p_user_id;

  -- Record transaction for plan credits
  if v_deducted_from_plan > 0 then
    insert into credit_transactions (user_id, type, amount, wallet, review_id)
    values (p_user_id, 'deduct', v_deducted_from_plan, 'plan', p_review_id);
  end if;

  -- Record transaction for top-up credits
  if v_deducted_from_topup > 0 then
    insert into credit_transactions (user_id, type, amount, wallet, review_id)
    values (p_user_id, 'deduct', v_deducted_from_topup, 'topup', p_review_id);
  end if;

  -- Return remaining balances
  return query
  select c.plan_credits, c.topup_credits
  from credits c
  where c.user_id = p_user_id;
end;
$$;

-- Function: Grant signup bonus (3 free credits)
create or replace function grant_signup_bonus(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  insert into credits (user_id, plan_credits, plan_tier)
  values (p_user_id, 3, 'free')
  on conflict (user_id) do nothing;

  insert into credit_transactions (user_id, type, amount, wallet)
  values (p_user_id, 'signup_bonus', 3, 'plan');
end;
$$;

-- Function: Reset plan credits on billing anniversary
-- Called by Supabase cron job or webhook handler
create or replace function reset_plan_credits(
  p_user_id uuid,
  p_new_allocation integer
)
returns void
language plpgsql
security definer
as $$
begin
  update credits
  set
    plan_credits = p_new_allocation,
    reset_date = now() + interval '30 days',
    updated_at = now()
  where user_id = p_user_id;

  insert into credit_transactions (user_id, type, amount, wallet)
  values (p_user_id, 'reset', p_new_allocation, 'plan');
end;
$$;

-- Function: Add top-up credits
create or replace function add_topup_credits(
  p_user_id uuid,
  p_amount integer,
  p_stripe_payment_id text
)
returns void
language plpgsql
security definer
as $$
begin
  update credits
  set
    topup_credits = topup_credits + p_amount,
    last_topup_at = now(),
    updated_at = now()
  where user_id = p_user_id;

  insert into credit_transactions (user_id, type, amount, wallet, stripe_payment_id)
  values (p_user_id, 'topup', p_amount, 'topup', p_stripe_payment_id);
end;
$$;

-- ═══════════════════════════════════════════════════════════════
-- 7. CREATE INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════

create index if not exists idx_reviews_user_id on reviews(user_id);
create index if not exists idx_reviews_project_id on reviews(project_id);
create index if not exists idx_reviews_created_at on reviews(created_at desc);
create index if not exists idx_credits_user_id on credits(user_id);
create index if not exists idx_projects_user_id on projects(user_id);
create index if not exists idx_credit_transactions_user_id on credit_transactions(user_id);
create index if not exists idx_credit_transactions_created_at on credit_transactions(created_at desc);

-- ═══════════════════════════════════════════════════════════════
-- 8. TRIGGER: Auto-create credits row on profile creation
-- ═══════════════════════════════════════════════════════════════

create or replace function handle_new_user_credits()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into credits (user_id, plan_credits, plan_tier)
  values (new.id, 3, 'free');

  insert into credit_transactions (user_id, type, amount, wallet)
  values (new.id, 'signup_bonus', 3, 'plan');

  return new;
end;
$$;

-- Trigger on profiles table (fires when a new profile is created)
drop trigger if exists on_profile_created_grant_credits on profiles;
create trigger on_profile_created_grant_credits
  after insert on profiles
  for each row
  execute function handle_new_user_credits();

-- ═══════════════════════════════════════════════════════════════
-- 9. MIGRATION NOTES
-- ═══════════════════════════════════════════════════════════════

-- This migration:
--   ✓ Removes original_code and rewritten_code (SOUL.md Rule 1)
--   ✓ Creates split wallet (plan_credits + topup_credits)
--   ✓ Adds projects table for business context
--   ✓ Adds credit_transactions for audit trail
--   ✓ Provides atomic credit deduction via RPC
--   ✓ Auto-grants 3 free credits on signup
--   ✓ Enables RLS on all tables
--   ✓ Adds indexes for query performance
--
-- After running this migration:
--   1. Update application code to use new schema
--   2. Remove any client-side code referencing old columns
--   3. Verify RLS policies work correctly
--   4. Test credit deduction flow end-to-end
