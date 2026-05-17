# CODEWATCH Day 1 Audit Report

**Auditor:** Kimi (Autonomous Build Agent)  
**Date:** 2026-05-17  
**Repo:** https://github.com/amussania/codewatch  
**Branch:** main  
**Commit:** 3e03742 (Create SOUL.md with agent context and instructions)

---

## 1. Executive Summary

CODEWATCH is a visually stunning, well-structured Next.js 16 marketing site with a functional Supabase auth layer and a polished dashboard UI. However, **it is not yet a chargeable SaaS**. The core review engine, credit system, Stripe integration, API routes, and production infrastructure are all missing. This audit identifies every gap between current state and SOUL.md requirements.

**Overall Health:** 🟡 Yellow — Beautiful frontend, missing backend

---

## 2. Project Structure Audit

### 2.1 What Exists ✅

| Component | Status | Notes |
|-----------|--------|-------|
| Next.js 16 App Router | ✅ | Latest stable, React 19 |
| TypeScript 5 | ✅ | Strict mode enabled |
| Tailwind CSS v4 | ✅ | PostCSS config present |
| shadcn/ui (base-nova) | ✅ | 6 UI components built |
| Marketing landing page | ✅ | 12 sections, cinematic scroll |
| Auth (login/signup) | ✅ | Supabase Auth with email verification |
| Dashboard shell | ✅ | Sidebar + review interface |
| Middleware | ✅ | Route protection for /dashboard |
| Supabase client setup | ✅ | SSR + browser clients |
| Design system (CLAUDE.md) | ✅ | Comprehensive brand guide |
| SOUL.md | ✅ | v3 — detailed agent instructions |
| Database migration (v1) | ⚠️ | Basic schema, does not match SOUL.md spec |

### 2.2 File Inventory

```
src/
├── app/
│   ├── (auth)/           # Login + signup pages
│   ├── (marketing)/      # Landing page (12 sections)
│   ├── dashboard/         # Dashboard + review page
│   ├── layout.tsx         # Root layout with fonts
│   ├── globals.css        # Tailwind + custom CSS
│   └── favicon.ico
├── components/
│   ├── ui/               # 6 shadcn components
│   ├── marketing/        # 16 landing page sections
│   ├── dashboard/        # 5 dashboard components
│   └── shared/           # 6 shared components
├── lib/
│   ├── supabase/         # Client, server, middleware
│   └── utils.ts
├── hooks/                # 2 custom hooks
└── middleware.ts         # Auth route protection

supabase/
└── migrations/
    └── 20260511000000_init.sql  # Initial schema

Total: 55 source files
```

---

## 3. Dependencies Audit

### 3.1 Package.json Analysis

```json
{
  "next": "16.2.6",           // ✅ Latest stable
  "react": "19.2.4",          // ✅ Matches Next.js 16
  "tailwindcss": "^4",        // ✅ v4 with PostCSS
  "@supabase/ssr": "^0.10.3", // ✅ SSR package
  "@supabase/supabase-js": "^2.105.4", // ✅ Client
  "framer-motion": "^12.38.0", // ✅ Animations
  "gsap": "^3.15.0",          // ✅ Scroll animations
  "lenis": "^1.3.23",         // ✅ Smooth scroll
  "three": "^0.184.0",        // ✅ 3D backgrounds
  "lucide-react": "^1.14.0",  // ✅ Icons
  "sonner": "^2.0.7",         // ✅ Toasts
  "next-themes": "^0.4.6",    // ✅ Theme switching
}
```

### 3.2 Missing Dependencies (Required by SOUL.md)

| Package | Purpose | Priority |
|---------|---------|----------|
| `stripe` | Payments & subscriptions | 🔴 Critical |
| `@upstash/redis` | Rate limiting | 🔴 Critical |
| `resend` | Transactional emails | 🟡 High |
| `@sentry/nextjs` | Error tracking | 🟡 High |
| `@anthropic-ai/sdk` or `openai` | AI review engine | 🔴 Critical |
| `zod` | API validation | 🟡 High |
| `@radix-ui/react-select` | UI component | 🟢 Low |

### 3.3 Dependency Issues

- **No node_modules committed** — expected, but `npm install` not run in this environment
- **No lockfile audit** — `package-lock.json` exists (409KB) but not analyzed for vulnerabilities
- **Unused packages:** `@studio-freight/lenis` (deprecated, replaced by `lenis`)

---

## 4. Database Schema Audit

### 4.1 Current Schema (vs SOUL.md Spec)

**Current (`supabase/migrations/20260511000000_init.sql`):**
```sql
-- profiles (extends auth.users)
- id, email, plan, credits_remaining, created_at

-- reviews
- id, user_id, language, score, issues, original_code, rewritten_code, verdict, created_at

-- RLS enabled on both tables
```

**Required (per SOUL.md Section 4):**
```sql
-- users (extends auth.users)
- id, email, created_at, plan, stripe_customer_id, stripe_subscription_id

-- credits (split wallet)
- id, user_id, plan_credits, topup_credits, total_used, reset_date, plan_tier, last_topup_at

-- reviews (NO source_code column)
- id, user_id, project_id, created_at, language, line_count, specialists_run, master_score, findings, rewrite_available, credits_used

-- projects
- id, user_id, name, business_context, custom_rules, created_at

-- credit_transactions (audit trail)
- id, user_id, type, amount, wallet, review_id, stripe_payment_id, created_at
```

