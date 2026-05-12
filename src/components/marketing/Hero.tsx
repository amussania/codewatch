"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";

// ─── Data ──────────────────────────────────────────────────────────────────

type Severity = "CRITICAL" | "HIGH" | "MEDIUM";

interface Finding {
  line: number;
  severity: Severity;
  text: string;
}

interface Specialist {
  id: string;
  name: string;
  accent: string;
  findings: Finding[];
}

const SPECIALISTS: Specialist[] = [
  {
    id: "security",
    name: "Security Analyst",
    accent: "#C8440A",
    findings: [
      { line: 1, severity: "CRITICAL", text: "No auth check before payment" },
      { line: 5, severity: "HIGH",     text: "Unvalidated userId — injection risk" },
    ],
  },
  {
    id: "reliability",
    name: "Reliability Engineer",
    accent: "#2060A0",
    findings: [
      { line: 5, severity: "HIGH",   text: "No error handling on db.findById()" },
      { line: 7, severity: "MEDIUM", text: "Missing rollback on stripe failure" },
    ],
  },
  {
    id: "logic",
    name: "Business Logic",
    accent: "#B07A20",
    findings: [
      { line: 2, severity: "MEDIUM", text: "Zero/negative amount passes unchecked" },
      { line: 8, severity: "HIGH",   text: "Currency hardcoded — multi-region break" },
    ],
  },
];

const SEV: Record<Severity, { bg: string; fg: string }> = {
  CRITICAL: { bg: "rgba(200,68,10,0.15)",  fg: "#C8440A" },
  HIGH:     { bg: "rgba(123,42,26,0.15)",  fg: "#7B2A1A" },
  MEDIUM:   { bg: "rgba(176,122,32,0.15)", fg: "#B07A20" },
};

const CODE: { n: number; t: string }[] = [
  { n: 1,  t: "async function processPayment(" },
  { n: 2,  t: "  amount: number," },
  { n: 3,  t: "  userId: string" },
  { n: 4,  t: ") {" },
  { n: 5,  t: "  const user = await db.users" },
  { n: 6,  t: "    .findById(userId);" },
  { n: 7,  t: "  await stripe.charge({" },
  { n: 8,  t: "    amount, currency: 'usd'" },
  { n: 9,  t: "  }, user.stripeId);" },
  { n: 10, t: "}" },
];

// ─── Dashed vertical lines background ─────────────────────────────────────

function DashedLines() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="cw-vdash" x="0" y="0" width="88" height="20" patternUnits="userSpaceOnUse">
            <line x1="0.5" y1="0" x2="0.5" y2="8" stroke="rgba(140,133,128,0.2)" strokeWidth="1" />
          </pattern>
          <linearGradient id="cw-fade-y" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="0" />
            <stop offset="20%"  stopColor="white" stopOpacity="1" />
            <stop offset="80%"  stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="cw-vmask">
            <rect width="100%" height="100%" fill="url(#cw-fade-y)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#cw-vdash)" mask="url(#cw-vmask)" />
      </svg>
      {/* side vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, var(--cw-bg-primary) 0%, transparent 10%, transparent 90%, var(--cw-bg-primary) 100%)",
        }}
      />
    </div>
  );
}

// ─── CTA button — Meridian sliding-text + ripple ───────────────────────────

function CtaButton({
  href,
  children,
  primary = false,
  reduced,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  reduced: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const active = hovered && !reduced;

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center justify-center overflow-hidden rounded-xl select-none font-semibold text-[15px] px-7"
      style={{
        height: "48px",
        ...(primary
          ? {
              background: "var(--cw-ember)",
              color: "#FDFAF7",
              boxShadow: active
                ? "0 8px 28px rgba(200,68,10,0.40)"
                : "0 4px 16px rgba(200,68,10,0.24)",
              transition: "box-shadow 0.2s ease",
            }
          : {
              background: "transparent",
              color: "var(--cw-ink-primary)",
              border: "1px solid rgba(26,23,20,0.16)",
            }),
      }}
    >
      {/* Ripple fill on hover */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-xl"
        style={{
          background: primary ? "rgba(255,255,255,0.12)" : "var(--cw-bg-secondary)",
          transformOrigin: "center",
        }}
        animate={{ scale: active ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.1, 0, 0.3, 1] }}
      />
      {/* Sliding text — primary slides up, duplicate slides in from below */}
      <span
        className="relative"
        style={{ display: "block", height: "1.3em", lineHeight: "1.3em", overflow: "hidden" }}
      >
        <motion.span
          style={{ display: "flex", flexDirection: "column" }}
          animate={{ y: active ? "-50%" : "0%" }}
          transition={{ duration: 0.28, ease: [0.1, 0, 0.3, 1] }}
        >
          <span style={{ display: "block" }}>{children}</span>
          <span style={{ display: "block" }} aria-hidden>{children}</span>
        </motion.span>
      </span>
    </Link>
  );
}

