"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────────────

type Billing = "monthly" | "annual";

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  features: string[];
  href: string;
  featured: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Solo builders, open source",
    monthlyPrice: null,
    features: [
      "10 free reviews",
      "All 5 specialist reviewers",
      "Severity report (Critical → Low)",
      "PDF & Markdown export",
      "No credit card required",
    ],
    href: "/signup",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Founders, freelancers, small teams",
    monthlyPrice: 29,
    features: [
      "200 reviews / month",
      "All 5 specialist reviewers",
      "Business Logic Context",
      "AI Origin Detection",
      "Humanisation Layer",
      "Priority review queue",
    ],
    href: "/signup?plan=pro",
    featured: true,
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "Agencies, larger codebases",
    monthlyPrice: 99,
    features: [
      "1,000 reviews / month",
      "Everything in Pro",
      "5 team seats included",
      "White-label reports",
      "Custom business logic templates",
      "Webhook integrations",
    ],
    href: "/signup?plan=scale",
    featured: false,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────────

function getDisplayPrice(
  monthlyPrice: number | null,
  billing: Billing
): { main: string; sub: string | null } {
  if (monthlyPrice === null) return { main: "Free", sub: null };
  if (billing === "monthly") return { main: `$${monthlyPrice}`, sub: "per month" };
  const discounted = Math.round(monthlyPrice * 0.8);
  return { main: `$${discounted}`, sub: "per month, billed annually" };
}

// ─── Toggle ───────────────────────────────────────────────────────────────────────

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

      {/* Pill toggle */}
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

// ─── Card ─────────────────────────────────────────────────────────────────────────

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const { main, sub } = getDisplayPrice(plan.monthlyPrice, billing);

  return (
    <div
      style={{
        borderRadius: 12,
        background: "var(--cw-bg-surface)",
        border: plan.featured
          ? "1.5px solid var(--cw-ember)"
          : "0.5px solid var(--cw-bg-secondary)",
        padding: "28px 24px",
        transform: plan.featured ? "translateY(-8px)" : "none",
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      {/* Tier name + tagline */}
      <div>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--cw-ink-primary)",
            margin: "0 0 4px",
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
          }}
        >
          {plan.tagline}
        </p>
      </div>

      {/* Price — fixed min-height prevents layout jump on toggle */}
      <div style={{ minHeight: 68 }}>
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
                fontSize: "clamp(38px, 3.2vw, 50px)",
                lineHeight: 1,
                color: "var(--cw-ink-primary)",
                margin: "0 0 6px",
              }}
            >
              {main}
            </p>
            {sub && (
              <p
                style={{
                  fontSize: 12,
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
          gap: 11,
          flex: 1,
        }}
      >
        {plan.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
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
            <span
              style={{
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                color: "var(--cw-ink-secondary)",
                lineHeight: 1.5,
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
            height: 42,
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
          Get started
        </button>
      </Link>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section
      id="pricing"
      style={{ background: "var(--cw-bg-secondary)", padding: "120px 0" }}
    >
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
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
              margin: "0 0 40px",
            }}
          >
            Simple, honest pricing.
          </h2>

          <BillingToggle billing={billing} onChange={setBilling} />
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 20, alignItems: "start" }}
        >
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            marginTop: 44,
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--cw-ink-tertiary)",
          }}
        >
          All plans include zero code retention and all five specialist reviewers.
          No credit card required to start.
        </p>
      </div>
    </section>
  );
}
