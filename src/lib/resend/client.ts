// lib/resend/client.ts — Resend email client for CODEWATCH
// SOUL.md v4: Resend for transactional emails (welcome, low credit alerts)

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn("RESEND_API_KEY not set — emails will be disabled");
}

export const resend = apiKey ? new Resend(apiKey) : null;

// Sender address — must be verified in Resend dashboard
export const FROM_EMAIL = "CodeWatch <noreply@codewatch.dev>";

export function isEmailEnabled(): boolean {
  return !!resend;
}