### 4.2 Critical Schema Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| `original_code` stored in DB | 🔴 CRITICAL | Violates SOUL.md Rule 1 — code must be memory-only |
| `rewritten_code` stored in DB | 🔴 CRITICAL | Same violation |
| No `credits` table | 🔴 CRITICAL | Missing split wallet (plan vs top-up) |
| No `projects` table | 🟡 HIGH | Missing business context persistence |
| No `credit_transactions` table | 🟡 HIGH | No audit trail |
| `credits_remaining` (int) | 🟡 HIGH | Should be split into plan_credits + topup_credits |
| `score` (int) | 🟢 LOW | Should be `master_score` with specialist breakdowns |

---

## 5. API Routes Audit

### 5.1 Current State

**No API routes exist.** The `src/app/api/` directory is completely missing.

### 5.2 Required API Routes (per SOUL.md Section 5)

| Route | Status | Purpose |
|-------|--------|---------|
| `POST /api/review` | ❌ Missing | Auth check, credit check, run specialists, deduct credits |
| `POST /api/rewrite` | ❌ Missing | Fail-safe rewrite |
| `POST /api/humanise` | ❌ Missing | Humanisation layer |
| `GET /api/credits` | ❌ Missing | Return balances, usage stats |
| `POST /api/topup` | ❌ Missing | Stripe Checkout for $2.99 top-up |
| `POST /api/stripe/webhook` | ❌ Missing | Handle Stripe events |

---

## 6. Auth & Middleware Audit

### 6.1 What Works ✅

- Supabase Auth with email/password
- Email verification flow
- Middleware route protection (`/dashboard` requires auth)
- Redirect unauthenticated users to `/login`
- Redirect authenticated users away from `/login`, `/signup`

### 6.2 Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| No OAuth providers | 🟡 HIGH | Google OAuth placeholder is disabled |
| No password reset | 🟡 HIGH | `/forgot-password` link exists but no route |
| No email verification resend | 🟢 LOW | User could get stuck if email lost |

---

## 7. External Services Audit

### 7.1 Supabase

