"use client";

import { motion, useSpring } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function SpringButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const scale = useSpring(1, { stiffness: 500, damping: 28 });
  const y     = useSpring(0, { stiffness: 500, damping: 28 });
  return (
    <motion.div
      style={{ scale, y }}
      onHoverStart={() => { scale.set(1.05); y.set(-2); }}
      onHoverEnd={()  => { scale.set(1);    y.set(0);  }}
      onTapStart={() => { scale.set(0.97);  y.set(0);  }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function FinalCTA() {
  return (
    <section className="py-28 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-3xl mx-auto rounded-3xl border border-[#ff6b6b]/20 bg-[var(--cw-surface-elevated)] px-8 py-16 text-center overflow-hidden"
      >
        {/* Background glows */}
        <motion.div
          animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#ff6b6b] blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.12, 0.05], scale: [1.04, 1, 1.04] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#4a9fff] blur-3xl pointer-events-none"
        />

        <div className="relative">
          <div className="text-5xl mb-5">🚀</div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Ship code you&apos;re proud of.
            <br />
            <span className="text-[#ff6b6b]">Start reviewing in 30 seconds.</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            No account required for your first review. Paste your code, choose a specialist,
            and see what you&apos;ve been missing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <SpringButton>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#ff6b6b] hover:bg-[#ff6b6b]/90 text-white border-0 px-8 shadow-xl shadow-[#ff6b6b33] text-base"
                >
                  Review my code — it&apos;s free
                </Button>
              </Link>
            </SpringButton>
            <SpringButton>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/12 text-foreground hover:bg-white/6 px-8 text-base"
                >
                  Watch a demo
                </Button>
              </Link>
            </SpringButton>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            No credit card · No setup · Results in under 10 seconds
          </p>
        </div>
      </motion.div>
    </section>
  );
}
