"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Billing = "monthly" | "annual";

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number | null;
  reviews: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  featured: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: null,
    reviews: "3 reviews on signup",
    desc: "Three full reviews, no card required. One-time allocation to get started.",
    features: [
      "All 5 specialists",
      "No credit card required",
      "One-time allocation",
      "Zero code retention",
      "30+ languages",
    ],
    cta: "Start for free",
    href: "/signup",
    featured: false,
  },
  {
    id: "solo",
    name: "Solo",
    monthlyPrice: 12,
    reviews: "30 reviews / mo",
    desc: "For developers who want expert-level review without the enterprise overhead.",
    features: [
      "All 5 specialists",
      "Business Logic Context",
      "AI Origin Probability",
      "Zero code retention",
      "30+ languages",
    ],
    cta: "Get started",
    href: "/signup?plan=solo",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 30,
    reviews: "120 reviews / mo",
    desc: "For developers who need the full toolkit, including rewrites and white-label output.",
    features: [
      "Everything in Solo",
      "Fail-Safe Rewrite included",
      "Humanisation Layer",
      "White-label reports",
      "Priority review queue",
      "Top-up credits never expire",
    ],
    cta: "Get started",
    href: "/signup?plan=pro",
    featured: false,
  },
  {
    id: "studio",
    name: "Studio",
    monthlyPrice: 72,
    reviews: "400 reviews / mo",
    desc: "For small teams and freelancers reviewing client code at volume.",
    features: [
      "Everything in Pro",
      "3 user seats included",
      "Team review history",
      "White-label client reports",
      "Webhook integrations",
    ],
    cta: "Get started",
    href: "/signup?plan=studio",
    featured: true,
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 155,
    reviews: "1,000 reviews / mo",
    desc: "For agencies running code review as a client-facing service.",
    features: [
      "Everything in Studio",
      "Unlimited user seats",
      "Custom business logic templates",
      "Priority support + SLA",
      "Reseller billing support",
    ],
    cta: "Get started",
    href: "/signup?plan=agency",
    featured: false,
  },
];

const CREDIT_TABLE = [
  { range: "< 100 lines",        credits: "1 credit" },
  { range: "100 – 300 lines",    credits: "2 credits" },
  { range: "300 – 600 lines",    credits: "4 credits" },
  { range: "600 – 1,500 lines",  credits: "8 credits" },
  { range: "Production Clearance", credits: "12 credits" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDisplayPrice(
  monthlyPrice: number | null,
  billing: Billing
): { main: string; sub: string | null } {
  if (monthlyPrice === null) return { main: "Free", sub: null };
  if (billing === "monthly") return { main: `$${monthlyPrice}`, sub: "per month" };
  const discounted = Math.round(monthlyPrice * 0.8);
  return { main: `$${discounted}`, sub: "per month, billed annually" };
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function BillingToggle({
  billing,
  onChange,
}: {
  billing: Billing;
  onChange: (b: Billing) => void;
}) {
  const annual = billing === "annual";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <button
        onClick={() => onChange("monthly")}
        style={{
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: annual ? 400 : 600,
          color: annual ? "var(--cw-ink-tertiary)" : "var(--cw-ink-primary)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          transition: "color 200ms ease",
        }}
      >
        Monthly
      </button>

      <button
        onClick={() => onChange(annual ? "monthly" : "annual")}
        aria-label="Toggle billing period"
        style={{
          position: "relative",
          width: 44,
          height: 24,
          borderRadius: 12,
          background: annual ? "var(--cw-ember)" : "var(--cw-bg-primary)",
          border: `1.5px solid ${annual ? "var(--cw-ember)" : "rgba(26,23,20,0.2)"}`,
          cursor: "pointer",
          padding: 0,
          flexShrink: 0,
          transition: "background 200ms ease, border-color 200ms ease",
        }}
      >
        <motion.span
          animate={{ x: annual ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{
            position: "absolute",
            top: 2,
            left: 0,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: annual ? "#FDFAF7" : "var(--cw-ink-primary)",
            display: "block",
            transition: "background 200ms ease",
          }}
        />
      </button>

      <button
        onClick={() => onChange("annual")}
        style={{
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: annual ? 600 : 400,
          color: annual ? "var(--cw-ink-primary)" : "var(--cw-ink-tertiary)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: 7,
          transition: "color 200ms ease",
        }}
      >
        Annual
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--cw-signal-pass)",
            background: "rgba(42,107,60,0.1)",
            padding: "2px 7px",
            borderRadius: 99,
          }}
        >
          Save 20%
        </span>
      </button>
    </div>
  );
}

// ─── Checkmark ────────────────────────────────────────────────────────────────

