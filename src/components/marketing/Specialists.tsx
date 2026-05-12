"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPECIALISTS = [
  {
    icon: "🔒",
    name: "Security Specialist",
    color: "#ff5b35",
    badge: "ALWAYS ON",
    desc: "OWASP Top 10, auth flows, injection, timing attacks, exposed secrets, insecure patterns, environment variable leaks. Runs on every single review.",
    example: { label: "Recent catch", text: "SQL injection vector in dynamic query builder — passed every existing test" },
  },
  {
    icon: "⚡",
    name: "Reliability Engineer",
    color: "#4da3ff",
    badge: "ALWAYS ON",
    desc: "Null guards, timeout enforcement, error propagation, retry logic, circuit breakers, input validation at every entry point. The edge cases that fail at 2AM.",
    example: { label: "Recent catch", text: "No timeout on external API call — would have hung indefinitely under load" },
  },
  {
    icon: "📊",
    name: "Business Logic Reviewer",
    color: "#00c4a0",
    badge: "ALWAYS ON",
    desc: "Validates code against your described rules. Price calculations, fee structures, user permissions, state transitions. No other tool does this.",
    example: { label: "Recent catch", text: "GST rounding incorrect for Indian customer — was under-charging by ₹2 per transaction" },
  },
  {
    icon: "⚙️",
    name: "Performance Engineer",
    color: "#fbbf24",
    badge: "OPTIONAL",
    desc: "N+1 query detection, O(n²) pattern recognition, memory leak identification, async blocking detection, database index recommendations.",
    example: { label: "Recent catch", text: "O(n²) nested loop in paginated API endpoint serving 50k requests/min" },
  },
  {
    icon: "✨",
    name: "Quality Gatekeeper",
    color: "#c4b5fd",
    badge: "OPTIONAL",
    desc: "Cyclomatic complexity, naming conventions, dead code elimination, test coverage gaps, function length thresholds. Enforces consistency at scale.",
    example: { label: "Recent catch", text: "Cyclomatic complexity of 31 in payment middleware — refactored to state machine" },
  },
];

export default function Specialists() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = SPECIALISTS[activeIdx];

  return (
    <section id="features" className="py-[140px]">
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="block w-6 h-px bg-[#ff5b35]" />
            <span className="text-[#ff5b35] text-[11px] tracking-[.2em] uppercase font-medium">The specialists</span>
          </div>
          <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[1.15] tracking-[-0.02em] mt-3">
            Five specialists.
            <br />
            <span className="text-[#ff5b35]">One Master Score.</span>
          </h2>
          <p className="text-[17px] text-[#999990] mt-4 max-w-lg mx-auto leading-[1.7]">
            Three specialists run on every review. Two are optional. All five run in parallel.
            You get one Master Production Score built from all of them.
          </p>
        </motion.div>

        {/* Split layout */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col lg:flex-row rounded-[20px] border border-[#e8e8e2] bg-white overflow-hidden"
        >
          {/* ── Left: specialist list ── */}
          <div className="lg:w-[40%] border-b lg:border-b-0 lg:border-r border-[#e8e8e2] flex flex-col">
            {SPECIALISTS.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setActiveIdx(i)}
                style={{
                  borderLeft: i === activeIdx ? "3px solid #ff5b35" : "3px solid transparent",
                  backgroundColor: i === activeIdx ? "rgba(255,91,53,0.04)" : undefined,
                  transition: "background-color 0.2s ease, border-color 0.2s ease",
                }}
                className={`flex items-center gap-4 px-6 py-4 text-left w-full group ${
                  i !== activeIdx ? "hover:bg-[#faf9f7]" : ""
                } ${i < SPECIALISTS.length - 1 ? "border-b border-[#e8e8e2]" : ""}`}
              >
                <span className="text-[11px] text-[#999990] font-medium tabular-nums shrink-0 w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0">{s.icon}</span>
                  <span
                    className="text-sm font-semibold leading-tight"
                    style={{
                      color: i === activeIdx ? "#ff5b35" : "#0d0d0d",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {s.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* ── Right: detail panel ── */}
          <div className="flex-1 p-8 lg:p-10 min-h-[320px] flex flex-col justify-between overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col gap-0 h-full"
              >
                {/* Name + badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3
                    className="font-heading text-[clamp(28px,3vw,40px)] leading-tight tracking-[-0.01em]"
                    style={{ color: active.color }}
                  >
                    {active.name}
                  </h3>
                  <span
                    className="shrink-0 mt-1 text-[9px] font-bold tracking-[0.08em] px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${active.color}14`, color: active.color, border: `1px solid ${active.color}28` }}
                  >
                    {active.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[15px] text-[#555550] leading-[1.75] mb-6 flex-1">
                  {active.desc}
                </p>

                {/* Recent catch */}
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: `${active.color}08`, border: `1px solid ${active.color}20` }}
                >
                  <p
                    className="text-[9px] uppercase tracking-widest font-semibold mb-1.5"
                    style={{ color: active.color }}
                  >
                    {active.example.label}
                  </p>
                  <p className="text-[13px] text-[#555550] leading-snug">
                    {active.example.text}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
