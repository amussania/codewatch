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
    <section className="py-[140px] px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-w-3xl mx-auto rounded-3xl border border-[#e8e8e2] bg-white px-8 py-16 text-center overflow-hidden"
        style={{ boxShadow: "0 4px 60px rgba(0,0,0,0.06)" }}
      >
        {/* Background glows */}
        <motion.div
          animate={{ opacity: [0.06, 0.16, 0.06], scale: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#ff5b35] blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.04, 0.10, 0.04], scale: [1.04, 1, 1.04] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#1a7be8] blur-3xl pointer-events-none"
        />

        <div className="relative">
          <h2 className="font-heading text-[clamp(52px,8vw,96px)] leading-[1.15] tracking-[-0.02em] mb-4 text-[#0d0d0d]">
            Ship Code You Can
            <br />
            <span className="text-[#ff5b35]">Stand Behind.</span>
          </h2>
          <p className="text-[#999990] max-w-md mx-auto mb-8 leading-[1.7] text-lg">
            Ten free reviews. No credit card. Your actual code, your actual vulnerabilities,
            your actual fix — in under two minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <SpringButton>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#ff5b35] hover:bg-[#ff5b35]/90 text-white border-0 px-8 shadow-xl shadow-[#ff5b3533] text-base rounded-xl font-semibold"
                >
                  Get 10 Free Reviews →
                </Button>
              </Link>
            </SpringButton>
          </div>

          <p className="text-xs text-[#999990] mt-6">
            10 free reviews · No card required · Cancel anytime · Your code never stored · Local taxes calculated at checkout
          </p>
        </div>
      </motion.div>
    </section>
  );
}
