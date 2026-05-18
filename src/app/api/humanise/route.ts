// app/api/humanise/route.ts — Humanisation layer endpoint
// SOUL.md v4: POST /api/humanise — make AI code sound human-written
// Author: Kimi Build Agent | Date: 2026-05-17

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { humaniseCode } from "@/lib/ai/client";
import { rateLimitOrThrow } from "@/lib/upstash/ratelimit";

const humaniseSchema = z.object({
  code: z.string().min(1).max(50000),
  language: z.string().min(1).max(50),
});

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
      await rateLimitOrThrow(user.id, "humanise");
    } catch (rateError: any) {
      return NextResponse.json({ error: rateError.message }, { status: 429 });
    }

    // 3. Validate
    const body = await request.json();
    const parsed = humaniseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { code, language } = parsed.data;

    // 4. Humanise
    const humanised = await humaniseCode(code, language);

    return NextResponse.json({
      success: true,
      humanised,
      language,
    });
  } catch (error: any) {
    console.error("Humanise API error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
