"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Data ──────────────────────────────────────────────────────────────────────

const BEATS = [
  {
    step: "01",
    headline: "Paste your code",
    copy: "Drop in any AI-generated code. Python, JavaScript, TypeScript, whatever your vibe-coding session produced.",
  },
  {
    step: "02",
    headline: "Five specialists review it simultaneously",
    copy: "Security. Reliability. Performance. Business Logic. Quality. Five specialist AI reviewers work in parallel — not sequentially.",
  },
  {
    step: "03",
    headline: "Get a structured report",
    copy: "A structured report you can act on. Prioritised by severity. Export as PDF or markdown. Share with your team.",
  },
] as const;

const SPECIALISTS = [
  { name: "Security Analyst",     color: "#C8440A" },
  { name: "Reliability Engineer", color: "#2060A0" },
  { name: "Performance Analyst",  color: "#7040B0" },
  { name: "Business Logic",       color: "#B07A20" },
  { name: "Quality Inspector",    color: "#2A6B3C" },
];

const SEVERITY_ROWS = [
  { label: "Critical", count: 2, color: "#C8440A", pct: "75%" },
  { label: "High",     count: 2, color: "#B07A20", pct: "75%" },
  { label: "Medium",   count: 2, color: "#2060A0", pct: "56%" },
  { label: "Low",      count: 1, color: "#2A6B3C", pct: "30%" },
];

// ─── Beat 1: Empty editor with blinking cursor ─────────────────────────────────

