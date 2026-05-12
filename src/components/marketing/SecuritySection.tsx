"use client";

import { motion } from "framer-motion";

const PILLARS = [
  {
    icon: "🔒",
    title: "Code never touches our disk",
    desc: "Ephemeral process, zero writes, destroyed when the review ends.",
    color: "#ff5b35",
  },
  {
    icon: "🔑",
    title: "Row-level tenant isolation",
    desc: "Cryptographically isolated per account — no shared surfaces.",
    color: "#4da3ff",
  },
  {
    icon: "🗑️",
    title: "Zero data retention by default",
    desc: "Review result returned, then deleted. On every plan.",
    color: "#00c4a0",
  },
  {
    icon: "💣",
    title: "Delete everything, anytime",
    desc: "One button wipe. GDPR Article 17 compliant. No waiting period.",
    color: "#fbbf24",
  },
];

const CODE_LINES = [
  { indent: 0, tokens: [{ t: "const", c: "#4da3ff" }, { t: " result = ", c: "#e8e8e2" }, { t: "await", c: "#c4b5fd" }, { t: " codewatch", c: "#e8e8e2" }] },
  { indent: 1, tokens: [{ t: ".review", c: "#00c4a0" }, { t: "(", c: "#e8e8e2" }, { t: "{ code, context }", c: "#fbbf24" }, { t: ");", c: "#e8e8e2" }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ t: "// ephemeral process spawned", c: "#555550" }] },
  { indent: 0, tokens: [{ t: "// specialists run in parallel", c: "#555550" }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ t: "return", c: "#4da3ff" }, { t: " result;", c: "#e8e8e2" }] },
  { indent: 0, tokens: [{ t: "// process destroyed ✓", c: "#00c4a0" }] },
];

export default function SecuritySection() {
  return (
    <section id="security" className="py-[140px] max-w-[1120px] mx-auto px-6 lg:px-12">
      <div className="grid lg:grid-cols-2 gap-16 items-start">

        {/* ── Left: headline + compact pillars ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="block w-6 h-px bg-[#ff5b35]" />
              <span className="text-[#ff5b35] text-[11px] tracking-[.2em] uppercase font-medium">Security</span>
            </div>
            <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[1.15] tracking-[-0.02em] mt-3">
              Your code is never stored.
              <br />
              <span className="text-[#ff5b35]">By design.</span>
            </h2>
            <p className="text-[17px] text-[#999990] mt-4 leading-[1.7] max-w-md">
              We built CODEWATCH for teams reviewing proprietary, production code.
              Security is not a feature. It is the architecture.
            </p>
          </div>

          {/* Compact pillars */}
          <div className="space-y-4">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex items-center gap-4"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ backgroundColor: `${p.color}12`, border: `1px solid ${p.color}22` }}
                >
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-[#0d0d0d]">{p.title}</span>
                  <span className="text-sm text-[#999990] ml-2">{p.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: CSS code block + shield overlay ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-2xl overflow-hidden border border-[#e8e8e2]"
        >
          {/* Editor chrome */}
          <div className="bg-[#1c1c1c] px-4 py-3 flex items-center gap-2 border-b border-[#2a2a2a]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28ca42]" />
            <span className="ml-3 text-[11px] text-[#555550] font-mono tracking-wide">review.ts — ephemeral</span>
          </div>

          {/* Code + overlay */}
          <div className="relative bg-[#0f0f0f] px-6 py-6 min-h-[300px] font-mono text-[12px] leading-[1.9]">
            {/* Line numbers + code */}
            {CODE_LINES.map((line, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-[#333] w-4 text-right shrink-0 select-none">{i + 1}</span>
                <span style={{ paddingLeft: line.indent * 16 }}>
                  {line.tokens.map((tok, j) => (
                    <span key={j} style={{ color: tok.c }}>{tok.t}</span>
                  ))}
                </span>
              </div>
            ))}

            {/* Shield overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/75 to-transparent">
              {/* CSS shield using clip-path */}
              <div className="relative mb-4">
                <div
                  className="w-16 h-[72px] flex items-center justify-center"
                  style={{
                    background: "linear-gradient(150deg, #ff5b35 0%, #c4370f 100%)",
                    clipPath: "polygon(50% 0%, 100% 18%, 100% 68%, 50% 100%, 0% 68%, 0% 18%)",
                  }}
                >
                  <span className="text-white font-bold text-2xl relative z-10 mt-1">✓</span>
                </div>
              </div>
              <p className="text-white font-semibold text-sm tracking-wide">Zero Retention</p>
              <p className="text-[#555550] text-xs mt-1">Process destroyed after every review</p>

              <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffffff08] border border-[#ffffff10]">
                <span className="text-[#00c4a0] font-bold text-xs">TLS 1.3</span>
                <span className="text-[#333] text-xs">·</span>
                <span className="text-[#4da3ff] font-bold text-xs">AES-256</span>
                <span className="text-[#333] text-xs">·</span>
                <span className="text-[#fbbf24] font-bold text-xs">GDPR</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
