"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    icon: "📋",
    title: "Paste Your Code",
    desc: "Drop in any function, file, or diff. Thirty-plus languages. No formatting required. No GitHub connection. No OAuth. No setup.",
    detail: "Supports TypeScript, Python, Go, Rust, Java, Kotlin, Swift, Ruby, PHP, C#, SQL, GraphQL, and more.",
  },
  {
    num: "02",
    icon: "💬",
    title: "Set Business Context",
    desc: "Tell CODEWATCH what your code is supposed to do. Describe your pricing rules, user roles, state transitions, or fee structures. This is what no other tool does.",
    detail: "Example: \"This function calculates GST for Indian customers. Base rate 18%. Essential goods at 5%.\"",
  },
  {
    num: "03",
    icon: "🔬",
    title: "Panel Reviews in Parallel",
    desc: "Five specialists review your code simultaneously. Security, reliability, performance, business logic, and quality — all scored independently.",
    detail: "All five specialists run in parallel. Total review time: under 2 minutes.",
  },
  {
    num: "04",
    icon: "✅",
    title: "Get the Fixed Code",
    desc: "Not a to-do list. The rewritten code. Hardened error propagation, environment variables replacing secrets, timeouts on every external call.",
    detail: "Paste it back. Ship it. Done.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[120px] max-w-[1100px] mx-auto px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-center mb-20"
      >
        <p className="font-sans text-[#ff5b35] text-[10px] tracking-[.2em] uppercase mb-4">
          — The Process
        </p>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em]">
          Paste. Review.
          <br />
          <span className="text-[#ff5b35]">Ship With Confidence.</span>
        </h2>
        <p className="text-[#3d4f6b] mt-5 max-w-md mx-auto leading-relaxed">
          Four steps. Under two minutes. No repo connection needed.
        </p>
      </motion.div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
            className="relative p-8 rounded-xl border border-[#e2e2ee] bg-white overflow-hidden transition-all duration-[250ms] ease-[ease] hover:border-[#ff5b35] hover:shadow-[0_8px_24px_rgba(255,91,53,0.08)] hover:-translate-y-1"
          >
            {/* Large decorative step number */}
            <span
              aria-hidden
              className="absolute -bottom-3 -right-1 font-heading leading-none select-none pointer-events-none"
              style={{ fontSize: "120px", color: "#f0f0f0", lineHeight: 1 }}
            >
              {step.num}
            </span>

            {/* DM Mono step number top */}
            <p className="font-sans text-[10px] tracking-[.18em] text-[#ff5b35] uppercase mb-5 relative z-10">
              — {step.num}
            </p>

            <div className="text-2xl mb-4 relative z-10">{step.icon}</div>
            <h3 className="font-heading text-[22px] leading-tight tracking-[.02em] mb-3 relative z-10">{step.title}</h3>
            <p className="text-sm text-[#3d4f6b] leading-relaxed mb-4 relative z-10">{step.desc}</p>
            <p className="font-sans text-[10px] text-[#8896ab]/70 tracking-[.06em] border-l-2 border-[#ff5b35]/25 pl-3 leading-snug relative z-10">
              {step.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
