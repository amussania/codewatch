"use client";

import { motion } from "framer-motion";

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

      <div className="rounded-2xl border border-[#e8e8e2] bg-white overflow-hidden">
        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`flex flex-col md:flex-row hover:bg-[#faf9f6] transition-colors duration-200 ${
              i < FEATURES.length - 1 ? "border-b border-[#e8e8e2]" : ""
            }`}
          >
            {/* Left 35%: pill + name */}
            <div className="md:w-[35%] shrink-0 px-8 py-8 flex flex-col gap-3 justify-center border-b md:border-b-0 md:border-r border-[#e8e8e2]">
              <span
                className="font-sans text-[10px] uppercase tracking-[0.08em] px-3 py-1 rounded-full w-fit"
                style={{
                  backgroundColor: "rgba(255,91,53,0.08)",
                  color: "#ff5b35",
                  border: "1px solid rgba(255,91,53,0.15)",
                }}
              >
                {f.pill}
              </span>
              <h3 className="text-[18px] font-bold leading-tight text-[#0d0d0d]">{f.name}</h3>
            </div>

            {/* Right 65%: description + pull quote */}
            <div className="flex-1 px-8 py-8 flex flex-col gap-4 justify-center">
              <p className="text-[15px] text-[#555550] leading-[1.8]">{f.body}</p>
              <blockquote className="pl-4 border-l-[3px] border-[#ff5b35]">
                <p className="font-serif italic text-[15px] text-[#888880] leading-[1.7]">{f.quote}</p>
              </blockquote>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
