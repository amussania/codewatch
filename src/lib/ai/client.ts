// lib/ai/client.ts — CODEWATCH AI Engine
// Ported faithfully from prototype v3. Server-side only.

import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  _client = new Anthropic({ apiKey });
  return _client;
}

export const CLAUDE_MODEL = "claude-sonnet-4-5";

// ─── JSON extraction ────────────────────────────────────────────────────────

function extractJSON(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  return fenced ? fenced[1].trim() : raw.trim();
}

// ─── Specialist prompts (ported exactly from prototype v3) ──────────────────

const SPECIALIST_PROMPTS = {
  security: `You are a Security Auditor with 15 years in application security, pen testing, and incident response. You have personally dealt with data breaches and know exactly how attackers think.

Analyze this code exclusively for SECURITY risks:
- Authentication flaws (auth bypass, token expiry, JWT validation, session fixation)
- Authorization flaws (horizontal/vertical privilege escalation, RBAC bypass)
- Injection attacks (SQL, NoSQL, XSS, CSRF, SSRF, command, template, LDAP)
- Data exposure (hardcoded secrets, API keys in source, sensitive logs, stack traces in prod)
- File upload risks (type validation, malware, filename sanitization)
- API security (rate limiting, CORS, abuse prevention, pagination)
- Secrets management and ENV variable handling

Respond ONLY in this JSON format (no markdown fences, no preamble):
{
  "score": <0-100, where 100 = perfectly secure>,
  "risk_level": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "issues": [{"line": "<line or general>", "severity": "<LOW|MEDIUM|HIGH|CRITICAL>", "title": "<title>", "description": "<why this is dangerous in production>", "fix": "<concrete fix>"}],
  "verdict": "<frank security engineer verdict>"
}`,

  reliability: `You are a Reliability Engineer with 15 years building systems that stay up under chaos. You've been on-call through major outages and know exactly what breaks at 2AM.

Analyze this code exclusively for RELIABILITY risks:
- Core functionality (edge cases, null/empty/partial states, retry logic, timeouts)
- Concurrency risks (race conditions, double-click, duplicate requests, multiple tabs)
- Distributed system risks (event duplication, out-of-order events, webhook before DB commit)
- Disaster scenarios (DB corruption, region outage, queue overload, infinite retry loops)
- Third-party dependency risks (API outage, circuit breakers, fallbacks)
- Offline/slow network handling
- Session expiry and user interruption handling
- Fail gracefully, not catastrophically: survivable, observable, reversible

Respond ONLY in this JSON format (no markdown fences, no preamble):
{
  "score": <0-100, where 100 = perfectly reliable>,
  "risk_level": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "issues": [{"line": "<line or general>", "severity": "<LOW|MEDIUM|HIGH|CRITICAL>", "title": "<title>", "description": "<why this breaks at 2AM in production>", "fix": "<concrete fix>"}],
  "verdict": "<frank SRE verdict>"
}`,

  business: `You are a Business Logic Reviewer with 15 years building fintech, e-commerce, and SaaS systems. You have seen a single wrong decimal cost a company millions.

The developer has provided business context about this code. You MUST use this context to review against their actual business rules, not generic patterns. If no context is provided, flag what you cannot assess without it and review what you can.

Analyze this code exclusively for BUSINESS LOGIC risks:
- Currency calculations, financial rounding precision, tax logic -- check against stated rules
- Duplicate transaction prevention and idempotency
- Subscription logic, trial expiration, discount stacking
- Timezone conversions, DST handling, leap year edge cases
- User role permissions and feature flags
- State transitions and approval workflows
- Order cancellation rollback, inventory deductions
- Any logic where a small error silently costs money or breaks user trust

IMPORTANT: Where the developer has stated specific business rules, verify the code matches those exact rules.

Respond ONLY in this JSON format (no markdown fences, no preamble):
{
  "score": <0-100>,
  "risk_level": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "issues": [{"line": "<line or general>", "severity": "<LOW|MEDIUM|HIGH|CRITICAL>", "title": "<title>", "description": "<description>", "fix": "<fix>"}],
  "verdict": "<verdict>",
  "context_gaps": ["<things you could not assess without more business context>"]
}`,

  performance: `You are a Performance Engineer with 15 years optimizing systems at scale. You think in N+1 queries, memory pressure, and p99 latency.

Analyze this code exclusively for PERFORMANCE risks:
- Backend: N+1 queries, missing DB indexes, memory leaks, thread blocking, connection pooling, caching strategy
- Frontend: bundle size, lazy loading, unnecessary re-renders, DOM bloat, infinite loops
- API: payload size, compression, duplicate requests, retry storms
- Scale: what breaks at 10x, 100x traffic?
- Queue handling, Redis misuse, cache invalidation

Respond ONLY in this JSON format (no markdown fences, no preamble):
{
  "score": <0-100>,
  "risk_level": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "issues": [{"line": "<line or general>", "severity": "<LOW|MEDIUM|HIGH|CRITICAL>", "title": "<title>", "description": "<description>", "fix": "<fix>"}],
  "verdict": "<verdict>"
}`,

  quality: `You are a Quality Gatekeeper with 15 years reviewing code for maintainability, predictability, and debuggability.

Analyze this code exclusively for QUALITY risks:
- Testing depth (unit, integration, e2e, chaos scenarios)
- Observability (structured logging, correlation IDs, metrics, health checks)
- Code quality (naming clarity, separation of concerns, dead code)
- Maintainability (can another engineer understand this in 6 months?)
- Deployment safety, analytics integrity, UX reliability

Respond ONLY in this JSON format (no markdown fences, no preamble):
{
  "score": <0-100>,
  "risk_level": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "issues": [{"line": "<line or general>", "severity": "<LOW|MEDIUM|HIGH|CRITICAL>", "title": "<title>", "description": "<description>", "fix": "<fix>"}],
  "verdict": "<verdict>"
}`,
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export type SpecialistId = keyof typeof SPECIALIST_PROMPTS;

export interface SpecialistIssue {
  line: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  fix: string;
  specialist: SpecialistId;
}

export interface SpecialistResult {
  specialist: SpecialistId;
  score: number;
  risk_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  issues: SpecialistIssue[];
  verdict: string;
  context_gaps?: string[]; // business specialist only
}

export interface ReviewResult {
  masterScore: number;
  masterRisk: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  specialists: SpecialistResult[];
  allIssues: SpecialistIssue[];
  summary: string;
  engineerNote: string;
  rewrittenCode: string;
  aiProbability: number;
}

export interface HumaniseResult {
  humanisedCode: string;
  changesMade: string[];
  humanScore: number;
}

// ─── Run a single specialist ─────────────────────────────────────────────────

async function runSpecialist(
  specialist: SpecialistId,
  code: string,
  businessContext?: string
): Promise<SpecialistResult> {
  const client = getClient();

  const userMessage =
    specialist === "business" && businessContext?.trim()
      ? `BUSINESS CONTEXT:\n${businessContext.trim()}\n\n---\n\nAnalyze this code:\n\n${code}`
      : `Analyze this code:\n\n${code}`;

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 5000,
    system: SPECIALIST_PROMPTS[specialist],
    messages: [{ role: "user", content: userMessage }],
  });

  const raw =
    message.content[0]?.type === "text" ? message.content[0].text : "{}";
  const content = extractJSON(raw);

  try {
    const parsed = JSON.parse(content);
    return {
      specialist,
      score: typeof parsed.score === "number" ? parsed.score : 0,
      risk_level: parsed.risk_level ?? "HIGH",
      issues: (parsed.issues ?? []).map((i: SpecialistIssue) => ({
        ...i,
        specialist,
      })),
      verdict: parsed.verdict ?? "",
      context_gaps: parsed.context_gaps ?? [],
    };
  } catch {
    return {
      specialist,
      score: 0,
      risk_level: "HIGH",
      issues: [],
      verdict: "Analysis failed — could not parse response.",
    };
  }
}

