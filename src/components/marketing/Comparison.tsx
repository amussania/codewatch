"use client";

import { motion } from "framer-motion";

type CellVal = true | false | "partial" | string;

const ROWS: { label: string; sub?: string; cw: CellVal; cr: CellVal; gr: CellVal; cp: CellVal; cd: CellVal }[] = [
  { label: "Business Logic Context",   sub: "YOUR RULES",  cw: true,             cr: false,      gr: false,      cp: false,      cd: false },
  { label: "Fail-Safe Rewrite",        sub: "FIXED CODE",  cw: true,             cr: false,      gr: false,      cp: false,      cd: false },
  { label: "Humanisation Layer",       sub: "EXCLUSIVE",   cw: true,             cr: false,      gr: false,      cp: false,      cd: false },
  { label: "AI Origin Probability",    sub: undefined,     cw: true,             cr: false,      gr: false,      cp: false,      cd: false },
  { label: "No Repo Connection",       sub: undefined,     cw: true,             cr: false,      gr: false,      cp: false,      cd: false },
  { label: "Multi-Specialist Panel",   sub: undefined,     cw: "5 specialists",  cr: "partial",  gr: "partial",  cp: "partial",  cd: "partial" },
  { label: "White-Label Reports",      sub: undefined,     cw: "Agency tier",    cr: false,      gr: false,      cp: false,      cd: false },
  { label: "Zero Code Retention",      sub: undefined,     cw: "Studio+",        cr: "partial",  gr: false,      cp: "partial",  cd: "partial" },
  { label: "Starting Price",           sub: undefined,     cw: "$12/mo",         cr: "$12/user", gr: "$30/seat", cp: "$10/mo",   cd: "$15/user" },
];

const COMPETITORS = ["CodeRabbit", "Greptile", "Copilot", "Codacy"];

function CheckMark() {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center mx-auto"
      style={{ backgroundColor: "#ff5b35" }}
    >
      <span className="text-white text-[11px] font-bold leading-none">✓</span>
    </div>
  );
}

function CrossMark() {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center mx-auto"
      style={{ backgroundColor: "#e0e0e0" }}
    >
      <span className="text-[#999999] text-[11px] font-bold leading-none">✕</span>
    </div>
  );
}

function PartialMark() {
  return (
    <div className="w-6 h-6 rounded-full border-2 border-amber-400 flex items-center justify-center mx-auto bg-amber-50">
      <div className="w-2 h-2 rounded-full bg-amber-400" />
    </div>
  );
}

function CellContent({ val, isCW }: { val: CellVal; isCW?: boolean }) {
  if (val === true)      return <CheckMark />;
  if (val === false)     return <CrossMark />;
  if (val === "partial") return <PartialMark />;
  if (isCW)             return <span className="font-sans text-[12px] font-semibold text-[#ff5b35]">{val}</span>;
  return <span className="font-sans text-[12px] text-[#999990]">{val}</span>;
}

export default function Comparison() {
  return (
    <section className="py-[140px]">
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="block w-6 h-px bg-[#ff5b35]" />
            <span className="text-[#ff5b35] text-[11px] tracking-[.2em] uppercase font-medium">Comparison</span>
          </div>
          <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[1.15] tracking-[-0.02em] mt-3">
            How we stack up
            <br />
            <span className="text-[#ff5b35]">against the market.</span>
          </h2>
          <p className="text-[17px] text-[#999990] mt-5 max-w-lg mx-auto leading-[1.7]">
            Every competitor does code review. Not one of them does what the market actually needs in 2026.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-2xl border border-[#e8e8e2] overflow-hidden bg-white"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-[#e8e8e2]">
                  <th className="sticky left-0 z-10 bg-[#f5f4f0] text-left px-6 py-4 font-sans text-[11px] font-semibold text-[#999990] uppercase tracking-[0.1em] w-[220px]">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center" style={{ backgroundColor: "#ff5b35" }}>
                    <span className="font-sans text-[11px] font-semibold text-white uppercase tracking-[0.1em] whitespace-nowrap">
                      CODEWATCH
                    </span>
                  </th>
                  {COMPETITORS.map((c) => (
                    <th
                      key={c}
                      className="bg-[#f5f4f0] px-6 py-4 text-center font-sans text-[11px] font-semibold text-[#999990] uppercase tracking-[0.1em] whitespace-nowrap"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={i}
                    className={`group border-b border-[#f0ede8] last:border-0 hover:bg-[#f5f4f0] cursor-default transition-colors duration-150 ${
                      i % 2 === 1 ? "bg-[#fafaf8]" : "bg-white"
                    }`}
                    style={{ height: 56 }}
                  >
                    <td className="sticky left-0 z-10 bg-inherit group-hover:bg-[#f5f4f0] px-6 py-4 text-[14px] font-semibold text-[#0d0d0d] w-[220px] transition-colors duration-150">
                      {row.label}
                      {row.sub && (
                        <span className="ml-2 inline-block font-sans text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#ff5b35]/10 text-[#ff5b35] border border-[#ff5b35]/20 tracking-wider align-middle">
                          {row.sub}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center bg-[#ff5b35]/[0.025] group-hover:bg-[#ff5b35]/[0.04] transition-colors duration-150">
                      <CellContent val={row.cw} isCW />
                    </td>
                    <td className="px-6 py-4 text-center"><CellContent val={row.cr} /></td>
                    <td className="px-6 py-4 text-center"><CellContent val={row.gr} /></td>
                    <td className="px-6 py-4 text-center"><CellContent val={row.cp} /></td>
                    <td className="px-6 py-4 text-center"><CellContent val={row.cd} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
