"use client";

import { motion } from "framer-motion";

const ITEMS = [
  "Security Specialist",
  "Reliability Engineer",
  "Business Logic Reviewer",
  "Performance Engineer",
  "Quality Gatekeeper",
  "Fail-Safe Rewrite",
  "Humanisation Layer",
  "AI Origin Detection",
  "White-Label Reports",
  "Zero Code Retention",
];

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="border-t border-b border-white/8 overflow-hidden bg-white/[0.02] py-3.5">
      <motion.div
        className="flex w-max"
        style={{ gap: "3.5rem" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-2.5 whitespace-nowrap">
            <span className="text-[#ff6b6b] opacity-40 text-[5px]">◆</span>
            <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-white/35">
              {item}
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
