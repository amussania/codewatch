"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

function CellContent({ val, isCW }: { val: CellVal; isCW?: boolean }) {
  if (val === true)      return <span className="text-[#00c4a0] font-bold text-base leading-none">✓</span>;
  if (val === false)     return <span className="text-[#c5cdd9] text-base leading-none">✗</span>;
  if (val === "partial") return <span className="text-amber-400 text-base leading-none">◉</span>;
  if (isCW)             return <span className="text-[#00c4a0] font-semibold text-sm">{val}</span>;
  return <span className="text-muted-foreground text-sm">{val}</span>;
}

export default function Comparison() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".comp-row", {
        y: 14,
        opacity: 0,
        duration: 0.45,
        stagger: 0.055,
        ease: "power2.out",
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
    <section ref={sectionRef} className="py-[8.75rem] bg-[#f7f7fa]">
      <div className="max-w-[1200px] mx-auto px-6">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2.5">
          <span className="block w-5 h-px bg-[#00b85f]" />
          <span className="text-[#00b85f] text-[10px] font-medium tracking-[.2em] uppercase">Comparison</span>
          <span className="block w-5 h-px bg-[#00b85f]" />
        </div>
        <h2 className="font-heading text-[clamp(38px,5vw,64px)] leading-[.97] tracking-[.02em] mt-3">
          How we stack up
          <br />
          <span className="text-[#00b85f]">against the market.</span>
        </h2>
        <p className="font-serif italic font-light text-[#7070a0] text-[17px] mt-5 max-w-lg mx-auto leading-relaxed">
          Every competitor does code review. Not one of them does what the market actually needs in 2026.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e2e2ee] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#e2e2ee] bg-[#f2f2f8]">
                <th className="text-left px-5 py-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest w-[240px]">
                  Feature
                </th>
                <th className="px-5 py-4 text-center text-[11px] font-semibold text-[#00b85f] uppercase tracking-widest">
                  CODEWATCH
                </th>
                {COMPETITORS.map((c) => (
                  <th
                    key={c}
                    className="px-5 py-4 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-widest"
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
                  className="comp-row border-b border-[#e2e2ee] last:border-0 hover:bg-[#f2f2f8] transition-colors"
                >
                  <td className="px-5 py-4 text-foreground/80">
                    {row.label}
                    {row.sub && (
                      <span className="ml-2 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#00b85f]/10 text-[#00b85f] border border-[#00b85f]/20 tracking-wider align-middle">
                        {row.sub}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center bg-[#00b85f]/[0.025]">
                    <CellContent val={row.cw} isCW />
                  </td>
                  <td className="px-5 py-4 text-center"><CellContent val={row.cr} /></td>
                  <td className="px-5 py-4 text-center"><CellContent val={row.gr} /></td>
                  <td className="px-5 py-4 text-center"><CellContent val={row.cp} /></td>
                  <td className="px-5 py-4 text-center"><CellContent val={row.cd} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </section>
  );
}
