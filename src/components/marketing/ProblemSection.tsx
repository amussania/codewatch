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
    <section ref={sectionRef} className="py-[100px] bg-[#f8faff]" id="features">
      <div className="max-w-[1100px] mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="block w-6 h-px bg-[#ff5b35]" />
          <span className="text-[#ff5b35] text-[10px] tracking-[.2em] uppercase">The problem</span>
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em] mt-3">
          AI writes the code.
          <br />
          <span className="text-[#ff5b35]">Who reviews it?</span>
        </h2>
        <p className="font-serif italic font-light text-[#8896ab] text-[17px] mt-5 max-w-lg mx-auto leading-relaxed">
          41% of all code is now AI-generated. The tools built to review human code were not built
          for this. They pass what they were not designed to catch.
        </p>
      </div>

      {/* Problem cards — 1px border grid */}
      <div className="grid md:grid-cols-3 gap-px bg-[#e2e2ee] border border-[#e2e2ee] rounded-xl overflow-hidden mb-px">
        {PROBLEMS.map((p) => (
          <div
            key={p.title}
            className="problem-card bg-white p-7 flex flex-col gap-4"
          >
            <div className="text-2xl">{p.icon}</div>

            <div>
              <span className="font-heading text-[52px] leading-none" style={{ color: p.color }}>
                {p.stat}
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">{p.statLabel}</p>
            </div>

            <h3 className="text-base font-semibold">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats bar — 1px border grid continuation */}
      <div className="problem-stats-bar grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e2e2ee] border border-t-0 border-[#e2e2ee] rounded-b-xl overflow-hidden">
        {STATS.map((s) => (
          <div key={s.label} className="problem-stat bg-[#f8faff] px-6 py-5 text-center">
            <div className="font-heading text-[40px] leading-none text-[#ff5b35]">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
