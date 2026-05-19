"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, Wallet, Copy, Check } from "lucide-react";
import CodeInput from "@/components/dashboard/CodeInput";
import ScoreRing from "@/components/dashboard/ScoreRing";
import IssueCard, { type Issue } from "@/components/dashboard/IssueCard";
import { toast } from "sonner";

// ─── Constants ───────────────────────────────────────────────────────────────

const LANGUAGES = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "shell", label: "Shell" },
  { value: "other", label: "Other" },
];

// Specialists — security + reliability always on, rest are optional toggles
const OPTIONAL_SPECIALISTS = [
  { id: "business", label: "Business Logic", icon: "💰", color: "#f59e0b" },
  { id: "performance", label: "Performance", icon: "🚀", color: "#3b82f6" },
  { id: "quality", label: "Quality", icon: "🎯", color: "#8b5cf6" },
];

const STATUS_MESSAGES = [
  "Parsing code structure…",
  "Running security checks…",
  "Checking reliability…",
  "Analysing performance patterns…",
  "Evaluating code quality…",
  "Generating fail-safe rewrite…",
  "Finalising review…",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreditBalance {
  planCredits: number;
  topupCredits: number;
  totalAvailable: number;
  totalUsed: number;
  planTier: string;
  resetDate: string | null;
}

interface SpecialistResult {
  specialist: string;
  score: number;
  risk_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  issues: Array<{
    line: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    title: string;
    description: string;
    fix: string;
    specialist: string;
  }>;
  verdict: string;
  context_gaps?: string[];
}

interface ReviewResult {
  reviewId?: string;
  masterScore: number;
  masterRisk: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  summary: string;
  specialists: SpecialistResult[];
  findings: Array<{
    line: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    title: string;
    description: string;
    fix: string;
    specialist: string;
  }>;
  rewrittenCode: string;
  engineerNote: string;
  aiProbability: number;
  specialistsRun: string[];
  creditsUsed: number;
  creditsRemaining: { plan: number; topup: number };
  lineCount: number;
}

interface HumaniseResult {
  humanisedCode: string;
  changesMade: string[];
  humanScore: number;
}

type Phase = "idle" | "reviewing" | "done";
type ActiveTab = "overview" | "security" | "reliability" | "business" | "performance" | "quality" | "rewrite" | "humanise";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function riskColor(risk: string) {
  if (risk === "CRITICAL") return "#ef4444";
  if (risk === "HIGH") return "#f97316";
  if (risk === "MEDIUM") return "#f59e0b";
  return "#3b82f6";
}

function scoreColor(score: number) {
  if (score >= 80) return "#00c96e";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

const selectCls = [
  "h-9 pl-3 pr-8 rounded-lg bg-[#FDFAF7] border border-[#E0DBD4]",
  "text-sm text-[#4A4540] appearance-none outline-none cursor-pointer",
  "focus:border-[#C8440A] focus:ring-1 focus:ring-[#C8440A]/20 transition-all",
].join(" ");

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [statusIdx, setStatusIdx] = useState(0);
  const [ringKey, setRingKey] = useState(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [credits, setCredits] = useState<CreditBalance | null>(null);
  const [copied, setCopied] = useState(false);

  // Optional specialist toggles
  const [optionalEnabled, setOptionalEnabled] = useState({
    business: false,
    performance: false,
    quality: false,
  });

  // Business context
  const [businessContext, setBusinessContext] = useState("");
  const [showContextBox, setShowContextBox] = useState(false);
  const [contextSaved, setContextSaved] = useState(false);

  // Humanise state
  const [humanising, setHumanising] = useState(false);
  const [humanResult, setHumanResult] = useState<HumaniseResult | null>(null);

  useEffect(() => { fetchCredits(); }, []);

  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) setCredits(await res.json());
    } catch {}
  };

  function toggleOptional(id: "business" | "performance" | "quality") {
    setOptionalEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
    if (id === "business") setShowContextBox(!optionalEnabled.business);
  }

  function saveContext() {
    setContextSaved(businessContext.trim().length > 0);
    setShowContextBox(false);
  }

  const activeSpecialistCount = 2 +
    (optionalEnabled.business ? 1 : 0) +
    (optionalEnabled.performance ? 1 : 0) +
    (optionalEnabled.quality ? 1 : 0);

  async function runReview() {
    if (!code.trim()) { toast.error("Please enter some code to review"); return; }

    setPhase("reviewing");
    setStatusIdx(0);
    setResult(null);
    setHumanResult(null);
    setActiveTab("overview");

    for (let i = 1; i < STATUS_MESSAGES.length; i++) {
      await delay(400);
      setStatusIdx(i);
    }

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          businessContext: contextSaved ? businessContext : undefined,
          includeOptional: {
            business: optionalEnabled.business,
            performance: optionalEnabled.performance,
            quality: optionalEnabled.quality,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) toast.error(`Insufficient credits. This review costs ${data.required} credits.`);
        else if (res.status === 429) toast.error("Rate limit exceeded. Please wait.");
        else toast.error(data.error || "Review failed");
        setPhase("idle");
        return;
      }

      setResult(data);
      setRingKey((k) => k + 1);
      setPhase("done");
      await fetchCredits();
      toast.success(`Review complete — Score: ${data.masterScore}/100`);
    } catch {
      toast.error("Network error. Please try again.");
      setPhase("idle");
    }
  }

  async function runHumanise() {
    if (!result?.rewrittenCode) return;
    setHumanising(true);
    setHumanResult(null);
    setActiveTab("humanise");
    try {
      const res = await fetch("/api/review", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: result.rewrittenCode }),
      });
      if (res.ok) setHumanResult(await res.json());
      else toast.error("Humanisation failed");
    } catch {
      toast.error("Humanisation failed");
    } finally {
      setHumanising(false);
    }
  }

  function copyCode(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function reset() { setPhase("idle"); setCode(""); setResult(null); setHumanResult(null); }

  // Build issues list from new schema
  const allIssues: Issue[] = (result?.findings ?? []).map((f, i) => ({
    id: `${f.specialist}-${i}`,
    severity: f.severity.toLowerCase() as Issue["severity"],
    title: f.title,
    description: f.description,
    line: typeof f.line === "number" ? f.line : undefined,
    file: `${f.specialist} specialist`,
  }));

  const critCount = allIssues.filter(i => i.severity === "critical").length;
  const highCount = allIssues.filter(i => i.severity === "high").length;
  const medCount = allIssues.filter(i => i.severity === "medium").length;
  const lowCount = allIssues.filter(i => i.severity === "low").length;

  // Tabs to show based on what specialists ran
  const resultTabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "◈" },
    ...(result?.specialists ?? []).map(s => ({
      id: s.specialist as ActiveTab,
      label: s.specialist.charAt(0).toUpperCase() + s.specialist.slice(1),
      icon: s.specialist === "security" ? "🔒" : s.specialist === "reliability" ? "⚡" : s.specialist === "business" ? "💰" : s.specialist === "performance" ? "🚀" : "🎯",
    })),
    { id: "rewrite", label: "Rewrite", icon: "🔧" },
    { id: "humanise", label: "Humanise", icon: "🧬" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Credit bar */}
      {credits && (
        <div className="flex items-center justify-between px-5 py-2 bg-[var(--cw-surface)] border-b border-white/8 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Credits:</span>
            <span className="font-medium">{credits.totalAvailable}</span>
            <span className="text-muted-foreground text-xs">(plan: {credits.planCredits}, top-up: {credits.topupCredits})</span>
          </div>
          <span className="text-xs text-muted-foreground capitalize">
            {credits.planTier} Plan{credits.resetDate && ` · Resets ${new Date(credits.resetDate).toLocaleDateString()}`}
          </span>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>

        {/* ── IDLE ── */}
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }} className="flex flex-col h-full p-5 gap-4 overflow-y-auto">

            {/* Specialist panel */}
            <div className="shrink-0">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Review Panel</p>
              <div className="flex flex-wrap gap-2">
                {/* Always-on */}
                {[
                  { id: "security", label: "Security", icon: "🔒", color: "#ef4444" },
                  { id: "reliability", label: "Reliability", icon: "⚡", color: "#f97316" },
                ].map(s => (
                  <div key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: s.color + "44", background: s.color + "0a" }}>
                    <span>{s.icon}</span>
                    <span style={{ color: s.color }} className="font-semibold">{s.label}</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Always on</span>
                  </div>
                ))}

                {/* Optional toggles */}
                {OPTIONAL_SPECIALISTS.map(s => {
                  const on = optionalEnabled[s.id as keyof typeof optionalEnabled];
                  return (
                    <button key={s.id} onClick={() => toggleOptional(s.id as "business" | "performance" | "quality")}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all"
                      style={{ borderColor: on ? s.color + "44" : "#e0dbd4", background: on ? s.color + "0a" : "transparent" }}>
                      <span>{s.icon}</span>
                      <span style={{ color: on ? s.color : "#9ca3af" }} className={on ? "font-semibold" : ""}>{s.label}</span>
                      <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${on ? "bg-green-500/10 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {on ? "On" : "Off"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Business context box */}
            {optionalEnabled.business && (
              <div className="shrink-0 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Business Logic Context</p>
                    <p className="text-xs text-amber-600 mt-0.5">Describe your business rules so the specialist reviews against your actual logic</p>
                  </div>
                  <button onClick={() => setShowContextBox(!showContextBox)}
                    className="text-xs text-amber-700 border border-amber-300 px-2 py-1 rounded hover:bg-amber-100 transition-colors">
                    {showContextBox ? "Close" : contextSaved ? "Edit" : "Add Context"}
                  </button>
                </div>
                {contextSaved && !showContextBox && (
                  <p className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">✓ Context saved</p>
                )}
                {showContextBox && (
                  <div className="mt-2">
                    <textarea value={businessContext} onChange={e => setBusinessContext(e.target.value)}
                      rows={4} placeholder='e.g. "Crypto trading platform. INR and USDT. 0.5% fee on every trade. No refunds once executed."'
                      className="w-full text-sm bg-white border border-amber-200 rounded p-2 outline-none focus:border-amber-400 resize-none" />
                    <div className="flex justify-end mt-2">
                      <button onClick={saveContext}
                        className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded hover:bg-amber-600 transition-colors">
                        Save Context
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Control bar */}
            <div className="flex items-center justify-between gap-4 shrink-0">
              <p className="text-xs text-muted-foreground">{activeSpecialistCount} specialist{activeSpecialistCount !== 1 ? "s" : ""} active</p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select value={language} onChange={e => setLanguage(e.target.value)} className={selectCls}>
                    {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <button onClick={runReview} disabled={!code.trim()}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold bg-[#C8440A] text-white shadow-lg shadow-[#C8440A22] hover:bg-[#C8440A]/90 active:scale-[0.97] transition-all disabled:opacity-35 disabled:cursor-not-allowed">
                  Run {activeSpecialistCount} Specialist{activeSpecialistCount !== 1 ? "s" : ""}
                </button>
              </div>
            </div>

            {/* Code input */}
            <CodeInput value={code} onChange={setCode} className="flex-1 min-h-[300px]" />
          </motion.div>
        )}

        {/* ── REVIEWING ── */}
        {phase === "reviewing" && (
          <motion.div key="reviewing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }} className="flex flex-col items-center justify-center h-full gap-5">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-2 h-2 rounded-full bg-[#C8440A]"
                  animate={{ y: [0, -9, 0], opacity: [0.35, 1, 0.35] }}
                  transition={{ repeat: Infinity, duration: 0.85, delay: i * 0.17, ease: "easeInOut" }} />
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={statusIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.18 }}
                className="text-sm text-muted-foreground">{STATUS_MESSAGES[statusIdx]}</motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── DONE ── */}
        {phase === "done" && result && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }} className="flex flex-col h-full overflow-hidden">

            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/8 shrink-0">
              <button onClick={reset} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> New review
              </button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{LANGUAGES.find(l => l.value === language)?.label}</span>
                <span className="opacity-30">·</span>
                <span>{result.lineCount} lines</span>
                <span className="opacity-30">·</span>
                <span>{result.creditsUsed} credits used</span>
                <span className="opacity-30">·</span>
                <span>{allIssues.length} issues found</span>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left — code (40%) */}
              <div className="w-[40%] p-4 overflow-hidden flex shrink-0">
                <CodeInput value={code} readOnly className="flex-1" />
              </div>
              <div className="w-px bg-white/8 shrink-0" />

              {/* Right — results (60%) */}
              <div className="flex flex-1 flex-col overflow-hidden">

                {/* Master score */}
                <div className="px-5 py-4 border-b border-white/8 shrink-0">
                  <div className="flex items-center gap-5">
                    <ScoreRing key={ringKey} score={result.masterScore} size={88} strokeWidth={6} />
                    <div className="flex-1">
                      <p className="text-2xl font-bold tabular-nums leading-none">
                        {result.masterScore}
                        <span className="text-sm font-normal text-muted-foreground"> / 100</span>
                      </p>
                      <p className="text-sm font-semibold mt-1" style={{ color: riskColor(result.masterRisk) }}>
                        {result.masterRisk} RISK
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {critCount} critical · {highCount} high · {medCount} warning · {lowCount} info
                      </p>
                    </div>
                    {/* Specialist score tiles */}
                    <div className="flex gap-2">
                      {result.specialists.map(s => (
                        <button key={s.specialist} onClick={() => setActiveTab(s.specialist as ActiveTab)}
                          className="flex flex-col items-center p-2 rounded-lg border transition-all hover:scale-105"
                          style={{ borderColor: scoreColor(s.score) + "33" }}>
                          <span className="text-base mb-1">
                            {s.specialist === "security" ? "🔒" : s.specialist === "reliability" ? "⚡" : s.specialist === "business" ? "💰" : s.specialist === "performance" ? "🚀" : "🎯"}
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.specialist}</span>
                          <span className="text-base font-bold mt-1" style={{ color: scoreColor(s.score) }}>{s.score}</span>
                          <span className="text-[8px] mt-0.5" style={{ color: riskColor(s.risk_level) }}>{s.risk_level}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Engineer note */}
                  {result.engineerNote && (
                    <div className="mt-3 flex gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <span className="text-lg shrink-0">👨‍💻</span>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-green-600 mb-1">Senior Engineer Verdict</p>
                        <p className="text-xs text-green-800 leading-relaxed">{result.engineerNote}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-4 py-2 border-b border-white/8 shrink-0 overflow-x-auto">
                  {resultTabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={["px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                        activeTab === tab.id ? "bg-[#C8440A]/12 text-[#C8440A]" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      ].join(" ")}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <AnimatePresence mode="wait" initial={false}>

                    {/* Overview tab */}
                    {activeTab === "overview" && (
                      <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }} className="space-y-3">
                        {result.specialists.map(s => (
                          <button key={s.specialist} onClick={() => setActiveTab(s.specialist as ActiveTab)}
                            className="w-full text-left p-4 rounded-lg border transition-all hover:-translate-y-0.5"
                            style={{ borderColor: scoreColor(s.score) + "22" }}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">
                                  {s.specialist === "security" ? "🔒" : s.specialist === "reliability" ? "⚡" : s.specialist === "business" ? "💰" : s.specialist === "performance" ? "🚀" : "🎯"}
                                </span>
                                <div>
                                  <p className="font-semibold capitalize">{s.specialist}</p>
                                  <p className="text-xs text-muted-foreground">{s.issues.length} issues — click for details</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold" style={{ color: scoreColor(s.score) }}>{s.score}</p>
                                <p className="text-xs" style={{ color: riskColor(s.risk_level) }}>{s.risk_level}</p>
                              </div>
                            </div>
                            {s.verdict && (
                              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-white/8 leading-relaxed line-clamp-2">{s.verdict}</p>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {/* Per-specialist tabs */}
                    {result.specialists.map(s => activeTab === s.specialist && (
                      <motion.div key={s.specialist} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }} className="space-y-3">
                        {/* Verdict */}
                        {s.verdict && (
                          <div className="p-4 rounded-lg border border-white/8 bg-white/2">
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">Specialist Verdict</p>
                            <p className="text-sm leading-relaxed">{s.verdict}</p>
                          </div>
                        )}
                        {/* Context gaps (business only) */}
                        {s.context_gaps && s.context_gaps.length > 0 && (
                          <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                            <p className="text-[9px] uppercase tracking-widest text-amber-600 mb-2">Context Gaps</p>
                            {s.context_gaps.map((g, i) => (
                              <p key={i} className="text-xs text-amber-800 flex gap-2"><span>?</span><span>{g}</span></p>
                            ))}
                          </div>
                        )}
                        {/* Issues */}
                        {s.issues.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No issues found by this specialist.</p>
                        ) : (
                          s.issues.map((issue, i) => (
                            <IssueCard key={i} issue={{
                              id: `${s.specialist}-${i}`,
                              severity: issue.severity.toLowerCase() as Issue["severity"],
                              title: issue.title,
                              description: issue.description,
                              line: typeof issue.line === "number" ? issue.line : undefined,
                              file: `${s.specialist} specialist`,
                            }} index={i} />
                          ))
                        )}
                      </motion.div>
                    ))}

                    {/* Rewrite tab */}
                    {activeTab === "rewrite" && (
                      <motion.div key="rewrite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }} className="h-full flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Fail-Safe Rewrite — same output, hardened behaviour</p>
                          <button onClick={() => copyCode(result.rewrittenCode)}
                            className="flex items-center gap-1.5 text-xs border border-white/8 px-2 py-1 rounded hover:bg-white/5 transition-colors">
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                        {result.rewrittenCode ? (
                          <CodeInput value={result.rewrittenCode} readOnly className="flex-1 min-h-[300px]" />
                        ) : (
                          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                            No rewrite available
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Humanise tab */}
                    {activeTab === "humanise" && (
                      <motion.div key="humanise" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }} className="flex flex-col gap-4">
                        {humanising && (
                          <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <div className="flex gap-2">
                              {[0,1,2].map(i => (
                                <motion.div key={i} className="w-2 h-2 rounded-full bg-purple-500"
                                  animate={{ y: [0,-8,0], opacity: [0.3,1,0.3] }}
                                  transition={{ repeat: Infinity, duration: 0.8, delay: i*0.15 }} />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">Applying human fingerprints…</p>
                          </div>
                        )}

                        {!humanising && !humanResult && (
                          <div className="flex flex-col items-center py-12 gap-4 text-center">
                            <span className="text-4xl">🧬</span>
                            <div>
                              <p className="font-semibold text-base">Humanisation Layer</p>
                              <p className="text-xs text-muted-foreground mt-1 max-w-xs">Applies variable naming drift, WHY comments, intentional TODOs, and asymmetric error handling. Code stays 100% identical.</p>
                            </div>
                            <button onClick={runHumanise} disabled={!result.rewrittenCode}
                              className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-40">
                              Run Humanisation
                            </button>
                          </div>
                        )}

                        {!humanising && humanResult && (
                          <>
                            {/* Human score */}
                            <div className="p-4 rounded-lg border border-purple-200 bg-purple-50">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="text-[9px] uppercase tracking-widest text-purple-600 mb-1">Human Detection Score</p>
                                  <p className="text-3xl font-bold text-purple-700">{humanResult.humanScore}%</p>
                                  <p className="text-xs text-purple-500 mt-0.5">estimated chance of passing AI detection</p>
                                </div>
                                <button onClick={() => copyCode(humanResult.humanisedCode)}
                                  className="flex items-center gap-1.5 text-xs border border-purple-300 px-2 py-1 rounded hover:bg-purple-100 transition-colors text-purple-700">
                                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  Copy
                                </button>
                              </div>
                              <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                                  style={{ width: `${humanResult.humanScore}%` }} />
                              </div>
                            </div>

                            {/* Changes made */}
                            {humanResult.changesMade.length > 0 && (
                              <div>
                                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">Changes Applied</p>
                                {humanResult.changesMade.map((c, i) => (
                                  <div key={i} className="flex gap-2 text-xs text-purple-700 bg-purple-50 border border-purple-100 rounded px-3 py-2 mb-1.5">
                                    <span>◆</span><span>{c}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <CodeInput value={humanResult.humanisedCode} readOnly className="flex-1 min-h-[300px]" />

                            <button onClick={runHumanise}
                              className="self-end text-xs border border-purple-300 text-purple-700 px-3 py-1.5 rounded hover:bg-purple-50 transition-colors">
                              ↺ Re-run
                            </button>
                          </>
                        )}
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
