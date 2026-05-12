"use client";

import { motion } from "framer-motion";

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
  { label: "Your code",          icon: "📋", note: "Paste in browser" },
  { label: "Encrypted transit",  icon: "🔐", note: "TLS 1.3" },
  { label: "Ephemeral sandbox",  icon: "⚡", note: "Isolated process" },
  { label: "Review result",      icon: "✅", note: "Returned to you" },
  { label: "Process destroyed",  icon: "🗑️", note: "Zero retention" },
];

export default function SecuritySection() {
  return (
    <section id="security" className="py-[140px] max-w-[1120px] mx-auto px-6 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="block w-6 h-px bg-[#ff5b35]" />
          <span className="text-[#ff5b35] text-[11px] tracking-[.2em] uppercase font-medium">Security</span>
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[1.15] tracking-[-0.02em] mt-3">
          Your code is never stored.
          <br />
          <span className="text-[#ff5b35]">By design.</span>
        </h2>
        <p className="text-[17px] text-[#999990] mt-4 max-w-lg mx-auto leading-[1.7]">
          We built CODEWATCH for teams reviewing proprietary, production code.
          Security is not a feature. It is the architecture.
        </p>
      </motion.div>

      {/* 2-column layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Security pillars */}
        <div className="space-y-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="rounded-2xl border border-[#e8e8e2] bg-white p-5 flex gap-4 hover:border-[#d0d0c8] transition-colors duration-300"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 mt-0.5"
                style={{ backgroundColor: `${p.color}12`, border: `1px solid ${p.color}22` }}
              >
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1.5 text-[#0d0d0d]">{p.title}</h3>
                <p className="text-xs text-[#555550] leading-[1.7]">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Data flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-2xl border border-[#e8e8e2] bg-white p-8 flex flex-col justify-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#999990]/60 mb-8 text-center">
            What happens to your code
          </p>
          <div className="flex flex-col gap-0">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.label}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f4f0] border border-[#e8e8e2] flex items-center justify-center text-lg shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0d0d0d]/80">{step.label}</p>
                    <p className="text-xs text-[#999990]">{step.note}</p>
                  </div>
                  {i === FLOW_STEPS.length - 1 && (
                    <span className="text-[10px] font-bold text-[#00c4a0] bg-[#00c4a0]/10 border border-[#00c4a0]/20 px-2 py-0.5 rounded">
                      ZERO STORED
                    </span>
                  )}
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="ml-5 w-px h-5 bg-[#e8e8e2]" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-[#ff5b35]/[0.05] border border-[#ff5b35]/12 p-4 text-center">
            <p className="text-xs text-[#555550] leading-[1.7]">
              <span className="text-[#0d0d0d] font-medium">Never used for AI training.</span>{" "}
              Model-level opt-outs are enforced at the API contract level with every provider we use.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
