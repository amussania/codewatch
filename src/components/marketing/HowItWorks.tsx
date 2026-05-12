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
    <section id="how-it-works" className="py-[100px] max-w-[1100px] mx-auto px-6">
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
          <span className="text-[#ff5b35] text-[10px] tracking-[.2em] uppercase">The process</span>
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em]">
          Paste. Review.
          <br />
          <span className="text-[#ff5b35]">Ship With Confidence.</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">
          Four steps. Under two minutes. No repo connection needed.
        </p>
      </motion.div>

      {/* Horizontal 4-column grid — each step staggers in */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e2e2ee] border border-[#e2e2ee] rounded-xl overflow-hidden">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
            className="bg-white p-7 flex flex-col gap-4 relative"
          >
            <span
              aria-hidden
              className="absolute top-5 right-6 font-heading leading-none select-none pointer-events-none text-[#ededf5]"
              style={{ fontSize: "72px" }}
            >
              {step.num}
            </span>

            <div className="text-2xl relative z-10">{step.icon}</div>
            <h3 className="font-semibold text-base relative z-10">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{step.desc}</p>
            <p className="text-[11px] text-muted-foreground/60 font-mono border-l-2 border-[#ff5b35]/30 pl-3 leading-snug">
              {step.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
