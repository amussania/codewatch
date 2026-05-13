"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface Finding {
  line: number;
  severity: Severity;
  text: string;
}

interface Specialist {
  id: string;
  name: string;
  color: string;
  findings: Finding[];
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const CODE_LINES = [
  "async function getUserData(userId, token) {",
  "  // Fetch user profile from database",
  '  const q = "SELECT * FROM users WHERE id="',
  "           + userId;",
  "  const user = await db.execute(q);",
  '  if (!user) throw new Error("Not found");',
  "  const resp = await api.get(",
  '    "/users/" + user.id,',
  "    { headers: { Authorization: token } }",
  "  );",
  '  console.log("Fetched:", resp.data.password);',
  "  return resp.data;",
  "}",
];

const SPECIALISTS: Specialist[] = [
  {
    id: "security",
    name: "Security Analyst",
    color: "#C8440A",
    findings: [
      { line: 3, severity: "CRITICAL", text: "String concat enables SQL injection" },
      { line: 9, severity: "CRITICAL", text: "Token passed but never validated" },
    ],
  },
  {
    id: "reliability",
    name: "Reliability Engineer",
    color: "#2060A0",
    findings: [
      { line: 5, severity: "HIGH",   text: "No error handler on db.execute()" },
      { line: 7, severity: "MEDIUM", text: "api.get() rejection not caught" },
    ],
  },
  {
    id: "logic",
    name: "Business Logic",
    color: "#B07A20",
    findings: [
      { line: 1, severity: "MEDIUM", text: "userId type unchecked — null accepted" },
    ],
  },
  {
    id: "performance",
    name: "Performance Analyst",
    color: "#7040B0",
    findings: [
      { line: 5, severity: "MEDIUM", text: "No connection pool — new handle per call" },
    ],
  },
  {
    id: "quality",
    name: "Quality Inspector",
    color: "#2A6B3C",
    findings: [
      { line: 11, severity: "LOW", text: "Password value logged — PII in logs" },
    ],
  },
];

// ─── Syntax Highlighting ────────────────────────────────────────────────────────

const KW = new Set([
  "async", "await", "function", "const", "let", "var",
  "if", "else", "return", "throw", "new", "true", "false", "null",
]);

function SyntaxLine({ code }: { code: string }) {
  const tokens: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < code.length) {
    if (code[i] === "/" && code[i + 1] === "/") {
      tokens.push(<span key={k++} style={{ color: "#5C6370" }}>{code.slice(i)}</span>);
      break;
    }
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== q) j++;
      tokens.push(<span key={k++} style={{ color: "#98C379" }}>{code.slice(i, j + 1)}</span>);
      i = j + 1;
      continue;
    }
    if (/\d/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\d.]/.test(code[j])) j++;
      tokens.push(<span key={k++} style={{ color: "#D19A66" }}>{code.slice(i, j)}</span>);
      i = j;
      continue;
    }
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\w$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      tokens.push(
        <span key={k++} style={{ color: KW.has(word) ? "#E5C07B" : "#ABB2BF" }}>
          {word}
        </span>
      );
      i = j;
      continue;
    }
    tokens.push(<span key={k++} style={{ color: "#ABB2BF" }}>{code[i]}</span>);
    i++;
  }
  return <>{tokens}</>;
}

// ─── Severity Pill ──────────────────────────────────────────────────────────────

const SEV_STYLES: Record<Severity, { bg: string; color: string; border: string }> = {
  CRITICAL: { bg: "rgba(200,68,10,0.18)",  color: "#E8603A", border: "rgba(200,68,10,0.35)" },
  HIGH:     { bg: "rgba(180,80,40,0.18)",  color: "#C87060", border: "rgba(180,80,40,0.35)" },
  MEDIUM:   { bg: "rgba(176,122,32,0.18)", color: "#D4A040", border: "rgba(176,122,32,0.35)" },
  LOW:      { bg: "rgba(32,96,160,0.18)",  color: "#4898D8", border: "rgba(32,96,160,0.35)" },
};

function SeverityPill({ severity }: { severity: Severity }) {
  const s = SEV_STYLES[severity];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "1px 6px",
        borderRadius: 3,
        fontSize: 9.5,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        fontFamily: "'JetBrains Mono', monospace",
        background: s.bg,
        color: s.color,
        border: `0.5px solid ${s.border}`,
        flexShrink: 0,
      }}
    >
      {severity}
    </span>
  );
}

