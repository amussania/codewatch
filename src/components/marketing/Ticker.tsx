"use client";

const ITEMS = [
  "Security Specialist",
  "Reliability Engineer",
  "Business Logic Reviewer",
  "Performance Engineer",
  "Quality Gatekeeper",
  "Fail-Safe Rewrite",
  "Humanisation Layer",
  "AI Origin Detection",
  "White-Label Reports",
  "Zero Code Retention",
];

const doubled = [...ITEMS, ...ITEMS];

export default function Ticker() {
  return (
    <div
      className="border-t border-b border-[#e8e8e2] overflow-hidden bg-white py-3.5"
      onMouseEnter={(e) => {
        const track = e.currentTarget.firstElementChild as HTMLElement | null;
        if (track) track.style.animationPlayState = "paused";
      }}
      onMouseLeave={(e) => {
        const track = e.currentTarget.firstElementChild as HTMLElement | null;
        if (track) track.style.animationPlayState = "running";
      }}
    >
      <div
        className="flex w-max"
        style={{
          gap: "3.5rem",
          animation: "ticker 30s linear infinite",
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-2.5 whitespace-nowrap">
            <span className="text-[#ff5b35] text-[5px]" style={{ opacity: 0.5 }}>◆</span>
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#999990]">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
