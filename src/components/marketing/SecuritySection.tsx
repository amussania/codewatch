"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PILLARS = [
  {
    icon: "🔒",
    title: "Your code never touches our disk",
    desc: "Every review runs in a sandboxed, ephemeral process. When the review ends, the process is destroyed. There is no database write. There is no file system write. Zero persistence by design.",
    color: "#ff5b35",
  },
  {
    icon: "🔑",
    title: "Row-level tenant isolation",
    desc: "Every user account operates in a fully isolated tenant context. No shared query surfaces. No shared caches. Your review history is cryptographically inaccessible to any other user.",
    color: "#4da3ff",
  },
  {
    icon: "🗑️",
    title: "Zero Data Retention by default",
    desc: "The review result is returned to you and then deleted. We do not store your code, your review output, or any metadata derived from your code. Default on every plan.",
    color: "#00c4a0",
  },
  {
    icon: "💣",
    title: "Delete everything, anytime",
    desc: "One button. Your account, your review history, your business logic context configurations — permanently purged. GDPR Article 17 compliant. No waiting period.",
    color: "#fbbf24",
  },
];

const FLOW_STEPS = [
  { label: "Your code", icon: "📋", note: "Paste in browser" },
  { label: "Encrypted transit", icon: "🔐", note: "TLS 1.3" },
  { label: "Ephemeral sandbox", icon: "⚡", note: "Isolated process" },
  { label: "Review result", icon: "✅", note: "Returned to you" },
  { label: "Process destroyed", icon: "🗑️", note: "Zero retention" },
];

export default function SecuritySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".sec-pillar", {
        y: 28,
        opacity: 0,
        duration: 0.65,
        stagger: { amount: 0.35 },
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
    <section ref={sectionRef} id="security" className="py-[8.75rem] max-w-[1200px] mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[#8896ab] text-xs font-semibold uppercase tracking-widest">
          Security
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold mt-3 tracking-tight">
          Your code is never stored.
          <br />
          <span className="text-[#ff5b35]">By design.</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
          We built CODEWATCH for teams reviewing proprietary, production code.
          Security is not a feature. It is the architecture.
        </p>
      </div>

      {/* 2-column layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: security pillars */}
        <div className="space-y-4">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="sec-pillar rounded-xl border border-[#e8edf5] bg-[var(--cw-surface)] p-5 flex gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 mt-0.5"
                style={{ backgroundColor: `${p.color}15`, border: `1px solid ${p.color}25` }}
              >
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1.5">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: data flow diagram */}
        <div className="rounded-2xl border border-[#e8edf5] bg-[var(--cw-surface)] p-8 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-8 text-center">
            What happens to your code
          </p>
          <div className="flex flex-col gap-0">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.label}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f8faff] border border-[#e8edf5] flex items-center justify-center text-lg shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground/80">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.note}</p>
                  </div>
                  {i === FLOW_STEPS.length - 1 && (
                    <span className="text-[10px] font-bold text-[#00c4a0] bg-[#00c4a0]/10 border border-[#00c4a0]/20 px-2 py-0.5 rounded">
                      ZERO STORED
                    </span>
                  )}
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="ml-5 w-px h-5 bg-[#f0f3f9]" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-[#ff5b35]/[0.06] border border-[#ff5b35]/15 p-4 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-foreground/80 font-medium">Never used for AI training.</span>{" "}
              Model-level opt-outs are enforced at the API contract level with every provider we use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
