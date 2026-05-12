"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

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
      className="rounded-2xl border border-[#e8e8e2] bg-white p-8 flex flex-col gap-5 hover:border-[#d0d0c8] transition-colors duration-300"
    >
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, s) => (
          <span key={s} className="text-[#fbbf24] text-sm">★</span>
        ))}
      </div>

      <p className="italic font-light text-sm text-[#555550] leading-[1.8] flex-1">
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-[#f5f4f0] border border-[#e8e8e2]">
        <div className="text-center">
          <div className="text-xs text-[#999990] mb-0.5">Before</div>
          <div className="text-lg font-bold text-[#999990]">{t.score.before}</div>
        </div>
        <div className="flex-1 h-px bg-[#e8e8e2] relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 right-0 text-xs font-bold"
            style={{ color: t.color }}
          >
            +{t.score.after - t.score.before}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-[#999990] mb-0.5">After</div>
          <div className="text-lg font-bold" style={{ color: t.color }}>{t.score.after}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1 border-t border-[#e8e8e2]">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: t.color }}
        >
          {t.avatar}
        </div>
        <div>
          <div className="text-sm font-semibold leading-none text-[#0d0d0d]">{t.name}</div>
          <div className="text-xs text-[#999990] mt-1">
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
    <section className="py-[140px]" id="testimonials">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1120px] mx-auto px-6 lg:px-12 text-center mb-14"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="block w-6 h-px bg-[#ff5b35]" />
          <span className="text-[#ff5b35] text-[11px] tracking-[.2em] uppercase font-medium">Testimonials</span>
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[1.15] tracking-[-0.02em] mt-3">
          What the market
          <br />
          <span className="text-[#ff5b35]">actually needed.</span>
        </h2>
        <p className="text-[17px] text-[#999990] mt-4 max-w-sm mx-auto leading-[1.7]">
          Developers, founders, and agencies who review code for a living.
        </p>
      </motion.div>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-5 pl-6"
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
