"use client";

import { useState, useCallback } from "react";

interface ReviewEditorProps {
  code?: string;
  onChange?: (code: string) => void;
  language?: string;
  readOnly?: boolean;
}

export default function ReviewEditor({
  code: initialCode = "",
  onChange,
  language = "typescript",
  readOnly = false,
}: ReviewEditorProps) {
  const [code, setCode] = useState(initialCode);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newCode = e.target.value;
      setCode(newCode);
      onChange?.(newCode);
    },
    [onChange]
  );

  const lines = code.split("\n");
  const lineCount = lines.length;

  return (
    <div className="rounded-xl border border-white/8 bg-[var(--cw-surface)] overflow-hidden font-mono text-sm">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-[var(--cw-surface-elevated)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            {language || "code"}.{language === "typescript" ? "ts" : language === "javascript" ? "js" : language}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{lineCount} lines</span>
      </div>

      {/* Code editor */}
      <div className="relative">
        <div className="flex">
          {/* Line numbers */}
          <div className="py-4 pl-4 pr-2 text-right select-none bg-[var(--cw-surface-elevated)]/50">
            {lines.map((_, i) => (
              <div key={i} className="text-muted-foreground/40 text-[13px] leading-6 w-8">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={code}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder="Paste your code here..."
            spellCheck={false}
            className="flex-1 py-4 px-4 bg-transparent text-[13px] leading-6 text-foreground/80 resize-none outline-none min-h-[300px] font-mono"
            style={{ tabSize: 2 }}
          />
        </div>
      </div>
    </div>
  );
}
