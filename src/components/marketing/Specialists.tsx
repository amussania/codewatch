"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Badge = "ALWAYS ON" | "OPTIONAL";

interface Specialist {
  num: string;
  name: string;
  color: string;
  badge: Badge;
  desc: string;
  bullets: string[];
  catch: string;
}

const SPECIALISTS: Specialist[] = [
  {
    num: "01",
    name: "Security Specialist",
    color: "#C8440A",
    badge: "ALWAYS ON",
    desc: "OWASP Top 10, auth flows, injection vectors, timing attacks, exposed secrets, environment variable leaks, insecure patterns. Runs on every single review — no exceptions.",
    bullets: [
      "OWASP Top 10 & injection vulnerabilities",
      "Auth flows, timing attacks & exposed secrets",
      "Environment variable leaks & insecure patterns",
    ],
    catch: "SQL injection vector in dynamic query builder — passed every existing test",
  },
  {
    num: "02",
    name: "Reliability Engineer",
    color: "#2060A0",
    badge: "ALWAYS ON",
    desc: "Null guards, timeout enforcement, error propagation, retry logic, circuit breakers, input validation at every entry point. The edge cases that fail at 2AM.",
    bullets: [
      "Null guards & defensive programming gaps",
      "Missing timeouts on every external call",
      "Error propagation & retry logic failures",
    ],
    catch: "No timeout on external API call — would have hung indefinitely under load",
  },
  {
    num: "03",
    name: "Business Logic Reviewer",
    color: "#B07A20",
    badge: "OPTIONAL",
    desc: "Validates code against your described business rules. Price calculations, fee structures, user permissions, state transitions. No other tool does this.",
    bullets: [
      "Price & fee calculation correctness",
      "User permission & state transition logic",
      "Currency, rounding & multi-region rules",
    ],
    catch: "GST rounding incorrect for Indian customers — under-charging by ₹2 per transaction",
  },
  {
    num: "04",
    name: "Performance Engineer",
    color: "#7040B0",
    badge: "OPTIONAL",
    desc: "N+1 query detection, O(n²) pattern recognition, memory leak identification, async blocking detection, database index recommendations.",
    bullets: [
      "N+1 queries & database access anti-patterns",
      "O(n²) complexity in hot code paths",
      "Memory leaks & async blocking detection",
    ],
    catch: "O(n²) nested loop in paginated API endpoint serving 50k requests/min",
  },
  {
    num: "05",
    name: "Quality Gatekeeper",
    color: "#2A6B3C",
    badge: "ALWAYS ON",
    desc: "Cyclomatic complexity, naming conventions, dead code elimination, test coverage gaps, function length thresholds. Enforces consistency at scale.",
    bullets: [
      "Cyclomatic complexity thresholds",
      "Dead code & naming convention drift",
      "Test coverage gaps & function length",
    ],
    catch: "Cyclomatic complexity of 31 in payment middleware — refactored to state machine",
  },
];

// Backgrounds get progressively darker as cards go deeper in the stack
const PEEK_BG = ["#F5F2EE", "#EDEAE3", "#E5E0D8", "#DDD9D0"];

// ─── Card component (handles both active and peeking states) ──────────────────

