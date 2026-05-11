"use client";

import dynamic from "next/dynamic";
import { motion, useSpring } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroVisual from "./HeroVisual";
import NoiseOverlay from "@/components/shared/NoiseOverlay";

const ThreeBackground = dynamic(() => import("./ThreeBackground"), { ssr: false });

/* ── Character-by-character reveal ──────────────────────────── */
function CharReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    /* overflow-hidden clips characters as they slide up from y:"100%" */
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Three.js canvas — absolute, behind everything */}
      <ThreeBackground />

      {/* Grain */}
      <NoiseOverlay />

      {/* Radial vignette — darkens edges */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, oklch(0.08 0.028 258 / 0.85) 100%)",
        }}
      />

      {/* Content grid */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">

        {/* ── Left: copy ── */}
        <div>
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-7 rounded-full border border-[#ff6b6b]/30 bg-[#ff6b6b]/10 text-[#ff6b6b] text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b] animate-pulse" />
            Multi-Specialist AI Code Review · Business-Logic Aware
          </motion.div>

          {/* Headline */}
          <h1 className="font-bold tracking-tight text-5xl lg:text-[3.6rem] leading-[1.08] mb-6">
            <div>
              <CharReveal text="The Senior Engineer" delay={0.08} />
            </div>
            <div className="mt-1">
              <CharReveal
                text="Your AI-Generated"
                delay={0.32}
                className="text-[#ff6b6b]"
              />
            </div>
            <div className="mt-1">
              <CharReveal text="Code Has Never Had" delay={0.58} />
            </div>
          </h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.55, delay: 0.88 }}
            className="text-[1.05rem] text-muted-foreground leading-relaxed mb-9 max-w-[420px]"
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
                  className="bg-[#ff6b6b] hover:bg-[#ff6b6b]/90 text-white border-0 px-7 shadow-xl shadow-[#ff6b6b44] text-[0.95rem]"
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
                  className="border-white/12 text-foreground hover:bg-white/6 px-7 text-[0.95rem]"
                >
                  See How It Works
                </Button>
              </Link>
            </SpringButton>
          </motion.div>

          {/* Why this matters now */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35 }}
            className="mt-10"
          >
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-4 font-semibold">
              Why this matters right now
            </p>
            <div className="flex flex-wrap gap-6">
              {STATS.map((s) => (
                <div key={s.value}>
                  <span className="text-2xl font-bold text-foreground">{s.value}</span>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-[120px] leading-snug">{s.label}</p>
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
