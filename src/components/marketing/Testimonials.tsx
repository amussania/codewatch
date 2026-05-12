"use client";

import { useRef } from "react";

const TESTIMONIALS = [
  {
    quote: "We had a race condition in our payment flow that had been in the codebase for four months. Every code review missed it because the syntax was perfect. CODEWATCH caught it in under twenty seconds because I described our payment state machine in the business context field. That single catch was worth twelve months of subscription.",
    name: "Rahul M.",
    role: "Senior Engineer",
    company: "Fintech startup",
    avatar: "RM",
    color: "#ff5b35",
    score: { before: 58, after: 91 },
  },
  {
    quote: "I'm not a senior engineer. I use Cursor to build most of the product. The AI Origin score was 94% on the first file I submitted — and CODEWATCH found that our tax calculation logic was completely wrong for Indian GST rules. We were under-charging customers. The fix saved us from a compliance nightmare.",
    name: "Priya S.",
    role: "Founder & CTO",
    company: "SaaS product",
    avatar: "PS",
    color: "#1a7be8",
    score: { before: 44, after: 87 },
  },
  {
    quote: "We review code for fourteen client companies. The white-label reports are the reason we chose CODEWATCH over everything else. Our clients see our branding, our commentary, our recommendations. They have no idea there's AI behind it. We've increased our review retainer fees by forty percent.",
    name: "Arjun K.",
    role: "Agency Director",
    company: "Dev agency",
    avatar: "AK",
    color: "#00c4a0",
    score: { before: 63, after: 96 },
  },
  {
    quote: "We merged a PR that had already passed three code reviews. CODEWATCH caught that the discount was being applied post-tax instead of pre-tax — a forty dollar error per enterprise customer per month. Two hundred customers. We'd been shipping the wrong math for eleven weeks.",
    name: "Daniel W.",
    role: "Staff Engineer",
    company: "Series B SaaS",
    avatar: "DW",
    color: "#c4b5fd",
    score: { before: 67, after: 93 },
  },
  {
    quote: "I review client code without repository access. They paste it in Slack, I paste it into CODEWATCH. I added it as a line item in my consulting proposals: 'Five-Specialist Code Security Audit.' My review rate went up sixty percent and clients think it's a proprietary system I built.",
    name: "Sofia M.",
    role: "Independent Consultant",
    company: "Freelance",
    avatar: "SM",
    color: "#fbbf24",
    score: { before: 52, after: 89 },
  },
];

function Card({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div
      style={{ width: 420, minWidth: 420, flexShrink: 0 }}
      className="rounded-xl border border-[#e2e2ee] bg-white p-8 flex flex-col gap-5 transition-all duration-[250ms] hover:border-[#ff5b35] hover:shadow-[0_8px_24px_rgba(255,91,53,0.08)]"
    >
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, s) => (
          <span key={s} className="text-[#fbbf24] text-sm">★</span>
        ))}
      </div>

      <p className="font-serif italic font-light text-sm text-[#3d4f6b] leading-relaxed flex-1">
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-[#fafafa] border border-[#e2e2ee]">
        <div className="text-center">
          <div className="font-sans text-[9px] text-[#8896ab] uppercase tracking-[.1em] mb-1">Before</div>
          <div className="font-heading text-2xl leading-none text-[#8896ab]">{t.score.before}</div>
        </div>
        <div className="flex-1 h-px bg-[#e2e2ee] relative mx-2">
          <div
            className="absolute top-1/2 -translate-y-1/2 right-0 font-sans text-[10px] font-bold tracking-[.06em]"
            style={{ color: t.color }}
          >
            +{t.score.after - t.score.before}
          </div>
        </div>
        <div className="text-center">
          <div className="font-sans text-[9px] text-[#8896ab] uppercase tracking-[.1em] mb-1">After</div>
          <div className="font-heading text-2xl leading-none" style={{ color: t.color }}>{t.score.after}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1 border-t border-[#e2e2ee]">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-sans text-[10px] font-bold text-white shrink-0 tracking-[.04em]"
          style={{ backgroundColor: t.color }}
        >
          {t.avatar}
        </div>
        <div>
          <div className="text-sm font-medium leading-none text-[#0a0f1e]">{t.name}</div>
          <div className="font-sans text-[10px] text-[#8896ab] mt-1 tracking-[.06em]">
            {t.role} · {t.company}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const pause  = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "paused"; };
  const resume = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "running"; };

  return (
    <section className="py-[120px] bg-[#fafafa]" id="testimonials">
      <div className="max-w-[1100px] mx-auto px-8 text-center mb-16">
        <p className="font-sans text-[#ff5b35] text-[10px] tracking-[.2em] uppercase mb-4">
          — Testimonials
        </p>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em]">
          What the market
          <br />
          <span className="text-[#ff5b35]">actually needed.</span>
        </h2>
        <p className="font-serif italic font-light text-[#8896ab] text-[17px] mt-5 max-w-sm mx-auto">
          Developers, founders, and agencies who review code for a living.
        </p>
      </div>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 pl-8"
          style={{ width: "fit-content", animation: "ticker 40s linear infinite" }}
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <Card key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