function EditorVisual() {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "#21252B",
        boxShadow: "0 24px 60px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      {/* macOS chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {(["#FF5F57", "#FFBD2E", "#28C840"] as const).map((c) => (
          <span
            key={c}
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: c,
              display: "block",
              flexShrink: 0,
            }}
          />
        ))}
        <span
          style={{
            marginLeft: 12,
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: "rgba(255,255,255,0.22)",
          }}
        >
          review.ts
        </span>
      </div>

      {/* Empty editor body */}
      <div
        style={{
          padding: "18px 0",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          lineHeight: 1.75,
          minHeight: 240,
        }}
      >
        {/* Line 1 — cursor */}
        <div style={{ display: "flex", alignItems: "center", paddingLeft: 16, paddingRight: 16 }}>
          <span
            style={{
              width: 24,
              flexShrink: 0,
              textAlign: "right",
              fontSize: 11,
              marginRight: 16,
              userSelect: "none",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            1
          </span>
          <span
            className="terminal-cursor"
            style={{
              display: "inline-block",
              width: 2,
              height: "1.1em",
              background: "#C8440A",
              verticalAlign: "text-bottom",
              borderRadius: 1,
            }}
          />
        </div>
        {/* Remaining empty lines */}
        {[2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <span
              style={{
                width: 24,
                flexShrink: 0,
                textAlign: "right",
                fontSize: 11,
                marginRight: 16,
                userSelect: "none",
                color: "rgba(255,255,255,0.10)",
              }}
            >
              {n}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Beat 2: Specialist badges animate in one by one ──────────────────────────

function SpecialistsVisual({ reduced }: { reduced: boolean | null }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {SPECIALISTS.map((s, i) => (
        <motion.div
          key={s.name}
          initial={reduced ? false : { opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: reduced ? 0 : i * 0.1,
            duration: 0.32,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 16px",
            borderRadius: 12,
            background: "var(--cw-bg-surface)",
            border: "0.5px solid var(--cw-bg-secondary)",
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: s.color,
              flexShrink: 0,
              display: "block",
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--cw-ink-primary)",
              flex: 1,
            }}
          >
            {s.name}
          </span>
          <motion.span
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.22 }}
            style={{
              fontSize: 11,
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--cw-ink-tertiary)",
            }}
          >
            Reviewing…
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Beat 3: Severity report with animated bars ───────────────────────────────

function ReportVisual({ reduced }: { reduced: boolean | null }) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: "22px 24px",
        background: "var(--cw-bg-surface)",
        border: "0.5px solid var(--cw-bg-secondary)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <p
          style={{
            margin: "0 0 5px",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--cw-signal-pass)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Review complete
        </p>
        <p
          style={{
            margin: "0 0 3px",
            fontSize: 20,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--cw-ink-primary)",
          }}
        >
          7 issues found
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--cw-ink-tertiary)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Across 5 specialist reviews
        </p>
      </div>

      {/* Severity bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 22 }}>
        {SEVERITY_ROWS.map(({ label, count, color, pct }, i) => (
          <div key={label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--cw-ink-secondary)",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  color,
                }}
              >
                {count}
              </span>
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: "var(--cw-bg-secondary)",
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{ height: "100%", borderRadius: 2, background: color }}
                initial={reduced ? false : { width: 0 }}
                animate={{ width: pct }}
                transition={{
                  delay: reduced ? 0 : i * 0.09 + 0.1,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Export row */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "6px 14px",
          borderRadius: 99,
          border: "1px solid var(--cw-bg-secondary)",
          fontSize: 12,
          fontFamily: "'DM Sans', sans-serif",
          color: "var(--cw-ink-secondary)",
          cursor: "default",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
          <path
            d="M5.5 1.5v6M2.5 5.5l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Export as PDF · Markdown
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function HowItWorks() {
  const [beat, setBeat] = useState(0);
  const outerRef        = useRef<HTMLDivElement>(null);
  const beatRef         = useRef(0);
  const reduced         = useReducedMotion();

  // Wire ScrollTrigger to Lenis — Lenis already calls ScrollTrigger.update()
  // on every scroll tick, so a vanilla ScrollTrigger is all we need here.
  useGSAP(
    () => {
      if (!outerRef.current) return;
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const next = Math.min(2, Math.floor(self.progress * 3));
          if (next !== beatRef.current) {
            beatRef.current = next;
            setBeat(next);
          }
        },
      });
    },
    { scope: outerRef, dependencies: [] }
  );

  // 200ms crossfade + slide — instant when reduced motion is preferred
  const xFade = reduced
    ? ({ duration: 0 } as const)
    : ({ duration: 0.2, ease: "easeOut" } as const);

  return (
    <section
      id="how-it-works"
      ref={outerRef}
      style={{ height: "300vh", background: "var(--cw-bg-primary)" }}
    >
      {/* Sticky viewport-height panel */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div className="w-full max-w-[1120px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* ── Left — text ────────────────────────────────────────── */}
            <div>
              {/* Step progress pills */}
              <div style={{ display: "flex", gap: 5, marginBottom: 36 }}>
                {([0, 1, 2] as const).map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 5,
                      borderRadius: 999,
                      background: i === beat ? "var(--cw-ember)" : "var(--cw-bg-secondary)",
                      width: i === beat ? 24 : 6,
                      transition:
                        "width 350ms cubic-bezier(0.16,1,0.3,1), background 350ms ease",
                    }}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={beat}
                  initial={reduced ? {} : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? {} : { opacity: 0, y: -8 }}
                  transition={xFade}
                >
                  <p
                    style={{
                      margin: "0 0 14px",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--cw-ember)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Step {BEATS[beat].step}
                  </p>
                  <h2
                    className="font-heading italic"
                    style={{
                      fontSize: "clamp(30px, 3.2vw, 46px)",
                      lineHeight: 1.1,
                      color: "var(--cw-ink-primary)",
                      margin: "0 0 20px",
                    }}
                  >
                    {BEATS[beat].headline}
                  </h2>
                  <p
                    style={{
                      fontSize: 17,
                      lineHeight: 1.7,
                      color: "var(--cw-ink-secondary)",
                      fontFamily: "'DM Sans', sans-serif",
                      maxWidth: 420,
                      margin: 0,
                    }}
                  >
                    {BEATS[beat].copy}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Right — product visual ─────────────────────────────── */}
            <div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={beat}
                  initial={reduced ? {} : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? {} : { opacity: 0, y: -10 }}
                  transition={xFade}
                >
                  {beat === 0 && <EditorVisual />}
                  {beat === 1 && <SpecialistsVisual reduced={reduced} />}
                  {beat === 2 && <ReportVisual reduced={reduced} />}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
