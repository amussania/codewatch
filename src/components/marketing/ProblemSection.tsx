"use client";

import { motion } from "framer-motion";

const PROBLEMS = [
  {
    icon: "🔒",
    stat: "2.74×",
    statLabel: "more vulnerabilities in AI-generated code",
    title: "Security Gaps Nobody Catches",
    desc: "Every other tool reviews syntax. AI-generated code has 2.74× more security vulnerabilities than human-written code. They all look syntactically correct. Most tools will pass them.",
    color: "#ff5b35",
  },
  {
    icon: "💸",
    stat: "$0",
    statLabel: "caught by syntax-only review",
    title: "Silent Business Logic Errors",
    desc: "Your tool reviews syntax. Not your pricing logic. Not your GST rules. Not your discount calculation. The code works. The business rule is wrong. Nobody finds out until customers are undercharged.",
    color: "#f59e0b",
  },
  {
    icon: "⚡",
    stat: "1.7×",
    statLabel: "more runtime errors in vibe-coded deployments",
    title: "Fails at 2AM on the Edge Case",
    desc: "AI-generated code handles the happy path perfectly. It fails on the edge case at 2AM when the payment gateway times out and there is no retry logic and no fallback and no error logging.",
    color: "#1a7be8",
  },
];

const STATS = [
  { value: "41%",    label: "of code is now AI-generated" },
  { value: "2.74×",  label: "more vulnerabilities in AI code" },
  { value: "< 2min", label: "Full panel review time" },
  { value: "30+",    label: "Languages supported" },
];

export default function ProblemSection() {
  return (
    <section className="py-[120px] bg-[#fafafa]" id="features">
      <div className="max-w-[1100px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <p className="font-sans text-[#ff5b35] text-[10px] tracking-[.2em] uppercase mb-4">
            — Problem Statement
          </p>
          <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em]">
            AI writes the code.
            <br />
            <span className="text-[#ff5b35]">Who reviews it?</span>
          </h2>
          <p className="text-[#3d4f6b] mt-5 max-w-lg mx-auto leading-relaxed">
            41% of all code is now AI-generated. The tools built to review human code were not built
            for this. They pass what they were not designed to catch.
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="bg-white p-8 flex flex-col gap-4 rounded-xl border border-[#e2e2ee] transition-all duration-[250ms] ease-[ease] hover:border-[#ff5b35] hover:shadow-[0_8px_24px_rgba(255,91,53,0.08)] hover:-translate-y-1"
            >
              <div className="text-2xl">{p.icon}</div>
              <div>
                <span className="font-heading text-[52px] leading-none" style={{ color: p.color }}>
                  {p.stat}
                </span>
                <p className="font-sans text-[10px] text-[#8896ab] mt-1 tracking-[.06em] uppercase">{p.statLabel}</p>
              </div>
              <h3 className="font-heading text-[20px] leading-tight tracking-[.02em]">{p.title}</h3>
              <p className="text-sm text-[#3d4f6b] leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e2e2ee] border border-[#e2e2ee] rounded-xl overflow-hidden"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-white px-6 py-5 text-center">
              <div className="font-heading text-[40px] leading-none text-[#ff5b35]">{s.value}</div>
              <div className="font-sans text-[10px] text-[#8896ab] mt-1.5 tracking-[.08em] uppercase">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
