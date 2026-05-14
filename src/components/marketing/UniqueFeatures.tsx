"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    pill: "UNIQUE",
    name: "Business Logic Context",
    body: "Every other tool is domain-blind. They review code in a vacuum. They can tell you the code is syntactically valid. They cannot tell you it is logically wrong for your business. CODEWATCH is the only tool where you describe your business rules — currency, fee structures, user roles, state transitions — and the AI validates code against those exact rules.",
    quote: "Not generic patterns. Your rules.",
  },
  {
    pill: "UNIQUE",
    name: "AI Origin Probability",
    body: "41% of global code is now AI-generated. App stores are rejecting vibe-coded apps. Enterprise teams are setting quality gates. CODEWATCH scores every review with a 0–100% probability that the submitted code was AI-generated, based on structural tells: overly symmetric error handling, missing edge cases, no evidence of iteration, generic naming patterns.",
    quote: "Set a threshold per project. Flag anything above 80% before it goes to production.",
  },
  {
    pill: "EXCLUSIVE",
    name: "Humanisation Layer",
    body: "No competitor has any concept of this. After the fail-safe rewrite, run the Humanisation Layer. It applies real human engineering fingerprints: variable naming drift, WHY comments referencing specific decisions and incidents, intentional TODOs a real developer would leave, asymmetric error handling. The code remains 100% functionally identical.",
    quote: "It reads like it was built by an experienced team over six months.",
  },
  {
    pill: "EXCLUSIVE",
    name: "Fail-Safe Rewrite",
    body: "Every other tool gives you a to-do list. CODEWATCH gives you the fixed code. The fail-safe rewrite keeps the same behaviour on the happy path and hardens everything else: explicit error propagation, environment variables replacing hardcoded secrets, timeouts on every external call, input validation, null guards, logging at critical decision points.",
    quote: "You take the rewritten code, paste it back, ship it.",
  },
  {
    pill: "ONLY US",
    name: "No Git Setup Required",
    body: "Every major competitor requires connecting a repository. CODEWATCH works with a paste. A freelancer reviewing client code. A non-technical founder checking what their developer sent. A consultant auditing legacy code with no Git access. All of them can use CODEWATCH in thirty seconds. No OAuth. No permissions. No setup.",
    quote: "Paste code. Get a review. Thirty seconds. No configuration.",
  },
];

const CARD_W = 380;
const CARD_GAP = 20;

// ─── Injected styles ──────────────────────────────────────────────────────────

const TRACK_STYLES = `
  .cw-unique-track::-webkit-scrollbar { display: none; }
`;

// ─── Arrow button ─────────────────────────────────────────────────────────────

