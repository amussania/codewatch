// app/api/credits/route.ts — Credit balance and usage endpoint
// SOUL.md v4: GET /api/credits — return both wallets, usage stats, reset date
// Author: Kimi Build Agent | Date: 2026-05-17

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimitOrThrow } from "@/lib/upstash/ratelimit";

export async function GET() {
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
      await rateLimitOrThrow(user.id, "credits");
    } catch (rateError: any) {
      return NextResponse.json(
        { error: rateError.message },
        { status: 429 }
      );
    }

    // 3. Fetch credit balance
    const { data: credits, error: creditsError } = await supabase
      .from("credits")
      .select("plan_credits, topup_credits, total_used, reset_date, plan_tier, last_topup_at")
      .eq("user_id", user.id)
      .single();

    if (creditsError) {
      // If no credits row exists, user might be new — return free tier defaults
      if (creditsError.code === "PGRST116") {
        return NextResponse.json({
          planCredits: 0,
          topupCredits: 0,
          totalUsed: 0,
          totalAvailable: 0,
          planTier: "free",
          resetDate: null,
          lastTopupAt: null,
          usageStats: {
            reviewsThisMonth: 0,
            averageScore: null,
          },
        });
      }
      throw creditsError;
    }

    // 4. Fetch usage stats
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("master_score, credits_used, created_at")
      .eq("user_id", user.id)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false });

    const reviewsThisMonth = reviews?.length || 0;
    const averageScore = reviews && reviews.length > 0
      ? Math.round(reviews.reduce((sum, r) => sum + (r.master_score || 0), 0) / reviews.length)
      : null;

    const totalCreditsUsed = reviews?.reduce((sum, r) => sum + (r.credits_used || 0), 0) || 0;

    // 5. Return response
    return NextResponse.json({
      planCredits: credits.plan_credits,
      topupCredits: credits.topup_credits,
      totalAvailable: (credits.plan_credits || 0) + (credits.topup_credits || 0),
      totalUsed: credits.total_used,
      totalCreditsUsedThisMonth: totalCreditsUsed,
      planTier: credits.plan_tier,
      resetDate: credits.reset_date,
      lastTopupAt: credits.last_topup_at,
      usageStats: {
        reviewsThisMonth,
        averageScore,
      },
    });
  } catch (error: any) {
    console.error("Credits API error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