// ─── Run all specialists in parallel ────────────────────────────────────────

export async function runAllSpecialists(
  code: string,
  options?: {
    businessContext?: string;
    includeOptional?: {
      business?: boolean;
      performance?: boolean;
      quality?: boolean;
    };
  }
): Promise<ReviewResult> {
  const client = getClient();

  // Always-on: security + reliability
  const activeSpecialists: SpecialistId[] = ["security", "reliability"];

  // Optional specialists — only run if explicitly enabled
  if (options?.includeOptional?.business) activeSpecialists.push("business");
  if (options?.includeOptional?.performance) activeSpecialists.push("performance");
  if (options?.includeOptional?.quality) activeSpecialists.push("quality");

  const truncated =
    code.length > 12000 ? code.slice(0, 12000) + "\n\n[...TRUNCATED]" : code;

  // Run all specialists + rewrite in parallel
  const [specialistResults, rewriteRaw] = await Promise.all([
    Promise.allSettled(
      activeSpecialists.map((s) =>
        runSpecialist(s, truncated, options?.businessContext)
      )
    ),
    client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 8000,
      system: `You are a Senior Staff Engineer. Rewrite the code to be FAIL-SAFE. NEVER change output. Add: explicit error handling, env for secrets, input validation, timeouts, logging, least privilege, null guards. Respond ONLY in JSON: {"rewritten_code":"<code>","ai_probability":<int>,"engineer_note":"<verdict>"}`,
      messages: [{ role: "user", content: `Rewrite this code:\n\n${truncated}` }],
    }),
  ]);

  // Process specialist results
  const specialists: SpecialistResult[] = [];
  const allIssues: SpecialistIssue[] = [];
  let totalScore = 0;

  for (const result of specialistResults) {
    if (result.status === "fulfilled") {
      specialists.push(result.value);
      totalScore += result.value.score;
      allIssues.push(...result.value.issues);
    }
  }

  // Sort issues by severity
  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  allIssues.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  // Master score = average of specialist scores
  const avgScore =
    specialists.length > 0 ? totalScore / specialists.length : 0;
  const masterScore = Math.round(Math.max(0, Math.min(100, avgScore)));
  const masterRisk: ReviewResult["masterRisk"] =
    masterScore >= 80
      ? "LOW"
      : masterScore >= 60
      ? "MEDIUM"
      : masterScore >= 40
      ? "HIGH"
      : "CRITICAL";

  const criticalCount = allIssues.filter(
    (i) => i.severity === "CRITICAL"
  ).length;
  const summary =
    allIssues.length > 0
      ? `${allIssues.length} issues found (${criticalCount} critical). Review recommended before deploying.`
      : "No significant issues detected. Code looks good.";

  // Process rewrite result
  let rewrittenCode = "";
  let aiProbability = 0;
  let engineerNote = "";

  try {
    const rewriteText =
      rewriteRaw.content[0]?.type === "text"
        ? rewriteRaw.content[0].text
        : "{}";
    const rewriteParsed = JSON.parse(extractJSON(rewriteText));
    rewrittenCode = rewriteParsed.rewritten_code ?? "";
    aiProbability = rewriteParsed.ai_probability ?? 0;
    engineerNote = rewriteParsed.engineer_note ?? "";
  } catch {
    rewrittenCode = code;
    engineerNote = "Rewrite failed — original code returned.";
  }

  return {
    masterScore,
    masterRisk,
    specialists,
    allIssues,
    summary,
    engineerNote,
    rewrittenCode,
    aiProbability,
  };
}

// ─── Humanise layer ──────────────────────────────────────────────────────────

export async function humaniseCode(code: string): Promise<HumaniseResult> {
  const client = getClient();

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 6000,
    system: `You are a senior engineer who has been writing code for 12 years. Make the received code read like it was written and evolved by a real human engineer, NOT generated by AI. Apply ALL: VARIABLE NAMING DRIFT, HUMAN COMMENTS (why not what), INTENTIONAL IMPERFECTIONS (TODOs, style drift), ASYMMETRIC ERROR HANDLING, EVIDENCE OF ITERATION. Code must remain 100% functionally identical. Respond ONLY in JSON: {"humanised_code":"<code>","changes_made":["<change>"],"human_score":<int>}`,
    messages: [
      { role: "user", content: `Humanise this code:\n\n${code}` },
    ],
  });

  const raw =
    message.content[0]?.type === "text" ? message.content[0].text : "{}";

  try {
    const parsed = JSON.parse(extractJSON(raw));
    return {
      humanisedCode: parsed.humanised_code ?? code,
      changesMade: parsed.changes_made ?? [],
      humanScore: parsed.human_score ?? 0,
    };
  } catch {
    return {
      humanisedCode: code,
      changesMade: [],
      humanScore: 0,
    };
  }
}
