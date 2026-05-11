"use client";

import { useEffect, useState } from "react";

const SAMPLE_CODE = `async function verifyToken(token: string) {
  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  const user = await db.users.findById(payload.sub);
  if (!user?.active) throw new AuthError("Account suspended");
  return user;
}`;

interface ReviewEditorProps {
  code?: string;
  isTyping?: boolean;
}

export default function ReviewEditor({
  code = SAMPLE_CODE,
  isTyping = true,
}: ReviewEditorProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const speed = 18;

    const interval = setInterval(() => {
      if (i < code.length) {
        setDisplayed(code.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [code]);

  const lines = displayed.split("\n");

  return (
    <div className="rounded-xl border border-white/8 bg-[var(--cw-surface)] overflow-hidden font-mono text-sm">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 bg-[var(--cw-surface-elevated)]">
        <div className="flex gap-1.5">
          {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground ml-2">auth.service.ts</span>
      </div>

      {/* Code body */}
      <div className="p-4 min-h-[200px] overflow-x-auto">
        <pre className="text-[13px] leading-6">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="text-muted-foreground/40 w-8 text-right mr-4 select-none shrink-0">
                {i + 1}
              </span>
              <span className="text-foreground/80">
                {line}
                {i === lines.length - 1 && !done && isTyping && (
                  <span className="terminal-cursor inline-block w-[2px] h-[1em] bg-[var(--cw-coral)] ml-px align-text-bottom" />
                )}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
