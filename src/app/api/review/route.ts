// app/api/review/route.ts — Core review endpoint for CODEWATCH
// Matches client.ts v3 schema exactly. Prototype logic preserved.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { runAllSpecialists, humaniseCode } from "@/lib/ai/client";
import { rateLimitOrThrow } from "@/lib/upstash/ratelimit";

// ─── Request schema ──────────────────────────────────────────────────────────

const reviewSchema = z.object({
  code: z.string().min(1).max(50000),
  language: z.enum([
    "javascript",
    "typescript",
    "python",
    "go",
    "rust",
    "java",
    "csharp",
    "cpp",
    "ruby",
    "php",
    "swift",
    "kotlin",
    "sql",
    "html",
    "css",
    "shell",
    "yaml",
    "json",
    "other",
  ]),
  projectId: z.string().uuid().optional(),
  businessContext: z.string().max(2000).optional(),

  // Optional specialists — security + reliability always run.
  // These must be explicitly enabled by the user in the dashboard.
  includeOptional: z
    .object({
      business: z.boolean().optional(),
      performance: z.boolean().optional(),
      quality: z.boolean().optional(),
    })
    .optional(),
});

const humaniseSchema = z.object({
  code: z.string().min(1).max(50000),
});

// ─── Credit calculation (matches pricing table in SOUL.md) ──────────────────

function calculateCredits(code: string): number {
  const lines = code.split("\n").length;
  if (lines < 100) return 1;
  if (lines < 300) return 2;
  if (lines < 600) return 4;
  if (lines < 1500) return 8;
  return 12; // Production Clearance
}

// ─── POST /api/review ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limit
    try {
      await rateLimitOrThrow(user.id, "review");
    } catch (rateError: any) {
      return NextResponse.json(
        { error: rateError.message },
        {
          status: 429,
          headers: {
            "X-RateLimit-Reset": String(rateError.rateLimit?.reset || ""),
          },
        }
      );
    }

    // 3. Parse + validate
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { code, language, projectId, businessContext, includeOptional } =
      parsed.data;

    // 4. Calculate credits
    const creditsNeeded = calculateCredits(code);

    // 5. Deduct credits atomically
    const { data: creditResult, error: creditError } = await supabase.rpc(
      "deduct_credits_for_review",
      {
        p_user_id: user.id,
        p_credits_needed: creditsNeeded,
        p_review_id: null,
      }
    );

    if (creditError) {
      if (creditError.message?.includes("Insufficient credits")) {
        return NextResponse.json(
          {
            error: "Insufficient credits",
            required: creditsNeeded,
            message: `This review requires ${creditsNeeded} credits. Please upgrade or top up.`,
          },
          { status: 402 }
        );
      }
      throw creditError;
    }

    // 6. Run all active specialists + rewrite (parallel, inside runAllSpecialists)
    const reviewResult = await runAllSpecialists(code, {
      businessContext,
      includeOptional: {
        business: includeOptional?.business ?? false,
        performance: includeOptional?.performance ?? false,
        quality: includeOptional?.quality ?? false,
      },
    });

    // 7. Store review — NO source code stored (SOUL.md Rule 1)
    const { data: reviewRecord, error: insertError } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        project_id: projectId || null,
        language,
        line_count: code.split("\n").length,
        specialists_run: reviewResult.specialists.map((s) => s.specialist),
        master_score: reviewResult.masterScore,
        master_risk: reviewResult.masterRisk,
        findings: reviewResult.allIssues,
        engineer_note: reviewResult.engineerNote,
        rewrite_available: !!reviewResult.rewrittenCode,
        ai_probability: reviewResult.aiProbability,
        credits_used: creditsNeeded,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Failed to store review:", insertError);
    }

    // 8. Return full response matching prototype output shape
    return NextResponse.json({
      success: true,
      reviewId: reviewRecord?.id,

      // Master score + risk
      masterScore: reviewResult.masterScore,
      masterRisk: reviewResult.masterRisk,
      summary: reviewResult.summary,

      // Per-specialist results (score, risk_level, issues[], verdict, context_gaps)
      specialists: reviewResult.specialists,

      // All issues merged + sorted by severity
      findings: reviewResult.allIssues,

      // Rewrite
      rewrittenCode: reviewResult.rewrittenCode,
      engineerNote: reviewResult.engineerNote,
      aiProbability: reviewResult.aiProbability,

      // Meta
      specialistsRun: reviewResult.specialists.map((s) => s.specialist),
      creditsUsed: creditsNeeded,
      creditsRemaining: {
        plan: creditResult?.[0]?.plan_credits_remaining ?? 0,
        topup: creditResult?.[0]?.topup_credits_remaining ?? 0,
      },
      lineCount: code.split("\n").length,
    });
  } catch (error: any) {
    console.error("Review API error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

// ─── POST /api/review/humanise ───────────────────────────────────────────────
// Separate endpoint so humanisation is always on-demand, never automatic.
// Matches prototype: only runs after the main review completes.

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = humaniseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await humaniseCode(parsed.data.code);

    return NextResponse.json({
      success: true,
      humanisedCode: result.humanisedCode,
      changesMade: result.changesMade,
      humanScore: result.humanScore,
    });
  } catch (error: any) {
    console.error("Humanise API error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
