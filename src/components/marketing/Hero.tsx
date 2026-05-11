"use client";

import { motion, useSpring } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroVisual from "./HeroVisual";

/* ── Character-by-character reveal ──────────────────────────── */
function CharReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={`inline-block overflow-hidden leading-none ${className}`}>
      <span className="inline-block">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: "0%",   opacity: 1 }}
            transition={{
              duration: 0.52,
              delay: delay + i * 0.022,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

/* ── Spring-powered CTA button wrapper ──────────────────────── */
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
  { value: "41%", label: "of all code is now AI-generated" },
  { value: "2.74×", label: "more security vulnerabilities in AI code" },
  { value: "75%", label: "of those vulnerabilities are silent" },
];

/* ── Hero ────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,123,232,0.06) 0%, transparent 70%)",
      }}
    >
      {/* Content grid */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">

        {/* ── Left: copy ── */}
        <div>
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-7 rounded-full border border-[#ff5b35]/25 bg-[#ff5b35]/8 text-[#ff5b35] text-xs font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5b35] animate-pulse" />
            Multi-Specialist AI Code Review · Business-Logic Aware
          </motion.div>

          {/* Headline */}
          <h1
            className="font-extrabold tracking-[-0.03em] leading-[1.08] mb-6"
            style={{ fontSize: "clamp(36px, 4.5vw, 58px)" }}
          >
            <div className="whitespace-nowrap">
              <CharReveal text="The Senior Engineer" delay={0.08} />
            </div>
            <div className="mt-1 whitespace-nowrap">
              <CharReveal
                text="Your AI-Generated"
                delay={0.32}
                className="text-[#ff5b35]"
              />
            </div>
            <div className="mt-1 whitespace-nowrap">
              <CharReveal text="Code Has Never Had" delay={0.58} />
            </div>
          </h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.55, delay: 0.88 }}
            className="text-[17px] text-[#3d4f6b] leading-[1.65] mb-9 max-w-[420px]"
          >
            AI writes your code fast. CODEWATCH makes sure it&apos;s fit for production.
            Five specialists. Your business rules. The actual fixed code.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.55, delay: 1.05 }}
            className="flex flex-wrap gap-3"
          >
            <SpringButton>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#ff5b35] hover:bg-[#ff5b35]/90 text-white border-0 px-7 shadow-xl shadow-[#ff5b3533] text-[0.95rem] font-semibold"
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
                  className="border-[1.5px] border-[#d1d9e6] text-[#0a0f1e] hover:bg-[#f8faff] px-7 text-[0.95rem]"
                >
                  See How It Works
                </Button>
              </Link>
            </SpringButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35 }}
            className="mt-10"
          >
            <p className="text-[10px] uppercase tracking-widest text-[#8896ab] mb-4 font-semibold">
              Why this matters right now
            </p>
            <div className="flex flex-wrap gap-6">
              {STATS.map((s) => (
                <div key={s.value}>
                  <span className="text-2xl font-extrabold text-[#0a0f1e] tracking-tight">{s.value}</span>
                  <p className="text-xs text-[#8896ab] mt-0.5 max-w-[120px] leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right: floating card ── */}
        <div className="flex justify-center lg:justify-end">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
