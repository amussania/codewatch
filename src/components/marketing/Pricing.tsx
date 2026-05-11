"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".pricing-card", {
        scale: 0.93,
        opacity: 0,
        y: 28,
        duration: 0.75,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="pricing" className="py-[8.75rem] max-w-[1200px] mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2.5">
          <span className="block w-5 h-px bg-[#00b85f]" />
          <span className="text-[#00b85f] text-[10px] font-medium tracking-[.2em] uppercase">Pricing</span>
          <span className="block w-5 h-px bg-[#00b85f]" />
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em] mt-3">
          Pay for what you review.
          <br />
          <span className="text-[#00b85f]">Not for what you don&apos;t.</span>
        </h2>
        <p className="font-serif italic font-light text-[#7070a0] text-[17px] mt-4 max-w-sm mx-auto">
          Credit-based. No seat taxes. No lock-in. Local taxes calculated at checkout.
        </p>
      </div>

      {/* Plan cards */}
      <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {PLANS.map((plan) => (
          <div key={plan.name} className="pricing-card relative">
            {plan.featured && (
              <>
                <div className="absolute -inset-[1px] rounded-[18px] bg-gradient-to-b from-[#00b85f]/60 via-[#00b85f]/20 to-[#1a7be8]/40 -z-10" />
                <motion.div
                  animate={{ opacity: [0.10, 0.24, 0.10], scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-5 rounded-3xl bg-[#00b85f] blur-2xl -z-20 pointer-events-none"
                />
              </>
            )}

            <div
              className={`relative rounded-2xl border p-6 flex flex-col gap-5 h-full ${
                plan.featured
                  ? "border-[#00b85f]/30 bg-[var(--cw-surface-elevated)]"
                  : "border-[#e2e2ee] bg-[var(--cw-surface)]"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-[#00b85f] text-white text-xs font-semibold shadow-lg shadow-[#00b85f44]">
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
                    <span className="text-[#00b85f] mt-px shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className={`w-full transition-all text-sm ${
                    plan.featured
                      ? "bg-[#00b85f] hover:bg-[#00b85f]/90 text-white border-0 shadow-lg shadow-[#00b85f33]"
                      : "bg-[#f7f7fa] hover:bg-[#e6e6f2] text-foreground border border-[#e2e2ee]"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Credit system + top-up */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        {/* Credit table */}
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

        {/* Top-up + notes */}
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
              <Button className="w-full bg-[#f7f7fa] hover:bg-[#e6e6f2] text-foreground border border-[#e2e2ee] text-sm">
                Top up credits
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        All plans include zero code retention, row-level tenant isolation, and all five specialists.
        Local taxes (GST, VAT) calculated at checkout where applicable.
      </p>
    </section>
  );
}
