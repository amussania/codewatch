"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FAQS = [
  {
    q: "Is my code safe? Will it be used to train AI models?",
    a: "Never. Your code is processed in an ephemeral sandbox, never written to disk, and deleted the moment your review is complete. We contractually opt out of model training at the API level with every provider we use. See our Security page for the full technical breakdown.",
  },
  {
    q: "Which programming languages does CodeWatch support?",
    a: "CodeWatch supports 30+ languages including TypeScript, JavaScript, Python, Go, Rust, Java, Kotlin, Swift, Ruby, PHP, C#, C++, SQL, GraphQL, and more. The Security Auditor and Performance Engineer specialists have language-specific rule sets for each.",
  },
  {
    q: "How accurate is CodeWatch compared to a senior human engineer?",
    a: "In our internal benchmarks across 500 open-source PRs, CodeWatch caught 94% of issues that were later flagged in production — compared to an average of 67% for human-only review. It's particularly strong on systematic patterns (N+1 queries, OWASP vulnerabilities, complexity hotspots) that humans miss under time pressure. It doesn't replace human judgment on architecture — but it makes humans faster and more consistent.",
  },
  {
    q: "Can I use CodeWatch on private or proprietary code?",
    a: "Yes. CodeWatch is designed for proprietary codebases. Your code is never logged, indexed, or shared. Enterprise customers can also deploy CodeWatch inside their own VPC so code never leaves their infrastructure at all.",
  },
  {
    q: "How does billing work? Can I cancel any time?",
    a: "Pro and Team plans are billed monthly with no lock-in. You can cancel at any time from your account settings — your plan stays active until the end of the billing period. We don't charge cancellation fees or require notice periods.",
  },
  {
    q: "What's the difference between the six specialists?",
    a: "Each specialist has a distinct focus: Security Auditor (OWASP, auth, injection), Performance Engineer (queries, memory, async), Architecture Reviewer (coupling, SOLID, patterns), Quality Analyst (complexity, naming, dead code), API Designer (REST/GraphQL contracts), and Tech Writer AI (JSDoc, OpenAPI, READMEs). You can run one or all six in parallel.",
  },
  {
    q: "How long does a review take?",
    a: "Most reviews complete in 6–12 seconds for files up to 500 lines. Larger files (up to 2,000 lines) typically complete in under 30 seconds. Running all six specialists in parallel adds roughly 4 seconds to the baseline.",
  },
  {
    q: "Does CodeWatch integrate with GitHub or my CI pipeline?",
    a: "Yes. The Pro plan includes a GitHub App that runs CodeWatch automatically on every pull request and posts findings as inline review comments. A webhook API lets you plug into any CI system — CircleCI, GitLab CI, Bitbucket Pipelines, and more.",
  },
];

function FAQItem({ faq, index, isOpen, onToggle }: {
  faq: typeof FAQS[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/8 last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm font-medium leading-snug pr-2 group-hover:text-foreground transition-colors">
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          className="shrink-0 mt-0.5 w-5 h-5 rounded-full border border-white/15 flex items-center justify-center text-muted-foreground group-hover:border-[#ff6b6b]/40 group-hover:text-[#ff6b6b] transition-colors"
        >
          <span className="text-xs font-bold leading-none">+</span>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-muted-foreground leading-relaxed pb-5 max-w-2xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".faq-item", {
        y: 20,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="faq" className="py-28 max-w-4xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="text-[#ff6b6b] text-sm font-medium uppercase tracking-widest">
          FAQ
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
          Common questions
        </h2>
        <p className="text-muted-foreground mt-4 max-w-sm mx-auto">
          Still have questions?{" "}
          <a href="mailto:hello@codewatch.dev" className="text-[#ff6b6b] hover:underline">
            Email us
          </a>
          {" "}— we reply within one business day.
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-[var(--cw-surface)] px-6 divide-y-0">
        {FAQS.map((faq, i) => (
          <div key={i} className="faq-item">
            <FAQItem
              faq={faq}
              index={i}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
