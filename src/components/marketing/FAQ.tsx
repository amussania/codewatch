"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How does the credit system work?",
    a: "Reviews are priced by code length: under 100 lines costs 1 credit, 100–300 lines costs 2 credits, 300–600 lines costs 4 credits, 600–1,500 lines costs 8 credits. A Production Clearance review — all five specialists plus Fail-Safe Rewrite — costs 12 credits regardless of file size. Credits reset monthly. Unused credits do not roll over except on Pro plans, where up to 200 credits roll over.",
  },
  {
    q: "Is my code stored anywhere?",
    a: "No. Code is processed in an ephemeral compute environment and destroyed at the end of the review. Nothing is written to disk. Nothing is retained in our database. The review result is returned to you and then deleted from our systems. This is not a policy — it is the architecture.",
  },
  {
    q: "Do I need a GitHub account or repository connection?",
    a: "No. CODEWATCH is paste-based. You paste code, you get a review. There is no OAuth flow, no repository permission request, no webhook setup required to use the product. It works in thirty seconds with no prior configuration. A freelancer reviewing client code, a founder checking what their developer sent, a consultant auditing legacy code with no Git access — all of them can use CODEWATCH immediately.",
  },
  {
    q: "Which programming languages does CODEWATCH support?",
    a: "CODEWATCH supports all major languages including TypeScript, JavaScript, Python, Go, Rust, Java, Kotlin, Swift, Ruby, PHP, C, C++, C#, SQL, GraphQL, Solidity, and more. The Business Logic Reviewer operates at the logic level and is language-agnostic — it validates your rules regardless of which language implements them.",
  },
  {
    q: "What is Business Logic Context and how do I use it?",
    a: "Before submitting your code, you describe what the code is supposed to do in business terms. You write things like: \"This function calculates the GST-inclusive price for Indian customers. The base rate is 18%. For essential goods it drops to 5%.\" CODEWATCH uses that description to validate whether your code correctly implements those rules. Syntax-only tools cannot do this. No other code review product does this.",
  },
  {
    q: "What is the Humanisation Layer?",
    a: "After the Fail-Safe Rewrite, you can run the Humanisation Layer. It applies engineering fingerprints that make the code read as if it was built by an experienced human developer: variable naming drift that reflects how a developer's mental model evolves, WHY comments referencing specific decisions and incidents, intentional TODOs a real developer would leave, asymmetric error handling focused on what has burned them before. The code remains 100% functionally identical. It no longer reads as AI-generated.",
  },
  {
    q: "Can I use CODEWATCH for client code reviews?",
    a: "Yes. The Agency tier includes white-label report generation. Reports are exported with your own branding, your own commentary fields, and no reference to CODEWATCH. Your clients see your analysis. They have no idea there is AI behind it. Multiple agency customers have increased their review retainer fees after switching to CODEWATCH.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "You can top up at any time for $2.99 per 25 credits. Your monthly subscription renews on its normal cycle. There are no overage charges — if you run out of credits, reviews are paused until you top up or your plan renews. You will never be charged more than you agreed to.",
  },
];

// ─── Injected styles ──────────────────────────────────────────────────────────

const FAQ_STYLES = `
  .cw-faq-email {
    position: relative;
    color: var(--cw-ember);
    text-decoration: none;
    display: inline-block;
  }
  .cw-faq-email::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--cw-ember);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .cw-faq-email:hover::after {
    transform: scaleX(1);
  }
`;

// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FAQItem({
  faq,
  isOpen,
  onToggle,
  delay,
}: {
  faq: (typeof FAQS)[0];
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: reduced ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        borderBottom: "0.5px solid rgba(26,23,20,0.1)",
        boxShadow: isOpen ? "inset 3px 0 0 var(--cw-ember)" : "inset 3px 0 0 transparent",
        transition: "box-shadow 200ms ease",
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 20,
          padding: "28px 0",
          paddingLeft: isOpen ? 20 : 0,
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "padding-left 200ms ease",
        }}
      >
        {/* Question text */}
        <span
          style={{
            fontSize: 17,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            color: isOpen ? "var(--cw-ember)" : "var(--cw-ink-primary)",
            lineHeight: 1.4,
            transition: "color 200ms ease",
            flex: 1,
          }}
        >
          {faq.q}
        </span>

        {/* Dash → diagonal indicator */}
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            marginTop: 3,
            fontSize: 20,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            lineHeight: 1,
            color: isOpen ? "var(--cw-ember)" : "var(--cw-ink-tertiary)",
            display: "inline-block",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 200ms ease, color 200ms ease",
          }}
        >
          —
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                fontSize: 15,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                color: "var(--cw-ink-secondary)",
                lineHeight: 1.7,
                margin: 0,
                padding: "8px 0 28px 20px",
                maxWidth: "72ch",
              }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <section
      id="faq"
      style={{ background: "var(--cw-bg-secondary)", padding: "140px 0" }}
    >
      <style>{FAQ_STYLES}</style>

      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                display: "block",
                width: 24,
                height: 1,
                background: "var(--cw-ember)",
              }}
            />
            <span
              style={{
                color: "var(--cw-ember)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              FAQ
            </span>
          </div>
          <h2
            className="font-heading italic"
            style={{
              fontSize: "clamp(38px, 5vw, 56px)",
              lineHeight: 1.15,
              color: "var(--cw-ink-primary)",
              margin: "0 0 16px",
            }}
          >
            Common questions
          </h2>
          <p
            style={{
              fontSize: 17,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: "var(--cw-ink-secondary)",
              lineHeight: 1.7,
              maxWidth: 360,
              margin: "0 auto",
            }}
          >
            Still have questions?{" "}
            <a href="mailto:hello@codewatch.dev" className="cw-faq-email">
              Email us
            </a>{" "}
            — we reply the same business day.
          </p>
        </motion.div>

        {/* FAQ rows — no card wrapper, sit directly on background */}
        <div style={{ borderTop: "0.5px solid rgba(26,23,20,0.1)" }}>
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              delay={i * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
