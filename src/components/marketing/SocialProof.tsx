"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { end: 10000, suffix: "+", display: "10,000+", label: "issues caught" },
  { end: 500,   suffix: "+", display: "500+",    label: "codebases reviewed" },
  { end: 98,    suffix: "%", display: "98%",     label: "accuracy rate" },
] as const;

const LOGOS = [
  "Stripe",
  "Vercel",
  "Supabase",
  "Linear",
  "Notion",
  "Prisma",
  "Railway",
  "Resend",
  "PlanetScale",
  "Fly.io",
];

// ─── Injected styles ──────────────────────────────────────────────────────────

const MARQUEE_STYLES = `
  @keyframes cw-logo-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .cw-logo-item {
    opacity: 0.4;
    transition: opacity 200ms ease;
    cursor: default;
    user-select: none;
  }
  .cw-logo-item:hover {
    opacity: 1;
  }
`;

// ─── Section ──────────────────────────────────────────────────────────────────

export default function SocialProof() {
  const sectionRef  = useRef<HTMLElement>(null);
  const statRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced     = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      STATS.forEach(({ end, suffix }, i) => {
        const el = statRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: end,
              duration: 1.8,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent =
                  Math.floor(obj.val).toLocaleString() + suffix;
              },
              onComplete: () => {
                el.textContent = end.toLocaleString() + suffix;
              },
            });
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={sectionRef}
      id="social-proof"
      style={{ background: "var(--cw-bg-secondary)" }}
    >
      <style>{MARQUEE_STYLES}</style>

      {/* Stats row */}
      <div
        className="max-w-[1120px] mx-auto px-6 lg:px-12"
        style={{ padding: "52px 24px 48px" }}
      >
        <div
          className="flex flex-col sm:flex-row"
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: 0,
          }}
        >
          {STATS.map(({ display, suffix, label }, i) => (
            <div
              key={label}
              className="flex flex-row sm:flex-row"
              style={{ alignItems: "stretch" }}
            >
              {i > 0 && (
                <div
                  className="hidden sm:block"
                  style={{
                    width: 1,
                    background: "var(--cw-bg-primary)",
                    margin: "0 48px",
                    alignSelf: "stretch",
                    flexShrink: 0,
                    opacity: 0.6,
                  }}
                />
              )}
              <div
                style={{
                  textAlign: "center",
                  padding: "8px 0",
                }}
              >
                <div
                  className="font-heading italic"
                  style={{
                    fontSize: 48,
                    lineHeight: 1,
                    color: "var(--cw-ink-primary)",
                    marginBottom: 8,
                    display: "block",
                  }}
                >
                  <span
                    ref={(el) => {
                      statRefs.current[i] = el;
                    }}
                    aria-label={display}
                  >
                    {reduced ? display : `0${suffix}`}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--cw-ink-tertiary)",
                  }}
                >
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo marquee */}
      <div
        style={{
          overflow: "hidden",
          borderTop: "0.5px solid var(--cw-bg-primary)",
          padding: "20px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "fit-content",
            animation: reduced ? "none" : "cw-logo-scroll 28s linear infinite",
            willChange: "transform",
          }}
        >
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <span
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 0 }}
            >
              <span
                className="cw-logo-item"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--cw-ink-primary)",
                  padding: "0 32px",
                  whiteSpace: "nowrap",
                }}
              >
                {logo}
              </span>
              <span
                aria-hidden
                style={{
                  color: "var(--cw-ember)",
                  fontSize: 7,
                  flexShrink: 0,
                  opacity: 0.45,
                }}
              >
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
