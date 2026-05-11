"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    num: "01",
    icon: "⌨️",
    title: "Paste your code",
    desc: "Drop in any snippet — a function, a PR diff, or an entire file. No formatting or cleanup needed. 30+ languages supported out of the box.",
    detail: "Supports TypeScript, Python, Go, Rust, Java, Ruby, SQL, and more.",
  },
  {
    num: "02",
    icon: "🤖",
    title: "Choose your specialists",
    desc: "Pick from six AI specialists — Security Auditor, Performance Engineer, Architecture Reviewer, and more — or let CodeWatch auto-assign based on what it detects.",
    detail: "Multi-specialist mode runs all six in parallel.",
  },
  {
    num: "03",
    icon: "🧠",
    title: "Receive expert analysis",
    desc: "Get detailed findings with line-level annotations, severity ratings, suggested fixes, and explanations written the way a senior engineer would write them.",
    detail: "Average review depth: 14 annotated findings per 100 lines.",
  },
  {
    num: "04",
    icon: "🚀",
    title: "Fix and ship with confidence",
    desc: "Apply fixes inline, re-run the review instantly, and watch your quality score improve. Your review history tracks progress across every PR.",
    detail: "Teams that use CodeWatch ship 2.3× fewer post-deploy incidents.",
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
    <section id="how-it-works" className="py-28 max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-20">
        <span className="text-[#ff6b6b] text-sm font-medium uppercase tracking-widest">
          The process
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
          From paste to production-ready
        </h2>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">
          Four steps. Under 30 seconds. No setup, no config, no waiting.
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
                <stop offset="0%" stopColor="#ff6b6b" />
                <stop offset="100%" stopColor="#4a9fff" />
              </linearGradient>
            </defs>
            {/* Static track */}
            <line
              className="hiw-track"
              x1="0.5" y1="0" x2="0.5" y2={svgHeight}
              stroke="white" strokeOpacity="0.07" strokeWidth="1"
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
              <div className="relative z-10 shrink-0 w-[78px] h-[78px] rounded-2xl border border-white/10 bg-[var(--cw-surface-elevated)] flex flex-col items-center justify-center shadow-xl">
                <span className="text-2xl leading-none">{step.icon}</span>
                <span className="text-[10px] font-mono text-muted-foreground mt-1 opacity-60">{step.num}</span>
              </div>

              {/* Content */}
              <div className="pt-2 flex-1">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-lg mb-3">{step.desc}</p>
                <p className="text-xs text-muted-foreground/60 font-mono border-l-2 border-[#ff6b6b]/30 pl-3">
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
