"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SPECIALISTS = [
  {
    icon: "🔒",
    name: "Security Specialist",
    color: "#ff6b6b",
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
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".spec-card", {
        y: 36,
        opacity: 0,
        duration: 0.7,
        stagger: { amount: 0.5, from: "start" },
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
    <section ref={sectionRef} id="features" className="py-28 max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[#ff6b6b] text-sm font-medium uppercase tracking-widest">
          The specialists
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
          Five specialists.
          <br />
          <span className="text-[#ff6b6b]">One Master Score.</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
          Three specialists run on every review. Two are optional. All five run in parallel.
          You get one Master Production Score built from all of them.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" id="features">
        {SPECIALISTS.map((s) => (
          <motion.div
            key={s.name}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="spec-card group relative rounded-2xl border border-white/8 bg-[var(--cw-surface)] p-6 flex flex-col gap-4 overflow-hidden"
          >
            {/* Corner glow on hover */}
            <div
              className="absolute -top-8 -left-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: s.color }}
            />

            {/* Icon + name + badge */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${s.color}18`, border: `1px solid ${s.color}30` }}
              >
                {s.icon}
              </div>
              <div>
                <h3 className="font-semibold text-base leading-tight">{s.name}</h3>
                <span
                  className="text-[9px] font-bold tracking-[0.06em] px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${s.color}18`, color: s.color }}
                >
                  {s.badge}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {s.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ backgroundColor: `${s.color}15`, color: s.color }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.desc}</p>

            {/* Example catch */}
            <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider font-medium mb-1" style={{ color: s.color }}>
                {s.example.label}
              </p>
              <p className="text-xs text-muted-foreground leading-snug">{s.example.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
