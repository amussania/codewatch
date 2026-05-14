"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Specialist icons (geometric SVG marks, per CLAUDE.MD §4 colours) ─────────

function SecurityIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path
        d="M7.5 1L13.5 4V7.5C13.5 10.8 10.8 13.7 7.5 14.5C4.2 13.7 1.5 10.8 1.5 7.5V4L7.5 1Z"
        fill={`${color}18`}
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReliabilityIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <circle cx="7.5" cy="7.5" r="6" fill={`${color}18`} stroke={color} strokeWidth="1.2"/>
      <path d="M4.5 7.5L6.5 9.5L10.5 5.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LogicIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <rect x="2.5" y="1.5" width="10" height="12" rx="1.5" fill={`${color}18`} stroke={color} strokeWidth="1.2"/>
      <line x1="5" y1="5.5" x2="10" y2="5.5" stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="5" y1="7.5" x2="10" y2="7.5" stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="5" y1="9.5" x2="7.5" y2="9.5" stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

function PerformanceIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <rect x="1.5" y="8" width="2.5" height="5" rx="0.8" fill={`${color}18`} stroke={color} strokeWidth="1.1"/>
      <rect x="6" y="5" width="2.5" height="8" rx="0.8" fill={`${color}18`} stroke={color} strokeWidth="1.1"/>
      <rect x="10.5" y="2" width="2.5" height="11" rx="0.8" fill={`${color}18`} stroke={color} strokeWidth="1.1"/>
    </svg>
  );
}

function QualityIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path
        d="M7.5 1.5L13.5 7.5L7.5 13.5L1.5 7.5Z"
        fill={`${color}18`}
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SPECIALISTS = [
  {
    Icon: SecurityIcon,
    name: "Security Specialist",
    color: "#C8440A",
    badge: "ALWAYS ON",
    desc: "OWASP Top 10, auth flows, injection, timing attacks, exposed secrets, insecure patterns, environment variable leaks. Runs on every single review.",
    example: { label: "Recent catch", text: "SQL injection vector in dynamic query builder — passed every existing test" },
  },
  {
    Icon: ReliabilityIcon,
    name: "Reliability Engineer",
    color: "#2060A0",
    badge: "ALWAYS ON",
    desc: "Null guards, timeout enforcement, error propagation, retry logic, circuit breakers, input validation at every entry point. The edge cases that fail at 2AM.",
    example: { label: "Recent catch", text: "No timeout on external API call — would have hung indefinitely under load" },
  },
  {
    Icon: LogicIcon,
    name: "Business Logic Reviewer",
    color: "#B07A20",
    badge: "ALWAYS ON",
    desc: "Validates code against your described rules. Price calculations, fee structures, user permissions, state transitions. No other tool does this.",
    example: { label: "Recent catch", text: "GST rounding incorrect for Indian customer — was under-charging by ₹2 per transaction" },
  },
  {
    Icon: PerformanceIcon,
    name: "Performance Engineer",
    color: "#7040B0",
    badge: "OPTIONAL",
    desc: "N+1 query detection, O(n²) pattern recognition, memory leak identification, async blocking detection, database index recommendations.",
    example: { label: "Recent catch", text: "O(n²) nested loop in paginated API endpoint serving 50k requests/min" },
  },
  {
    Icon: QualityIcon,
    name: "Quality Gatekeeper",
    color: "#2A6B3C",
    badge: "OPTIONAL",
    desc: "Cyclomatic complexity, naming conventions, dead code elimination, test coverage gaps, function length thresholds. Enforces consistency at scale.",
    example: { label: "Recent catch", text: "Cyclomatic complexity of 31 in payment middleware — refactored to state machine" },
  },
];

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Specialists() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = SPECIALISTS[activeIdx];

  return (
    <section id="features" className="py-[140px]">
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span style={{ display: "block", width: 24, height: 1, background: "var(--cw-ember)" }} />
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
              The specialists
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
            Five specialists.
            <br />
            <span style={{ color: "var(--cw-ember)" }}>One Master Score.</span>
          </h2>
          <p
            style={{
              fontSize: 17,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: "var(--cw-ink-secondary)",
              marginTop: 16,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.7,
            }}
          >
            Three specialists run on every review. Two are optional. All five run in parallel.
            You get one Master Production Score built from all of them.
          </p>
        </motion.div>

        {/* Split panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col lg:flex-row overflow-hidden"
          style={{
            borderRadius: 12,
            border: "0.5px solid var(--cw-bg-secondary)",
            background: "var(--cw-bg-surface)",
          }}
        >

          {/* ── Left: specialist list ── */}
          <div
            className="lg:w-[40%] flex flex-col border-b lg:border-b-0"
            style={{ borderColor: "var(--cw-bg-secondary)" }}
          >
            {SPECIALISTS.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setActiveIdx(i)}
                className={`flex items-center gap-4 px-6 py-4 text-left w-full ${
                  i < SPECIALISTS.length - 1 ? "border-b" : ""
                }`}
                style={{
                  borderColor: "var(--cw-bg-secondary)",
                  borderLeft: `3px solid ${i === activeIdx ? "var(--cw-ember)" : "transparent"}`,
                  backgroundColor: i === activeIdx ? "rgba(200,68,10,0.03)" : "transparent",
                  transition: "background-color 200ms ease, border-color 200ms ease",
                }}
                onMouseEnter={(e) => {
                  if (i !== activeIdx) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "var(--cw-bg-secondary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (i !== activeIdx) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  }
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--cw-ink-tertiary)",
                    fontWeight: 500,
                    fontVariantNumeric: "tabular-nums",
                    flexShrink: 0,
                    width: 24,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    style={{
                      fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      color: i === activeIdx ? "var(--cw-ember)" : "var(--cw-ink-primary)",
                      transition: "color 200ms ease",
                      lineHeight: 1.3,
                    }}
                  >
                    {s.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* ── Right: detail panel ── */}
          <div
            className="flex-1 p-8 lg:p-10 min-h-[320px] flex flex-col justify-between overflow-hidden"
            style={{ borderLeft: "0.5px solid var(--cw-bg-secondary)" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col h-full"
              >
                {/* Name + badge */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <h3
                    className="font-heading italic"
                    style={{
                      fontSize: "clamp(26px, 3vw, 38px)",
                      lineHeight: 1.15,
                      color: active.color,
                    }}
                  >
                    {active.name}
                  </h3>
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      padding: "4px 10px",
                      borderRadius: 4,
                      ...(active.badge === "ALWAYS ON"
                        ? {
                            background: "var(--cw-ember)",
                            color: "#FDFAF7",
                          }
                        : {
                            background: "var(--cw-bg-secondary)",
                            color: "var(--cw-ink-tertiary)",
                          }),
                    }}
                  >
                    {active.badge}
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--cw-ink-secondary)",
                    lineHeight: 1.75,
                    flex: 1,
                    marginBottom: 24,
                  }}
                >
                  {active.desc}
                </p>

                {/* Recent catch */}
                <div
                  style={{
                    borderRadius: 8,
                    padding: "14px 16px",
                    background: "var(--cw-bg-secondary)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--cw-ink-tertiary)",
                      marginBottom: 6,
                    }}
                  >
                    {active.example.label}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif",
                      color: "var(--cw-ink-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {active.example.text}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