// ─── Live code review panel ────────────────────────────────────────────────

function CodeReviewPanel({ reduced }: { reduced: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const spec = SPECIALISTS[activeIdx];

    if (reduced) {
      setShown(spec.findings.length);
      return;
    }

    // shown is already 0 (batched with activeIdx change in the cycle timer)
    const STAGGER = 800;
    const PAUSE = 1600;
    const timers: ReturnType<typeof setTimeout>[] = [];

    spec.findings.forEach((_, i) => {
      timers.push(setTimeout(() => setShown(i + 1), 600 + i * STAGGER));
    });

    const total = 600 + (spec.findings.length - 1) * STAGGER + PAUSE;
    timers.push(
      setTimeout(() => {
        // Batch both resets — single re-render, shown=0 when new spec mounts
        setShown(0);
        setActiveIdx((prev) => (prev + 1) % SPECIALISTS.length);
      }, total)
    );

    return () => timers.forEach(clearTimeout);
  }, [activeIdx, reduced]);

  const spec = SPECIALISTS[activeIdx];
  const highlightedLines = new Set(spec.findings.map((f) => f.line));

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "#1A1714",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 40px 80px rgba(26,23,20,0.30), 0 0 0 1px rgba(255,255,255,0.04)",
        fontFamily: "var(--font-code, monospace)",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.025)",
        }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
        <span className="ml-3 text-[11px]" style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.02em" }}>
          processPayment.ts
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <motion.span
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: "#28C840" }}
            animate={reduced ? {} : { opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.28)" }}>
            reviewing
          </span>
        </span>
      </div>

      {/* Code */}
      <div className="py-2" style={{ fontSize: "12.5px", lineHeight: "1.65" }}>
        {CODE.map(({ n, t }) => {
          const lit = highlightedLines.has(n);
          return (
            <div
              key={n}
              className="flex items-stretch px-4 py-px"
              style={{
                background: lit ? "rgba(255,255,255,0.045)" : "transparent",
                borderLeft: lit ? `2px solid ${spec.accent}` : "2px solid transparent",
                transition: "background 0.4s ease, border-left-color 0.4s ease",
              }}
            >
              <span
                className="w-6 shrink-0 text-right mr-4 tabular-nums"
                style={{
                  color: lit ? spec.accent : "rgba(255,255,255,0.16)",
                  transition: "color 0.4s ease",
                }}
              >
                {n}
              </span>
              <span
                style={{
                  color: lit ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.38)",
                  transition: "color 0.4s ease",
                }}
              >
                {t}
              </span>
            </div>
          );
        })}
      </div>

      {/* Findings panel */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px 16px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
          >
            {/* Specialist badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[.1em]"
                style={{
                  background: `${spec.accent}22`,
                  color: spec.accent,
                  border: `1px solid ${spec.accent}40`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: spec.accent }} />
                {spec.name}
              </span>
            </div>

            {/* Findings */}
            <div className="space-y-2">
              {spec.findings.map((finding, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2.5"
                  style={{ fontSize: "11.5px" }}
                  initial={reduced ? false : { opacity: 0, x: -10 }}
                  animate={i < shown ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span
                    className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mt-0.5"
                    style={{ background: SEV[finding.severity].bg, color: SEV[finding.severity].fg }}
                  >
                    {finding.severity}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.58)", lineHeight: "1.45" }}>
                    {finding.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Summary footer */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.14)" }}
      >
        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.22)" }}>
          4 issues detected across 3 specialists
        </span>
        <span className="text-[10px] font-semibold" style={{ color: "#C8440A" }}>
          1 critical · 2 high · 1 medium
        </span>
      </div>
    </div>
  );
}

// ─── Headline clip-path word reveal ────────────────────────────────────────

const HEADLINE_LINES = [
  ["Your", "code", "doesn't", "break"],
  ["in", "the", "IDE."],
  ["It", "breaks", "in", "production."],
];

const HEADLINE_WORDS = HEADLINE_LINES.map((line, li) => {
  const start = HEADLINE_LINES.slice(0, li).reduce((s, l) => s + l.length, 0);
  return line.map((word, wi) => ({ word, idx: start + wi }));
});

function ClipWord({ word, delay, reduced }: { word: string; delay: number; reduced: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        paddingBottom: "0.12em",
        marginBottom: "-0.12em",
        verticalAlign: "bottom",
      }}
    >
      <motion.span
        style={{ display: "inline-block" }}
        initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }
        }
      >
        {word}
      </motion.span>
    </span>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

