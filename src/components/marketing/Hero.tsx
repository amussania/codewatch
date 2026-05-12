"use client";

import { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ── Terminal character-by-character reveal ── */
function TerminalLabel({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(timer); setDone(true); }
    }, 38);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="font-sans text-[#ff5b35] text-[10px] tracking-[.2em] uppercase">
      {displayed}
      {!done && (
        <span className="inline-block w-px h-[10px] bg-[#ff5b35] ml-0.5 align-middle animate-[blink_1s_step-end_infinite]" />
      )}
    </span>
  );
}

/* ── Word-by-word reveal ── */
function WordReveal({ words, delay = 0, className = "" }: { words: string[]; delay?: number; className?: string }) {
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={`inline-block ${className}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}{i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </>
  );
}

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
  { value: "41%",   label: "AI-generated code" },
  { value: "2.74×", label: "more vulnerabilities" },
  { value: "75%",   label: "silent failures" },
  { value: "< 2m",  label: "full panel review" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-16">
      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#e2e2ee 1px, transparent 1px), linear-gradient(90deg, #e2e2ee 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.28,
        }}
      />
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[560px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(255,91,53,0.06) 0%, transparent 68%)" }}
      />

      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-8 py-28">
        {/* Terminal eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center gap-0 mb-8"
        >
          <TerminalLabel text="— Multi-Specialist AI Code Review" />
        </motion.div>

        {/* Headline — word by word */}
        <h1
          className="font-heading leading-[.93] tracking-[.01em] mb-7"
          style={{ fontSize: "clamp(52px, 9vw, 110px)" }}
        >
          <div><WordReveal words={["The", "Senior", "Engineer"]} delay={0.4} /></div>
          <div><WordReveal words={["Your", "AI-Generated"]} delay={0.58} className="text-[#ff5b35]" /></div>
          <div><WordReveal words={["Code", "Has", "Never", "Had"]} delay={0.72} /></div>
        </h1>

        {/* Sub-copy — Fraunces italic */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.0 }}
          className="font-serif italic font-light text-[18px] text-[#3d4f6b] leading-[1.65] mb-10 max-w-[520px] mx-auto"
        >
          AI writes your code fast. CODEWATCH makes sure it&apos;s fit for production.
          Five specialists. Your business rules. The actual fixed code.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 1.12 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          <SpringButton>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-[#ff5b35] hover:bg-[#ff5b35]/90 text-white border-0 px-8 shadow-xl shadow-[#ff5b3530] text-[0.9rem] tracking-[.06em] rounded-[5px] font-sans"
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
                className="border border-[#d1d9e6] text-[#0a0f1e] hover:bg-[#f7f7fa] px-8 text-[0.9rem] tracking-[.06em] rounded-[5px] font-sans"
              >
                See How It Works
              </Button>
            </Link>
          </SpringButton>
        </motion.div>

        {/* Stats row — DM Mono */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.28, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e2e2ee] border border-[#e2e2ee] rounded-xl overflow-hidden max-w-2xl mx-auto"
        >
          {STATS.map((s) => (
            <div key={s.value} className="bg-white px-6 py-5 text-center">
              <div className="font-heading text-[42px] leading-none text-[#ff5b35]">{s.value}</div>
              <div className="font-sans text-[10px] text-[#8896ab] mt-1.5 tracking-[.08em] uppercase leading-snug">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
