"use client";

import { useRef, useEffect, useCallback, useState, type MutableRefObject } from "react";
import { motion, useSpring, useScroll, useTransform, useInView, type MotionValue } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ── Interactive dot grid ───────────────────────────────────────────────
function DotGrid({ mouseRef }: { mouseRef: MutableRefObject<{ x: number; y: number }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SPACING = 36;
    const RADIUS = 1.5;
    const INFLUENCE = 150;
    const SPRING_K = 0.055;
    const DAMPING = 0.78;
    const STRENGTH = 20;

    type Dot = { x: number; y: number; ox: number; oy: number; vx: number; vy: number };
    let dots: Dot[] = [];
    let logW = 0;
    let logH = 0;
    let animId = 0;

    const build = (w: number, h: number) => {
      dots = [];
      const cols = Math.ceil(w / SPACING) + 2;
      const rows = Math.ceil(h / SPACING) + 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c * SPACING - SPACING * 0.5;
          const oy = r * SPACING - SPACING * 0.5;
          dots.push({ x: ox, y: oy, ox, oy, vx: 0, vy: 0 });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, logW, logH);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const d of dots) {
        const dx = mx - d.ox;
        const dy = my - d.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INFLUENCE && dist > 0) {
          const force = ((INFLUENCE - dist) / INFLUENCE) ** 2;
          d.vx += (dx / dist) * force * STRENGTH * 0.12;
          d.vy += (dy / dist) * force * STRENGTH * 0.12;
        }

        d.vx += (d.ox - d.x) * SPRING_K;
        d.vy += (d.oy - d.y) * SPRING_K;
        d.vx *= DAMPING;
        d.vy *= DAMPING;
        d.x += d.vx;
        d.y += d.vy;

        ctx.beginPath();
        ctx.arc(d.x, d.y, RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(150, 140, 128, 0.38)";
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      logW = width;
      logH = height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      build(width, height);
    });

    ro.observe(canvas);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [mouseRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ── Word reveal with optional scroll colour ────────────────────────────
function WordReveal({
  words,
  delay = 0,
  scrollColor,
  coral,
}: {
  words: string[];
  delay?: number;
  scrollColor?: MotionValue<string>;
  coral?: boolean;
}) {
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: delay + i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={coral ? { color: "#ff5b35" } : scrollColor ? { color: scrollColor } : undefined}
        >
          {word}{i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </>
  );
}

// ── Count-up stat ──────────────────────────────────────────────────────
function CountUp({ target, suffix, decimals, trigger }: { target: number; suffix: string; decimals: number; trigger: boolean }) {
  const [display, setDisplay] = useState("0" + suffix);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!trigger) return;
    const startTime = performance.now();
    const duration = 1500;

    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      setDisplay((decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toString()) + suffix);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, target, suffix, decimals]);

  return <>{display}</>;
}

// ── Spring button ──────────────────────────────────────────────────────
function SpringButton({ children }: { children: React.ReactNode }) {
  const scale = useSpring(1, { stiffness: 500, damping: 28 });
  const y = useSpring(0, { stiffness: 500, damping: 28 });
  return (
    <motion.div
      style={{ scale, y }}
      onHoverStart={() => { scale.set(1.045); y.set(-2); }}
      onHoverEnd={() => { scale.set(1); y.set(0); }}
      onTapStart={() => { scale.set(0.97); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

// ── Stats ──────────────────────────────────────────────────────────────
const STATS = [
  { value: "41%",  target: 41,   suffix: "%", decimals: 0, label: "of all code is now AI-generated" },
  { value: "2.74×", target: 2.74, suffix: "×", decimals: 2, label: "more vulnerabilities in AI code" },
  { value: "75%",  target: 75,   suffix: "%", decimals: 0, label: "of vulnerabilities are silent" },
  { value: "< 2m", target: null, suffix: "",  decimals: 0, label: "Full panel review time" },
] as const;

function StatCard({ stat }: { stat: typeof STATS[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-white px-6 py-5 text-center">
      <div className="font-heading text-[42px] leading-none text-[#ff5b35]">
        {stat.target !== null ? (
          <CountUp target={stat.target} suffix={stat.suffix} decimals={stat.decimals} trigger={isInView} />
        ) : (
          stat.value
        )}
      </div>
      <div className="text-[11px] text-[#999990] mt-1 leading-snug">{stat.label}</div>
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────
export default function Hero() {
  const heroMouseRef = useRef({ x: -9999, y: -9999 });
  const { scrollY } = useScroll();
  const headlineColor = useTransform(scrollY, [0, 280], ["#c8c8c0", "#0d0d0d"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    heroMouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    heroMouseRef.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-16"
      style={{ background: "#f5f4f0" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated dot grid */}
      <DotGrid mouseRef={heroMouseRef} />

      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,91,53,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[1120px] mx-auto px-6 lg:px-12 py-28">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span className="block w-6 h-px bg-[#ff5b35]" />
          <span className="text-[#ff5b35] text-[11px] tracking-[.2em] uppercase font-medium">
            Multi-Specialist AI Code Review
          </span>
        </motion.div>

        {/* Headline with scroll-based colour reveal */}
        <h1
          className="font-heading leading-[1.15] tracking-[-0.02em] mb-8"
          style={{ fontSize: "clamp(56px, 8vw, 96px)" }}
        >
          <div>
            <WordReveal words={["The", "Senior", "Engineer"]} delay={0.08} scrollColor={headlineColor} />
          </div>
          <div>
            <WordReveal words={["Your", "AI-Generated"]} delay={0.26} coral />
          </div>
          <div>
            <WordReveal words={["Code", "Has", "Never", "Had"]} delay={0.4} scrollColor={headlineColor} />
          </div>
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[18px] text-[#555550] leading-[1.7] mb-10 max-w-[520px] mx-auto"
        >
          AI writes your code fast. CODEWATCH makes sure it&apos;s fit for production.
          Five specialists. Your business rules. The actual fixed code.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.82, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          <SpringButton>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-[#ff5b35] hover:bg-[#ff5b35]/90 text-white border-0 px-8 shadow-xl shadow-[#ff5b3530] rounded-xl font-semibold"
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
                className="border border-[#d8d8d2] text-[#0d0d0d] bg-white hover:bg-[#eeede8] px-8 rounded-xl"
              >
                See How It Works
              </Button>
            </Link>
          </SpringButton>
        </motion.div>

        {/* Stats row with count-up */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e8e8e2] border border-[#e8e8e2] rounded-2xl overflow-hidden max-w-2xl mx-auto"
        >
          {STATS.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