export default function Hero() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden pt-16"
      style={{ background: "var(--cw-bg-primary)" }}
    >
      <DashedLines />

      {/* Ember ambient — top left */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 5% 5%, rgba(200,68,10,0.11) 0%, transparent 70%)",
        }}
      />

      {/* Two-column layout */}
      <div className="relative z-10 max-w-[1120px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center min-h-[calc(100svh-4rem)] gap-12 lg:gap-16 py-20 lg:py-0">

        {/* ── Left: text ── */}
        <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left w-full">

          {/* Label pill */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-[.16em] select-none"
              style={{
                border: "1px solid rgba(200,68,10,0.22)",
                background: "rgba(200,68,10,0.06)",
                color: "var(--cw-ember)",
              }}
            >
              <span className="block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--cw-ember)" }} />
              AI Code Review · Open Beta
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            className="font-heading italic leading-[1.08] tracking-[-0.03em] mb-7"
            style={{ fontSize: "var(--type-hero)", color: "var(--cw-ink-primary)" }}
          >
            {HEADLINE_WORDS.map((line, li) => (
              <div key={li} className="flex flex-wrap justify-center lg:justify-start gap-x-[0.22em]">
                {line.map(({ word, idx }) => (
                  <ClipWord key={idx} word={word} delay={0.18 + idx * 0.055} reduced={reduced} />
                ))}
              </div>
            ))}
          </h1>

          {/* Sub-headline */}
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-[17px] leading-[1.72] mb-10 max-w-[440px]"
            style={{ color: "var(--cw-ink-secondary)" }}
          >
            Five specialist AI reviewers catch what your tools miss —
            vulnerabilities, reliability gaps, and logic errors —
            before they reach production.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.5, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-7"
          >
            <CtaButton href="/signup" primary reduced={reduced}>
              Get started free →
            </CtaButton>
            <CtaButton href="#how-it-works" reduced={reduced}>
              Watch it review code ▶
            </CtaButton>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.7, ease: "easeOut" }}
            className="text-[12px] tracking-[0.02em]"
            style={{ color: "var(--cw-ink-tertiary)" }}
          >
            No credit card required&nbsp;&nbsp;·&nbsp;&nbsp;Works with any AI-generated code
          </motion.p>
        </div>

        {/* ── Right: live code review panel ── */}
        <motion.div
          className="hidden md:block w-full lg:w-[460px] xl:w-[500px] shrink-0"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <CodeReviewPanel reduced={reduced} />
        </motion.div>
      </div>
    </section>
  );
}
