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
    name: "Security Auditor",
    color: "#ff6b6b",
    tags: ["OWASP Top 10", "Auth flows", "Injection", "Secrets"],
    desc: "Finds timing attacks, SQL injection, exposed secrets, insecure deserialization, and broken authentication — before they reach production.",
    example: { label: "Recent catch", text: "JWT secret exposed in client bundle via environment variable leak" },
  },
  {
    icon: "⚡",
    name: "Performance Engineer",
    color: "#fbbf24",
    tags: ["N+1 queries", "Memory leaks", "Async", "Caching"],
    desc: "Detects O(n²) loops, missing database indexes, unbounded memory growth, and blocking operations in async code.",
    example: { label: "Recent catch", text: "O(n²) nested loop in paginated API endpoint serving 50k req/min" },
  },
  {
    icon: "🏗️",
    name: "Architecture Reviewer",
    color: "#4a9fff",
    tags: ["Coupling", "SOLID", "Patterns", "Scalability"],
    desc: "Reviews separation of concerns, dependency inversion, scalability patterns, and data flow between layers.",
    example: { label: "Recent catch", text: "Business logic leaking into HTTP layer — suggested service + repository pattern" },
  },
  {
    icon: "✨",
    name: "Quality Analyst",
    color: "#c4b5fd",
    tags: ["Complexity", "Naming", "Dead code", "Coverage"],
    desc: "Enforces naming conventions, flags functions with cyclomatic complexity above threshold, removes dead code, and identifies untestable constructs.",
    example: { label: "Recent catch", text: "Cyclomatic complexity of 23 in auth middleware — refactor to state machine suggested" },
  },
  {
    icon: "🔌",
    name: "API Designer",
    color: "#86efac",
    tags: ["REST", "GraphQL", "Versioning", "Contracts"],
    desc: "Reviews HTTP status code usage, REST resource naming, pagination design, API versioning strategy, and breaking-change risk.",
    example: { label: "Recent catch", text: "404 vs 403 distinction missing — leaks existence of private user resources" },
  },
  {
    icon: "📝",
    name: "Tech Writer AI",
    color: "#fda4af",
    tags: ["JSDoc", "README", "OpenAPI", "Changelogs"],
    desc: "Auto-generates JSDoc comments, OpenAPI spec from route handlers, README sections, and inline explanations from your code's context.",
    example: { label: "Recent output", text: "Generated full OpenAPI 3.1 spec from 47 Express route handlers in 4 seconds" },
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
          Six AI experts. One review.
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
          Each specialist is trained for a specific domain. Run them individually for a
          targeted review, or all at once for a comprehensive audit.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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

            {/* Icon + name */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${s.color}18`, border: `1px solid ${s.color}30` }}
              >
                {s.icon}
              </div>
              <h3 className="font-semibold text-base">{s.name}</h3>
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