// ─── Code Editor Panel ──────────────────────────────────────────────────────────

function CodeEditorPanel({
  lineRefs,
  activeLines,
  specColor,
}: {
  lineRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  activeLines: number[];
  specColor: string;
}) {
  return (
    <div style={{ perspective: "1100px", perspectiveOrigin: "50% 30%" }}>
      <div
        style={{
          position: "relative",
          transform: "rotateY(-8deg) rotateX(3deg)",
          borderRadius: 16,
          overflow: "hidden",
          background: "#21252B",
          boxShadow:
            "0 40px 90px rgba(0,0,0,0.55), 0 6px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Specular sheen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            background:
              "radial-gradient(ellipse at 15% 10%, rgba(255,255,255,0.07) 0%, transparent 55%)",
          }}
        />
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
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57", flexShrink: 0, display: "block" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E", flexShrink: 0, display: "block" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840", flexShrink: 0, display: "block" }} />
          <span
            style={{
              marginLeft: 12,
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              color: "rgba(255,255,255,0.22)",
            }}
          >
            getUserData.ts
          </span>
        </div>
        {/* Code lines */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12.5,
            lineHeight: 1.75,
            padding: "10px 0",
          }}
        >
          {CODE_LINES.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = activeLines.includes(lineNum);
            return (
              <div
                key={idx}
                ref={(el) => { lineRefs.current[idx] = el; }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 16,
                  paddingRight: 16,
                  background: isActive ? `${specColor}18` : "transparent",
                  borderLeft: `2px solid ${isActive ? specColor : "transparent"}`,
                  transition: "background 350ms ease, border-color 350ms ease",
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
                    color: isActive ? specColor : "rgba(255,255,255,0.18)",
                    transition: "color 350ms ease",
                  }}
                >
                  {lineNum}
                </span>
                <span style={{ whiteSpace: "pre" }}>
                  <SyntaxLine code={line} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Reviewer Panel ─────────────────────────────────────────────────────────────

function ReviewerPanel({
  spec,
  shownFindings,
  showSummary,
  findingRefs,
  reduced,
}: {
  spec: Specialist;
  shownFindings: number;
  showSummary: boolean;
  findingRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  reduced: boolean | null;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Specialist badge */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={spec.id + "-hdr"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 99,
              background: `${spec.color}1A`,
              border: `1px solid ${spec.color}45`,
              color: spec.color,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <motion.span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: spec.color,
                flexShrink: 0,
                display: "inline-block",
              }}
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            {spec.name}
          </div>
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
              color: "rgba(255,255,255,0.22)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Reviewing…
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Findings */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={spec.id + "-findings"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          {spec.findings.slice(0, shownFindings).map((finding, i) => (
            <motion.div
              key={i}
              ref={(el) => { findingRefs.current[i] = el; }}
              initial={{
                clipPath: reduced ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                opacity: reduced ? 1 : 0,
              }}
              animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderRadius: 12,
                padding: "10px 12px",
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.09)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <SeverityPill severity={finding.severity} />
                <span
                  style={{
                    fontSize: 10.5,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "rgba(255,255,255,0.32)",
                  }}
                >
                  L{finding.line}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.88)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {finding.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Summary badge */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              borderRadius: 14,
              padding: "14px 16px",
              background: "rgba(200,68,10,0.12)",
              border: "1px solid rgba(200,68,10,0.28)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "#E06030",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              7 issues found · 2 critical
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Across 5 specialist reviews
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────────

export default function ProductDemo() {
  const [specIdx, setSpecIdx]             = useState(0);
  const [shownFindings, setShownFindings] = useState(0);
  const [showSummary, setShowSummary]     = useState(false);
  const [annotationPaths, setAnnotationPaths] = useState<string[]>([]);

  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const findingRefs  = useRef<(HTMLDivElement | null)[]>([]);

  const isInView = useInView(sectionRef, { once: false, amount: 0.25 });
  const reduced  = useReducedMotion();
  const spec     = SPECIALISTS[specIdx];

  // State machine — sequences through specialists and loops
  useEffect(() => {
    if (!isInView) return;

    if (showSummary) {
      const t = setTimeout(() => {
        setShowSummary(false);
        setSpecIdx(0);
        setShownFindings(0);
      }, reduced ? 1200 : 2800);
      return () => clearTimeout(t);
    }

    if (shownFindings < spec.findings.length) {
      if (reduced) {
        setShownFindings(spec.findings.length);
        return;
      }
      const delay = shownFindings === 0 ? 650 : 320;
      const t = setTimeout(() => setShownFindings((n) => n + 1), delay);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      if (specIdx < SPECIALISTS.length - 1) {
        setSpecIdx((n) => n + 1);
        setShownFindings(0);
      } else {
        setShowSummary(true);
      }
    }, reduced ? 600 : 1800);
    return () => clearTimeout(t);
  }, [isInView, reduced, specIdx, shownFindings, showSummary, spec.findings.length]);

  // Compute bezier annotation paths from DOM positions
  useEffect(() => {
    if (reduced || !containerRef.current) {
      setAnnotationPaths((prev) => (prev.length > 0 ? [] : prev));
      return;
    }
    const raf = requestAnimationFrame(() => {
      const cr = containerRef.current?.getBoundingClientRect();
      if (!cr) return;
      const paths: string[] = [];
      for (let i = 0; i < shownFindings; i++) {
        const lineEl    = lineRefs.current[spec.findings[i].line - 1];
        const findingEl = findingRefs.current[i];
        if (!lineEl || !findingEl) continue;
        const lr = lineEl.getBoundingClientRect();
        const fr = findingEl.getBoundingClientRect();
        const x1   = lr.right - cr.left;
        const y1   = lr.top + lr.height / 2 - cr.top;
        const x2   = fr.left - cr.left;
        const y2   = fr.top + fr.height / 2 - cr.top;
        const ctrl = (x2 - x1) * 0.42;
        paths.push(
          `M${x1},${y1} C${x1 + ctrl},${y1} ${x2 - ctrl},${y2} ${x2},${y2}`
        );
      }
      setAnnotationPaths((prev) =>
        prev.length === 0 && paths.length === 0 ? prev : paths
      );
    });
    return () => cancelAnimationFrame(raf);
  }, [specIdx, shownFindings, reduced, spec.findings]);

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32"
      style={{ background: "#1A1714", minHeight: "100svh" }}
    >
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-12 lg:mb-16">
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.28)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Live Review · Product Demo
          </p>
          <h2
            className="font-heading italic"
            style={{
              margin: 0,
              fontSize: "clamp(28px, 3vw, 42px)",
              lineHeight: 1.08,
              color: "var(--cw-bg-primary)",
            }}
          >
            Five specialists. One paste of code.
          </h2>
          <p
            style={{
              margin: "14px 0 0",
              fontSize: 15,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.42)",
              fontFamily: "'DM Sans', sans-serif",
              maxWidth: 480,
            }}
          >
            Watch five specialist AI reviewers analyse the same code in sequence —
            each finding what the others miss.
          </p>
        </div>

        {/* Demo panels */}
        <div
          ref={containerRef}
          className="relative grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-10 items-start"
        >
          <CodeEditorPanel
            lineRefs={lineRefs}
            activeLines={spec.findings.slice(0, shownFindings).map((f) => f.line)}
            specColor={spec.color}
          />

          <ReviewerPanel
            spec={spec}
            shownFindings={shownFindings}
            showSummary={showSummary}
            findingRefs={findingRefs}
            reduced={reduced}
          />

          {/* Annotation SVG — desktop only, hidden on mobile */}
          {!reduced && annotationPaths.length > 0 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
              style={{ overflow: "visible" }}
            >
              {annotationPaths.map((d, i) => (
                <motion.path
                  key={`${specIdx}-${i}`}
                  d={d}
                  fill="none"
                  stroke={spec.color}
                  strokeWidth={1}
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  opacity={0.5}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </svg>
          )}
        </div>

        {/* Specialist progress tracker */}
        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: `repeat(${SPECIALISTS.length}, 1fr)`,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {SPECIALISTS.map((s, i) => {
            const isActive = i === specIdx && !showSummary;
            const isDone   = showSummary || i < specIdx;
            return (
              <div key={s.id} style={{ padding: "14px 12px 12px 0" }}>
                <div
                  style={{
                    height: 1,
                    borderRadius: 1,
                    marginBottom: 10,
                    background: isActive
                      ? s.color
                      : isDone
                      ? `${s.color}55`
                      : "rgba(255,255,255,0.1)",
                    transition: "background 400ms ease",
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: 10.5,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    fontFamily: "'DM Sans', sans-serif",
                    color: isActive
                      ? s.color
                      : isDone
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(255,255,255,0.18)",
                    transition: "color 400ms ease",
                  }}
                >
                  {s.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
