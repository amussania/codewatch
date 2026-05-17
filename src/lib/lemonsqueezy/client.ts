// lib/lemonsqueezy/client.ts — Lemon Squeezy client for CODEWATCH
// SOUL.md v4: Lemon Squeezy is the payment processor. NOT Stripe.
// Author: Kimi Build Agent | Date: 2026-05-17

import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

const apiKey = process.env.LEMONSQUEEZY_API_KEY;
const storeId = process.env.LEMONSQUEEZY_STORE_ID;

if (!apiKey) {
  throw new Error("LEMONSQUEEZY_API_KEY is not set");
}

if (!storeId) {
  throw new Error("LEMONSQUEEZY_STORE_ID is not set");
}

// Initialize Lemon Squeezy SDK
lemonSqueezySetup({ apiKey });

export { createCheckout, getProduct, getVariant } from "@lemonsqueezy/lemonsqueezy.js";

// Product/variant IDs for CODEWATCH tiers (populate from Lemon Squeezy dashboard)
export const LEMON_SQUEEZY_VARIANTS = {
  solo: process.env.LEMONSQUEEZY_VARIANT_SOLO || "",
  pro: process.env.LEMONSQUEEZY_VARIANT_PRO || "",
  studio: process.env.LEMONSQUEEZY_VARIANT_STUDIO || "",
  agency: process.env.LEMONSQUEEZY_VARIANT_AGENCY || "",
  topup: process.env.LEMONSQUEEZY_VARIANT_TOPUP || "",
};

// Credit allocation per tier (matches SOUL.md Section 6)
export const TIER_CREDITS: Record<string, number> = {
  free: 3,
  solo: 30,
  pro: 120,
  studio: 400,
  agency: 1000,
};

// Validate variant configuration
export function validateVariantConfig(): string[] {
  const missing: string[] = [];
  for (const [tier, id] of Object.entries(LEMON_SQUEEZY_VARIANTS)) {
    if (!id) missing.push(tier);
  }
  return missing;
}