function FeatureCheck() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0, marginTop: 2 }}
    >
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="var(--cw-signal-pass)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const { main, sub } = getDisplayPrice(plan.monthlyPrice, billing);
  const reduced = useReducedMotion();

  return (
    <motion.div
      style={{
        borderRadius: 12,
        background: "var(--cw-bg-surface)",
        border: plan.featured
          ? "1.5px solid var(--cw-ember)"
          : "0.5px solid var(--cw-bg-secondary)",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
      initial={{ y: plan.featured ? -8 : 0 }}
      animate={
        plan.featured && !reduced
          ? { y: [-8, -14, -8] }
          : { y: plan.featured ? -8 : 0 }
      }
      transition={
        plan.featured && !reduced
          ? { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
          : { duration: 0 }
      }
    >
      {/* Tier name + desc */}
      <div>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--cw-ink-tertiary)",
            margin: "0 0 6px",
          }}
        >
          {plan.name}
        </p>
        <p
          style={{
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--cw-ink-tertiary)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {plan.desc}
        </p>
      </div>

      {/* Price — fixed min-height prevents layout jump on toggle */}
      <div style={{ minHeight: 64 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${plan.id}-${billing}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <p
              className="font-heading italic"
              style={{
                fontSize: "clamp(34px, 2.8vw, 44px)",
                lineHeight: 1,
                color: "var(--cw-ink-primary)",
                margin: "0 0 4px",
              }}
            >
              {main}
            </p>
            <p
              style={{
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
                color: "var(--cw-ink-tertiary)",
                margin: "0 0 2px",
              }}
            >
              {plan.reviews}
            </p>
            {sub && (
              <p
                style={{
                  fontSize: 11,
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--cw-ink-tertiary)",
                  margin: 0,
                }}
              >
                {sub}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div style={{ height: "0.5px", background: "var(--cw-bg-secondary)" }} />

      {/* Features */}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 9,
          flex: 1,
        }}
      >
        {plan.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
            <FeatureCheck />
            <span
              style={{
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                color: "var(--cw-ink-secondary)",
                lineHeight: 1.45,
              }}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href={plan.href} style={{ display: "block" }}>
        <button
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            if (plan.featured) {
              btn.style.filter = "brightness(1.08)";
              btn.style.transform = "translateY(-1px)";
            } else {
              btn.style.background = "var(--cw-bg-secondary)";
              btn.style.borderColor = "rgba(26,23,20,0.4)";
            }
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            if (plan.featured) {
              btn.style.filter = "brightness(1)";
              btn.style.transform = "translateY(0)";
            } else {
              btn.style.background = "transparent";
              btn.style.borderColor = "rgba(26,23,20,0.2)";
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 40,
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            transition:
              "filter 200ms ease, background 200ms ease, border-color 200ms ease, transform 200ms ease",
            ...(plan.featured
              ? {
                  background: "var(--cw-ember)",
                  color: "#FDFAF7",
                  border: "none",
                }
              : {
                  background: "transparent",
                  color: "var(--cw-ink-primary)",
                  border: "1px solid rgba(26,23,20,0.2)",
                }),
          }}
        >
          {plan.cta}
        </button>
      </Link>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section
      id="pricing"
      style={{ background: "var(--cw-bg-secondary)", padding: "120px 0" }}
    >
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--cw-ember)",
              fontFamily: "'DM Sans', sans-serif",
              margin: "0 0 14px",
            }}
          >
            Pricing
          </p>
          <h2
            className="font-heading italic"
            style={{
              fontSize: "clamp(32px, 3.5vw, 48px)",
              lineHeight: 1.1,
              color: "var(--cw-ink-primary)",
              margin: "0 0 8px",
            }}
          >
            Pay for what you review.
          </h2>
          <p
            style={{
              fontSize: 15,
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--cw-ink-secondary)",
              margin: "0 0 36px",
              lineHeight: 1.6,
            }}
          >
            Credit-based. No seat taxes. No lock-in.
          </p>

          <BillingToggle billing={billing} onChange={setBilling} />
        </div>

        {/* Plan cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
          style={{ gap: 16, alignItems: "start", marginBottom: 24 }}
        >
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        {/* Credit system + top-up */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid md:grid-cols-2"
          style={{ gap: 16, marginBottom: 24 }}
        >
          {/* Credit usage table */}
          <div
            style={{
              borderRadius: 12,
              border: "0.5px solid var(--cw-bg-primary)",
              background: "var(--cw-bg-surface)",
              padding: "22px 24px",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--cw-ink-tertiary)",
                marginBottom: 16,
              }}
            >
              Credit Usage
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CREDIT_TABLE.map((row) => (
                <div
                  key={row.range}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif",
                      color: "var(--cw-ink-secondary)",
                    }}
                  >
                    {row.range}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      color: "var(--cw-ink-primary)",
                    }}
                  >
                    {row.credits}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top-up */}
          <div
            style={{
              borderRadius: 12,
              border: "0.5px solid var(--cw-bg-primary)",
              background: "var(--cw-bg-surface)",
              padding: "22px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--cw-ink-tertiary)",
                  marginBottom: 12,
                }}
              >
                Top-up Credits
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                <span
                  className="font-heading italic"
                  style={{ fontSize: 44, lineHeight: 1, color: "var(--cw-ink-primary)" }}
                >
                  $2.99
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--cw-ink-tertiary)",
                  }}
                >
                  / 25 reviews
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--cw-ink-secondary)",
                  lineHeight: 1.7,
                }}
              >
                Buy additional credits any time. No subscription required. Credits never expire.
              </p>
            </div>
            <div style={{ marginTop: 24 }}>
              <Link href="/signup" style={{ display: "block" }}>
                <button
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.background = "var(--cw-bg-primary)";
                    btn.style.borderColor = "rgba(26,23,20,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.background = "transparent";
                    btn.style.borderColor = "rgba(26,23,20,0.2)";
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: 40,
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    background: "transparent",
                    color: "var(--cw-ink-primary)",
                    border: "1px solid rgba(26,23,20,0.2)",
                    transition: "background 200ms ease, border-color 200ms ease",
                  }}
                >
                  Top up credits
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--cw-ink-tertiary)",
          }}
        >
          All plans include zero code retention, row-level tenant isolation, and all five specialists.
          Local taxes (GST, VAT) calculated at checkout where applicable.
        </p>

      </div>
    </section>
  );
}
