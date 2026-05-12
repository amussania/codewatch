"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PLANS = [
  {
    name: "Solo",
    price: "$12",
    period: "/ mo",
    reviews: "100 reviews / mo",
    desc: "For developers who want expert-level review without the enterprise overhead.",
    features: [
      "All 5 specialists",
      "Business Logic Context",
      "AI Origin Probability",
      "Zero code retention",
      "30+ languages",
    ],
    cta: "Get 10 Free Reviews",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "$30",
    period: "/ mo",
    reviews: "350 reviews / mo",
    desc: "For developers who need the full toolkit, including rewrites and white-label output.",
    features: [
      "Everything in Solo",
      "Fail-Safe Rewrite included",
      "Humanisation Layer",
      "White-label reports",
      "Priority review queue",
      "Credit rollover (up to 200)",
    ],
    cta: "Get 10 Free Reviews",
    href: "/signup?plan=pro",
    featured: false,
  },
  {
    name: "Studio",
    price: "$72",
    period: "/ mo",
    reviews: "1,000 reviews / mo",
    desc: "For small teams and freelancers reviewing client code at volume.",
    features: [
      "Everything in Pro",
      "3 user seats included",
      "Team review history",
      "White-label client reports",
      "Webhook integrations",
    ],
    cta: "Get Started",
    href: "/signup?plan=studio",
    featured: true,
  },
  {
    name: "Agency",
    price: "$155",
    period: "/ mo",
    reviews: "3,000 reviews / mo",
    desc: "For agencies running code review as a client-facing service.",
    features: [
      "Everything in Studio",
      "Unlimited user seats",
      "Custom business logic templates",
      "Priority support + SLA",
      "Reseller billing support",
    ],
    cta: "Get Started",
    href: "/signup?plan=agency",
    featured: false,
  },
];

const CREDIT_TABLE = [
  { range: "< 100 lines", credits: "1 credit" },
  { range: "100 – 300 lines", credits: "2 credits" },
  { range: "300 – 600 lines", credits: "4 credits" },
  { range: "600 – 1,500 lines", credits: "8 credits" },
  { range: "Production Clearance", credits: "12 credits" },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-[100px] max-w-[1100px] mx-auto px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="block w-6 h-px bg-[#ff5b35]" />
          <span className="text-[#ff5b35] text-[10px] tracking-[.2em] uppercase">Pricing</span>
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em] mt-3">
          Pay for what you review.
          <br />
          <span className="text-[#ff5b35]">Not for what you don&apos;t.</span>
        </h2>
        <p className="font-serif italic font-light text-[#8896ab] text-[17px] mt-4 max-w-sm mx-auto">
          Credit-based. No seat taxes. No lock-in. Local taxes calculated at checkout.
        </p>
      </motion.div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.09, ease: "easeOut" }}
            className="relative"
          >
            {plan.featured && (
              <>
                <div className="absolute -inset-[1px] rounded-[18px] bg-gradient-to-b from-[#ff5b35]/60 via-[#ff5b35]/20 to-[#1a7be8]/40 -z-10" />
                <motion.div
                  animate={{ opacity: [0.10, 0.24, 0.10], scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-5 rounded-3xl bg-[#ff5b35] blur-2xl -z-20 pointer-events-none"
                />
              </>
            )}

            <div
              className={`relative rounded-2xl border p-6 flex flex-col gap-5 h-full ${
                plan.featured
                  ? "border-[#ff5b35]/30 bg-[var(--cw-surface-elevated)]"
                  : "border-[#e2e2ee] bg-[var(--cw-surface)]"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-[#ff5b35] text-white text-xs font-semibold shadow-lg shadow-[#ff5b3544]">
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-base">{plan.name}</h3>
                <p className="text-muted-foreground text-xs mt-1 leading-snug">{plan.desc}</p>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-[clamp(40px,4vw,52px)] leading-none">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{plan.reviews}</p>
              </div>

              <ul className="space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-[#ff5b35] mt-px shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className={`w-full transition-all text-sm tracking-[.06em] rounded-[5px] ${
                    plan.featured
                      ? "bg-[#ff5b35] hover:bg-[#ff5b35]/90 text-white border-0 shadow-lg shadow-[#ff5b3533]"
                      : "bg-[#f7f7fa] hover:bg-[#e6e6f2] text-foreground border border-[#e2e2ee]"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Credit system + top-up */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="grid md:grid-cols-2 gap-5 mb-8"
      >
        <div className="rounded-2xl border border-[#e2e2ee] bg-[var(--cw-surface)] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">
            Credit Usage
          </p>
          <div className="space-y-2.5">
            {CREDIT_TABLE.map((row) => (
              <div key={row.range} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.range}</span>
                <span className="text-foreground font-medium">{row.credits}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e2ee] bg-[var(--cw-surface)] p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">
              Top-up Credits
            </p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-heading text-[48px] leading-none">$2.99</span>
              <span className="text-muted-foreground text-sm">/ 25 reviews</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Buy additional credits any time. No subscription required. Credits never expire.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/signup">
              <Button className="w-full bg-[#f7f7fa] hover:bg-[#e6e6f2] text-foreground border border-[#e2e2ee] text-sm tracking-[.06em] rounded-[5px]">
                Top up credits
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground">
        All plans include zero code retention, row-level tenant isolation, and all five specialists.
        Local taxes (GST, VAT) calculated at checkout where applicable.
      </p>
    </section>
  );
}
