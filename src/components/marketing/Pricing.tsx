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
  { range: "< 100 lines",        credits: "1 credit" },
  { range: "100 – 300 lines",    credits: "2 credits" },
  { range: "300 – 600 lines",    credits: "4 credits" },
  { range: "600 – 1,500 lines",  credits: "8 credits" },
  { range: "Production Clearance", credits: "12 credits" },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-[120px] max-w-[1100px] mx-auto px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-center mb-20"
      >
        <p className="font-sans text-[#ff5b35] text-[10px] tracking-[.2em] uppercase mb-4">
          — Pricing
        </p>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em]">
          Pay for what you review.
          <br />
          <span className="text-[#ff5b35]">Not for what you don&apos;t.</span>
        </h2>
        <p className="font-serif italic font-light text-[#8896ab] text-[17px] mt-5 max-w-sm mx-auto">
          Credit-based. No seat taxes. No lock-in. Local taxes calculated at checkout.
        </p>
      </motion.div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <div className="absolute -inset-[1px] rounded-[14px] bg-gradient-to-b from-[#ff5b35]/50 via-[#ff5b35]/15 to-[#1a7be8]/30 -z-10" />
                <motion.div
                  animate={{ opacity: [0.08, 0.22, 0.08], scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-5 rounded-3xl bg-[#ff5b35] blur-2xl -z-20 pointer-events-none"
                />
              </>
            )}

            <div
              className={`relative rounded-xl border p-8 flex flex-col gap-5 h-full transition-all duration-[250ms] ${
                plan.featured
                  ? "border-[#ff5b35]/25 bg-[#fafafa] hover:shadow-[0_8px_32px_rgba(255,91,53,0.12)]"
                  : "border-[#e2e2ee] bg-white hover:border-[#ff5b35] hover:shadow-[0_8px_24px_rgba(255,91,53,0.08)]"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="font-sans px-3 py-1 rounded-full bg-[#ff5b35] text-white text-[9px] font-bold tracking-[.1em] uppercase shadow-lg shadow-[#ff5b3544]">
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <p className="font-sans text-[10px] tracking-[.16em] uppercase text-[#8896ab] mb-1">{plan.name}</p>
                <p className="text-xs text-[#3d4f6b] leading-snug mt-2">{plan.desc}</p>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-[clamp(40px,4vw,52px)] leading-none">{plan.price}</span>
                  <span className="font-sans text-[#8896ab] text-xs">{plan.period}</span>
                </div>
                <p className="font-sans text-[10px] text-[#8896ab] mt-1 tracking-[.06em]">{plan.reviews}</p>
              </div>

              <ul className="space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#3d4f6b]">
                    <span className="text-[#ff5b35] mt-px shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className={`w-full text-xs tracking-[.08em] rounded-[5px] font-sans ${
                    plan.featured
                      ? "bg-[#ff5b35] hover:bg-[#ff5b35]/90 text-white border-0 shadow-lg shadow-[#ff5b3533]"
                      : "bg-[#f7f7fa] hover:bg-[#ededf5] text-[#0a0f1e] border border-[#e2e2ee]"
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
        className="grid md:grid-cols-2 gap-6 mb-8"
      >
        <div className="rounded-xl border border-[#e2e2ee] bg-white p-8">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[.16em] text-[#8896ab]/70 mb-5">
            — Credit Usage
          </p>
          <div className="space-y-3">
            {CREDIT_TABLE.map((row) => (
              <div key={row.range} className="flex items-center justify-between">
                <span className="text-sm text-[#3d4f6b]">{row.range}</span>
                <span className="font-sans text-[11px] text-[#0a0f1e] font-medium tracking-[.06em]">{row.credits}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e2ee] bg-white p-8 flex flex-col justify-between">
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[.16em] text-[#8896ab]/70 mb-5">
              — Top-up Credits
            </p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-heading text-[48px] leading-none">$2.99</span>
              <span className="font-sans text-[#8896ab] text-xs">/ 25 reviews</span>
            </div>
            <p className="text-sm text-[#3d4f6b] leading-relaxed">
              Buy additional credits any time. No subscription required. Credits never expire.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/signup">
              <Button className="w-full bg-[#f7f7fa] hover:bg-[#ededf5] text-[#0a0f1e] border border-[#e2e2ee] text-xs tracking-[.08em] rounded-[5px] font-sans">
                Top up credits
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <p className="font-sans text-center text-[10px] text-[#8896ab] tracking-[.06em]">
        All plans include zero code retention, row-level tenant isolation, and all five specialists.
        Local taxes (GST, VAT) calculated at checkout where applicable.
      </p>
    </section>
  );
}
