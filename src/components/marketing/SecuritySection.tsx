"use client";

import { motion, useReducedMotion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    title: "Code never touches our disk",
    desc: "Ephemeral process, zero writes, destroyed when the review ends.",
  },
  {
    title: "Row-level tenant isolation",
    desc: "Cryptographically isolated per account — no shared surfaces.",
  },
  {
    title: "Zero data retention by default",
    desc: "Review result returned, then deleted. On every plan.",
  },
  {
    title: "Delete everything, anytime",
    desc: "One button wipe. GDPR Article 17 compliant. No waiting period.",
  },
];

const CODE_LINES: {
  n: number;
  tokens: { t: string; c: string }[];
  indent: number;
  annotate?: boolean;
}[] = [
  {
    n: 1,
    indent: 0,
    tokens: [
      { t: "const", c: "#4da3ff" },
      { t: " result = ", c: "#e8e8e2" },
      { t: "await", c: "#c4b5fd" },
      { t: " codewatch", c: "#e8e8e2" },
    ],
  },
  {
    n: 2,
    indent: 1,
    tokens: [
      { t: ".review", c: "#00c4a0" },
      { t: "(", c: "#e8e8e2" },
      { t: "{ code, context }", c: "#fbbf24" },
      { t: ");", c: "#e8e8e2" },
    ],
  },
  { n: 3, indent: 0, tokens: [] },
  {
    n: 4,
    indent: 0,
    annotate: true,
    tokens: [{ t: "// ephemeral process spawned", c: "#555550" }],
  },
  {
    n: 5,
    indent: 0,
    tokens: [{ t: "// specialists run in parallel", c: "#555550" }],
  },
  { n: 6, indent: 0, tokens: [] },
  {
    n: 7,
    indent: 0,
    tokens: [
      { t: "return", c: "#4da3ff" },
      { t: " result;", c: "#e8e8e2" },
    ],
  },
  {
    n: 8,
    indent: 0,
    tokens: [{ t: "// process destroyed ✓", c: "#00c4a0" }],
  },
];

// ─── Section ──────────────────────────────────────────────────────────────────

export default function SecuritySection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="security"
      style={{ background: "var(--cw-bg-primary)", padding: "140px 0", paddingBottom: 80 }}
    >
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: headline + editorial pillar list ── */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 32 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ alignSelf: "start" }}
          >
            {/* Section label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
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
                Security
              </span>
            </div>

            {/* Headline */}
            <h2
              className="font-heading italic"
              style={{
                fontSize: "clamp(38px, 5vw, 56px)",
                lineHeight: 1.1,
                color: "var(--cw-ink-primary)",
                margin: "0 0 16px",
              }}
            >
              Your code is never stored.
              <br />
              <span style={{ color: "var(--cw-ember)" }}>By design.</span>
            </h2>

            {/* Subline */}
            <p
              style={{
                fontSize: 17,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                color: "var(--cw-ink-secondary)",
                lineHeight: 1.7,
                maxWidth: 420,
                margin: "0 0 40px",
              }}
            >
              We built CODEWATCH for teams reviewing proprietary, production
              code. Security is not a feature. It is the architecture.
            </p>

            {/* Editorial pillar list */}
            <div>
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={reduced ? false : { opacity: 0, x: -16 }}
                  whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: reduced ? 0 : i * 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    position: "relative",
                    padding: "20px 0",
                    borderTop: i === 0 ? "0.5px solid var(--cw-bg-secondary)" : undefined,
                    borderBottom: "0.5px solid var(--cw-bg-secondary)",
                    overflow: "visible",
                  }}
                >
                  {/* Background number — purely decorative */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 80,
                      lineHeight: 1,
                      color: "var(--cw-ink-primary)",
                      opacity: 0.04,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Feature name + desc inline */}
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      lineHeight: 1.6,
                      position: "relative",
                      paddingLeft: 48,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        color: "var(--cw-ink-primary)",
                      }}
                    >
                      {p.title}
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                        color: "var(--cw-ink-tertiary)",
                        marginLeft: 8,
                      }}
                    >
                      {p.desc}
                    </span>
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: code panel ── */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "sticky",
              top: 120,
              alignSelf: "start",
              borderRadius: 12,
              overflow: "hidden",
              border: "0.5px solid var(--cw-bg-secondary)",
            }}
          >
            {/* Editor chrome */}
            <div
              style={{
                background: "#1c1c1c",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderBottom: "1px solid #2a2a2a",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", flexShrink: 0 }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e", flexShrink: 0 }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28ca42", flexShrink: 0 }} />
              <span
                style={{
                  marginLeft: 12,
                  fontSize: 11,
                  color: "#555550",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.05em",
                }}
              >
                review.ts — ephemeral
              </span>
            </div>

            {/* Code area */}
            <div
              style={{
                background: "#0f0f0f",
                padding: "24px 24px 20px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                lineHeight: 1.9,
              }}
            >
              {CODE_LINES.map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    ...(line.annotate
                      ? {
                          borderLeft: "2px solid var(--cw-ember)",
                          paddingLeft: 8,
                          marginLeft: -10,
                          background: "rgba(200,68,10,0.05)",
                        }
                      : {}),
                  }}
                >
                  <span
                    style={{
                      color: "#333",
                      width: 16,
                      textAlign: "right",
                      flexShrink: 0,
                      userSelect: "none",
                    }}
                  >
                    {line.n}
                  </span>
                  <span
                    style={{
                      paddingLeft: line.indent * 16,
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      {line.tokens.map((tok, j) => (
                        <span key={j} style={{ color: tok.c }}>
                          {tok.t}
                        </span>
                      ))}
                    </span>
                    {line.annotate && (
                      <span
                        style={{
                          fontSize: 9,
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--cw-ember)",
                          marginLeft: 16,
                          flexShrink: 0,
                        }}
                      >
                        EPHEMERAL PROCESS
                      </span>
                    )}
                  </span>
                </div>
              ))}

              {/* Flat badge pills */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: "0.5px solid #2a2a2a",
                }}
              >
                {["TLS 1.3", "AES-256", "GDPR"].map((pill) => (
                  <span
                    key={pill}
                    style={{
                      fontSize: 11,
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      color: "var(--cw-ink-secondary)",
                      background: "var(--cw-bg-secondary)",
                      borderRadius: 4,
                      padding: "4px 10px",
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
