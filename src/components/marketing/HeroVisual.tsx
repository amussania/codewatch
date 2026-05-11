"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const SPECIALIST_SCORES = [
  { name: "Security", score: 31, color: "#00b85f" },
  { name: "Reliability", score: 58, color: "#4da3ff" },
  { name: "Business Logic", score: 22, color: "#00c4a0" },
  { name: "Performance", score: 67, color: "#fbbf24" },
  { name: "Quality", score: 54, color: "#c4b5fd" },
];

const ISSUES = [
  { dot: "#00b85f", label: "SQL injection in query builder", severity: "CRITICAL" },
  { dot: "#00b85f", label: "Hardcoded API key in source", severity: "CRITICAL" },
  { dot: "#fbbf24", label: "No timeout on external fetch", severity: "HIGH" },
  { dot: "#00c4a0", label: "GST rounding incorrect (18% rule)", severity: "LOGIC" },
];

export default function HeroVisual() {
  const tiltRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.0);
  const mouseY = useMotionValue(0.0);

  const springX = useSpring(mouseX, { stiffness: 260, damping: 26 });
  const springY = useSpring(mouseY, { stiffness: 260, damping: 26 });

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
      {/* Ambient glows — visible on white bg */}
      <div className="absolute -inset-10 rounded-full bg-[#00b85f] opacity-[0.12] blur-3xl pointer-events-none" />
      <div className="absolute -inset-10 rounded-full bg-[#1a7be8] opacity-[0.08] blur-3xl pointer-events-none translate-x-10 translate-y-4" />

      {/* Floating chips */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.4 }}
        className="absolute -top-4 -right-6 bg-[#00c4a0]/10 border border-[#00c4a0]/30 text-[#00c4a0] text-[11px] font-semibold px-3 py-1.5 rounded-full z-10 whitespace-nowrap"
      >
        ✓ 4 Critical Issues Fixed
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.9, duration: 0.4 }}
        className="absolute -bottom-4 -left-6 bg-[#4da3ff]/10 border border-[#4da3ff]/30 text-[#4da3ff] text-[11px] font-semibold px-3 py-1.5 rounded-full z-10 whitespace-nowrap"
      >
        Human Score: 91%
      </motion.div>

      <div style={{ perspective: 1100 }}>
        <motion.div
          animate={{ y: [0, -11, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            ref={tiltRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-[390px] rounded-2xl border border-[#e2e2ee] bg-[var(--cw-surface)] shadow-2xl overflow-hidden"
          >
            {/* Window chrome */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2e2ee] bg-[var(--cw-surface-elevated)]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {["#ff5f57","#ffbd2e","#28c840"].map((c) => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">production-clearance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#00b85f] bg-[#00b85f]/10 border border-[#00b85f]/20 px-2 py-0.5 rounded">
                  HIGH RISK
                </span>
              </div>
            </div>

            {/* Master score + title */}
            <div className="flex items-center gap-4 px-4 pt-4 pb-3">
              <div className="shrink-0 relative">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#e2e2ee" strokeWidth="5" />
                  <motion.circle
                    cx="32" cy="32" r="26"
                    fill="none"
                    stroke="#00b85f"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - 42 / 100) }}
                    transition={{ duration: 1.4, delay: 0.8, ease: "easeOut" }}
                    transform="rotate(-90 32 32)"
                  />
                  <text x="32" y="36" textAnchor="middle" fill="#00b85f" fontSize="14" fontWeight="700" fontFamily="monospace">
                    42
                  </text>
                </svg>
                <p className="text-[8px] text-muted-foreground text-center mt-0.5 font-mono tracking-wider">MASTER</p>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground/80 mb-2.5">Production Clearance Review</p>
                <div className="space-y-1.5">
                  {SPECIALIST_SCORES.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <span className="text-[9px] text-muted-foreground w-[80px] truncate">{s.name}</span>
                      <div className="flex-1 h-1 rounded-full bg-[#e6e6f2] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: s.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${s.score}%` }}
                          transition={{ duration: 0.8, delay: 0.9 + i * 0.08, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[9px] font-mono w-5 text-right" style={{ color: s.color }}>{s.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Issues */}
            <div className="px-4 pb-3 space-y-1.5">
              {ISSUES.map((issue, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.09, type: "spring", stiffness: 320, damping: 26 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#f7f7fa] border border-[#e2e2ee]"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: issue.dot, boxShadow: `0 0 5px ${issue.dot}88` }}
                  />
                  <span className="text-[11px] text-[#4a4a6a] flex-1 truncate">{issue.label}</span>
                  <span
                    className="text-[9px] font-bold shrink-0 px-1.5 py-0.5 rounded"
                    style={{ color: issue.dot, backgroundColor: `${issue.dot}15` }}
                  >
                    {issue.severity}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Mini metrics */}
            <div className="px-4 pb-4 grid grid-cols-3 gap-2">
              {[
                { label: "AI Origin", value: "82%", color: "#fbbf24" },
                { label: "Issues Found", value: "10", color: "#00b85f" },
                { label: "Rewrite", value: "Ready", color: "#00c4a0" },
              ].map((m) => (
                <div key={m.label} className="rounded-lg bg-[#f2f2f8] border border-[#e2e2ee] px-2 py-1.5 text-center">
                  <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                  <p className="text-[9px] text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
