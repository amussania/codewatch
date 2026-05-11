"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ScoreRing from "@/components/dashboard/ScoreRing";

/* ── Syntax-highlighted tokens ──────────────────────────────── */
type Token = { t: string; c: string };
const KW = "#7dd3fc"; // keyword
const TY = "#fda4af"; // type
const MO = "#c4b5fd"; // method
const NU = "#fbbf24"; // number
const PU = "#64748b"; // punctuation
const ID = "#e2e8f0"; // identifier
const KN = "#7dd3fc"; // null/await/return

const CODE_TOKENS: Token[][] = [
  [{ t:"async ", c:KW },{ t:"function ", c:KW },{ t:"authenticate", c:ID },{ t:"(", c:PU },{ t:"token", c:TY },{ t:": ", c:PU },{ t:"string", c:KW },{ t:") {", c:PU }],
  [{ t:"  const ", c:KW },{ t:"hash ", c:ID },{ t:"= ", c:PU },{ t:"await ", c:KN },{ t:"bcrypt.", c:ID },{ t:"hash", c:MO },{ t:"(token, ", c:PU },{ t:"12", c:NU },{ t:")", c:PU }],
  [{ t:"  const ", c:KW },{ t:"user ", c:ID },{ t:"= ", c:PU },{ t:"await ", c:KN },{ t:"db.users.", c:ID },{ t:"findOne", c:MO },{ t:"({ hash })", c:PU }],
  [{ t:"  return ", c:KW },{ t:"user ", c:ID },{ t:"?? ", c:PU },{ t:"null", c:KN }],
  [{ t:"}", c:PU }],
];

const ISSUES = [
  { dot: "#ff6b6b", label: "Timing attack on token compare" },
  { dot: "#f59e0b", label: "Missing rate limiting on /auth" },
  { dot: "#4a9fff", label: "Add explicit return types", fixed: true },
];

/* ── Component ───────────────────────────────────────────────── */
export default function HeroVisual() {
  const tiltRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.0);
  const mouseY = useMotionValue(0.0);

  /* Springs on normalised [-0.5, 0.5] values */
  const springX = useSpring(mouseX, { stiffness: 260, damping: 26 });
  const springY = useSpring(mouseY, { stiffness: 260, damping: 26 });

  /* Map to rotation degrees */
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!tiltRef.current) return;
    const r = tiltRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width  - 0.5);
    mouseY.set((e.clientY - r.top)  / r.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.94 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative select-none"
    >
      {/* Ambient coral glow */}
      <div className="absolute -inset-10 rounded-full bg-[#ff6b6b] opacity-[0.07] blur-3xl pointer-events-none" />
      {/* Ambient blue glow */}
      <div className="absolute -inset-10 rounded-full bg-[#4a9fff] opacity-[0.05] blur-3xl pointer-events-none translate-x-10 translate-y-4" />

      {/* Perspective wrapper is OUTSIDE the bob so they don't compound */}
      <div style={{ perspective: 1100 }}>
        {/* Floating bob — only translates Y, no 3-D transform */}
        <motion.div
          animate={{ y: [0, -11, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Tilt target */}
          <motion.div
            ref={tiltRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-[390px] rounded-2xl border border-white/10 bg-[var(--cw-surface)] shadow-2xl overflow-hidden"
          >
            {/* ── Window chrome ── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[var(--cw-surface-elevated)]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {["#ff5f57","#ffbd2e","#28c840"].map((c) => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">auth.service.ts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b] animate-pulse" />
                <span className="text-[11px] text-muted-foreground">AI Review</span>
              </div>
            </div>

            {/* ── Score ring + code ── */}
            <div className="flex items-start gap-4 p-4">
              <div className="shrink-0 pt-0.5">
                <ScoreRing score={87} size={74} strokeWidth={5} />
              </div>

              {/* Syntax-highlighted code */}
              <div className="flex-1 overflow-hidden font-mono text-[11px] leading-[1.65]">
                {CODE_TOKENS.map((line, li) => (
                  <motion.div
                    key={li}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + li * 0.07, duration: 0.3 }}
                    className="flex whitespace-pre"
                  >
                    <span className="text-white/20 w-4 text-right mr-3 shrink-0">{li + 1}</span>
                    <span>
                      {line.map((tok, ti) => (
                        <span key={ti} style={{ color: tok.c }}>{tok.t}</span>
                      ))}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Issue list ── */}
            <div className="px-4 pb-4 space-y-1.5">
              {ISSUES.map((issue, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.15 + i * 0.1, type: "spring", stiffness: 320, damping: 26 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]"
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: issue.dot, boxShadow: `0 0 6px ${issue.dot}88` }}
                  />
                  <span className="text-[11px] text-white/60 flex-1 truncate">{issue.label}</span>
                  {issue.fixed && (
                    <span className="text-[10px] text-emerald-400 font-medium shrink-0">Fixed ✓</span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* ── Specialist badge ── */}
            <div className="px-4 pb-4 flex items-center gap-2">
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-[10px] text-white/30 font-mono">security specialist · gpt-4o</span>
              <div className="flex-1 h-px bg-white/6" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
