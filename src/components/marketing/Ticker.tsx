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
    <div className="border-t border-b border-[#e8edf5] overflow-hidden bg-[#f4f6fb] py-3.5">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="flex w-max"
        style={{
          gap: "3.5rem",
          animation: "ticker 30s linear infinite",
          willChange: "transform",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = "running";
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-2.5 whitespace-nowrap">
            <span className="text-[#ff5b35] text-[5px]" style={{ opacity: 0.4 }}>◆</span>
            <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#8896ab]">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
