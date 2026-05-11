"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, ChevronDown } from "lucide-react";
import CodeInput from "@/components/dashboard/CodeInput";
import ScoreRing from "@/components/dashboard/ScoreRing";
import IssueCard, { type Issue } from "@/components/dashboard/IssueCard";

const LANGUAGES = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
];

const SPECIALISTS = [
  { value: "all", label: "All Issues" },
  { value: "security", label: "Security" },
  { value: "performance", label: "Performance" },
  { value: "style", label: "Code Style" },
  { value: "bugs", label: "Bug Hunt" },
];

const STATUS_MESSAGES = [
  "Parsing code structure…",
  "Running security checks…",
  "Analysing performance patterns…",
  "Checking code style…",
  "Generating suggestions…",
  "Finalising review…",
];

const MOCK_ISSUES: Issue[] = [
  {
    id: "iss-1",
    severity: "high",
    title: "Unhandled exception from jwt.verify()",
    description:
      "jwt.verify() throws synchronously on invalid or expired tokens. Without a try/catch, this propagates as an unhandled rejection and can crash the request handler.",
    line: 2,
    file: "auth.ts",
  },
  {
    id: "iss-2",
    severity: "high",
    title: "Missing input validation on token parameter",
    description:
      "The token parameter accepts any string without length or format validation. Passing a crafted payload may trigger a ReDoS vulnerability in some JWT implementations.",
    line: 1,
    file: "auth.ts",
  },
  {
    id: "iss-3",
    severity: "medium",
    title: "Payload typed as any — bypasses TypeScript safety",
    description:
      "jwt.verify() returns any by default. Accessing payload.sub without an explicit type guard bypasses TypeScript's type system and may cause runtime errors.",
    line: 2,
    file: "auth.ts",
  },
  {
    id: "iss-4",
    severity: "low",
    title: "Inconsistent error hierarchy",
    description:
      "AuthError is thrown for a business-logic check but jwt.verify failures surface as raw JWT errors. Unifying them improves logging and client error responses.",
    line: 4,
    file: "auth.ts",
  },
];

const MOCK_REWRITTEN = `import type { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  sub: string;
}

async function verifyToken(token: string) {
  if (!token || typeof token !== "string") {
    throw new AuthError("Invalid token format");
  }

  let payload: TokenPayload;
  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as TokenPayload;
  } catch {
    throw new AuthError("Token verification failed");
  }

  const user = await db.users.findById(payload.sub);
  if (!user?.active) throw new AuthError("Account suspended");
  return user;
}`;

const MOCK_SCORE = 72;

type Phase = "idle" | "reviewing" | "done";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function scoreVerdict(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "Excellent", color: "#4a9fff" };
  if (score >= 70) return { label: "Good — a few issues", color: "#4a9fff" };
  if (score >= 50) return { label: "Needs Work", color: "#f59e0b" };
  return { label: "Critical Issues", color: "#ff6b6b" };
}

const selectCls = [
  "h-9 pl-3 pr-8 rounded-lg bg-white/[0.05] border border-white/10",
  "text-sm text-foreground/80 appearance-none outline-none cursor-pointer",
  "focus:border-[#ff6b6b] focus:ring-1 focus:ring-[#ff6b6b] transition-all",
].join(" ");

