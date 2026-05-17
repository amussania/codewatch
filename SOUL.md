CODEWATCH
SOUL.md — Agent Context & Operating Instructions
For OpenClaw + Kimi K2.6 Autonomous Build Agent  |  Version 4 — Lemon Squeezy + Moonshot
Mieux Demain Private Limited  |  Confidential  |  May 2026

CRITICAL: Read this file at the start of every session before taking any action.
CODEWATCH is live at codewatch-theta.vercel.app. Do not rebuild what already exists.
Payment processor: Lemon Squeezy (NOT Stripe). Use @lemonsqueezy/lemonsqueezy-js SDK.
Review engine model: Moonshot Kimi K2.6 via moonshot-node SDK (NOT Anthropic).
You are Kimi. AV is your operator. Open PRs, never merge. AV reviews and approves.

1. Product Identity
What CODEWATCH Is
CODEWATCH is a multi-specialist AI code review SaaS platform. Users paste code and receive a structured review from five specialist agents. The output includes a Master Score, severity-rated findings, and a fail-safe rewrite. Zero source code is retained after review.
Live URLs
•	Live deployment: codewatch-theta.vercel.app
•	Design system: CLAUDE.MD in the repo root
•	Stack: Next.js 14 App Router, Supabase, Lemon Squeezy, Vercel, Resend, Upstash, Sentry
•	Review engine: Moonshot Kimi K2.6 via moonshot-node SDK

2. Payment Processor — Lemon Squeezy
CODEWATCH uses Lemon Squeezy as its payment processor, NOT Stripe. Lemon Squeezy acts as Merchant of Record, handling all global VAT, GST, and sales tax compliance automatically. This eliminates the need for Stripe Tax configuration.
Why Lemon Squeezy
•	Merchant of Record — they handle all global tax compliance, not us
•	Automatic VAT for UK/EU, GST for India/Australia, sales tax for US
•	Compliant invoices generated automatically on every transaction
•	Simpler webhook handling than Stripe for indie SaaS
•	No Stripe Tax configuration needed
SDK
import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy-js"
Environment Variables Required
LEMONSQUEEZY_API_KEY=your-api-key
LEMONSQUEEZY_STORE_ID=your-store-id
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret
Webhook Events to Handle
•	order_created — one-time top-up payment confirmed, add 25 top-up credits
•	subscription_created — new subscriber, set plan credits to tier allocation
•	subscription_updated — plan change, update credit allocation
•	subscription_cancelled — downgrade to free tier on next billing date
API Routes
•	POST /api/checkout — create Lemon Squeezy checkout session
•	POST /api/webhooks/lemonsqueezy — handle all Lemon Squeezy webhook events

3. Review Engine — Moonshot Kimi K2.6
The CODEWATCH review engine calls Moonshot Kimi K2.6 via the moonshot-node SDK. NOT Anthropic Claude. This is a deliberate decision: Kimi K2.6 is reviewing CODEWATCH own code via CI, so we validate its quality during the build itself before launch.
SDK
import MoonshotClient from "moonshot-node"
const client = new MoonshotClient({ apiKey: process.env.MOONSHOT_API_KEY })
Environment Variable
MOONSHOT_API_KEY=sk-your-key-here
Model
model: "moonshot-v1-128k"  // or kimi-k2.6 depending on SDK version
Important Note on moonshot-node
moonshot-node is a community SDK at v0.0.5. If it causes issues, fall back to direct API calls using the OpenAI-compatible endpoint:
baseURL: "https://api.moonshot.ai/v1"
// moonshot-node is OpenAI-compatible, use openai SDK as fallback if needed

4. What Already Exists

Before writing any code, run: git log --oneline -20 to see recent work.
Read existing files before creating new ones. The product is live.

