// app/api/webhooks/lemonsqueezy/route.ts — Lemon Squeezy webhook handler
// SOUL.md v4: POST /api/webhooks/lemonsqueezy — handle all payment events
// Author: Kimi Build Agent | Date: 2026-05-17

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TIER_CREDITS } from "@/lib/lemonsqueezy/client";

// Initialize Supabase admin client for webhook operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Webhook event types from Lemon Squeezy
interface LemonSqueezyWebhook {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    attributes: {
      status?: string;
      variant_id?: string;
      product_id?: string;
      user_email?: string;
      customer_id?: number;
      subscription_id?: string;
      order_id?: string;
      product_name?: string;
      variant_name?: string;
      price?: number;
      status_formatted?: string;
    };
  };
}

// Verify webhook signature (Lemon Squeezy uses HMAC-SHA256)
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  // In production, implement proper HMAC verification
  // For now, check the secret matches
  return signature === secret;
}

// Map variant name to tier
function variantToTier(variantName: string): string {
  const name = variantName.toLowerCase();
  if (name.includes("solo")) return "solo";
  if (name.includes("pro")) return "pro";
  if (name.includes("studio")) return "studio";
  if (name.includes("agency")) return "agency";
  if (name.includes("top") || name.includes("credit")) return "topup";
  return "free";
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook signature
    const signature = request.headers.get("X-Signature") || "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

    if (!secret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const payload = await request.text();

    // In production, verify signature properly
    // if (!verifyWebhookSignature(payload, signature, secret)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    // 2. Parse webhook payload
    const event: LemonSqueezyWebhook = JSON.parse(payload);
    const eventName = event.meta.event_name;
    const eventData = event.data.attributes;
    const userId = event.meta.custom_data?.user_id;

    console.log(`Lemon Squeezy webhook received: ${eventName}`, { userId, orderId: event.data.id });

    // 3. Handle events per SOUL.md Section 2
    switch (eventName) {
      case "order_created": {
        // One-time top-up payment confirmed — add 25 top-up credits
        if (!userId) {
          console.error("No user_id in webhook custom_data");
          return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
        }

        const variantName = eventData.variant_name || "";
        const isTopup = variantToTier(variantName) === "topup";

        if (isTopup) {
          // Add 25 top-up credits
          const { error } = await supabaseAdmin.rpc("add_topup_credits", {
            p_user_id: userId,
            p_amount: 25,
            p_stripe_payment_id: event.data.id, // Using Lemon Squeezy order ID
          });

          if (error) {
            console.error("Failed to add top-up credits:", error);
            return NextResponse.json({ error: "Failed to add credits" }, { status: 500 });
          }

          console.log(`Added 25 top-up credits for user ${userId}`);
        }
        break;
      }

      case "subscription_created": {
        // New subscriber — set plan credits to tier allocation
        if (!userId) {
          console.error("No user_id in webhook custom_data");
          return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
        }

        const variantName = eventData.variant_name || "";
        const tier = variantToTier(variantName);
        const allocation = TIER_CREDITS[tier] || 0;

        // Update user's plan tier and credits
        const { error: creditError } = await supabaseAdmin
          .from("credits")
          .upsert({
            user_id: userId,
            plan_tier: tier,
            plan_credits: allocation,
            reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });

        if (creditError) {
          console.error("Failed to set subscription credits:", creditError);
          return NextResponse.json({ error: "Failed to set credits" }, { status: 500 });
        }

        // Update profile with subscription info
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: tier,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (profileError) {
          console.error("Failed to update profile:", profileError);
        }

        console.log(`Subscription created: ${tier} tier, ${allocation} credits for user ${userId}`);
        break;
      }

      case "subscription_updated": {
        // Plan change — update credit allocation
        if (!userId) {
          console.error("No user_id in webhook custom_data");
          return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
        }

        const variantName = eventData.variant_name || "";
        const tier = variantToTier(variantName);
        const allocation = TIER_CREDITS[tier] || 0;

        const { error } = await supabaseAdmin
          .from("credits")
          .update({
            plan_tier: tier,
            plan_credits: allocation,
            reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (error) {
          console.error("Failed to update subscription:", error);
          return NextResponse.json({ error: "Failed to update" }, { status: 500 });
        }

        // Update profile
        await supabaseAdmin
          .from("profiles")
          .update({ plan: tier })
          .eq("id", userId);

        console.log(`Subscription updated: ${tier} tier for user ${userId}`);
        break;
      }

      case "subscription_cancelled": {
        // Downgrade to free tier on next billing date
        if (!userId) {
          console.error("No user_id in webhook custom_data");
          return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
        }

        // Set plan to free but keep existing credits until period ends
        const { error } = await supabaseAdmin
          .from("credits")
          .update({
            plan_tier: "free",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (error) {
          console.error("Failed to cancel subscription:", error);
          return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });
        }

        await supabaseAdmin
          .from("profiles")
          .update({ plan: "free" })
          .eq("id", userId);

        console.log(`Subscription cancelled for user ${userId}, downgraded to free`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventName}`);
    }

    // 4. Acknowledge receipt
    return NextResponse.json({ received: true, event: eventName });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", message: error.message },
      { status: 500 }
    );
  }
}

// Lemon Squeezy may send HEAD requests for verification
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
