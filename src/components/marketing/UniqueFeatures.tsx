"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".uf-item", {
        y: 28,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-[8.75rem] max-w-[1200px] mx-auto px-6">
      <div className="text-center mb-16">
        <span className="text-[#8896ab] text-xs font-semibold uppercase tracking-widest">
          What Nobody Else Does
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
          The gaps every
          <br />
          <span className="text-[#ff5b35]">competitor leaves open.</span>
        </h2>
        <p className="text-muted-foreground mt-5 max-w-lg mx-auto leading-relaxed">
          Every competitor catches syntax errors and common patterns. These capabilities exist nowhere else in the market.
        </p>
      </div>

      <div className="flex flex-col border border-[#e8edf5] rounded-2xl overflow-hidden divide-y divide-[#e8edf5]">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="uf-item grid md:grid-cols-[280px_1fr] bg-[var(--cw-surface)] hover:bg-[var(--cw-surface-elevated)] transition-colors duration-200"
          >
            {/* Left: pill + title */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-[#e8edf5] flex flex-col justify-center">
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

            {/* Right: description */}
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
          </div>
        ))}
      </div>
    </section>
  );
}
