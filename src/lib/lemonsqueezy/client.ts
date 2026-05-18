// lib/lemonsqueezy/client.ts — Lemon Squeezy client for CODEWATCH
// SOUL.md v4: Lemon Squeezy is the payment processor. NOT Stripe.

import {
  lemonSqueezySetup,
  createCheckout as _createCheckout,
  getProduct as _getProduct,
  getVariant as _getVariant,
} from "@lemonsqueezy/lemonsqueezy.js";

let initialized = false;

function ensureInitialized() {
  if (initialized) return;
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY is not set");
  }
  lemonSqueezySetup({ apiKey });
  initialized = true;
}

export function createCheckout(
  ...args: Parameters<typeof _createCheckout>
): ReturnType<typeof _createCheckout> {
  ensureInitialized();
  return _createCheckout(...args);
}

export function getProduct(
  ...args: Parameters<typeof _getProduct>
): ReturnType<typeof _getProduct> {
  ensureInitialized();
  return _getProduct(...args);
}

export function getVariant(
  ...args: Parameters<typeof _getVariant>
): ReturnType<typeof _getVariant> {
  ensureInitialized();
  return _getVariant(...args);
}

export const LEMON_SQUEEZY_VARIANTS = {
  solo: process.env.LEMONSQUEEZY_VARIANT_SOLO || "",
  pro: process.env.LEMONSQUEEZY_VARIANT_PRO || "",
  studio: process.env.LEMONSQUEEZY_VARIANT_STUDIO || "",
  agency: process.env.LEMONSQUEEZY_VARIANT_AGENCY || "",
  topup: process.env.LEMONSQUEEZY_VARIANT_TOPUP || "",
};

export const TIER_CREDITS: Record<string, number> = {
  free: 3,
  solo: 30,
  pro: 120,
  studio: 400,
  agency: 1000,
};

export function validateVariantConfig(): string[] {
  const missing: string[] = [];
  for (const [tier, id] of Object.entries(LEMON_SQUEEZY_VARIANTS)) {
    if (!id) missing.push(tier);
  }
  return missing;
}
