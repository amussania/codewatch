import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";

// ─── Credit allocation by Stripe price/plan ───────────────────────────────────
// These are matched against the Stripe subscription's metadata.plan_tier field
// (set when creating the checkout session). Fallback to price-based lookup.

const PLAN_CREDITS: Record<string, number> = {
  solo: 100,
  pro: 350,
  studio: 1000,
  agency: 3000,
};

function creditsForPlan(planTier: string | undefined | null): number {
  if (!planTier) return 100;
  return PLAN_CREDITS[planTier.toLowerCase()] ?? 100;
}

// ─── Stripe client (lazy) ─────────────────────────────────────────────────────

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
  });
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  // 1. Verify signature — reject anything that doesn't pass
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    console.error("Stripe webhook signature error:", message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  const service = createServiceClient();

  // 2. Handle events
  switch (event.type) {

    // ── Subscription payment succeeded ──────────────────────────────────────
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      // In Stripe API 2026-04-22.dahlia, subscription moved to invoice.parent
      const parent = invoice.parent as { type?: string; subscription_details?: { subscription?: string } } | null;
      const subscriptionId = parent?.type === "subscription_details"
        ? (parent.subscription_details?.subscription ?? null)
        : null;

      if (!subscriptionId) break;

      // Fetch subscription to get plan metadata
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const planTier =
        (subscription.metadata?.plan_tier as string | undefined) ??
        (subscription.items.data[0]?.price?.metadata?.plan_tier as string | undefined);

      const credits = creditsForPlan(planTier);

      // Find user by stripe_customer_id in profiles
      const { data: profile } = await service
        .from("profiles")
        .select("id, balance")
        .eq("stripe_customer_id", customerId)
        .single();

      if (!profile) {
        console.error("Stripe webhook: no profile for customer", customerId);
        break;
      }

      // Update balance and reset_date
      const resetDate = new Date();
      resetDate.setMonth(resetDate.getMonth() + 1);

      await service
        .from("profiles")
        .update({
          balance: credits,
          plan_tier: planTier ?? "solo",
          plan: planTier ?? "solo",
          reset_date: resetDate.toISOString(),
        })
        .eq("id", profile.id);

      await service.from("credit_transactions").insert({
        user_id: profile.id,
        type: "subscription",
        amount: credits,
        review_id: null,
      });

      break;
    }

    // ── Subscription cancelled ───────────────────────────────────────────────
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: profile } = await service
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (!profile) break;

      await service
        .from("profiles")
        .update({ plan: "free", plan_tier: "free" })
        .eq("id", profile.id);

      break;
    }

    // ── Subscription updated (plan change) ──────────────────────────────────
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const planTier =
        (subscription.metadata?.plan_tier as string | undefined) ??
        (subscription.items.data[0]?.price?.metadata?.plan_tier as string | undefined);

      if (!planTier) break;

      const { data: profile } = await service
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (!profile) break;

      await service
        .from("profiles")
        .update({ plan: planTier, plan_tier: planTier })
        .eq("id", profile.id);

      break;
    }

    // ── One-off top-up checkout completed ───────────────────────────────────
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "payment") break;

      const topupCredits = parseInt(session.metadata?.credits ?? "0", 10);
      const userId = session.metadata?.user_id;

      if (!topupCredits || !userId) break;

      // Read current balance
      const { data: profile } = await service
        .from("profiles")
        .select("balance")
        .eq("id", userId)
        .single();

      if (!profile) break;

      await service
        .from("profiles")
        .update({ balance: (profile.balance ?? 0) + topupCredits })
        .eq("id", userId);

      await service.from("credit_transactions").insert({
        user_id: userId,
        type: "topup",
        amount: topupCredits,
        review_id: null,
      });

      break;
    }

    default:
      // Unhandled event type — not an error
      break;
  }

  return NextResponse.json({ received: true });
}
