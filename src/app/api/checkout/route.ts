// app/api/checkout/route.ts — Lemon Squeezy checkout session creation
// SOUL.md v4: POST /api/checkout — create Lemon Squeezy checkout session
// Author: Kimi Build Agent | Date: 2026-05-17

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createCheckout, LEMON_SQUEEZY_VARIANTS } from "@/lib/lemonsqueezy/client";
import { rateLimitOrThrow } from "@/lib/upstash/ratelimit";

const checkoutSchema = z.object({
  tier: z.enum(["solo", "pro", "studio", "agency", "topup"]),
  redirectUrl: z.string().url().optional(),
});

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
      await rateLimitOrThrow(user.id, "credits");
    } catch (rateError: any) {
      return NextResponse.json({ error: rateError.message }, { status: 429 });
    }

    // 3. Parse request
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { tier, redirectUrl } = parsed.data;

    // 4. Get variant ID
    const variantId = LEMON_SQUEEZY_VARIANTS[tier];
    if (!variantId) {
      return NextResponse.json(
        { error: `Variant not configured for tier: ${tier}` },
        { status: 500 }
      );
    }

    // 5. Create checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://codewatch-theta.vercel.app";

    const checkout = await createCheckout({
      variantId,
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
        desc: true,
        discount: true,
        subscriptionPreview: true,
        buttonColor: "#C8440A", // Ember accent from CLAUDE.md
      },
      checkoutData: {
        email: user.email,
        custom: {
          user_id: user.id,
        },
        redirectUrl: redirectUrl || `${appUrl}/dashboard?checkout=success`,
      },
    });

    // 6. Return checkout URL
    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.data.attributes.url,
      checkoutId: checkout.data.id,
    });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout", message: error.message },
      { status: 500 }
    );
  }
}
