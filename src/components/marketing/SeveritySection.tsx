"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const LEVELS = [
  {
    label: "Critical",
    bars: 5,
    color: "#C8440A",
    finding:
      "SQL injection in dynamic query builder — confirmed exploitable across 3 files",
  },
  {
    label: "High",
    bars: 4,
    color: "#8B2F0A",
    finding:
      "No timeout on external API call — process hangs indefinitely under load",
  },
  {
    label: "Medium",
    bars: 3,
    color: "#B07A20",
    finding:
      "API key logged on auth failure — plaintext visible in log aggregators",
  },
  {
    label: "Low",
    bars: 2,
    color: "#2060A0",
    finding:
      "Unused dependency with known CVE — minimal attack surface at this version",
  },
  {
    label: "Pass",
    bars: 5,
    color: "#2A6B3C",
    finding:
      "Error handling, timeouts, and retry logic all correctly implemented",
  },
] as const;

// ─── Signal bars ──────────────────────────────────────────────────────────────

const BAR_HEIGHTS = [8, 12, 16, 20, 24];

function SignalBars({ filled, color }: { filled: number; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 3,
      }}
    >
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: h,
            borderRadius: 2,
            background: i < filled ? color : "var(--cw-bg-secondary)",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function SeveritySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView       = useInView(containerRef, { once: true, margin: "-80px" });
  const reduced      = useReducedMotion();

  return (
    <section
      id="severity"
      style={{
        background: "var(--cw-bg-primary)",
        padding: "120px 0",
      }}
    >
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
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
              Severity System
            </span>
          </div>
          <h2
            className="font-heading italic"
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.1,
              color: "var(--cw-ink-primary)",
              margin: "0 0 16px",
            }}
          >
            Not everything is an emergency.
          </h2>
          <p
            style={{
              fontSize: 17,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: "var(--cw-ink-secondary)",
              lineHeight: 1.7,
              maxWidth: 440,
              margin: "0 auto",
            }}
          >
            Every finding is ranked. You know what to fix before you ship and
            what can wait until the next sprint.
          </p>
        </div>

        {/* Severity cards */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
          style={{ gap: 12 }}
        >
          {LEVELS.map((level, i) => (
            <motion.div
              key={level.label}
              initial={
                reduced
                  ? false
                  : { opacity: 0, y: 16, clipPath: "inset(0 0 100% 0)" }
              }
              animate={
                reduced
                  ? {}
                  : inView
                  ? { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }
                  : { opacity: 0, y: 16, clipPath: "inset(0 0 100% 0)" }
              }
              transition={{
                duration: 0.45,
                delay: reduced ? 0 : i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                borderRadius: 12,
                background: "var(--cw-bg-surface)",
                border: "0.5px solid var(--cw-bg-secondary)",
                padding: "22px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {/* Label */}
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: level.color,
                }}
              >
                {level.label}
              </p>

              {/* Signal bars */}
              <SignalBars filled={level.bars} color={level.color} />

              {/* Example finding */}
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "var(--cw-ink-secondary)",
                  lineHeight: 1.55,
                  flex: 1,
                }}
              >
                {level.finding}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
