"use client";

import { motion, useSpring } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function SpringButton({ children }: { children: React.ReactNode }) {
  const scale = useSpring(1, { stiffness: 500, damping: 28 });
  const y     = useSpring(0, { stiffness: 500, damping: 28 });
  return (
    <motion.div
      style={{ scale, y }}
      onHoverStart={() => { scale.set(1.045); y.set(-2); }}
      onHoverEnd={()  => { scale.set(1);     y.set(0);  }}
      onTapStart={() => { scale.set(0.97);   y.set(0);  }}
    >
      {children}
    </motion.div>
  );
}

const STATS = [
  { value: "41%",   label: "of all code is now AI-generated" },
  { value: "2.74×", label: "more vulnerabilities in AI code" },
  { value: "75%",   label: "of vulnerabilities are silent" },
  { value: "< 2m",  label: "Full panel review time" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-16">
      {/* Grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#e2e2ee 1px, transparent 1px), linear-gradient(90deg, #e2e2ee 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.3,
        }}
      />
      {/* Top radial glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[560px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(255,91,53,0.07) 0%, transparent 68%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 py-28">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span className="block w-6 h-px bg-[#ff5b35]" />
          <span className="text-[#ff5b35] text-[10px] tracking-[.2em] uppercase">
            Multi-Specialist AI Code Review
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading leading-[.93] tracking-[.01em] mb-7"
          style={{ fontSize: "clamp(52px, 9vw, 110px)" }}
        >
          The Senior Engineer
          <br />
          <span className="text-[#ff5b35]">Your AI-Generated</span>
          <br />
          Code Has Never Had
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="font-serif italic font-light text-[18px] text-[#3d4f6b] leading-[1.65] mb-10 max-w-[520px] mx-auto"
        >
          AI writes your code fast. CODEWATCH makes sure it&apos;s fit for production.
          Five specialists. Your business rules. The actual fixed code.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.46 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          <SpringButton>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-[#ff5b35] hover:bg-[#ff5b35]/90 text-white border-0 px-8 shadow-xl shadow-[#ff5b3530] text-[0.95rem] tracking-[.06em] rounded-[5px]"
              >
                Get 10 Free Reviews →
              </Button>
            </Link>
          </SpringButton>
          <SpringButton>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="border border-[#d1d9e6] text-[#0a0f1e] hover:bg-[#f7f7fa] px-8 text-[0.95rem] tracking-[.06em] rounded-[5px]"
              >
                See How It Works
              </Button>
            </Link>
          </SpringButton>
        </motion.div>

        {/* Stats row — 1px border grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e2e2ee] border border-[#e2e2ee] rounded-xl overflow-hidden max-w-2xl mx-auto"
        >
          {STATS.map((s) => (
            <div key={s.value} className="bg-white px-6 py-5 text-center">
              <div className="font-heading text-[42px] leading-none text-[#ff5b35]">{s.value}</div>
              <div className="text-[11px] text-[#8896ab] mt-1 leading-snug">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
