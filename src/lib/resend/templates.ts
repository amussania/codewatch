// lib/resend/templates.ts — Email templates for CODEWATCH
// SOUL.md v4: Welcome, low credit alerts (20%, 8%), top-up confirmation
// Author: Kimi Build Agent | Date: 2026-05-17

import { resend, FROM_EMAIL, isEmailEnabled } from "./client";

// Welcome email — sent on signup
export async function sendWelcomeEmail(to: string, name?: string) {
  if (!isEmailEnabled()) return;

  await resend!.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to CodeWatch — your 3 free reviews are ready",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1A1714; font-size: 24px; margin-bottom: 16px;">
          Welcome to CodeWatch${name ? ", " + name : ""}
        </h1>
        <p style="color: #4A4540; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          You now have <strong>3 free code reviews</strong> waiting. Paste your code and get instant feedback from five AI specialists.
        </p>
        <a href="https://codewatch-theta.vercel.app/dashboard"
           style="display: inline-block; background: #C8440A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
          Start Reviewing
        </a>
        <p style="color: #8C8580; font-size: 14px; margin-top: 32px;">
          No credit card required. Your free credits never expire.
        </p>
      </div>
    `,
  });
}

// Low credit alert — sent at 20% and 8% remaining
export async function sendLowCreditAlert(
  to: string,
  remainingCredits: number,
  totalCredits: number
) {
  if (!isEmailEnabled()) return;

  const percentage = Math.round((remainingCredits / totalCredits) * 100);
  const isUrgent = percentage <= 8;

  await resend!.emails.send({
    from: FROM_EMAIL,
    to,
    subject: isUrgent
      ? "Urgent: You're almost out of CodeWatch credits"
      : "Heads up: Your CodeWatch credits are running low",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: ${isUrgent ? "#C8440A" : "#1A1714"}; font-size: 24px; margin-bottom: 16px;">
          ${isUrgent ? "⚠️ Urgent: " : ""}Low Credit Alert
        </h1>
        <p style="color: #4A4540; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          You have <strong>${remainingCredits} credits</strong> remaining (${percentage}% of your monthly allocation).
        </p>
        ${isUrgent ? `
          <p style="color: #C8440A; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            <strong>Your next review may fail.</strong> Top up now to keep reviewing without interruption.
          </p>
        ` : ""}
        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
          <a href="https://codewatch-theta.vercel.app/dashboard?topup=1"
             style="display: inline-block; background: #C8440A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
            Top Up Credits
          </a>
          <a href="https://codewatch-theta.vercel.app/dashboard?upgrade=1"
             style="display: inline-block; background: transparent; color: #C8440A; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; border: 1px solid #C8440A;">
            Upgrade Plan
          </a>
        </div>
        <p style="color: #8C8580; font-size: 14px;">
          Top-up credits never expire and work with any plan.
        </p>
      </div>
    `,
  });
}

// Top-up confirmation
export async function sendTopupConfirmation(to: string, creditsAdded: number) {
  if (!isEmailEnabled()) return;

  await resend!.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "CodeWatch top-up confirmed — credits added",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1A1714; font-size: 24px; margin-bottom: 16px;">
          Top-up Confirmed ✅
        </h1>
        <p style="color: #4A4540; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          <strong>${creditsAdded} credits</strong> have been added to your account. These credits never expire.
        </p>
        <a href="https://codewatch-theta.vercel.app/dashboard"
           style="display: inline-block; background: #C8440A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
          Continue Reviewing
        </a>
      </div>
    `,
  });
}

// Subscription confirmation
export async function sendSubscriptionConfirmation(to: string, tier: string, credits: number) {
  if (!isEmailEnabled()) return;

  await resend!.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Welcome to CodeWatch ${tier} — subscription active`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1A1714; font-size: 24px; margin-bottom: 16px;">
          Subscription Activated 🎉
        </h1>
        <p style="color: #4A4540; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          You're now on the <strong>${tier}</strong> plan with <strong>${credits} credits per month</strong>.
        </p>
        <a href="https://codewatch-theta.vercel.app/dashboard"
           style="display: inline-block; background: #C8440A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
          Start Reviewing
        </a>
      </div>
    `,
  });
}
