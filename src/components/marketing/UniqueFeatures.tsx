"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
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
    pill: "UNIQUE",
    pillColor: "#ff5b35",
    name: "AI Origin Probability",
    body: "41% of global code is now AI-generated. App stores are rejecting vibe-coded apps. Enterprise teams are setting quality gates. CODEWATCH scores every review with a 0–100% probability that the submitted code was AI-generated, based on structural tells: overly symmetric error handling, missing edge cases, no evidence of iteration, generic naming patterns.",
    extra:
      "Set a threshold per project. Flag anything above 80% before it goes to production.",
  },
  {
    pill: "EXCLUSIVE",
    pillColor: "#00c4a0",
    name: "Humanisation Layer",
    body: "No competitor has any concept of this. After the fail-safe rewrite, run the Humanisation Layer. It applies real human engineering fingerprints: variable naming drift that reflects how a developer's mental model evolves, WHY comments that reference specific decisions and incidents, intentional TODOs a real developer would leave, asymmetric error handling focused on what has burned them before.",
    extra:
      "The code remains 100% functionally identical. It reads like it was built by an experienced team over six months.",
  },
  {
    pill: "EXCLUSIVE",
    pillColor: "#00c4a0",
    name: "Fail-Safe Rewrite",
    body: "Every other tool gives you a to-do list. CODEWATCH gives you the fixed code. The fail-safe rewrite keeps the same behaviour on the happy path and hardens everything else: explicit error propagation, environment variables replacing hardcoded secrets, timeouts on every external call, input validation, null guards, logging at critical decision points.",
    extra: "You take the rewritten code, paste it back, ship it. Done.",
  },
  {
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
    <section className="py-[100px] max-w-[1100px] mx-auto px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="block w-6 h-px bg-[#ff5b35]" />
          <span className="text-[#ff5b35] text-[10px] tracking-[.2em] uppercase">What Nobody Else Does</span>
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em] mt-3">
          The gaps every
          <br />
          <span className="text-[#ff5b35]">competitor leaves open.</span>
        </h2>
        <p className="font-serif italic font-light text-[#8896ab] text-[17px] mt-5 max-w-lg mx-auto leading-relaxed">
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
            className="grid md:grid-cols-[280px_1fr] bg-[var(--cw-surface)] hover:bg-[var(--cw-surface-elevated)] transition-colors duration-200"
          >
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-[#e2e2ee] flex flex-col justify-center">
              <span
                className="inline-block text-[10px] font-bold px-2.5 py-1 rounded mb-4 tracking-[0.06em] w-fit border"
                style={{
                  backgroundColor: `${f.pillColor}14`,
                  color: f.pillColor,
                  borderColor: `${f.pillColor}28`,
                }}
              >
                {f.pill}
              </span>
              <h3 className="text-xl font-bold leading-tight tracking-tight">{f.name}</h3>
            </div>

            <div className="p-8 md:p-10">
              <p className="text-sm text-muted-foreground leading-[1.85]">
                <strong className="text-foreground/80 font-semibold">
                  {f.body.split(".")[0]}.
                </strong>{" "}
                {f.body.slice(f.body.indexOf(".") + 2)}
              </p>
              {f.quote && (
                <blockquote className="mt-4 pl-4 border-l-2 border-[#ff5b35]/35 text-sm text-foreground/50 italic leading-relaxed">
                  {f.quote}
                </blockquote>
              )}
              {f.extra && (
                <p className="mt-3 text-sm text-muted-foreground leading-[1.85]">{f.extra}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
