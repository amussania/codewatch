"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

// ─── Animated dark grid (white lines, inverted from hero) ─────────────────────

const GRID_STYLES = `
  @keyframes cw-cta-dark-drift {
    from { background-position: 0 0; }
    to   { background-position: 64px 64px; }
  }
  .cw-cta-dark-grid {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(253,250,247,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(253,250,247,0.06) 1px, transparent 1px);
    background-size: 64px 64px;
    animation: cw-cta-dark-drift 24s linear infinite;
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .cw-cta-dark-grid { animation: none; }
  }
`;

function DarkGridBackground() {
  return (
    <>
      <div className="cw-cta-dark-grid" aria-hidden />

      {/* Primary ember glow — large, centred */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 1000px 500px at 50% 50%, rgba(200,68,10,0.25) 0%, rgba(200,68,10,0.08) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Secondary softer glow — offset for depth */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 600px 300px at 40% 60%, rgba(200,68,10,0.12) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Edge vignette — grid fades toward borders */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 35%, var(--cw-bg-ink) 100%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FinalCTA() {
  const reduced = useReducedMotion();

  return (
    <section
      id="cta"
      style={{
        background: "var(--cw-bg-ink)",
        padding: "160px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{GRID_STYLES}</style>
      <DarkGridBackground />

      <div className="max-w-[1120px] mx-auto px-6 lg:px-12" style={{ position: "relative" }}>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ textAlign: "center" }}
        >
          {/* Headline */}
          <h2
            className="font-heading italic"
            style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              lineHeight: 1.1,
              color: "#FDFAF7",
              margin: "0 0 20px",
            }}
          >
            Stop shipping your AI's mistakes.
          </h2>

          {/* Subline */}
          <p
            style={{
              fontSize: 18,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: "rgba(253,250,247,0.6)",
              lineHeight: 1.75,
              maxWidth: 440,
              margin: "0 auto 44px",
            }}
          >
            CodeWatch catches what your AI code generator misses.
            Every time. Before production.
          </p>

          {/* CTA button */}
          <motion.div
            whileHover={reduced ? {} : { y: -1, filter: "brightness(1.08)" }}
            whileTap={reduced ? {} : { scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ display: "inline-block", marginBottom: 20 }}
          >
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 52,
                padding: "0 32px",
                background: "var(--cw-ember)",
                color: "#FDFAF7",
                borderRadius: 6,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              Start reviewing for free →
            </Link>
          </motion.div>

          {/* Trust line */}
          <p
            style={{
              fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: "rgba(253,250,247,0.4)",
              margin: 0,
            }}
          >
            Free tier · no credit card · up and running in 60 seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
}
