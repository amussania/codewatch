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
    <section id="how-it-works" className="py-[140px] max-w-[1120px] mx-auto px-6 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="block w-6 h-px bg-[#ff5b35]" />
          <span className="text-[#ff5b35] text-[11px] tracking-[.2em] uppercase font-medium">The process</span>
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[1.15] tracking-[-0.02em]">
          Paste. Review.
          <br />
          <span className="text-[#ff5b35]">Ship With Confidence.</span>
        </h2>
        <p className="text-[17px] text-[#999990] mt-4 max-w-md mx-auto leading-[1.7]">
          Four steps. Under two minutes. No repo connection needed.
        </p>
      </motion.div>

      {/* Steps — 4-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}
            className="bg-white rounded-2xl border border-[#e8e8e2] p-8 flex flex-col gap-4 relative overflow-hidden hover:border-[#d0d0c8] transition-colors duration-300"
          >
            {/* Ghost step number */}
            <span
              aria-hidden
              className="absolute top-4 right-5 font-heading leading-none select-none pointer-events-none text-[#f0efe9]"
              style={{ fontSize: "88px", lineHeight: 1 }}
            >
              {step.num}
            </span>

            <div className="text-2xl relative z-10">{step.icon}</div>
            <h3 className="font-semibold text-base text-[#0d0d0d] relative z-10">{step.title}</h3>
            <p className="text-sm text-[#555550] leading-[1.7] flex-1">{step.desc}</p>
            <p className="text-[11px] text-[#999990] border-l-2 border-[#ff5b35]/30 pl-3 leading-snug">
              {step.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
