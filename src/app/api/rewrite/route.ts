import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { runAllSpecialists } from "@/lib/ai/client";
import { rateLimitOrThrow } from "@/lib/upstash/ratelimit";

const rewriteSchema = z.object({
  code: z.string().min(1).max(50000),
  language: z.string().min(1).max(50),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      await rateLimitOrThrow(user.id, "rewrite");
    } catch (rateError: any) {
      return NextResponse.json({ error: rateError.message }, { status: 429 });
    }
    const body = await request.json();
    const parsed = rewriteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const result = await runAllSpecialists(parsed.data.code, {});
    return NextResponse.json({
      success: true,
      rewrittenCode: result.rewrittenCode,
      engineerNote: result.engineerNote,
      aiProbability: result.aiProbability,
    });
  } catch (error: any) {
    console.error("Rewrite API error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}