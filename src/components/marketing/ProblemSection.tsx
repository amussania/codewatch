"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── SVG icons ────────────────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 1.5L17 5V9.5C17 13.4 13.8 16.8 10 18C6.2 16.8 3 13.4 3 9.5V5L10 1.5Z"
        fill="rgba(200,68,10,0.1)"
        stroke="var(--cw-ember)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect
        x="3.5" y="2" width="13" height="16" rx="2"
        fill="rgba(200,68,10,0.08)" stroke="var(--cw-ember)" strokeWidth="1.3"
      />
      <line x1="7" y1="7.5" x2="13" y2="7.5" stroke="var(--cw-ember)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="7" y1="10.5" x2="13" y2="10.5" stroke="var(--cw-ember)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="7" y1="13.5" x2="10" y2="13.5" stroke="var(--cw-ember)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2.5L18 17H2L10 2.5Z"
        fill="rgba(200,68,10,0.08)"
        stroke="var(--cw-ember)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <line x1="10" y1="9" x2="10" y2="12.5" stroke="var(--cw-ember)" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="10" cy="14.5" r="0.8" fill="var(--cw-ember)"/>
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    Icon: ShieldIcon,
    stat: "2.74×",
    statLabel: "more vulnerabilities in AI-generated code",
    title: "Security Gaps Nobody Catches",
    desc: "Every other tool reviews syntax. AI-generated code has 2.74× more security vulnerabilities than human-written code. They all look syntactically correct. Most tools will pass them.",
  },
  {
    Icon: DocumentIcon,
    stat: "$0",
    statLabel: "caught by syntax-only review",
    title: "Silent Business Logic Errors",
    desc: "Your tool reviews syntax. Not your pricing logic. Not your GST rules. Not your discount calculation. The code works. The business rule is wrong. Nobody finds out until customers are undercharged.",
  },
  {
    Icon: WarningIcon,
    stat: "1.7×",
    statLabel: "more runtime errors in vibe-coded deployments",
    title: "Fails at 2AM on the Edge Case",
    desc: "AI-generated code handles the happy path perfectly. It fails on the edge case at 2AM when the payment gateway times out and there is no retry logic and no fallback and no error logging.",
  },
];

const STATS = [
  { value: "41%",    target: 41,   suffix: "%", decimals: 0, label: "of code is now AI-generated" },
  { value: "2.74×",  target: 2.74, suffix: "×", decimals: 2, label: "more vulnerabilities in AI code" },
  { value: "< 2min", target: null, suffix: "",  decimals: 0, label: "Full panel review time" },
  { value: "30+",    target: 30,   suffix: "+", decimals: 0, label: "Languages supported" },
] as const;

// ─── CountUp ──────────────────────────────────────────────────────────────────

function CountUp({
  target,
  suffix,
  decimals,
  trigger,
}: {
  target: number;
  suffix: string;
  decimals: number;
  trigger: boolean;
}) {
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
      setDisplay(
        (decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toString()) + suffix
      );
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, target, suffix, decimals]);

  return <>{display}</>;
}

function StatCell({ stat }: { stat: (typeof STATS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      style={{
        padding: "20px 24px",
        textAlign: "center",
        background: "var(--cw-bg-surface)",
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1,
          color: "var(--cw-ember)",
        }}
      >
        {stat.target !== null ? (
          <CountUp
            target={stat.target}
            suffix={stat.suffix}
            decimals={stat.decimals}
            trigger={isInView}
          />
        ) : (
          stat.value
        )}
      </div>
      <div
        style={{
          fontSize: 12,
          fontFamily: "'DM Sans', sans-serif",
          color: "var(--cw-ink-tertiary)",
          marginTop: 4,
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

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
            <span
              style={{
                display: "block",
                width: 24,
                height: 1,
                background: "var(--cw-ember)",
              }}
            />
            <span
              style={{
                color: "var(--cw-ember)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              The problem
            </span>
          </div>
          <h2
            className="font-heading italic"
            style={{
              fontSize: "clamp(38px, 5vw, 64px)",
              lineHeight: 1.15,
              color: "var(--cw-ink-primary)",
              margin: "12px 0 0",
            }}
          >
            AI writes the code.
            <br />
            <span style={{ color: "var(--cw-ember)" }}>Who reviews it?</span>
          </h2>
          <p
            style={{
              fontSize: 17,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: "var(--cw-ink-secondary)",
              marginTop: 20,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.7,
            }}
          >
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
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(26,23,20,0.08)" }}
              style={{
                background: "var(--cw-bg-surface)",
                padding: 32,
                borderRadius: 12,
                border: "0.5px solid var(--cw-bg-secondary)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <p.Icon />
              <div>
                <span
                  className="font-heading italic"
                  style={{ fontSize: 52, lineHeight: 1, color: "var(--cw-ember)" }}
                >
                  {p.stat}
                </span>
                <p
                  style={{
                    fontSize: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--cw-ink-tertiary)",
                    marginTop: 2,
                  }}
                >
                  {p.statLabel}
                </p>
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--cw-ink-primary)",
                  margin: 0,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  color: "var(--cw-ink-secondary)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-2 md:grid-cols-4"
          style={{
            gap: "1px",
            background: "var(--cw-bg-secondary)",
            border: "0.5px solid var(--cw-bg-secondary)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {STATS.map((s) => (
            <StatCell key={s.label} stat={s} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
