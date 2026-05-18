// app/api/rewrite/route.ts — Fail-safe rewrite endpoint
// SOUL.md v4: POST /api/rewrite — generate corrected code from findings
// Author: Kimi Build Agent | Date: 2026-05-17

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateRewrite } from "@/lib/ai/client";
import { rateLimitOrThrow } from "@/lib/upstash/ratelimit";

const rewriteSchema = z.object({
  code: z.string().min(1).max(50000),
  language: z.string().min(1).max(50),
  findings: z.array(
    z.object({
      line: z.number().int().positive(),
      severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
      description: z.string(),
    })
  ),
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
      await rateLimitOrThrow(user.id, "rewrite");
    } catch (rateError: any) {
      return NextResponse.json({ error: rateError.message }, { status: 429 });
    }

    // 3. Validate
    const body = await request.json();
    const parsed = rewriteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { code, language, findings } = parsed.data;

    // 4. Generate rewrite
    const rewrite = await generateRewrite(code, language, findings);

    return NextResponse.json({
      success: true,
      rewrite,
      language,
    });
  } catch (error: any) {
    console.error("Rewrite API error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
