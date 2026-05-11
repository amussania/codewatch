"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PROBLEMS = [
  {
    icon: "⏳",
    stat: "4.2 days",
    statLabel: "average PR review wait",
    title: "Review cycles kill momentum",
    desc: "Engineers context-switch, lose flow state, and watch their PRs stagnate in queues. Every day of waiting is a day not shipping.",
    color: "#ff6b6b",
  },
  {
    icon: "🎲",
    stat: "3×",
    statLabel: "variance between reviewers",
    title: "Feedback is a lottery",
    desc: "A junior reviewer misses the timing attack. A senior catches the N+1 query but not the missing index. No two reviews are the same.",
    color: "#f59e0b",
  },
  {
    icon: "🔥",
    stat: "67%",
    statLabel: "of prod bugs were in the diff",
    title: "Issues slip straight to production",
    desc: "Human reviewers miss edge cases, especially under deadline pressure. The bugs that cost the most are the ones nobody spotted in review.",
    color: "#4a9fff",
  },
];

const STATS = [
  { value: "12,400+", label: "Reviews completed" },
  { value: "94%", label: "Issues caught pre-merge" },
  { value: "< 8s", label: "Average review time" },
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
    <section ref={sectionRef} className="py-28 max-w-7xl mx-auto px-6" id="features">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[#ff6b6b] text-sm font-medium uppercase tracking-widest">
          The problem
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
          Code review is broken.
          <br />
          <span className="text-muted-foreground font-normal">We&apos;re fixing it.</span>
        </h2>
        <p className="text-muted-foreground mt-5 max-w-lg mx-auto leading-relaxed">
          Traditional code review is slow, inconsistent, and misses the things that matter most.
          CodeWatch gives every engineer instant access to specialist-level analysis.
        </p>
      </div>

      {/* Problem cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-16">
        {PROBLEMS.map((p) => (
          <div
            key={p.title}
            className="problem-card group relative rounded-2xl border border-white/8 bg-[var(--cw-surface)] p-7 overflow-hidden"
          >
            {/* Subtle corner glow */}
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{ backgroundColor: p.color }}
            />

            <div className="text-3xl mb-5">{p.icon}</div>

            <div className="mb-5">
              <span className="text-3xl font-bold" style={{ color: p.color }}>
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
      <div className="problem-stats-bar rounded-2xl border border-white/8 bg-[var(--cw-surface)] px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-white/8">
        {STATS.map((s) => (
          <div key={s.label} className="problem-stat text-center">
            <div className="text-3xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
