"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PROBLEMS = [
  {
    icon: "🔒",
    stat: "2.74×",
    statLabel: "more vulnerabilities in AI-generated code",
    title: "Security Gaps Nobody Catches",
    desc: "Every other tool reviews syntax. AI-generated code has 2.74× more security vulnerabilities than human-written code. They all look syntactically correct. Most tools will pass them.",
    color: "#00b85f",
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
  { value: "41%", label: "of code is now AI-generated" },
  { value: "2.74×", label: "more vulnerabilities in AI code" },
  { value: "< 2min", label: "Full panel review time" },
  { value: "30+", label: "Languages supported" },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".problem-card", {
        y: 40,
        opacity: 0,
        duration: 0.75,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
      gsap.from(".problem-stat", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".problem-stats-bar",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-[8.75rem] max-w-[1200px] mx-auto px-6 bg-[#f7f7fa]" id="features">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2.5">
          <span className="block w-5 h-px bg-[#00b85f]" />
          <span className="text-[#00b85f] text-[10px] font-medium tracking-[.2em] uppercase">The problem</span>
          <span className="block w-5 h-px bg-[#00b85f]" />
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em] mt-3">
          AI writes the code.
          <br />
          <span className="text-[#00b85f]">Who reviews it?</span>
        </h2>
        <p className="font-serif italic font-light text-[#7070a0] text-[17px] mt-5 max-w-lg mx-auto leading-relaxed">
          41% of all code is now AI-generated. The tools built to review human code were not built
          for this. They pass what they were not designed to catch.
        </p>
      </div>

      {/* Problem cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-16">
        {PROBLEMS.map((p) => (
          <div
            key={p.title}
            className="problem-card group relative rounded-2xl border border-[#e2e2ee] bg-white p-7 overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          >
            {/* Subtle corner glow */}
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{ backgroundColor: p.color }}
            />

            <div className="text-3xl mb-5">{p.icon}</div>

            <div className="mb-5">
              <span className="font-heading text-[52px] leading-none" style={{ color: "#00b85f" }}>
                {p.stat}
              </span>
              <span className="text-xs text-muted-foreground ml-2">{p.statLabel}</span>
            </div>

            <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div className="problem-stats-bar rounded-2xl border border-[#e2e2ee] bg-[var(--cw-surface)] px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-[#e2e2ee]">
        {STATS.map((s) => (
          <div key={s.label} className="problem-stat text-center">
            <div className="font-heading text-[44px] leading-none text-[#00b85f]">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
