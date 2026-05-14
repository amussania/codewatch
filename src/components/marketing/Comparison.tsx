"use client";

import { motion } from "framer-motion";

type CellVal = true | false | "partial" | string;

const ROWS: {
  label: string;
  sub?: string;
  cw: CellVal;
  cr: CellVal;
  gr: CellVal;
  cp: CellVal;
  cd: CellVal;
}[] = [
  { label: "Business Logic Context",   sub: "YOUR RULES",  cw: true,             cr: false,      gr: false,      cp: false,      cd: false },
  { label: "Fail-Safe Rewrite",        sub: "FIXED CODE",  cw: true,             cr: false,      gr: false,      cp: false,      cd: false },
  { label: "Humanisation Layer",       sub: "EXCLUSIVE",   cw: true,             cr: false,      gr: false,      cp: false,      cd: false },
  { label: "AI Origin Probability",    sub: undefined,     cw: true,             cr: false,      gr: false,      cp: false,      cd: false },
  { label: "No Repo Connection",       sub: undefined,     cw: true,             cr: false,      gr: false,      cp: false,      cd: false },
  { label: "Multi-Specialist Panel",   sub: undefined,     cw: "5 specialists",  cr: "partial",  gr: "partial",  cp: "partial",  cd: "partial" },
  { label: "White-Label Reports",      sub: undefined,     cw: "Agency tier",    cr: false,      gr: false,      cp: false,      cd: false },
  { label: "Zero Code Retention",      sub: undefined,     cw: "Studio+",        cr: "partial",  gr: false,      cp: "partial",  cd: "partial" },
  { label: "Starting Price",           sub: undefined,     cw: "$12/mo",         cr: "$12/user", gr: "$30/seat", cp: "$10/mo",   cd: "$15/user" },
];

const COMPETITORS = ["CodeRabbit", "Greptile", "Copilot", "Codacy"];

// ─── Cell marks ───────────────────────────────────────────────────────────────

function CheckMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      style={{ display: "block", margin: "0 auto" }}
    >
      <path
        d="M3 9L7 13L15 5"
        stroke="var(--cw-signal-pass)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      style={{ display: "block", margin: "0 auto" }}
    >
      <path
        d="M5 5L13 13M13 5L5 13"
        stroke="var(--cw-ink-tertiary)"
        strokeOpacity={0.4}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PartialMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      style={{ display: "block", margin: "0 auto" }}
    >
      <line
        x1="5"
        y1="9"
        x2="13"
        y2="9"
        stroke="var(--cw-signal-warn)"
        strokeOpacity={0.7}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CellContent({ val, isCW }: { val: CellVal; isCW?: boolean }) {
  if (val === true)      return <CheckMark />;
  if (val === false)     return <CrossMark />;
  if (val === "partial") return <PartialMark />;
  if (isCW) {
    return (
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--cw-ember)",
        }}
      >
        {val}
      </span>
    );
  }
  return (
    <span
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        color: "var(--cw-ink-tertiary)",
      }}
    >
      {val}
    </span>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Comparison() {
  return (
    <section className="py-[140px]">
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
              Comparison
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
            How we stack up
            <br />
            <span style={{ color: "var(--cw-ember)" }}>against the market.</span>
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
            Every competitor does code review. Not one of them does what the market actually needs in 2026.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            borderRadius: 12,
            border: "0.5px solid var(--cw-bg-secondary)",
            overflow: "hidden",
            background: "var(--cw-bg-surface)",
          }}
        >
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse"
              style={{ minWidth: 680 }}
            >
              <thead>
                <tr style={{ borderBottom: "0.5px solid var(--cw-bg-secondary)" }}>
                  {/* Feature column header */}
                  <th
                    className="sticky left-0 z-10 text-left px-6 py-4 w-[220px]"
                    style={{ background: "var(--cw-bg-surface)" }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--cw-ink-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Feature
                    </span>
                  </th>
                  {/* CodeWatch header */}
                  <th
                    className="px-6 py-4 text-center"
                    style={{ background: "var(--cw-ember-light)" }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--cw-ember)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      CODEWATCH
                    </span>
                  </th>
                  {/* Competitor headers */}
                  {COMPETITORS.map((c) => (
                    <th
                      key={c}
                      className="px-6 py-4 text-center"
                      style={{ background: "var(--cw-bg-surface)" }}
                    >
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--cw-ink-tertiary)",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={i}
                    className="group cursor-default"
                    style={{
                      borderBottom: i < ROWS.length - 1 ? "0.5px solid var(--cw-bg-secondary)" : undefined,
                      background: i % 2 === 1 ? "var(--cw-bg-primary)" : "var(--cw-bg-surface)",
                      height: 56,
                    }}
                  >
                    {/* Feature name */}
                    <td
                      className="sticky left-0 z-10 px-6 py-4 w-[220px]"
                      style={{ background: "inherit" }}
                    >
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14,
                          fontWeight: 400,
                          color: "var(--cw-ink-primary)",
                        }}
                      >
                        {row.label}
                      </span>
                      {row.sub && (
                        <span
                          style={{
                            marginLeft: 8,
                            display: "inline-block",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 9,
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: "var(--cw-ember-light)",
                            color: "var(--cw-ember)",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            verticalAlign: "middle",
                          }}
                        >
                          {row.sub}
                        </span>
                      )}
                    </td>
                    {/* CodeWatch cell */}
                    <td
                      className="px-6 py-4 text-center"
                      style={{ background: "rgba(200,68,10,0.025)" }}
                    >
                      <CellContent val={row.cw} isCW />
                    </td>
                    {/* Competitor cells */}
                    <td className="px-6 py-4 text-center"><CellContent val={row.cr} /></td>
                    <td className="px-6 py-4 text-center"><CellContent val={row.gr} /></td>
                    <td className="px-6 py-4 text-center"><CellContent val={row.cp} /></td>
                    <td className="px-6 py-4 text-center"><CellContent val={row.cd} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
