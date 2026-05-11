"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PILLARS = [
  {
    icon: "🔐",
    title: "Zero data retention",
    desc: "Your code is analyzed entirely in memory and never written to disk. No snippet, diff, or review is stored after the session ends.",
    badge: "Verified",
    color: "#ff6b6b",
  },
  {
    icon: "🔒",
    title: "AES-256 in transit & at rest",
    desc: "All data is encrypted with AES-256 over TLS 1.3. API keys are hashed with bcrypt. We never have access to your raw credentials.",
    badge: "Audited",
    color: "#4a9fff",
  },
  {
    icon: "🏛️",
    title: "SOC 2 Type II",
    desc: "Our infrastructure undergoes annual SOC 2 Type II audits. Security controls, availability, and confidentiality are independently verified.",
    badge: "Certified",
    color: "#86efac",
  },
  {
    icon: "🌍",
    title: "GDPR & CCPA compliant",
    desc: "We process no personal data from your code. You can delete your account and all associated metadata at any time with one click.",
    badge: "Compliant",
    color: "#c4b5fd",
  },
  {
    icon: "🚫",
    title: "Never used for training",
    desc: "Your code is never used to train AI models — ours or third-party providers. Model-level opt-outs are enforced at the API contract level.",
    badge: "Contractual",
    color: "#fbbf24",
  },
  {
    icon: "🏢",
    title: "Private cloud deployment",
    desc: "Enterprise customers can run CodeWatch in their own VPC or on-premises. No code leaves your infrastructure.",
    badge: "Enterprise",
    color: "#fda4af",
  },
];

export default function SecuritySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".sec-pillar", {
        y: 28,
        opacity: 0,
        duration: 0.65,
        stagger: { amount: 0.45 },
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="security" className="py-28 max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[#ff6b6b] text-sm font-medium uppercase tracking-widest">
          Security
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
          Your code stays yours
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
          We built CodeWatch for the security-conscious from day one. Every architectural
          decision prioritises your code&apos;s privacy over convenience.
        </p>
      </div>

      {/* Hero promise */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl border border-[#ff6b6b]/20 bg-[var(--cw-surface-elevated)] p-8 mb-10 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b6b]/5 to-transparent pointer-events-none" />
        <div className="text-4xl mb-4">🛡️</div>
        <h3 className="text-xl font-semibold mb-2">
          Your code is never stored, indexed, or shared
        </h3>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
          We operate a strict zero-persistence policy. Analysis runs in an ephemeral sandbox.
          When your review is complete, every byte of your code is purged — no exceptions.
        </p>
      </motion.div>

      {/* Pillars grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="sec-pillar rounded-xl border border-white/8 bg-[var(--cw-surface)] p-5 flex gap-4"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 mt-0.5"
              style={{ backgroundColor: `${p.color}15`, border: `1px solid ${p.color}25` }}
            >
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-semibold text-sm">{p.title}</h3>
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: `${p.color}18`, color: p.color }}
                >
                  {p.badge}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
