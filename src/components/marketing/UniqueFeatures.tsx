"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    pill: "UNIQUE",
    name: "Business Logic Context",
    body: "Every other tool is domain-blind. They review code in a vacuum. They can tell you the code is syntactically valid. They cannot tell you it is logically wrong for your business. CODEWATCH is the only tool where you describe your business rules — currency, fee structures, user roles, state transitions — and the AI validates code against those exact rules.",
    quote: "Not generic patterns. Your rules.",
  },
  {
    pill: "UNIQUE",
    name: "AI Origin Probability",
    body: "41% of global code is now AI-generated. App stores are rejecting vibe-coded apps. Enterprise teams are setting quality gates. CODEWATCH scores every review with a 0–100% probability that the submitted code was AI-generated, based on structural tells: overly symmetric error handling, missing edge cases, no evidence of iteration, generic naming patterns.",
    quote: "Set a threshold per project. Flag anything above 80% before it goes to production.",
  },
  {
    pill: "EXCLUSIVE",
    name: "Humanisation Layer",
    body: "No competitor has any concept of this. After the fail-safe rewrite, run the Humanisation Layer. It applies real human engineering fingerprints: variable naming drift, WHY comments referencing specific decisions and incidents, intentional TODOs a real developer would leave, asymmetric error handling. The code remains 100% functionally identical.",
    quote: "It reads like it was built by an experienced team over six months.",
  },
  {
    pill: "EXCLUSIVE",
    name: "Fail-Safe Rewrite",
    body: "Every other tool gives you a to-do list. CODEWATCH gives you the fixed code. The fail-safe rewrite keeps the same behaviour on the happy path and hardens everything else: explicit error propagation, environment variables replacing hardcoded secrets, timeouts on every external call, input validation, null guards, logging at critical decision points.",
    quote: "You take the rewritten code, paste it back, ship it.",
  },
  {
    pill: "ONLY US",
    name: "No Git Setup Required",
    body: "Every major competitor requires connecting a repository. CODEWATCH works with a paste. A freelancer reviewing client code. A non-technical founder checking what their developer sent. A consultant auditing legacy code with no Git access. All of them can use CODEWATCH in thirty seconds. No OAuth. No permissions. No setup.",
    quote: "Paste code. Get a review. Thirty seconds. No configuration.",
  },
];

// ─── Chevron ──────────────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ flexShrink: 0 }}
    >
      <path
        d="M3 6L8 11L13 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function UniqueFeatures() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-[140px] max-w-[1120px] mx-auto px-6 lg:px-12">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center mb-16"
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
            What Nobody Else Does
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
          The gaps every
          <br />
          <span style={{ color: "var(--cw-ember)" }}>competitor leaves open.</span>
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
          Every competitor catches syntax errors and common patterns. These capabilities exist nowhere else in the market.
        </p>
      </motion.div>

      {/* Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          borderRadius: 12,
          border: "0.5px solid var(--cw-bg-secondary)",
          overflow: "hidden",
        }}
      >
        {FEATURES.map((f, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className={i < FEATURES.length - 1 ? "border-b" : ""}
              style={{
                borderColor: "var(--cw-bg-secondary)",
                borderLeft: `3px solid ${isOpen ? "var(--cw-ember)" : "transparent"}`,
                backgroundColor: isOpen ? "var(--cw-bg-surface)" : "var(--cw-bg-primary)",
                transition: "background-color 200ms ease, border-color 200ms ease",
              }}
            >
              {/* Header row */}
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-4 px-6 py-6 text-left"
                style={{
                  cursor: "pointer",
                  color: isOpen ? "var(--cw-ember)" : "var(--cw-ink-tertiary)",
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    (e.currentTarget as HTMLButtonElement).parentElement!.style.backgroundColor =
                      "var(--cw-bg-secondary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) {
                    (e.currentTarget as HTMLButtonElement).parentElement!.style.backgroundColor =
                      "var(--cw-bg-primary)";
                  }
                }}
              >
                {/* Left: pill + name */}
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <span
                    style={{
                      display: "inline-block",
                      width: "fit-content",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: "var(--cw-ember-light)",
                      color: "var(--cw-ember)",
                    }}
                  >
                    {f.pill}
                  </span>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      color: isOpen ? "var(--cw-ember)" : "var(--cw-ink-primary)",
                      transition: "color 200ms ease",
                      lineHeight: 1.3,
                    }}
                  >
                    {f.name}
                  </span>
                </div>

                {/* Right: chevron */}
                <Chevron open={isOpen} />
              </button>

              {/* Expandable content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-7 pt-0">
                      <p
                        style={{
                          fontSize: 15,
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 400,
                          color: "var(--cw-ink-secondary)",
                          lineHeight: 1.7,
                          marginBottom: 16,
                        }}
                      >
                        {f.body}
                      </p>
                      <blockquote
                        style={{
                          paddingLeft: 16,
                          borderLeft: "3px solid var(--cw-ember)",
                          margin: 0,
                        }}
                      >
                        <p
                          className="font-heading italic"
                          style={{
                            fontSize: 16,
                            color: "var(--cw-ink-secondary)",
                            lineHeight: 1.6,
                          }}
                        >
                          {f.quote}
                        </p>
                      </blockquote>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

    </section>
  );
}
