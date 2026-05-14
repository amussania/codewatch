"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

const ROW1: Testimonial[] = [
  {
    quote: "We had a race condition in our payment flow for four months. Every review missed it. CODEWATCH caught it in twenty seconds because I described our payment state machine in the context field. That single catch was worth twelve months of subscription.",
    name: "Rahul M.",
    role: "Senior Engineer",
    company: "Fintech startup",
  },
  {
    quote: "I'm a founder, not a senior engineer. CODEWATCH found our tax calculation logic was completely wrong for Indian GST rules. We were under-charging customers. The fix saved us from a compliance nightmare before launch.",
    name: "Priya S.",
    role: "Founder & CTO",
    company: "SaaS product",
  },
  {
    quote: "The white-label reports are why we chose CODEWATCH. We review code for fourteen client companies. Our clients see our branding, our commentary, our recommendations. We raised our retainer fees forty percent.",
    name: "Arjun K.",
    role: "Agency Director",
    company: "Dev agency",
  },
  {
    quote: "Found a SQL injection vector that had passed three internal code reviews and been live for six months. The query builder looked syntactically fine. It wasn't. The Business Logic Reviewer caught it on the first pass.",
    name: "Marcus T.",
    role: "Staff Engineer",
    company: "Series B SaaS",
  },
  {
    quote: "The Humanisation Layer is remarkable. The rewritten code reads like a senior developer built it over six months. Nobody on the team questioned the PR. It shipped the same day.",
    name: "Lisa B.",
    role: "Solo Founder",
    company: "Dev tools startup",
  },
  {
    quote: "I added 'Five-Specialist Security Audit' as a line item in my consulting proposals. No git access required — clients paste code, I paste into CODEWATCH. My rates went up sixty percent.",
    name: "James R.",
    role: "Independent Consultant",
    company: "Freelance",
  },
];

const ROW2: Testimonial[] = [
  {
    quote: "We merged a PR that passed three code reviews. CODEWATCH caught that the discount was applied post-tax instead of pre-tax. Forty dollar error per enterprise customer per month. Two hundred customers. Eleven weeks.",
    name: "Daniel W.",
    role: "Staff Engineer",
    company: "Series B SaaS",
  },
  {
    quote: "I review client code without repository access. They paste in Slack, I paste into CODEWATCH. Five-specialist audit in thirty seconds. My review rate went up sixty percent and clients think it's a system I built.",
    name: "Sofia M.",
    role: "Independent Consultant",
    company: "Freelance",
  },
  {
    quote: "AI origin score was 94%. The Security Analyst flagged three injection vectors we'd completely missed. We rewrote the entire auth module before it ever touched staging. Saved us from something serious.",
    name: "Yuki N.",
    role: "Engineering Lead",
    company: "B2B startup",
  },
  {
    quote: "Set up the business context with our EU VAT rules. CODEWATCH flagged that our discount logic was being applied in the wrong order for German customers. Caught it the day before launch.",
    name: "Carlos R.",
    role: "CTO",
    company: "E-commerce platform",
  },
  {
    quote: "Every other tool gives you a to-do list. CODEWATCH gives you the fixed code. Paste the rewrite back in, ship it. We're shipping confidently for the first time in eight months.",
    name: "Amara O.",
    role: "Founder",
    company: "Series A product",
  },
  {
    quote: "Performance Engineer caught an O(n²) loop in a paginated endpoint serving 50k requests per minute. That would have taken down production. Caught it in review before we deployed to staging.",
    name: "Tom H.",
    role: "Backend Lead",
    company: "Marketplace platform",
  },
];

// ─── Injected styles ──────────────────────────────────────────────────────────

const MARQUEE_STYLES = `
  @keyframes cw-scroll-left {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes cw-scroll-right {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); }
  }
  .cw-t-card {
    transition: transform 200ms ease, border-color 200ms ease;
    cursor: default;
  }
  .cw-t-card:hover {
    transform: translateY(-2px);
    border-color: rgba(200, 68, 10, 0.2) !important;
  }
`;

// ─── Shared edge-fade mask ────────────────────────────────────────────────────

const MASK_STYLE: React.CSSProperties = {
  maskImage:
    "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
};

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ t }: { t: Testimonial }) {
  return (
    <div
      className="cw-t-card"
      style={{
        width: 320,
        flexShrink: 0,
        borderRadius: 12,
        background: "var(--cw-bg-surface)",
        border: "0.5px solid var(--cw-bg-secondary)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Quote */}
      <p
        className="font-heading italic"
        style={{
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--cw-ink-primary)",
          margin: 0,
          flex: 1,
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Attribution */}
      <div
        style={{
          borderTop: "0.5px solid var(--cw-bg-secondary)",
          paddingTop: 14,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--cw-ink-secondary)",
          }}
        >
          {t.name}
        </p>
        <p
          style={{
            margin: "3px 0 0",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            color: "var(--cw-ink-tertiary)",
          }}
        >
          {t.role} · {t.company}
        </p>
      </div>
    </div>
  );
}

// ─── Marquee row ──────────────────────────────────────────────────────────────

function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: Testimonial[];
  direction: "left" | "right";
  duration: number;
}) {
  const [paused, setPaused] = useState(false);
  const animationName =
    direction === "left" ? "cw-scroll-left" : "cw-scroll-right";

  return (
    <div
      style={{
        overflow: "hidden",
        padding: "8px 0",
        ...MASK_STYLE,
      }}
    >
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          display: "flex",
          gap: 16,
          width: "fit-content",
          animation: `${animationName} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {[...items, ...items].map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

// ─── Reduced-motion fallback ──────────────────────────────────────────────────

function StaticGrid({ items }: { items: Testimonial[] }) {
  return (
    <div className="max-w-[1120px] mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Testimonials() {
  const reduced = useReducedMotion();

  return (
    <section
      id="testimonials"
      style={{ background: "var(--cw-bg-primary)", padding: "120px 0" }}
    >
      <style>{MARQUEE_STYLES}</style>

      {/* Header */}
      <div
        className="max-w-[1120px] mx-auto px-6 lg:px-12"
        style={{ textAlign: "center", marginBottom: 56 }}
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
            Testimonials
          </span>
        </div>
        <h2
          className="font-heading italic"
          style={{
            fontSize: "clamp(38px, 5vw, 64px)",
            lineHeight: 1.15,
            color: "var(--cw-ink-primary)",
            margin: "0 0 16px",
          }}
        >
          What the market
          <br />
          <span style={{ color: "var(--cw-ember)" }}>actually needed.</span>
        </h2>
        <p
          style={{
            fontSize: 17,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            color: "var(--cw-ink-secondary)",
            lineHeight: 1.7,
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          Developers, founders, and agencies who review code for a living.
        </p>
      </div>

      {/* Marquee rows — or static grid for reduced motion */}
      {reduced ? (
        <StaticGrid items={[...ROW1, ...ROW2]} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <MarqueeRow items={ROW1} direction="right" duration={65} />
          <MarqueeRow items={ROW2} direction="left" duration={55} />
        </div>
      )}
    </section>
  );
}
