"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
    num: "001",
    pill: "UNIQUE",
    pillColor: "#ff5b35",
    name: "Business Logic Context",
    body: "Every other tool is domain-blind. They review code in a vacuum. They can tell you the code is syntactically valid. They cannot tell you it is logically wrong for your business.",
    quote:
      "When a developer implemented a pricing calculation with an off-by-one error in the discount logic, the leading competitor didn't flag it. The function was syntactically correct. The business rule was wrong.",
    extra:
      "CODEWATCH is the only tool where you describe your business rules — currency, fee structures, user roles, state transitions — and the AI validates code against those exact rules. Not generic patterns. Your rules.",
  },
  {
    num: "002",
    pill: "UNIQUE",
    pillColor: "#ff5b35",
    name: "AI Origin Probability",
    body: "41% of global code is now AI-generated. App stores are rejecting vibe-coded apps. Enterprise teams are setting quality gates. CODEWATCH scores every review with a 0–100% probability that the submitted code was AI-generated.",
    extra:
      "Set a threshold per project. Flag anything above 80% before it goes to production.",
  },
  {
    num: "003",
    pill: "EXCLUSIVE",
    pillColor: "#00c4a0",
    name: "Humanisation Layer",
    body: "No competitor has any concept of this. After the fail-safe rewrite, run the Humanisation Layer. It applies real human engineering fingerprints: variable naming drift, WHY comments, intentional TODOs, asymmetric error handling.",
    extra:
      "The code remains 100% functionally identical. It reads like it was built by an experienced team over six months.",
  },
  {
    num: "004",
    pill: "EXCLUSIVE",
    pillColor: "#00c4a0",
    name: "Fail-Safe Rewrite",
    body: "Every other tool gives you a to-do list. CODEWATCH gives you the fixed code. The fail-safe rewrite keeps the same behaviour on the happy path and hardens everything else: explicit error propagation, environment variables replacing hardcoded secrets, timeouts on every external call.",
    extra: "You take the rewritten code, paste it back, ship it. Done.",
  },
  {
    num: "005",
    pill: "ONLY US",
    pillColor: "#4da3ff",
    name: "No Git Setup Required",
    body: "Every major competitor requires connecting a repository. CODEWATCH works with a paste. A freelancer reviewing client code. A non-technical founder checking what their developer sent. A consultant auditing legacy code with no Git access.",
    extra:
      "All of them can use CODEWATCH in thirty seconds. No OAuth. No permissions. No setup.",
  },
];

export default function UniqueFeatures() {
  return (
    <section className="py-[120px] max-w-[1100px] mx-auto px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-center mb-20"
      >
        <p className="font-sans text-[#ff5b35] text-[10px] tracking-[.2em] uppercase mb-4">
          — What Nobody Else Does
        </p>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em]">
          The gaps every
          <br />
          <span className="text-[#ff5b35]">competitor leaves open.</span>
        </h2>
        <p className="text-[#3d4f6b] mt-5 max-w-lg mx-auto leading-relaxed">
          Every competitor catches syntax errors and common patterns. These capabilities exist nowhere else in the market.
        </p>
      </motion.div>

      <div className="flex flex-col border border-[#e2e2ee] rounded-2xl overflow-hidden divide-y divide-[#e2e2ee]">
        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.48, delay: i * 0.08, ease: "easeOut" }}
            className="grid md:grid-cols-[300px_1fr] bg-white hover:bg-[#fafafa] transition-colors duration-200"
          >
            {/* Left: number + pill + title */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-[#e2e2ee] flex flex-col justify-center gap-3">
              <span className="font-sans text-[10px] tracking-[.18em] text-[#8896ab]/60 uppercase">
                {f.num}
              </span>
              <span
                className="inline-block text-[10px] font-sans font-bold px-2.5 py-1 rounded tracking-[0.08em] w-fit border"
                style={{
                  backgroundColor: `${f.pillColor}14`,
                  color: f.pillColor,
                  borderColor: `${f.pillColor}28`,
                }}
              >
                {f.pill}
              </span>
              <h3 className="font-heading text-[22px] leading-tight tracking-[.02em]">{f.name}</h3>
            </div>

            {/* Right: description */}
            <div className="p-8 md:p-10">
              <p className="text-sm text-[#3d4f6b] leading-[1.85]">
                <strong className="text-[#0a0f1e] font-semibold">
                  {f.body.split(".")[0]}.
                </strong>{" "}
                {f.body.slice(f.body.indexOf(".") + 2)}
              </p>
              {f.quote && (
                <blockquote className="mt-4 pl-4 border-l-2 border-[#ff5b35]/30 text-sm text-[#3d4f6b]/60 italic leading-relaxed">
                  {f.quote}
                </blockquote>
              )}
              {f.extra && (
                <p className="mt-3 text-sm text-[#3d4f6b] leading-[1.85]">{f.extra}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
