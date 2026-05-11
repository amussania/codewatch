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
    name: "Starter",
    price: "Free",
    period: "",
    desc: "For individuals who want to try AI code review.",
    features: [
      "3 reviews / month",
      "2 specialist types",
      "Score history (7 days)",
      "Community support",
    ],
    cta: "Start for free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ mo",
    desc: "Unlimited reviews for developers who care about quality.",
    features: [
      "Unlimited reviews",
      "All 6 specialist types",
      "Full history + CSV export",
      "Priority review queue",
      "Slack & GitHub integration",
      "API access",
    ],
    cta: "Start 14-day trial",
    href: "/signup?plan=pro",
    featured: true,
  },
  {
    name: "Team",
    price: "$99",
    period: "/ mo",
    desc: "Shared workspace for engineering teams.",
    features: [
      "5 seats (+ $15 / extra seat)",
      "Team review dashboard",
      "Shared history & annotations",
      "SSO + audit log",
      "SLA + dedicated support",
      "Custom specialist prompts",
    ],
    cta: "Talk to sales",
    href: "/contact",
    featured: false,
  },
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
        stagger: 0.13,
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
    <section id="pricing" className="py-28 max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[#ff6b6b] text-sm font-medium uppercase tracking-widest">
          Pricing
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
          Simple, honest pricing
        </h2>
        <p className="text-muted-foreground mt-4 max-w-sm mx-auto">
          No hidden fees. Cancel any time. Volume discounts available for teams over 20.
        </p>
      </div>

      <div ref={containerRef} className="grid md:grid-cols-3 gap-6 items-center">
        {PLANS.map((plan) => (
          <div key={plan.name} className="pricing-card relative">
            {/* ── Glow bloom on featured card ── */}
            {plan.featured && (
              <>
                {/* Static border glow */}
                <div className="absolute -inset-[1px] rounded-[18px] bg-gradient-to-b from-[#ff6b6b]/60 via-[#ff6b6b]/20 to-[#4a9fff]/40 -z-10" />
                {/* Pulsing bloom */}
                <motion.div
                  animate={{ opacity: [0.12, 0.28, 0.12], scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-5 rounded-3xl bg-[#ff6b6b] blur-2xl -z-20 pointer-events-none"
                />
                {/* Blue counter-glow */}
                <motion.div
                  animate={{ opacity: [0.06, 0.14, 0.06], scale: [1.02, 1, 1.02] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
                  className="absolute -inset-5 rounded-3xl bg-[#4a9fff] blur-3xl -z-20 pointer-events-none"
                />
              </>
            )}

            <div
              className={`relative rounded-2xl border p-7 flex flex-col gap-6 h-full ${
                plan.featured
                  ? "border-[#ff6b6b]/30 bg-[var(--cw-surface-elevated)]"
                  : "border-white/8 bg-[var(--cw-surface)]"
              }`}
            >
              {/* Most popular badge */}
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-[#ff6b6b] text-white text-xs font-semibold shadow-lg shadow-[#ff6b6b44]">
                    Most popular
                  </span>
                </div>
              )}

              {/* Plan name + desc */}
              <div>
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-1 leading-snug">{plan.desc}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="text-[#ff6b6b] mt-px shrink-0 text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={plan.href}>
                <Button
                  className={`w-full transition-all ${
                    plan.featured
                      ? "bg-[#ff6b6b] hover:bg-[#ff6b6b]/90 text-white border-0 shadow-lg shadow-[#ff6b6b33]"
                      : "bg-white/6 hover:bg-white/10 text-foreground border border-white/10"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-muted-foreground mt-8">
        All plans include SSL encryption, SOC2-compliant infrastructure, and zero training-data retention.
        {" "}
        <Link href="/security" className="text-[#ff6b6b] hover:underline">
          Security details →
        </Link>
      </p>
    </section>
  );
}
