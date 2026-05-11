"use client";

import { useRef } from "react";

interface CodeInputProps {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minLines?: number;
  className?: string;
}

export default function CodeInput({
  value,
  onChange,
  placeholder = "// Paste your code here…",
  readOnly = false,
  minLines = 18,
  className = "",
}: CodeInputProps) {
  const taRef  = useRef<HTMLTextAreaElement>(null);
  const lnRef  = useRef<HTMLDivElement>(null);

  const lineCount = Math.max(value.split("\n").length, minLines);

  function syncScroll() {
    if (lnRef.current && taRef.current) {
      lnRef.current.scrollTop = taRef.current.scrollTop;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (readOnly) return;
    if (e.key === "Tab") {
      e.preventDefault();
      const ta    = taRef.current!;
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const next  = value.slice(0, start) + "  " + value.slice(end);
      onChange?.(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  }

  return (
    <div
      className={`relative flex h-full rounded-xl overflow-hidden border border-white/8 bg-black/40 font-mono text-[13px] leading-6 ${className}`}
    >
      {/* Window chrome dots */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-3.5 h-8 border-b border-white/6 bg-black/30 z-10">
        {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
          <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* Line numbers — synced scroll, hidden scrollbar */}
      <div
        ref={lnRef}
        className="shrink-0 pt-10 pb-4 w-12 overflow-y-hidden select-none bg-black/25 border-r border-white/6 text-right"
        style={{ scrollbarWidth: "none" }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="pr-3 text-muted-foreground/25 leading-6">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={taRef}
        value={value}
        readOnly={readOnly}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={readOnly ? "" : placeholder}
        onChange={readOnly ? undefined : (e) => onChange?.(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={handleKeyDown}
        className={[
          "flex-1 pt-10 pb-4 px-4 bg-transparent resize-none outline-none w-full",
          "text-foreground/80 placeholder:text-muted-foreground/20 leading-6",
          readOnly ? "cursor-default" : "",
        ].join(" ")}
      />
    </div>
  );
}
