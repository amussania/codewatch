// app/api/credits/check/route.ts — Check credits and send alerts
// SOUL.md v4: Low credit alerts at 20% and 8%

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendLowCreditAlert } from "@/lib/resend/templates";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: credits, error } = await supabase
      .from("credits")
      .select("plan_credits, topup_credits, total_used, plan_tier")
      .eq("user_id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 });
    }

    const total = (credits.plan_credits || 0) + (credits.topup_credits || 0);
    const tierAllocation =
      credits.plan_tier === "free" ? 3 :
      credits.plan_tier === "solo" ? 30 :
      credits.plan_tier === "pro" ? 120 :
      credits.plan_tier === "studio" ? 400 :
      credits.plan_tier === "agency" ? 1000 : 3;

    const percentage = Math.round((total / tierAllocation) * 100);

    // Send alerts at 20% and 8% thresholds
    if (percentage <= 20) {
      await sendLowCreditAlert(user.email!, total, tierAllocation);
    }

    return NextResponse.json({
      total,
      percentage,
      planCredits: credits.plan_credits,
      topupCredits: credits.topup_credits,
      tier: credits.plan_tier,
      alertSent: percentage <= 20,
    });
  } catch (error: any) {
    console.error("Credit check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