function ArrowBtn({
  dir,
  onClick,
  disabled,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid var(--cw-bg-secondary)",
        background: "var(--cw-bg-surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1,
        flexShrink: 0,
        transition: "opacity 200ms ease, border-color 200ms ease, background 200ms ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const el = e.currentTarget;
          el.style.borderColor = "var(--cw-ember)";
          el.style.background = "var(--cw-ember-light)";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--cw-bg-secondary)";
        el.style.background = "var(--cw-bg-surface)";
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        {dir === "left" ? (
          <path
            d="M9 2L4 7L9 12"
            stroke="var(--cw-ink-primary)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M5 2L10 7L5 12"
            stroke="var(--cw-ink-primary)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({
  feature,
  index,
  inView,
  reduced,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
  inView: boolean;
  reduced: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={
        reduced
          ? {}
          : inView
          ? { opacity: 1, clipPath: "inset(0 0 0% 0)" }
          : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
      }
      whileHover={reduced ? {} : { y: -6 }}
      transition={{
        clipPath: {
          duration: 0.5,
          delay: reduced ? 0 : index * 0.1,
          ease: [0.16, 1, 0.3, 1],
        },
        opacity: {
          duration: 0.5,
          delay: reduced ? 0 : index * 0.1,
        },
        y: {
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        width: CARD_W,
        flexShrink: 0,
        minHeight: 480,
        borderRadius: 12,
        background: "var(--cw-bg-surface)",
        border: `0.5px solid ${hovered ? "rgba(200,68,10,0.3)" : "var(--cw-bg-secondary)"}`,
        padding: 40,
        display: "flex",
        flexDirection: "column",
        scrollSnapAlign: "start",
        boxShadow: hovered ? "0 20px 48px rgba(26,23,20,0.10)" : "none",
        transition:
          "border-color 400ms cubic-bezier(0.16,1,0.3,1), box-shadow 400ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Badge pill */}
      <span
        style={{
          display: "inline-block",
          width: "fit-content",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          padding: "4px 10px",
          borderRadius: 4,
          background: "var(--cw-ember-light)",
          color: "var(--cw-ember)",
          marginBottom: 24,
          flexShrink: 0,
        }}
      >
        {feature.pill}
      </span>

      {/* Feature name */}
      <h3
        className="font-heading italic"
        style={{
          fontSize: 32,
          lineHeight: 1.15,
          color: "var(--cw-ink-primary)",
          margin: "0 0 20px",
        }}
      >
        {feature.name}
      </h3>

      {/* Body text */}
      <p
        style={{
          fontSize: 15,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          color: "var(--cw-ink-secondary)",
          lineHeight: 1.7,
          margin: "0 0 32px",
        }}
      >
        {feature.body}
      </p>

      {/* Pull quote — pushed to bottom of flex column */}
      <blockquote
        style={{
          marginTop: "auto",
          paddingLeft: 16,
          borderLeft: "3px solid var(--cw-ember)",
        }}
      >
        <p
          className="font-heading italic"
          style={{
            fontSize: 16,
            color: "var(--cw-ink-secondary)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {feature.quote}
        </p>
      </blockquote>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function UniqueFeatures() {
  const reduced = useReducedMotion();
  const trackRef  = useRef<HTMLDivElement>(null); // outer wrapper — drives inView
  const scrollRef = useRef<HTMLDivElement>(null); // inner scrollable div

  const inView = useInView(trackRef, { once: true, margin: "-80px" });

  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  // Drag state in refs (no re-render needed)
  const isDragging       = useRef(false);
  const dragStartX       = useRef(0);
  const dragStartScroll  = useRef(0);

  // ── Arrow state ────────────────────────────────────────────────────────────

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  const scrollDir = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -(CARD_W + CARD_GAP) : CARD_W + CARD_GAP,
      behavior: "smooth",
    });
  };

  // ── Drag handlers ──────────────────────────────────────────────────────────

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current      = true;
    dragStartX.current      = e.clientX;
    dragStartScroll.current = el.scrollLeft;
    el.style.cursor         = "grabbing";
    el.style.scrollSnapType = "none";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const delta = dragStartX.current - e.clientX;
    scrollRef.current.scrollLeft = dragStartScroll.current + delta * 1.2;
  }, []);

  const onDragEnd = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !isDragging.current) return;
    isDragging.current = false;
    el.style.cursor    = "grab";
    // Snap to nearest card, then restore CSS snap
    const idx    = Math.round(el.scrollLeft / (CARD_W + CARD_GAP));
    const target = Math.max(0, idx) * (CARD_W + CARD_GAP);
    el.scrollTo({ left: target, behavior: "smooth" });
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.style.scrollSnapType = "x mandatory";
    }, 420);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section
      id="unique-features"
      style={{ background: "var(--cw-bg-primary)", padding: "140px 0" }}
    >
      <style>{TRACK_STYLES}</style>

      {/* Header + arrows */}
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                display: "block",
                width: 24,
                height: 1,
                background: "var(--cw-ember)",
              }}
            />
            <span
              style={{
                color: "var(--cw-ember)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              What Nobody Else Does
            </span>
          </div>
          <h2
            className="font-heading italic"
            style={{
              fontSize: "clamp(38px, 5vw, 64px)",
              lineHeight: 1.15,
              color: "var(--cw-ink-primary)",
              margin: "12px 0 0",
            }}
          >
            The gaps every
            <br />
            <span style={{ color: "var(--cw-ember)" }}>competitor leaves open.</span>
          </h2>
          <p
            style={{
              fontSize: 17,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: "var(--cw-ink-secondary)",
              marginTop: 20,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.7,
            }}
          >
            Every competitor catches syntax errors and common patterns. These
            capabilities exist nowhere else in the market.
          </p>
        </motion.div>

        {/* Arrow controls — right-aligned */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <ArrowBtn dir="left"  onClick={() => scrollDir("left")}  disabled={!canLeft}  />
          <ArrowBtn dir="right" onClick={() => scrollDir("right")} disabled={!canRight} />
        </div>
      </div>

      {/* Masked scroll track — full viewport width */}
      <div
        ref={trackRef}
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 80px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 80px), transparent 100%)",
        }}
      >
        <div
          ref={scrollRef}
          className="cw-unique-track"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          style={{
            display: "flex",
            gap: CARD_GAP,
            overflowX: "auto",
            // Align first card with page content on all breakpoints
            paddingLeft: "max(24px, calc((100vw - 1120px) / 2 + 48px))",
            paddingRight: 80,
            paddingBottom: 24,
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            cursor: "grab",
            userSelect: "none",
          }}
        >
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={f.name}
              feature={f}
              index={i}
              inView={inView}
              reduced={!!reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
