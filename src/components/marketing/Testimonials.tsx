"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useAnimation, type PanInfo } from "framer-motion";

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
    color: "#00c4a0",
    score: { before: 44, after: 87 },
  },
  {
    quote: "We review code for fourteen client companies. The white-label reports are the reason we chose CODEWATCH over everything else. Our clients see our branding, our commentary, our recommendations. They have no idea there's AI behind it. We've increased our review retainer fees by forty percent.",
    name: "Arjun K.",
    role: "Agency Director",
    company: "Dev agency",
    avatar: "AK",
    color: "#4da3ff",
    score: { before: 63, after: 96 },
  },
];

const CARD_W = 380;
const CARD_GAP = 20;
const VISIBLE_DESKTOP = 3;
const MAX_IDX = Math.max(0, TESTIMONIALS.length - VISIBLE_DESKTOP);

export default function Testimonials() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const dragStart = useRef(0);

  async function goTo(idx: number) {
    const clamped = Math.max(0, Math.min(idx, MAX_IDX));
    setCurrentIdx(clamped);
    await controls.start({
      x: -clamped * (CARD_W + CARD_GAP),
      transition: { type: "spring", stiffness: 300, damping: 34 },
    });
  }

  function onDragStart() {
    dragStart.current = currentIdx * (CARD_W + CARD_GAP);
  }

  async function onDragEnd(_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const THRESHOLD = 60;
    const VEL_THRESHOLD = 400;

    if (info.offset.x < -THRESHOLD || info.velocity.x < -VEL_THRESHOLD) {
      await goTo(currentIdx + 1);
    } else if (info.offset.x > THRESHOLD || info.velocity.x > VEL_THRESHOLD) {
      await goTo(currentIdx - 1);
    } else {
      await goTo(currentIdx);
    }
  }

  return (
    <section className="py-[7.5rem] overflow-hidden bg-[#f8faff]" id="testimonials">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[#ff5b35] text-sm font-medium uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
            What the market
            <br />
            <span className="text-[#ff5b35]">actually needed.</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-sm mx-auto">
            Developers, founders, and agencies who review code for a living.
          </p>
        </div>
      </div>

      {/* Drag carousel — extends past container edges */}
      <div className="max-w-[1200px] mx-auto px-6 overflow-visible">
        <div className="overflow-hidden -mx-6 px-6">
          <motion.div
            animate={controls}
            drag="x"
            dragConstraints={{ left: -MAX_IDX * (CARD_W + CARD_GAP), right: 0 }}
            dragElastic={0.06}
            dragTransition={{ bounceStiffness: 280, bounceDamping: 36 }}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            style={{ x }}
            className="flex gap-5 cursor-grab active:cursor-grabbing select-none"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                style={{ width: CARD_W, minWidth: CARD_W }}
                className="rounded-2xl border border-[#e8edf5] bg-[var(--cw-surface)] p-6 flex flex-col gap-5"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} className="text-[#fbbf24] text-sm">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Score delta */}
                <div className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-[#f8faff] border border-[#e8edf5]">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-0.5">Before</div>
                    <div className="text-lg font-bold text-muted-foreground">{t.score.before}</div>
                  </div>
                  <div className="flex-1 h-px bg-[#f0f3f9] relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 right-0 text-[#ff5b35] text-xs font-bold"
                      style={{ color: t.color }}
                    >
                      +{t.score.after - t.score.before}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-0.5">After</div>
                    <div className="text-lg font-bold" style={{ color: t.color }}>{t.score.after}</div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-1 border-t border-[#e8edf5]">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium leading-none">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dot pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: MAX_IDX + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-300"
            >
              <motion.div
                animate={{ width: i === currentIdx ? 20 : 8, opacity: i === currentIdx ? 1 : 0.35 }}
                className="h-1.5 rounded-full bg-[#ff5b35]"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
