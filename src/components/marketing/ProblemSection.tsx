"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

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
  { value: "41%",    target: 41,   suffix: "%", decimals: 0, label: "of code is now AI-generated" },
  { value: "2.74×",  target: 2.74, suffix: "×", decimals: 2, label: "more vulnerabilities in AI code" },
  { value: "< 2min", target: null, suffix: "",  decimals: 0, label: "Full panel review time" },
  { value: "30+",    target: 30,   suffix: "+", decimals: 0, label: "Languages supported" },
] as const;

function CountUp({ target, suffix, decimals, trigger }: { target: number; suffix: string; decimals: number; trigger: boolean }) {
  const [display, setDisplay] = useState("0" + suffix);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!trigger) return;
    const startTime = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      setDisplay((decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toString()) + suffix);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, target, suffix, decimals]);

  return <>{display}</>;
}

function StatCell({ stat }: { stat: typeof STATS[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-white px-6 py-5 text-center">
      <div className="font-heading text-[40px] leading-none text-[#ff5b35]">
        {stat.target !== null ? (
          <CountUp target={stat.target} suffix={stat.suffix} decimals={stat.decimals} trigger={isInView} />
        ) : (
          stat.value
        )}
      </div>
      <div className="text-xs text-[#999990] mt-1">{stat.label}</div>
    </div>
  );
}

export default function ProblemSection() {
  return (
    <section className="py-[140px]" id="features">
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
            <span className="text-[#ff5b35] text-[11px] tracking-[.2em] uppercase font-medium">The problem</span>
          </div>
          <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[1.15] tracking-[-0.02em] mt-3">
            AI writes the code.
            <br />
            <span className="text-[#ff5b35]">Who reviews it?</span>
          </h2>
          <p className="text-[17px] text-[#999990] mt-5 max-w-lg mx-auto leading-[1.7]">
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
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}
              className="bg-white p-8 rounded-2xl border border-[#e8e8e2] flex flex-col gap-4 hover:border-[#d0d0c8] transition-colors duration-300"
            >
              <div className="text-2xl">{p.icon}</div>
              <div>
                <span className="font-heading text-[52px] leading-none" style={{ color: p.color }}>
                  {p.stat}
                </span>
                <p className="text-xs text-[#999990] mt-0.5">{p.statLabel}</p>
              </div>
              <h3 className="text-base font-semibold text-[#0d0d0d]">{p.title}</h3>
              <p className="text-sm text-[#555550] leading-[1.7]">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e8e8e2] border border-[#e8e8e2] rounded-2xl overflow-hidden"
        >
          {STATS.map((s) => (
            <StatCell key={s.label} stat={s} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
