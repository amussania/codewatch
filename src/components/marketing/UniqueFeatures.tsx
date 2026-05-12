"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function UniqueFeatures() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-[140px] max-w-[1120px] mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="block w-6 h-px bg-[#ff5b35]" />
          <span className="text-[#ff5b35] text-[11px] tracking-[.2em] uppercase font-medium">What Nobody Else Does</span>
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[1.15] tracking-[-0.02em] mt-3">
          The gaps every
          <br />
          <span className="text-[#ff5b35]">competitor leaves open.</span>
        </h2>
        <p className="text-[17px] text-[#999990] mt-5 max-w-lg mx-auto leading-[1.7]">
          Every competitor catches syntax errors and common patterns. These capabilities exist nowhere else in the market.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="rounded-2xl border border-[#e8e8e2] bg-white overflow-hidden"
      >
        {FEATURES.map((f, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className={`border-l-[3px] transition-colors duration-300 ${
                i < FEATURES.length - 1 ? "border-b border-[#e8e8e2]" : ""
              }`}
              style={{
                borderLeftColor: isOpen ? "#ff5b35" : "transparent",
                backgroundColor: isOpen ? "#fdf9f7" : undefined,
              }}
            >
              {/* Header row */}
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={`w-full flex items-center gap-4 px-6 py-6 text-left transition-colors duration-200 ${
                  !isOpen ? "hover:bg-[#faf9f6]" : ""
                }`}
                style={{ cursor: "pointer" }}
              >
                {/* Left: pill + name */}
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <span
                    className="font-sans text-[10px] uppercase tracking-[0.08em] px-2.5 py-0.5 rounded-full w-fit"
                    style={{
                      backgroundColor: "rgba(255,91,53,0.08)",
                      color: "#ff5b35",
                      border: "1px solid rgba(255,91,53,0.15)",
                    }}
                  >
                    {f.pill}
                  </span>
                  <span
                    className="text-[18px] font-bold leading-tight"
                    style={{ color: isOpen ? "#ff5b35" : "#0d0d0d" }}
                  >
                    {f.name}
                  </span>
                </div>

                {/* Right: rotating plus icon */}
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="shrink-0 w-7 h-7 rounded-full border border-[#e8e8e2] flex items-center justify-center text-[18px] font-light leading-none select-none"
                  style={{ color: isOpen ? "#ff5b35" : "#999990" }}
                >
                  +
                </motion.span>
              </button>

              {/* Expandable content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-[15px] text-[#555550] leading-[1.7] mb-4">{f.body}</p>
                      <blockquote className="pl-4 border-l-[3px] border-[#ff5b35]">
                        <p className="font-serif italic text-[15px] text-[#888880] leading-[1.7]">
                          {f.quote}
                        </p>
                      </blockquote>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
