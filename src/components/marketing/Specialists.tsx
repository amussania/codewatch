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
    <section ref={sectionRef} id="features" className="py-[100px]">
      <div className="max-w-[1100px] mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="block w-6 h-px bg-[#ff5b35]" />
          <span className="text-[#ff5b35] text-[10px] tracking-[.2em] uppercase">The specialists</span>
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em] mt-3">
          Five specialists.
          <br />
          <span className="text-[#ff5b35]">One Master Score.</span>
        </h2>
        <p className="font-serif italic font-light text-[#8896ab] text-[17px] mt-4 max-w-lg mx-auto leading-relaxed">
          Three specialists run on every review. Two are optional. All five run in parallel.
          You get one Master Production Score built from all of them.
        </p>
      </div>

      {/* 5-column 1px border grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[#e2e2ee] border border-[#e2e2ee] rounded-xl overflow-hidden">
        {SPECIALISTS.map((s) => (
          <div
            key={s.name}
            className="spec-card bg-white p-5 flex flex-col gap-3"
          >
            {/* Icon + badge */}
            <div className="flex items-start justify-between">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: `${s.color}18`, border: `1px solid ${s.color}30` }}
              >
                {s.icon}
              </div>
              <span
                className="text-[8px] font-bold tracking-[0.06em] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${s.color}18`, color: s.color }}
              >
                {s.badge}
              </span>
            </div>

            {/* Name */}
            <h3 className="font-semibold text-sm leading-tight">{s.name}</h3>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">{s.desc}</p>

            {/* Example catch */}
            <div className="rounded-lg bg-[#f8faff] border border-[#e2e2ee] px-3 py-2">
              <p className="text-[9px] uppercase tracking-wider font-medium mb-0.5" style={{ color: s.color }}>
                {s.example.label}
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug">{s.example.text}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
