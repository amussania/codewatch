// lib/ai/moonshot.ts — Moonshot Kimi K2.6 client for CODEWATCH
// SOUL.md v4: Use Moonshot Kimi K2.6, NOT Anthropic. Server-side only.
// Author: Kimi Build Agent | Date: 2026-05-17

import { createSDK } from "moonshot-node";

const apiKey = process.env.MOONSHOT_API_KEY;
if (!apiKey) {
  throw new Error("MOONSHOT_API_KEY is not set in environment variables");
}

export const moonshot = createSDK({ accessToken: apiKey });

// Model identifier — use 128k context for code review
export const MOONSHOT_MODEL = "moonshot-v1-128k";

// Base system prompt shared across all specialists
export const BASE_SYSTEM_PROMPT = `You are a senior software engineer conducting a code review.
Analyze the provided code for issues. Respond in strict JSON format.
Do not include markdown code blocks or explanations outside the JSON.

Response format:
{
  "findings": [
    {
      "line": number,
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "category": "security" | "reliability" | "performance" | "quality" | "logic",
      "title": "Brief issue title",
      "description": "Detailed explanation"
    }
  ],
  "summary": "Overall assessment in 1-2 sentences",
  "score": number (0-100)
}`;

// Specialist prompts — each focuses on a different dimension
export const SPECIALIST_PROMPTS = {
  security: `You are a Security Analyst. Focus exclusively on:
- Authentication/authorization vulnerabilities
- Injection risks (SQL, XSS, command)
- Sensitive data exposure
- Insecure dependencies
- Missing input validation
- Cryptographic weaknesses

${BASE_SYSTEM_PROMPT}`,

  reliability: `You are a Reliability Engineer. Focus exclusively on:
- Error handling gaps
- Silent failures
- Resource leaks
- Race conditions
- Unhandled edge cases
- Missing rollback mechanisms
- Timeout and retry logic

${BASE_SYSTEM_PROMPT}`,

  performance: `You are a Performance Engineer. Focus exclusively on:
- Algorithmic complexity (Big O)
- N+1 queries and unnecessary DB calls
- Memory leaks and excessive allocation
- Blocking operations in async contexts
- Inefficient data structures
- Missing caching opportunities

${BASE_SYSTEM_PROMPT}`,

  quality: `You are a Code Quality Specialist. Focus exclusively on:
- SOLID principle violations
- Code duplication
- Naming conventions and readability
- Type safety issues
- Dead code and unused imports
- Test coverage gaps
- Documentation deficiencies

${BASE_SYSTEM_PROMPT}`,

  logic: `You are a Business Logic Validator. Focus exclusively on:
- Logic errors and incorrect conditions
- Off-by-one errors
- State management issues
- API contract violations
- Data validation gaps
- Workflow correctness
- Edge case handling

${BASE_SYSTEM_PROMPT}`,
};

// Run a single specialist review
export async function runSpecialist(
  specialist: keyof typeof SPECIALIST_PROMPTS,
  code: string,
  language: string,
  businessContext?: string
) {
  const systemPrompt = SPECIALIST_PROMPTS[specialist];
  const contextBlock = businessContext
    ? `\n\nBusiness Context:\n${businessContext}`
    : "";

  const userPrompt = `Language: ${language}${contextBlock}\n\nCode to review:\n\n${code}`;

  const response = await moonshot.chat.createCompletion.request({
    model: MOONSHOT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 4000,
  });

  const content = response.choices?.[0]?.message?.content || "{}";

  // Parse JSON response
  try {
    const parsed = JSON.parse(content);
    return {
      specialist,
      findings: parsed.findings || [],
      summary: parsed.summary || "",
      score: typeof parsed.score === "number" ? parsed.score : 75,
      raw: content,
    };
  } catch {
    // Fallback if JSON parsing fails
    return {
      specialist,
      findings: [],
      summary: "Failed to parse review response",
      score: 0,
      raw: content,
    };
  }
}

// Run all specialists in parallel
export async function runAllSpecialists(
  code: string,
  language: string,
  options?: {
    businessContext?: string;
    skipQuality?: boolean;
  }
) {
  const specialists: (keyof typeof SPECIALIST_PROMPTS)[] = [
    "security",
    "reliability",
    "performance",
    "logic",
  ];

  if (!options?.skipQuality) {
    specialists.push("quality");
  }

  const results = await Promise.allSettled(
    specialists.map((s) => runSpecialist(s, code, language, options?.businessContext))
  );

  const findings: Array<{
    line: number;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    category: string;
    title: string;
    description: string;
    specialist: string;
  }> = [];

  let totalScore = 0;
  let successCount = 0;
  const specialistsRun: string[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      const data = result.value;
      specialistsRun.push(data.specialist);
      totalScore += data.score;
      successCount++;

      for (const finding of data.findings) {
        findings.push({
          ...finding,
          specialist: data.specialist,
        });
      }
    }
  }

  // Calculate Master Score: average of specialist scores, weighted down by CRITICAL findings
  const avgScore = successCount > 0 ? totalScore / successCount : 0;
  const criticalCount = findings.filter((f) => f.severity === "CRITICAL").length;
  const masterScore = Math.max(0, avgScore - criticalCount * 15);

  // Sort findings: CRITICAL first, then by line number
  findings.sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return a.line - b.line;
  });

  return {
    masterScore: Math.round(masterScore),
    findings,
    specialistsRun,
    summary: findings.length > 0
      ? `${findings.length} findings (${criticalCount} critical). Review recommended before merging.`
      : "No significant issues detected. Code looks good.",
  };
}

// Fail-safe rewrite: generate corrected code
export async function generateRewrite(
  code: string,
  language: string,
  findings: Array<{ line: number; severity: string; description: string }>
) {
  const findingsText = findings
    .map((f) => `Line ${f.line} [${f.severity}]: ${f.description}`)
    .join("\n");

  const prompt = `You are a senior engineer. Fix the following code based on these review findings.
Return ONLY the corrected code. No explanations, no markdown code fences.

Findings:
${findingsText}

Original code (${language}):
${code}

Corrected code:`;

  const response = await moonshot.chat.createCompletion.request({
    model: MOONSHOT_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 8000,
  });

  return response.choices?.[0]?.message?.content || code;
}

// Humanisation layer: make AI-generated code sound human-written
export async function humaniseCode(code: string, language: string) {
  const prompt = `You are a senior engineer refactoring code to sound naturally human-written.
Add subtle imperfections: slightly inconsistent spacing, a meaningful comment, a minor variable rename that shows human thought.
Do NOT change logic or introduce bugs. Return ONLY the refactored code.

Code (${language}):
${code}

Refactored code:`;

  const response = await moonshot.chat.createCompletion.request({
    model: MOONSHOT_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 8000,
  });

  return response.choices?.[0]?.message?.content || code;
}