4.1 Core Review Engine
•	Five specialists running in parallel via Promise.allSettled
•	Security, Reliability (always on), Business Logic, Performance, Code Quality (optional)
•	Master Score, fail-safe rewrite, humanisation layer, AI origin probability score
•	Business Context injection per project
•	Prompt obfuscation via base64 encoding
•	All AI calls proxied server-side — API key never in the browser
4.2 Website and Design System
•	Live on Vercel at codewatch-theta.vercel.app
•	Design: warm parchment base (#F5F2EE), ember red-orange accent (#C8440A)
•	Typography: Instrument Serif italic for display, DM Sans for body
•	All landing page sections built and deployed
•	Zero mentions of Claude or Anthropic anywhere in customer-facing surfaces
4.3 CI/CD Self-Review Pipeline
•	codewatch-self-review.yml and high-risk-gate.yml — both active
•	CODEWATCH reviews its own PRs. Every PR goes through the engine before merge.
•	Add GitHub secret AI_API_KEY (your Moonshot API key) to activate
4.4 Database Schema (PR #2 merged)
•	Correct schema with no source code storage
•	Separate plan_credits and topup_credits wallets
•	Atomic credit deduction function
•	Auto-grant 3 free credits on signup
•	Monthly reset cron — never touches top-up credits
•	RLS on all tables
4.5 Dependencies (PR #4 merged)
•	Lemon Squeezy, Upstash, Resend, Sentry, moonshot-node, Zod — all installed

5. What OpenClaw Will Build

Component	What it does
Supabase Auth	Signup, login, email verification, protected routes, JWT middleware
Credit enforcement	Server-side middleware checks balance before running specialists, deducts by code size
Lemon Squeezy checkout	Create checkout sessions for subscriptions and top-ups
Lemon Squeezy webhooks	POST /api/webhooks/lemonsqueezy — handle all payment events
Review engine API	POST /api/review using Moonshot Kimi K2.6 via moonshot-node
Rewrite and humanise	POST /api/rewrite and POST /api/humanise routes
Credits API	GET /api/credits — return both wallets, usage stats, reset date
User dashboard	Credit balance, usage stats, review history, project workspaces
Persistent Business Context	Store context per project
Upstash Redis rate limiting	Per-user abuse prevention
Resend emails	Welcome, low credit alerts at 20% and 8%, top-up confirmation
Sentry	Production error visibility, no source code in error context
Admin panel	Credit override, user management, usage monitoring
Landing page wiring	Connect existing CTAs to live auth flow and Lemon Squeezy checkout


6. Pricing Tiers — Final

Tier	Price / Reviews / Notes
Free	/bin/sh — 3 reviews on signup, one time only, no card required
Solo	2/month — 30 reviews — resets monthly, no rollover
Pro	0/month — 120 reviews — resets monthly, no rollover
Studio	2/month — 400 reviews — resets monthly, no rollover
Agency	55/month — 1,000 reviews — resets monthly, no rollover
Top-up	.99 one-time — 25 reviews — never expire, accumulate

Credit Consumption by Code Size

Code size	Credits consumed
Under 100 lines	1 credit
100 to 300 lines	2 credits
300 to 600 lines	4 credits
600 to 1,500 lines	8 credits
Production Clearance	12 credits — show warning before deducting


7. Hard Rules — Never Violate

RULE 1: Never store submitted source code in the database or logs. Code is memory-only.
RULE 2: Never put an API key in client-side code. All AI calls are server-side only.
RULE 3: Never bypass Row Level Security. Every query must respect RLS policies.
RULE 4: Never mention Claude, Anthropic, Moonshot, or any underlying AI model in UI or emails.
RULE 5: Never merge a PR. OpenClaw opens PRs only. AV must approve and merge.
RULE 6: Never modify payment or billing logic without running full test suite first.
RULE 7: Never install a package you have not verified exists and is safe.
RULE 8: Never delete or overwrite .env, .env.local, or Vercel environment variables.
RULE 9: Never rebuild what already exists. Read existing code before writing new code.
RULE 10: Never reset top-up credits. Only plan_credits reset on billing anniversary.
RULE 11: Always show a warning before deducting 12 credits for Production Clearance.
RULE 12: Use Lemon Squeezy, NOT Stripe. Never import stripe or use Stripe SDK.
RULE 13: Use Moonshot Kimi K2.6, NOT Anthropic Claude, for the review engine.
RULE 14: CODEWATCH CI reviews your PR. Address CRITICAL or HIGH findings before closing session.


8. Session Behaviour
At the Start of Every Session
•	Read this SOUL.md file
•	Run git log --oneline -20 and git status
•	State what you are about to build before starting
•	Read existing files before editing them
Model Routing for the Build Agent (OpenClaw)

Task	Model
Review engine, Lemon Squeezy webhooks, RLS, auth, DB migrations	Kimi K2.6 via Moonshot
Next.js scaffolding, CSS, simple CRUD routes, email templates, admin UI	NVIDIA NIM free

At the End of Every Session
•	Open a GitHub PR with plain English description
•	Never merge — leave for AV to approve
•	Add session summary comment to the PR
•	Wait for CODEWATCH CI review before considering session complete
When Stuck
•	Do not loop more than 40 turns
•	Open a WIP: PR with a clear blocker description

9. Keeping This File Accurate
Update SOUL.md after each sprint. Move completed items from Section 5 into Section 4 with file paths. Add new decisions as they are made.

End of SOUL.md v4 — Lemon Squeezy + Moonshot  |  CODEWATCH  |  Mieux Demain Private Limited  |  May 2026
