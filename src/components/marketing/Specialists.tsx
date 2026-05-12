"use client";

import { motion } from "framer-motion";

const SPECIALISTS = [
  {
    icon: "🔒",
    name: "Security Specialist",
    color: "#ff5b35",
    badge: "ALWAYS ON",
    tags: ["OWASP Top 10", "Auth flows", "Injection", "Secrets", "Timing attacks"],
    desc: "OWASP Top 10, auth flows, injection, timing attacks, exposed secrets, insecure patterns, environment variable leaks. Runs on every single review.",
    example: { label: "Recent catch", text: "SQL injection vector in dynamic query builder — passed every existing test" },
  },
  {
    icon: "⚡",
    name: "Reliability Engineer",
    color: "#4da3ff",
    badge: "ALWAYS ON",
    tags: ["Null guards", "Timeouts", "Error propagation", "Input validation"],
    desc: "Null guards, timeout enforcement, error propagation, retry logic, circuit breakers, input validation at every entry point. The edge cases that fail at 2AM.",
    example: { label: "Recent catch", text: "No timeout on external API call — would have hung indefinitely under load" },
  },
  {
    icon: "📊",
    name: "Business Logic Reviewer",
    color: "#00c4a0",
    badge: "ALWAYS ON",
    tags: ["Your rules", "Pricing logic", "Permissions", "State machines"],
    desc: "Validates code against your described rules. Price calculations, fee structures, user permissions, state transitions. No other tool does this.",
    example: { label: "Recent catch", text: "GST rounding incorrect for Indian customer — was under-charging by ₹2 per transaction" },
  },
  {
    icon: "⚙️",
    name: "Performance Engineer",
    color: "#fbbf24",
    badge: "OPTIONAL",
    tags: ["N+1 queries", "O(n²) patterns", "Memory leaks", "Async blocking"],
    desc: "N+1 query detection, O(n²) pattern recognition, memory leak identification, async blocking detection, database index recommendations.",
    example: { label: "Recent catch", text: "O(n²) nested loop in paginated API endpoint serving 50k requests/min" },
  },
  {
    icon: "✨",
    name: "Quality Gatekeeper",
    color: "#c4b5fd",
    badge: "OPTIONAL",
    tags: ["Complexity", "Naming", "Dead code", "Test gaps"],
    desc: "Cyclomatic complexity, naming conventions, dead code elimination, test coverage gaps, function length thresholds. Enforces consistency at scale.",
    example: { label: "Recent catch", text: "Cyclomatic complexity of 31 in payment middleware — refactored to state machine" },
  },
];

export default function Specialists() {
  return (
    <section id="features" className="py-[140px]">
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">
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

        {/* 5-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {SPECIALISTS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}
              className="bg-white p-8 flex flex-col gap-3 rounded-2xl border border-[#e8e8e2] hover:border-[#d0d0c8] transition-colors duration-300"
            >
              {/* Number + badge row */}
              <div className="flex items-start justify-between">
                <span
                  className="text-[11px] font-bold tracking-[0.06em] tabular-nums"
                  style={{ color: s.color }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[8px] font-bold tracking-[0.06em] px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${s.color}18`, color: s.color }}
                >
                  {s.badge}
                </span>
              </div>

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: `${s.color}12`, border: `1px solid ${s.color}28` }}
              >
                {s.icon}
              </div>

              <h3 className="font-semibold text-sm text-[#0d0d0d] leading-tight">{s.name}</h3>
              <p className="text-xs text-[#555550] leading-[1.7] flex-1">{s.desc}</p>

              <div className="rounded-xl bg-[#f5f4f0] border border-[#e8e8e2] px-3 py-2">
                <p className="text-[9px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: s.color }}>
                  {s.example.label}
                </p>
                <p className="text-[11px] text-[#555550] leading-snug">{s.example.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
