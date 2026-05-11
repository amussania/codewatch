"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useAnimation, type PanInfo } from "framer-motion";

const TESTIMONIALS = [
  {
    quote: "CodeWatch caught a timing attack in our auth service that had been in production for 8 months. Our own security review missed it twice. I don't start a PR without it now.",
    name: "Sarah K.",
    role: "Staff Security Engineer",
    company: "Stripe",
    avatar: "SK",
    color: "#ff6b6b",
    score: { before: 61, after: 94 },
  },
  {
    quote: "We went from 4-day review cycles to shipping same-day. CodeWatch runs in our CI pipeline and flags issues before a human even looks at the PR. It's like having a senior engineer on every diff.",
    name: "Marcus T.",
    role: "CTO",
    company: "Mercado (YC S23)",
    avatar: "MT",
    color: "#4a9fff",
    score: { before: 72, after: 97 },
  },
  {
    quote: "The Performance Engineer specialist found an N+1 query in a checkout flow we'd already optimised. It was hiding behind a conditional. CodeWatch found it in under 10 seconds.",
    name: "Elena R.",
    role: "Senior Backend Engineer",
    company: "Shopify",
    avatar: "ER",
    color: "#c4b5fd",
    score: { before: 68, after: 91 },
  },
  {
    quote: "I was sceptical about AI review. Then it flagged a missing rate limiter on our password reset endpoint the same day I'd written it. Saved us from a nightmare during launch week.",
    name: "James L.",
    role: "Backend Engineer",
    company: "Linear",
    avatar: "JL",
    color: "#86efac",
    score: { before: 55, after: 88 },
  },
  {
    quote: "Our team's average review score went from 64 to 89 in six weeks. Juniors get specific, actionable feedback instead of vague comments. The quality uplift has been real.",
    name: "Priya M.",
    role: "Engineering Manager",
    company: "Notion",
    avatar: "PM",
    color: "#fbbf24",
    score: { before: 64, after: 89 },
  },
];

const CARD_W = 380;
const CARD_GAP = 20;
const VISIBLE_DESKTOP = 3;
const MAX_IDX = TESTIMONIALS.length - VISIBLE_DESKTOP;

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
    <section className="py-28 overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[#ff6b6b] text-sm font-medium uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
            Trusted by engineers who ship
          </h2>
          <p className="text-muted-foreground mt-4 max-w-sm mx-auto">
            From solo developers to engineering teams at fast-growing companies.
          </p>
        </div>
      </div>

      {/* Drag carousel — extends past container edges */}
      <div className="max-w-7xl mx-auto px-6 overflow-visible">
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
                className="rounded-2xl border border-white/8 bg-[var(--cw-surface)] p-6 flex flex-col gap-5"
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
                <div className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-0.5">Before</div>
                    <div className="text-lg font-bold text-muted-foreground">{t.score.before}</div>
                  </div>
                  <div className="flex-1 h-px bg-white/10 relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 right-0 text-[#ff6b6b] text-xs font-bold"
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
                <div className="flex items-center gap-3 pt-1 border-t border-white/6">
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
                className="h-1.5 rounded-full bg-[#ff6b6b]"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
