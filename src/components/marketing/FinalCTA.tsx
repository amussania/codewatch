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
    <section className="py-[8.75rem] px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-3xl mx-auto rounded-3xl border border-[#e8edf5] bg-[#f8faff] px-8 py-16 text-center overflow-hidden"
        style={{ boxShadow: "0 2px 40px rgba(0,0,0,0.06)" }}
      >
        {/* Background glows */}
        <motion.div
          animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#ff5b35] opacity-[0.08] blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.12, 0.05], scale: [1.04, 1, 1.04] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#1a7be8] opacity-[0.06] blur-3xl pointer-events-none"
        />

        <div className="relative">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Ship Code You Can
            <br />
            <span className="text-[#ff5b35]">Stand Behind.</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            Ten free reviews. No credit card. Your actual code, your actual vulnerabilities,
            your actual fix — in under two minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <SpringButton>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#ff5b35] hover:bg-[#ff5b35]/90 text-white border-0 px-8 shadow-xl shadow-[#ff5b3533] text-base"
                >
                  Get 10 Free Reviews →
                </Button>
              </Link>
            </SpringButton>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            10 free reviews · No card required · Cancel anytime · Your code never stored · Local taxes calculated at checkout
          </p>
        </div>
      </motion.div>
    </section>
  );
}
