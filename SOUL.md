CODEWATCH
SOUL.md — Agent Context & Operating Instructions
For OpenClaw + Kimi K2.6 Autonomous Build Agent  |  Version 3 — Final
Mieux Demain Private Limited  |  Confidential  |  May 2026

CRITICAL: Read this file at the start of every session before taking any action.
CODEWATCH is not starting from zero. A working product already exists at codewatch-theta.vercel.app.
Do not rebuild what already exists. Read existing code first, then build what is missing.
You are Kimi. AV is your operator. Open PRs, never merge. AV reviews and approves.

1. Product Identity
What CODEWATCH Is
CODEWATCH is a multi-specialist AI code review SaaS platform. Users paste code and receive a structured review from five specialist agents covering Security, Reliability, Business Logic, Performance, and Code Quality. The output includes a Master Score, severity-rated findings, and a fail-safe rewrite. Zero source code is retained after review. Code is held in RAM only and discarded after each AI call.
The Core Promise
Paste code. Get a specialist panel review with a Master Score. Get fixed code back. Know your AI-generated code will survive production. In under two minutes.
Live URLs
•	Live deployment: codewatch-theta.vercel.app
•	Design system: CLAUDE.MD in the repo root
•	Stack: Next.js 14 App Router, Supabase, Stripe, Vercel, Resend, Upstash, Sentry

2. What Already Exists — Do Not Rebuild

Before writing any code, run: git log --oneline -20 to see recent work.
Read existing files before creating new ones. The product is live.
Your job is to port and wire existing logic, not rewrite from scratch.