| Check | Status | Notes |
|-------|--------|-------|
| Client config | ✅ | `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| SSR package | ✅ | `@supabase/ssr` with cookie handling |
| Middleware | ✅ | Session refresh + route protection |
| RLS enabled | ✅ | On `profiles` and `reviews` |
| Connection verified | ⚠️ | Cannot verify without env vars |

### 7.2 Vercel

| Check | Status | Notes |
|-------|--------|-------|
| Deployment | ⚠️ | `codewatch-theta.vercel.app` mentioned in SOUL.md |
| `vercel.json` | ❌ Missing | No custom config |
| Environment variables | ❌ Missing | No `.env` or `.env.local` in repo |
| CI/CD | ❌ Missing | No `.github/workflows/` directory |

### 7.3 Stripe

| Check | Status | Notes |
|-------|--------|-------|
| Package installed | ❌ Missing | Not in package.json |
| API routes | ❌ Missing | No checkout, webhook, or subscription handlers |
| Product catalog | ❌ Missing | No tier definitions in code |
| Webhook handler | ❌ Missing | Required for subscription lifecycle |

### 7.4 Other Services

| Service | Status | Notes |
|---------|--------|-------|
| Resend (emails) | ❌ Missing | No package, no templates |
| Upstash (Redis) | ❌ Missing | No rate limiting |
| Sentry (errors) | ❌ Missing | No error tracking |
| AI API (Anthropic) | ❌ Missing | No review engine |

---

## 8. CI/CD Audit

### 8.1 GitHub Actions

**No workflows exist.** The `.github/workflows/` directory is missing entirely.

### 8.2 Required Workflows (per SOUL.md Section 2.3)

| Workflow | Status | Purpose |
|----------|--------|---------|
| `codewatch-self-review.yml` | ❌ Missing | Self-review on every PR |
| `high-risk-gate.yml` | ❌ Missing | Zero tolerance for HIGH security findings |

---

## 9. Credit System Audit

### 9.1 Current State

- Dashboard UI shows a mock review flow with hardcoded data
- No actual credit deduction
- No credit balance display
- No upgrade CTAs

### 9.2 What's Missing

| Feature | Status | SOUL.md Ref |
|---------|--------|-------------|
| Variable credit consumption | ❌ | Section 2.5 |
| Plan vs top-up wallet split | ❌ | Section 6 |
| Monthly reset cron job | ❌ | Section 6 |
| 3 free credits on signup | ❌ | Section 6 |
| Low credit alerts (20%, 8%) | ❌ | Section 6 |
| 402 response at 0 credits | ❌ | Section 6 |
| Atomic credit deduction | ❌ | Section 6 |
| Production Clearance warning | ❌ | Section 2.5 |

---

## 10. Dashboard Audit

### 10.1 What Exists ✅

- Beautiful UI with code input, score ring, issue cards
- Language selector (7 languages)
- Specialist filter (5 categories)
- Animated review flow (mock data)
- Tabbed results (issues + rewritten code)

### 10.2 What's Missing

| Feature | Status | Notes |
|---------|--------|-------|
| Real AI review | ❌ | All data is MOCK |
| Credit display | ❌ | No wallet shown |
| Project workspaces | ❌ | No project selector |
| Business context input | ❌ | No per-project context |
| Review history | ❌ | No past reviews list |
| Download HTML report | ❌ | Mentioned in SOUL.md |
| Pre-run credit check modal | ❌ | Mentioned in SOUL.md |

---

## 11. Security Audit

### 11.1 Findings

| Finding | Severity | Description |
|---------|----------|-------------|
| `original_code` in DB | 🔴 CRITICAL | Violates SOUL.md Rule 1 |
| `rewritten_code` in DB | 🔴 CRITICAL | Violates SOUL.md Rule 1 |
| No API key in env | 🟡 HIGH | Cannot verify server-side AI calls |
| No rate limiting | 🟡 HIGH | Upstash Redis not configured |
| No Sentry | 🟡 HIGH | No production error visibility |
| RLS enabled | ✅ | Proper on profiles and reviews |
| Middleware auth | ✅ | Proper route protection |

---

## 12. Recommended Day 1 Task List

### 🔴 P0 — Blockers (Must Fix Before Any User Can Pay)

1. **Fix Database Schema**
   - Drop `original_code` and `rewritten_code` columns from `reviews`
   - Create `credits` table with `plan_credits` + `topup_credits` split
   - Create `projects` table for business context
   - Create `credit_transactions` table for audit trail
   - Update RLS policies for new tables

2. **Install Missing Dependencies**
   - `stripe`, `@upstash/redis`, `resend`, `@sentry/nextjs`
   - AI SDK (`@anthropic-ai/sdk` or `openai`)
   - `zod` for API validation

3. **Create Core API Routes**
   - `POST /api/review` — auth check, credit check, run specialists (mock for now), deduct credits atomically
   - `GET /api/credits` — return plan + top-up balances
   - `POST /api/stripe/webhook` — handle subscription events

4. **Wire Dashboard to Real API**
   - Replace mock data with actual API calls
   - Add credit balance display
   - Add pre-run credit check modal

### 🟡 P1 — High Priority (Required for MVP)

5. **Stripe Integration**
   - Create product catalog (5 tiers per SOUL.md Section 2.4)
   - Checkout session creation
   - Subscription lifecycle management
   - Webhook handling for payment events

6. **Credit System**
   - Variable consumption by code size (Section 2.5)
   - Plan vs top-up deduction logic
   - Monthly reset cron job (Supabase pg_cron)
   - 3 free credits on signup
   - Low credit email alerts (20%, 8%)

7. **AI Review Engine**
   - Port existing Node.js proxy logic
   - Five specialists running in parallel
   - Master Score calculation
   - Fail-safe rewrite
   - Base64 prompt obfuscation

8. **Email System (Resend)**
   - Welcome email on signup
   - Low credit alerts
   - Top-up confirmation

### 🟢 P2 — Medium Priority (Polish)

9. **Rate Limiting (Upstash)**
   - Per-user rate limiting on `/api/review`
   - Abuse prevention

10. **Error Tracking (Sentry)**
    - Integrate with Next.js
    - Scrub source code from error context

11. **CI/CD Workflows**
    - `codewatch-self-review.yml`
    - `high-risk-gate.yml`
    - Add `AI_API_KEY` secret

12. **Project Workspaces**
    - Create/manage projects
    - Persist business context per project
    - Review history per project

### ⚪ P3 — Nice to Have

13. **Google OAuth**
14. **Password reset flow**
15. **Admin panel**
16. **Downloadable HTML reports**
17. **Humanisation Layer**
18. **AI Origin Probability Score**

---

## 13. Quick Wins (Can Do Today)

1. **Clean up migration** — Remove `original_code` and `rewritten_code` columns
2. **Add missing deps** to package.json
3. **Create `/api/credits` route** — Simple balance endpoint
4. **Add credit display** to dashboard header
5. **Create `.env.example`** — Document all required env vars

---

## 14. Environment Variables Needed

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# AI
ANTHROPIC_API_KEY=

# Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Resend
RESEND_API_KEY=

# Sentry
SENTRY_DSN=

# App
NEXT_PUBLIC_APP_URL=https://codewatch-theta.vercel.app
```

---

## 15. Conclusion

CODEWATCH has a **world-class frontend** and a **solid foundation** with Supabase auth, but the backend is essentially a blank slate. The gap between "beautiful marketing site" and "chargeable SaaS" is significant but well-defined. Every missing piece is documented in SOUL.md with clear requirements.

**Estimated time to MVP:** 2-3 weeks of focused development  
**Biggest risks:** AI review engine accuracy, Stripe webhook reliability, credit system atomicity  
**Strongest assets:** Design system completeness, auth foundation, clear spec

---

*Audit completed by Kimi 🤖*  
*Open PR, never merge. AV reviews and approves.*
