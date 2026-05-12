"use client";

import { motion } from "framer-motion";

const SPECIALISTS = [
  {
    num: "01",
    icon: "🔒",
    name: "Security Specialist",
    color: "#ff5b35",
    badge: "ALWAYS ON",
    desc: "OWASP Top 10, auth flows, injection, timing attacks, exposed secrets, insecure patterns, environment variable leaks. Runs on every single review.",
    example: { label: "Recent catch", text: "SQL injection vector in dynamic query builder — passed every existing test" },
  },
  {
    num: "02",
    icon: "⚡",
    name: "Reliability Engineer",
    color: "#4da3ff",
    badge: "ALWAYS ON",
    desc: "Null guards, timeout enforcement, error propagation, retry logic, circuit breakers, input validation at every entry point. The edge cases that fail at 2AM.",
    example: { label: "Recent catch", text: "No timeout on external API call — would have hung indefinitely under load" },
  },
  {
    num: "03",
    icon: "📊",
    name: "Business Logic Reviewer",
    color: "#00c4a0",
    badge: "ALWAYS ON",
    desc: "Validates code against your described rules. Price calculations, fee structures, user permissions, state transitions. No other tool does this.",
    example: { label: "Recent catch", text: "GST rounding incorrect for Indian customer — was under-charging by ₹2 per transaction" },
  },
  {
    num: "04",
    icon: "⚙️",
    name: "Performance Engineer",
    color: "#fbbf24",
    badge: "OPTIONAL",
    desc: "N+1 query detection, O(n²) pattern recognition, memory leak identification, async blocking detection, database index recommendations.",
    example: { label: "Recent catch", text: "O(n²) nested loop in paginated API endpoint serving 50k requests/min" },
  },
  {
    num: "05",
    icon: "✨",
    name: "Quality Gatekeeper",
    color: "#c4b5fd",
    badge: "OPTIONAL",
    desc: "Cyclomatic complexity, naming conventions, dead code elimination, test coverage gaps, function length thresholds. Enforces consistency at scale.",
    example: { label: "Recent catch", text: "Cyclomatic complexity of 31 in payment middleware — refactored to state machine" },
  },
];

export default function Specialists() {
  return (
    <section id="features" className="py-[120px]">
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
            — The Specialists
          </p>
          <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em]">
            Five specialists.
            <br />
            <span className="text-[#ff5b35]">One Master Score.</span>
          </h2>
          <p className="text-[#3d4f6b] mt-5 max-w-lg mx-auto leading-relaxed">
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
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="bg-white p-8 flex flex-col gap-4 rounded-xl border border-[#e2e2ee] transition-all duration-[250ms] ease-[ease] hover:border-[#ff5b35] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,91,53,0.08)]"
            >
              {/* DM Mono number */}
              <p className="font-sans text-[10px] tracking-[.18em] text-[#ff5b35] uppercase">
                [ {s.num} ]
              </p>

              {/* Icon + badge */}
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: `${s.color}18`, border: `1px solid ${s.color}30` }}
                >
                  {s.icon}
                </div>
                <span
                  className="font-sans text-[8px] font-bold tracking-[0.1em] px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${s.color}18`, color: s.color }}
                >
                  {s.badge}
                </span>
              </div>

              <h3 className="font-heading text-[18px] leading-tight tracking-[.02em]">{s.name}</h3>
              <p className="text-xs text-[#3d4f6b] leading-relaxed flex-1">{s.desc}</p>

              <div className="rounded-lg bg-[#f8faff] border border-[#e2e2ee] px-3 py-2.5">
                <p className="font-sans text-[9px] uppercase tracking-wider mb-1" style={{ color: s.color }}>
                  {s.example.label}
                </p>
                <p className="text-[11px] text-[#8896ab] leading-snug">{s.example.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