export default function DashboardPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [specialist, setSpecialist] = useState("all");
  const [statusIdx, setStatusIdx] = useState(0);
  const [ringKey, setRingKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"issues" | "rewritten">("issues");
  const [issues, setIssues] = useState<Issue[]>([]);

  async function runReview() {
    if (!code.trim()) return;
    setPhase("reviewing");
    setStatusIdx(0);

    for (let i = 1; i < STATUS_MESSAGES.length; i++) {
      await delay(310);
      setStatusIdx(i);
    }
    await delay(310);

    setIssues(MOCK_ISSUES);
    setRingKey((k) => k + 1);
    setActiveTab("issues");
    setPhase("done");
  }

  function reset() {
    setPhase("idle");
    setCode("");
    setIssues([]);
  }

  const verdict = scoreVerdict(MOCK_SCORE);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>

        {/* ── IDLE ─────────────────────────────────────────── */}
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col h-full p-5 gap-4"
          >
            {/* Control bar */}
            <div className="flex items-center justify-between gap-4 shrink-0">
              <div>
                <h1 className="text-base font-semibold tracking-tight">Code Review</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Paste your code and get an instant AI review
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Language */}
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={selectCls}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value} className="bg-[#0d0f1a]">
                        {l.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                </div>

                {/* Specialist */}
                <div className="relative">
                  <select
                    value={specialist}
                    onChange={(e) => setSpecialist(e.target.value)}
                    className={selectCls}
                  >
                    {SPECIALISTS.map((s) => (
                      <option key={s.value} value={s.value} className="bg-[#0d0f1a]">
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                </div>

                {/* Review button */}
                <button
                  onClick={runReview}
                  disabled={!code.trim()}
                  className={[
                    "flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold",
                    "bg-[#ff6b6b] text-white shadow-lg shadow-[#ff6b6b22]",
                    "hover:bg-[#ff6b6b]/90 active:scale-[0.97] transition-all",
                    "disabled:opacity-35 disabled:cursor-not-allowed disabled:active:scale-100",
                  ].join(" ")}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Review
                </button>
              </div>
            </div>

            {/* Terminal code input */}
            <CodeInput
              value={code}
              onChange={setCode}
              className="flex-1"
            />
          </motion.div>
        )}

        {/* ── REVIEWING ────────────────────────────────────── */}
        {phase === "reviewing" && (
          <motion.div
            key="reviewing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-center justify-center h-full gap-5"
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#ff6b6b]"
                  animate={{ y: [0, -9, 0], opacity: [0.35, 1, 0.35] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.85,
                    delay: i * 0.17,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={statusIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
                className="text-sm text-muted-foreground"
              >
                {STATUS_MESSAGES[statusIdx]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── DONE ─────────────────────────────────────────── */}
        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/8 shrink-0">
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                New review
              </button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{LANGUAGES.find((l) => l.value === language)?.label}</span>
                <span className="opacity-30">·</span>
                <span>{SPECIALISTS.find((s) => s.value === specialist)?.label}</span>
                <span className="opacity-30">·</span>
                <span>{issues.length} issues found</span>
              </div>
            </div>

            {/* Split panels */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left — read-only code (40%) */}
              <div className="w-[40%] p-4 overflow-hidden flex shrink-0">
                <CodeInput value={code} readOnly className="flex-1" />
              </div>

              <div className="w-px bg-white/8 shrink-0" />

              {/* Right — results (60%) */}
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Score */}
                <div className="flex items-center gap-5 px-5 py-4 border-b border-white/8 shrink-0">
                  <ScoreRing key={ringKey} score={MOCK_SCORE} size={88} strokeWidth={6} />
                  <div>
                    <p className="text-2xl font-bold tabular-nums leading-none">
                      {MOCK_SCORE}
                      <span className="text-sm font-normal text-muted-foreground"> / 100</span>
                    </p>
                    <p className="text-sm font-medium mt-1.5" style={{ color: verdict.color }}>
                      {verdict.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                      {issues.filter((iss) => iss.severity === "high").length} critical
                      {" · "}
                      {issues.filter((iss) => iss.severity === "medium").length} warning
                      {" · "}
                      {issues.filter((iss) => iss.severity === "low").length} info
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-5 py-2 border-b border-white/8 shrink-0">
                  {(["issues", "rewritten"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={[
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        activeTab === tab
                          ? "bg-[#ff6b6b]/12 text-[#ff6b6b]"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                      ].join(" ")}
                    >
                      {tab === "issues" ? `Issues (${issues.length})` : "Rewritten Code"}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <AnimatePresence mode="wait" initial={false}>
                    {activeTab === "issues" && (
                      <motion.div
                        key="tab-issues"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3"
                      >
                        {issues.map((issue, i) => (
                          <IssueCard key={issue.id} issue={issue} index={i} />
                        ))}
                      </motion.div>
                    )}

                    {activeTab === "rewritten" && (
                      <motion.div
                        key="tab-rewritten"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="h-full min-h-[400px] flex flex-col"
                      >
                        <CodeInput value={MOCK_REWRITTEN} readOnly className="flex-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
