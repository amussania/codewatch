"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    num: "01",
    icon: "📋",
    title: "Paste Your Code",
    desc: "Drop in any function, file, or diff. Thirty-plus languages. No formatting required. No GitHub connection. No OAuth. No setup.",
    detail: "Supports TypeScript, Python, Go, Rust, Java, Kotlin, Swift, Ruby, PHP, C#, SQL, GraphQL, and more.",
  },
  {
    num: "02",
    icon: "💬",
    title: "Set Business Context",
    desc: "Tell CODEWATCH what your code is supposed to do. Describe your pricing rules, user roles, state transitions, or fee structures. This is what no other tool does.",
    detail: "Example: \"This function calculates GST for Indian customers. Base rate 18%. Essential goods at 5%.\"",
  },
  {
    num: "03",
    icon: "🔬",
    title: "Panel Reviews in Parallel",
    desc: "Five specialists review your code simultaneously. Security, reliability, performance, business logic, and quality — all scored independently. You get a Master Production Score.",
    detail: "All five specialists run in parallel. Total review time: under 2 minutes.",
  },
  {
    num: "04",
    icon: "✅",
    title: "Get the Fixed Code",
    desc: "Not a to-do list. The rewritten code. Hardened error propagation, environment variables replacing secrets, timeouts on every external call, input validation. Optionally run the Humanisation Layer.",
    detail: "Paste it back. Ship it. Done.",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  /* Measure steps container after mount and on resize */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSvgHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* DrawSVG simulation: animate stroke-dashoffset using getTotalLength() */
  useGSAP(
    () => {
      if (!lineRef.current || !containerRef.current || svgHeight === 0) return;

      const len = lineRef.current.getTotalLength();

      /* Track behind the line (static) */
      gsap.set(".hiw-track", { opacity: 1 });

      /* Animated line: strokeDashoffset from len → 0 tied to scroll */
      gsap.fromTo(
        lineRef.current,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 62%",
            end: "bottom 38%",
            scrub: 1.4,
          },
        }
      );

      /* Steps stagger in as you scroll */
      gsap.from(".hiw-step", {
        y: 38,
        opacity: 0,
        duration: 0.8,
        stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef, dependencies: [svgHeight] }
  );

  return (
    <section id="how-it-works" className="py-[8.75rem] max-w-[1200px] mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-20">
        <span className="text-[#8896ab] text-xs font-semibold uppercase tracking-widest">
          The process
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
          Paste. Review.
          <br />
          <span className="text-[#ff5b35]">Ship With Confidence.</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">
          Four steps. Under two minutes. No repo connection needed.
        </p>
      </div>

      {/* Steps + SVG timeline */}
      <div ref={containerRef} className="relative">
        {/* ── SVG timeline line (DrawSVG simulation) ── */}
        {svgHeight > 0 && (
          <svg
            ref={svgRef}
            aria-hidden
            className="absolute left-[39px] top-0 hidden md:block pointer-events-none"
            width="1"
            height={svgHeight}
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="hiw-grad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#ff5b35" />
                <stop offset="100%" stopColor="#1a7be8" />
              </linearGradient>
            </defs>
            {/* Static track */}
            <line
              className="hiw-track"
              x1="0.5" y1="0" x2="0.5" y2={svgHeight}
              stroke="#e8edf5" strokeOpacity="1" strokeWidth="1"
            />
            {/* Animated draw line */}
            <line
              ref={lineRef}
              x1="0.5" y1="0" x2="0.5" y2={svgHeight}
              stroke="url(#hiw-grad)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        )}

        <div className="space-y-14">
          {STEPS.map((step, i) => (
            <div key={i} className="hiw-step relative flex gap-7 md:gap-10 items-start">
              {/* Icon node */}
              <div className="relative z-10 shrink-0 w-[78px] h-[78px] rounded-2xl border border-[#e8edf5] bg-[var(--cw-surface-elevated)] flex flex-col items-center justify-center shadow-xl">
                <span className="text-2xl leading-none">{step.icon}</span>
                <span className="text-[10px] font-mono text-muted-foreground mt-1 opacity-60">{step.num}</span>
              </div>

              {/* Content */}
              <div className="pt-2 flex-1 relative">
                <span
                  aria-hidden
                  className="absolute -top-3 left-0 font-extrabold leading-none select-none pointer-events-none"
                  style={{ fontSize: "80px", color: "#f0f2f5", zIndex: 0 }}
                >
                  {step.num}
                </span>
                <h3 className="relative text-xl font-semibold mb-2" style={{ zIndex: 1 }}>{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-lg mb-3">{step.desc}</p>
                <p className="text-xs text-muted-foreground/60 font-mono border-l-2 border-[#ff5b35]/30 pl-3">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
