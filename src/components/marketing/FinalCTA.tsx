"use client";

import { motion, useSpring } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function SpringButton({ children }: { children: React.ReactNode }) {
  const scale = useSpring(1, { stiffness: 500, damping: 28 });
  const y     = useSpring(0, { stiffness: 500, damping: 28 });
  return (
    <motion.div
      style={{ scale, y }}
      onHoverStart={() => { scale.set(1.05); y.set(-2); }}
      onHoverEnd={()  => { scale.set(1);    y.set(0);  }}
      onTapStart={() => { scale.set(0.97);  y.set(0);  }}
    >
      {children}
    </motion.div>
  );
}

export default function FinalCTA() {
  return (
    <section className="py-[120px] px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-3xl mx-auto rounded-2xl border border-[#e2e2ee] bg-white px-8 py-20 text-center overflow-hidden"
      >
        {/* Subtle coral glow */}
        <motion.div
          animate={{ opacity: [0.06, 0.14, 0.06], scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#ff5b35] blur-3xl pointer-events-none"
        />

        <div className="relative">
          <p className="font-sans text-[#ff5b35] text-[10px] tracking-[.2em] uppercase mb-6">
            — Get Started Free
          </p>
          <h2 className="font-heading text-[clamp(52px,8vw,96px)] leading-[.93] tracking-[.02em] mb-5">
            Ship Code You Can
            <br />
            <span className="text-[#ff5b35]">Stand Behind.</span>
          </h2>
          <p className="font-serif italic font-light text-[#8896ab] max-w-md mx-auto mb-10 leading-relaxed text-lg">
            Ten free reviews. No credit card. Your actual code, your actual vulnerabilities,
            your actual fix — in under two minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <SpringButton>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#ff5b35] hover:bg-[#ff5b35]/90 text-white border-0 px-8 shadow-xl shadow-[#ff5b3533] font-sans tracking-[.06em] rounded-[5px]"
                >
                  Get 10 Free Reviews →
                </Button>
              </Link>
            </SpringButton>
          </div>

          <p className="font-sans text-[10px] text-[#8896ab] mt-6 tracking-[.06em]">
            10 free reviews · No card required · Cancel anytime · Your code never stored · Local taxes calculated at checkout
          </p>
        </div>
      </motion.div>
    </section>
  );
}
