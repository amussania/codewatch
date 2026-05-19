import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const TOPUP_CREDITS = 25;
const TOPUP_PRICE_CENTS = 299; // $2.99

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
  });
}

export async function POST() {
  // 1. Authenticate
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const stripe = getStripe();

  // 2. Create Stripe Checkout session for one-off top-up
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://codewatch.dev";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: TOPUP_PRICE_CENTS,
          product_data: {
            name: `${TOPUP_CREDITS} CodeWatch Credits`,
            description: "One-time credit top-up. Credits never expire.",
          },
        },
      },
    ],
    metadata: {
      user_id: user.id,
      credits: String(TOPUP_CREDITS),
    },
    success_url: `${origin}/dashboard/billing?topup=success`,
    cancel_url: `${origin}/dashboard/billing?topup=cancelled`,
    customer_email: user.email,
  });

  return NextResponse.json({ url: session.url });
}