2.1 Core Review Engine
Built, tested, and validated against real NeuroTrade production code. Running locally via Node.js proxy. Surfaced genuine HIGH-severity issues on first run.
•	Five specialists running in parallel via Promise.allSettled
•	Security Specialist: injection, exposed secrets, insecure patterns — ALWAYS ON
•	Reliability Engineer: error handling gaps, silent failures, loading states — ALWAYS ON
•	Business Logic Reviewer: domain rule validation against user-stated context — OPTIONAL
•	Performance Analyst: N+1 queries, re-renders, blocking operations — OPTIONAL
•	Code Quality Inspector: maintainability, naming, documentation — OPTIONAL
•	Master Score with individual specialist breakdown and severity ratings
•	Fail-safe rewrite: fixes code without changing observable behaviour — ALWAYS RUNS
•	Humanisation Layer: adds human engineering fingerprints to AI-generated code — EXCLUSIVE
•	AI Origin Probability Score: estimates likelihood code is AI-generated — UNIQUE
•	Business Context injection: free-text field per project for domain-specific rules
•	Prompt obfuscation via base64 encoding — moat protected
•	Pre-run credit check modal with upgrade banners
•	Downloadable HTML reports
•	Light and dark mode toggle
•	All AI calls proxied server-side — API key never in the browser
2.2 Website and Design System
•	Live on Vercel at codewatch-theta.vercel.app
•	Design: warm parchment base (#F5F2EE), ember red-orange accent (#C8440A)
•	Typography: Instrument Serif italic for display, DM Sans for body
•	All landing page sections built and deployed
•	About page copy written and approved
•	Zero mentions of Claude or Anthropic anywhere in customer-facing surfaces
•	USD pricing globally — Stripe Tax handles country-specific rates at checkout
•	Framer Motion animations, Lenis smooth scroll, cinematic scroll structure
2.3 CI/CD Self-Review Pipeline
•	codewatch-self-review.yml: reviews all changed files on every PR, posts findings as PR comment, blocks merge on CRITICAL finding or Security score below 60
•	high-risk-gate.yml: zero tolerance for HIGH security findings on auth, payment, webhook, migration files
•	Add GitHub secret AI_API_KEY to activate — your Anthropic API key
•	CODEWATCH reviews its own code. Every PR goes through the engine before merge. This makes the reliability claims contractually true.
2.4 Pricing Architecture
Defined, validated, and live on the landing page. Do not change these values without explicit instruction from AV.

Tier	Price / Reviews / Notes
Free	$0 — 3 reviews on signup, one time only, no card required
Solo	$12/month — 30 reviews — resets monthly, no rollover
Pro	$30/month — 120 reviews — resets monthly, no rollover
Studio	$72/month — 400 reviews — resets monthly, no rollover
Agency	$155/month — 1,000 reviews — resets monthly, no rollover
Top-up	$2.99 one-time — 25 reviews — never expire, accumulate across months

2.5 Credit Consumption by Code Size
Credit deduction is variable by code size, not flat per review. This is already implemented in the UI. The server-side enforcement must match exactly.

Code size	Credits consumed
Under 100 lines	1 credit
100 to 300 lines	2 credits
300 to 600 lines	4 credits
600 to 1,500 lines	8 credits
Production Clearance (full codebase)	12 credits

IMPORTANT: Production Clearance is for full codebase scans, not standard reviews. Always show a warning in the UI before deducting 12 credits so users are not surprised.

3. What OpenClaw Will Build
These are the gaps between current state and a live chargeable SaaS. Build nothing else without explicit instruction from AV.

Component	What it does
Supabase Auth	Signup, login, email verification, protected routes, JWT middleware
Credit enforcement	Server-side middleware checks balance before running specialists, deducts by code size
Credit wallet split	Plan credits tracked separately from top-up credits. Plan credits reset monthly. Top-up credits never expire.
Monthly reset	Supabase cron job resets plan credits on billing anniversary. Never resets top-up credits.
Stripe subscriptions	4 tier products, checkout, webhooks, invoice generation
Credit top-up	$2.99 one-time, 25 credits added to top-up wallet, Stripe Checkout
Stripe Tax	UK VAT, India GST, US sales tax auto-applied at checkout
Free tier credits	3 credits granted on signup, one time, no card required
User dashboard	Credit balance, usage stats, review history, project workspaces
Persistent Business Context	Store context per project — users do not re-enter it each time
Upstash Redis	Per-user rate limiting, abuse prevention
Resend emails	Welcome, low credit alert at 20% and 8%, top-up confirmation
Sentry	Production error visibility, no source code in error context
Admin panel	Credit override, user management, usage monitoring
GitHub Actions wiring	Connect CI/CD workflows to actual repo, confirm gates active
Landing page wiring	Connect existing CTAs to live auth flow and Stripe checkout


4. Database Schema
RLS must be enabled on all tables. Never add a source_code column anywhere. Code is memory-only and discarded after each review call.
users
id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid()
email                 text        UNIQUE NOT NULL
created_at            timestamptz DEFAULT now()
plan                  text        DEFAULT 'free'
stripe_customer_id    text
stripe_subscription_id text
credits
id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid()
user_id               uuid        REFERENCES users(id)
plan_credits          integer     DEFAULT 0   -- resets monthly
topup_credits         integer     DEFAULT 0   -- never expires
total_used            integer     DEFAULT 0
reset_date            timestamptz             -- billing anniversary
plan_tier             text        DEFAULT 'free'
last_topup_at         timestamptz

Plan credits and top-up credits are stored separately. The monthly reset cron job resets ONLY plan_credits, never topup_credits.
reviews
id               uuid        PRIMARY KEY DEFAULT gen_random_uuid()
user_id          uuid        REFERENCES users(id)
project_id       uuid        REFERENCES projects(id)
created_at       timestamptz DEFAULT now()
language         text
line_count       integer
specialists_run  text[]
master_score     integer
findings         jsonb
rewrite_available boolean    DEFAULT false
credits_used     integer

NEVER add a source_code column. Code is discarded in RAM after processing.

projects
id               uuid        PRIMARY KEY DEFAULT gen_random_uuid()
user_id          uuid        REFERENCES users(id)
name             text        NOT NULL
business_context text
custom_rules     text
created_at       timestamptz DEFAULT now()
credit_transactions
id               uuid        PRIMARY KEY DEFAULT gen_random_uuid()
user_id          uuid        REFERENCES users(id)
type             text        -- deduct / topup / subscription / reset / refund
amount           integer
wallet           text        -- plan / topup
review_id        uuid
stripe_payment_id text
created_at       timestamptz DEFAULT now()

5. API Routes to Build
All business logic server-side. No AI calls from the browser. No API keys in client-side code.

Route	Purpose
POST /api/review	Auth check, credit check by line count, run specialists, deduct credits atomically, save findings (never source code), return JSON
POST /api/rewrite	Fail-safe rewrite on reviewed code
POST /api/humanise	Humanisation layer on rewritten code
GET /api/credits	Return plan balance, top-up balance, usage stats, reset date
POST /api/topup	Create Stripe Checkout session for $2.99 top-up
POST /api/stripe/webhook	Handle Stripe events: payment, subscription change, cancellation


6. Credit System Rules
How credits flow
•	On signup: 3 plan credits granted, no card required
•	On subscription payment: plan_credits set to tier allocation, reset_date set to today + 30 days
•	On top-up payment: topup_credits incremented by 25, never reset
•	On review: deduct from plan_credits first, then topup_credits if plan is empty
•	On monthly reset: plan_credits reset to tier allocation, topup_credits untouched
•	At 20% balance remaining: email + in-app alert sent via Resend
•	At 8% balance remaining: urgent alert with upgrade CTA
•	At 0 credits: POST /api/review returns 402. No AI call made. No credits wasted.
The atomic guarantee
Credits are deducted and the review is saved in a single PostgreSQL transaction. If the write fails, the credit deduction rolls back. Users never lose credits without getting their review results. Implement this as a Supabase database function (RPC call), not two separate writes.

7. Hard Rules — Never Violate

RULE 1: Never store submitted source code in the database or logs. Code is memory-only.
RULE 2: Never put an API key in client-side code. All AI calls are server-side only.
RULE 3: Never bypass Row Level Security. Every query must respect RLS policies.
RULE 4: Never mention Claude, Anthropic, or any underlying AI model in UI or emails.
RULE 5: Never merge a PR. OpenClaw opens PRs only. AV must approve and merge.
RULE 6: Never modify payment or billing logic without running full test suite first.
RULE 7: Never install a package you have not verified exists and is safe.
RULE 8: Never delete or overwrite .env, .env.local, or Vercel environment variables.
RULE 9: Never rebuild what already exists. Read existing code before writing new code.
RULE 10: Never reset top-up credits. Only plan_credits reset on billing anniversary.
RULE 11: Always show a warning before deducting 12 credits for Production Clearance.
RULE 12: CODEWATCH CI will review your PR. Address CRITICAL or HIGH security findings before considering the session complete.


8. File System Map
You May Read and Write
•	app/ — all Next.js pages, layouts, and API routes
•	components/ — all React components
•	lib/ — utility functions, Supabase client, Stripe helpers
•	styles/ — global CSS and Tailwind config
•	public/ — static assets only
•	supabase/migrations/ — SQL migration files only
•	.github/workflows/ — CI/CD yaml files
•	SOUL.md — read at the start of every session
•	CLAUDE.MD — read before building any UI to understand the design system
You Must Never Touch
•	.env and .env.local — contain API keys
•	.git/ — never modify git history
•	node_modules/ — never edit packages directly
•	vercel.json — do not change without explicit instruction
•	supabase/config.toml — do not change project config

9. Session Behaviour
At the Start of Every Session
•	Read this SOUL.md file
•	Run git log --oneline -20 to see recent work
•	Run git status to see current state
•	State what you are about to build before starting
•	If the task touches an existing file, read that file before editing it
Model Routing

Task	Model
Review engine, Stripe webhooks, RLS, auth middleware, DB migrations	Kimi K2.6 via Moonshot
Next.js scaffolding, CSS, simple CRUD routes, email templates, admin UI	NVIDIA NIM free (DeepSeek V3.2)

At the End of Every Session
•	Open a GitHub PR with plain English description of what was built and tested
•	Never merge the PR — leave it for AV to review and approve
•	Add a session summary comment to the PR with what was done and what remains
•	Wait for CODEWATCH CI review comment before considering session complete
When Stuck
•	Do not loop more than 40 turns on the same problem
•	Leave a clear comment in the code describing what you tried
•	Open a WIP: PR and explain the blocker in the description
•	Never loop indefinitely. A WIP PR with a clear blocker is always the right exit.

10. Keeping This File Accurate
SOUL.md is updated by AV after each sprint. As features are completed, move them from Section 3 into Section 2 with their file paths. Add new decisions to the relevant section as they are made.
•	After each merged PR: update Section 2 with what was built and file paths
•	After each architecture decision: update the relevant section
•	After each unexpected blocker: add the solution to Section 9 so it does not repeat

End of SOUL.md v3 — Final  |  CODEWATCH  |  Mieux Demain Private Limited  |  May 2026
