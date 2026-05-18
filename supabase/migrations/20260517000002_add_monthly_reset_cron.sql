-- Migration: Add monthly credit reset cron job
-- Uses Supabase pg_cron extension (available on paid plans)
-- Resets plan_credits to tier allocation on billing anniversary
-- NEVER resets topup_credits (SOUL.md Rule 10)
-- Author: Kimi Build Agent | Date: 2026-05-17

-- ═══════════════════════════════════════════════════════════════
-- 1. ENABLE PG_CRON EXTENSION (if not already enabled)
-- ═══════════════════════════════════════════════════════════════

-- Note: pg_cron is available on Supabase Pro plan and above
-- If running on free tier, this will fail — handle gracefully
create extension if not exists pg_cron;

-- ═══════════════════════════════════════════════════════════════
-- 2. CREATE RESET FUNCTION (called by cron)
-- ═══════════════════════════════════════════════════════════════

create or replace function process_monthly_credit_resets()
returns void
language plpgsql
security definer
as $$
declare
  v_tier text;
  v_allocation integer;
  v_rec record;
begin
  -- Tier allocations per SOUL.md Section 2.4
  -- free: 3 (one-time, never resets — but we handle for completeness)
  -- solo: 30
  -- pro: 120
  -- studio: 400
  -- agency: 1000

  for v_rec in
    select
      c.user_id,
      c.plan_tier,
      c.reset_date
    from credits c
    where c.reset_date <= now()
      and c.plan_tier != 'free'  -- Free tier never resets (one-time bonus)
  loop
    -- Determine allocation based on tier
    v_tier := lower(v_rec.plan_tier);

    case v_tier
      when 'solo' then v_allocation := 30;
      when 'pro' then v_allocation := 120;
      when 'studio' then v_allocation := 400;
      when 'agency' then v_allocation := 1000;
      else v_allocation := 0;
    end case;

    -- Reset plan credits, update reset date, leave topup untouched
    update credits
    set
      plan_credits = v_allocation,
      reset_date = now() + interval '30 days',
      updated_at = now()
    where user_id = v_rec.user_id;

    -- Log the reset transaction
    insert into credit_transactions (user_id, type, amount, wallet)
    values (v_rec.user_id, 'reset', v_allocation, 'plan');

  end loop;
end;
$$;

-- ═══════════════════════════════════════════════════════════════
-- 3. SCHEDULE CRON JOB (runs daily at 00:00 UTC)
-- ═══════════════════════════════════════════════════════════════

-- Unschedule if already exists (idempotent)
select cron.unschedule('monthly-credit-reset') where exists (
  select 1 from cron.job where jobname = 'monthly-credit-reset'
);

-- Schedule daily check for credits needing reset
-- Only users whose reset_date <= now() will be processed
select cron.schedule(
  'monthly-credit-reset',
  '0 0 * * *',  -- Every day at 00:00 UTC
  'select process_monthly_credit_resets()'
);

-- ═══════════════════════════════════════════════════════════════
-- 4. VERIFY SCHEDULE
-- ═══════════════════════════════════════════════════════════════

-- Uncomment to verify the job was scheduled:
-- select * from cron.job where jobname = 'monthly-credit-reset';

-- ═══════════════════════════════════════════════════════════════
-- 5. NOTES
-- ═══════════════════════════════════════════════════════════════

-- This migration:
--   ✓ Runs daily to check for credits needing reset
--   ✓ Resets ONLY plan_credits (never topup_credits per Rule 10)
--   ✓ Free tier is excluded (3 credits are one-time)
--   ✓ Logs each reset as a credit_transaction
--   ✓ Sets next reset_date to 30 days from now
--
-- If pg_cron is not available (free tier):
--   - This migration will fail on the CREATE EXTENSION step
--   - Alternative: Run process_monthly_credit_resets() manually
--   - Or use a Vercel cron job to call an API endpoint
