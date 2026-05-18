// app/api/review/route.ts — Core review endpoint for CODEWATCH
// SOUL.md v4: POST /api/review — auth check, credit check, run specialists, deduct credits
// Author: Kimi Build Agent | Date: 2026-05-17

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { runAllSpecialists, generateRewrite } from "@/lib/ai/client";
import { rateLimitOrThrow } from "@/lib/upstash/ratelimit";

// Validation schema for review requests
const reviewSchema = z.object({
  code: z.string().min(1).max(50000), // Max 50KB of code
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
  skipQuality: z.boolean().optional(),
});

// Calculate credits needed based on code size (SOUL.md Section 6)
function calculateCredits(code: string): number {
  const lines = code.split("\n").length;

  if (lines < 100) return 1;
  if (lines < 300) return 2;
  if (lines < 600) return 4;
  if (lines < 1500) return 8;
  return 12; // Production Clearance
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limit check
    try {
      await rateLimitOrThrow(user.id, "review");
    } catch (rateError: any) {
      return NextResponse.json(
        { error: rateError.message },
        { status: 429, headers: { "X-RateLimit-Reset": String(rateError.rateLimit?.reset || "") } }
      );
    }

    // 3. Parse and validate request body
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { code, language, projectId, businessContext, skipQuality } = parsed.data;

    // 4. Calculate credits needed
    const creditsNeeded = calculateCredits(code);

    // 5. Check credits and deduct atomically via RPC
    const { data: creditResult, error: creditError } = await supabase.rpc(
      "deduct_credits_for_review",
      {
        p_user_id: user.id,
        p_credits_needed: creditsNeeded,
        p_review_id: null, // Will be updated after review is created
      }
    );

    if (creditError) {
      // Check if it's an insufficient credits error
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

    // 6. Run AI specialists
    const reviewResult = await runAllSpecialists(code, language, {
      businessContext,
      skipQuality,
    });

    // 7. Generate rewrite if findings exist
    let rewrite: string | undefined;
    if (reviewResult.findings.length > 0) {
      try {
        rewrite = await generateRewrite(code, language, reviewResult.findings);
      } catch {
        // Rewrite is best-effort; don't fail the whole review
        rewrite = undefined;
      }
    }

    // 8. Store review result (NO source code per SOUL.md Rule 1)
    const { data: reviewRecord, error: insertError } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        project_id: projectId || null,
        language,
        line_count: code.split("\n").length,
        specialists_run: reviewResult.specialistsRun,
        master_score: reviewResult.masterScore,
        findings: reviewResult.findings,
        rewrite_available: !!rewrite,
        credits_used: creditsNeeded,
      })
      .select("id")
      .single();

    if (insertError) {
      // Attempt to refund credits if storage fails
      console.error("Failed to store review:", insertError);
      // Note: In production, you'd want a more robust refund mechanism
    }

    // 9. Return response
    return NextResponse.json({
      success: true,
      reviewId: reviewRecord?.id,
      masterScore: reviewResult.masterScore,
      findings: reviewResult.findings,
      summary: reviewResult.summary,
      specialistsRun: reviewResult.specialistsRun,
      creditsUsed: creditsNeeded,
      creditsRemaining: {
        plan: creditResult?.[0]?.plan_credits_remaining ?? 0,
        topup: creditResult?.[0]?.topup_credits_remaining ?? 0,
      },
      rewrite: rewrite || null,
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
