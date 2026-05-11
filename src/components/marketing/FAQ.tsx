"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

function FAQItem({ faq, index, isOpen, onToggle }: {
  faq: typeof FAQS[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#e8edf5] last:border-0">
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
          className="shrink-0 mt-0.5 w-5 h-5 rounded-full border border-[#e8edf5] flex items-center justify-center text-muted-foreground group-hover:border-[#ff5b35]/40 group-hover:text-[#ff5b35] transition-colors"
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
    <section ref={sectionRef} id="faq" className="py-[8.75rem] bg-[#f8faff]">
      <div className="max-w-3xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="text-[#8896ab] text-xs font-semibold uppercase tracking-widest">
          FAQ
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
          Common questions
        </h2>
        <p className="text-muted-foreground mt-4 max-w-sm mx-auto">
          Still have questions?{" "}
          <a href="mailto:hello@codewatch.dev" className="text-[#ff5b35] hover:underline">
            Email us
          </a>
          {" "}— we reply the same business day.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e8edf5] bg-[var(--cw-surface)] px-6 divide-y-0">
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
      </div>
    </section>
  );
}