function SpecialistCard({
  spec,
  rank,
  isActive,
  onSelect,
  entranceDelay,
  isInView,
  reduced,
}: {
  spec: Specialist;
  rank: number;
  isActive: boolean;
  onSelect: () => void;
  entranceDelay: number;
  isInView: boolean;
  reduced: boolean;
}) {
  const [peekHovered, setPeekHovered] = useState(false);

  return (
    <motion.div
      key={spec.num}
      layout
      initial={reduced ? false : { opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        opacity: { duration: 0.5, delay: entranceDelay, ease: [0.25, 0.46, 0.45, 0.94] },
        y: { duration: 0.6, delay: entranceDelay, ease: [0.16, 1, 0.3, 1] },
        layout: reduced
          ? { type: "tween", duration: 0.15, ease: "easeOut" }
          : { type: "tween", duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
      }}
      style={{
        borderRadius: 16,
        borderTop: `3px solid ${spec.color}`,
        borderRight: "0.5px solid rgba(26,23,20,0.08)",
        borderBottom: "0.5px solid rgba(26,23,20,0.08)",
        borderLeft: "0.5px solid rgba(26,23,20,0.08)",
        background: isActive
          ? "var(--cw-bg-surface)"
          : peekHovered
          ? "var(--cw-bg-secondary)"
          : PEEK_BG[rank - 1] ?? PEEK_BG[3],
        boxShadow: isActive
          ? "0 32px 80px rgba(26,23,20,0.16), 0 8px 24px rgba(26,23,20,0.08)"
          : "0 2px 8px rgba(26,23,20,0.06)",
        overflow: "hidden",
        cursor: isActive ? "default" : "pointer",
        transition: "background 200ms ease, box-shadow 200ms ease",
        flexShrink: 0,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isActive ? (
          /* ── Active card: full content ── */
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ padding: 48 }}
          >
            <div
              className="flex flex-col lg:grid"
              style={{ gridTemplateColumns: "60% 40%", gap: 48, alignItems: "start" }}
            >
              {/* ── Left column ── */}
              <div>
                {/* Number */}
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--cw-ink-tertiary)",
                    margin: "0 0 8px",
                  }}
                >
                  {spec.num} / 05
                </p>

                {/* Name */}
                <h3
                  className="font-heading italic"
                  style={{
                    fontSize: "clamp(32px, 4vw, 48px)",
                    lineHeight: 1.1,
                    color: spec.color,
                    margin: "0 0 20px",
                  }}
                >
                  {spec.name}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: 17,
                    color: "var(--cw-ink-secondary)",
                    lineHeight: 1.7,
                    maxWidth: 480,
                    margin: "0 0 28px",
                  }}
                >
                  {spec.desc}
                </p>

                {/* Bullets */}
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {spec.bullets.map((b) => (
                    <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span
                        aria-hidden
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: spec.color,
                          flexShrink: 0,
                          marginTop: 7,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 400,
                          fontSize: 14,
                          color: "var(--cw-ink-secondary)",
                          lineHeight: 1.55,
                        }}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Right column ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 4 }}>
                {/* Status badge */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      padding: "6px 12px",
                      borderRadius: 6,
                      ...(spec.badge === "ALWAYS ON"
                        ? { background: "#C8440A", color: "#FDFAF7" }
                        : {
                            background: "var(--cw-bg-secondary)",
                            color: "var(--cw-ink-tertiary)",
                          }),
                    }}
                  >
                    {spec.badge}
                  </span>
                </div>

                {/* Recent catch */}
                <div
                  style={{
                    background: `${spec.color}0F`,
                    borderLeft: `3px solid ${spec.color}`,
                    borderRadius: 8,
                    padding: 20,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: spec.color,
                      margin: "0 0 8px",
                    }}
                  >
                    Recent catch
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      color: "var(--cw-ink-secondary)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {spec.catch}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── Peeking card: 56px strip ── */
          <motion.button
            key="peek"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={onSelect}
            onMouseEnter={() => setPeekHovered(true)}
            onMouseLeave={() => setPeekHovered(false)}
            aria-label={`View ${spec.name}`}
            style={{
              width: "100%",
              height: 56,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 24px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {/* Number */}
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                color: "var(--cw-ink-tertiary)",
                letterSpacing: "0.04em",
                flexShrink: 0,
                width: 24,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {spec.num}
            </span>

            {/* Name */}
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                color: "var(--cw-ink-primary)",
                flex: 1,
              }}
            >
              {spec.name}
            </span>

            {/* Colour dot */}
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: spec.color,
                flexShrink: 0,
                opacity: 0.7,
              }}
            />

            {/* Chevron */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              style={{ flexShrink: 0 }}
            >
              <path
                d="M5 3L9 7L5 11"
                stroke="var(--cw-ink-tertiary)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Specialists() {
  const reduced = useReducedMotion();
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4]);

  const stackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stackRef, { once: true, margin: "-80px" });

  const handleSelect = (idx: number) => {
    setOrder((prev) => {
      if (prev[0] === idx) return prev;
      return [idx, ...prev.filter((i) => i !== idx)];
    });
  };

  return (
    <section
      id="features"
      style={{
        background: "var(--cw-bg-primary)",
        padding: "140px 0",
        minHeight: "100vh",
      }}
    >
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
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
              style={{ display: "block", width: 24, height: 1, background: "var(--cw-ember)" }}
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
            Three specialists run on every review. Two are optional. All five run in
            parallel. You get one Master Production Score built from all of them.
          </p>
        </motion.div>

        {/* Card stack */}
        <div
          ref={stackRef}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {order.map((specIdx, rank) => (
            <SpecialistCard
              key={SPECIALISTS[specIdx].num}
              spec={SPECIALISTS[specIdx]}
              rank={rank}
              isActive={rank === 0}
              onSelect={() => handleSelect(specIdx)}
              entranceDelay={reduced ? 0 : rank * 0.08}
              isInView={inView}
              reduced={!!reduced}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
