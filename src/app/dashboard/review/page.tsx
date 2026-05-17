"use client";

import { useState, useCallback } from "react";
import ReviewEditor from "@/components/dashboard/ReviewEditor";
import ScoreRing from "@/components/dashboard/ScoreRing";
import IssueCard, { type Issue } from "@/components/dashboard/IssueCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReviewResult {
  reviewId?: string;
  masterScore: number;
  findings: Array<{
    line: number;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    category: string;
    title: string;
    description: string;
    specialist: string;
  }>;
  summary: string;
  specialistsRun: string[];
  creditsUsed: number;
  creditsRemaining: {
    plan: number;
    topup: number;
  };
  rewrite: string | null;
  lineCount: number;
}

const LANGUAGE_OPTIONS = [
  "javascript", "typescript", "python", "go", "rust", "java",
  "csharp", "cpp", "ruby", "php", "swift", "kotlin",
  "sql", "html", "css", "shell", "yaml", "json", "other",
];

export default function ReviewPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [isReviewing, setIsReviewing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [activeTab, setActiveTab] = useState<"issues" | "rewrite">("issues");
  const [reviewKey, setReviewKey] = useState(0);

  const handleReview = useCallback(async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to review");
      return;
    }

    setIsReviewing(true);
    setResult(null);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          skipQuality: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          toast.error(`Insufficient credits. This review costs ${data.required} credits. Please upgrade or top up.`);
        } else if (response.status === 429) {
          toast.error("Rate limit exceeded. Please slow down.");
        } else {
          toast.error(data.error || "Review failed");
        }
        setIsReviewing(false);
        return;
      }

      setResult(data);
      setReviewKey((k) => k + 1);
      toast.success(`Review complete! Used ${data.creditsUsed} credits. Score: ${data.masterScore}`);
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Review error:", error);
    } finally {
      setIsReviewing(false);
    }
  }, [code, language]);

  const handleFix = useCallback((id: string) => {
    // TODO: Implement fix application when rewrite is available
    toast.info("Fix application coming soon — use the rewrite tab for now");
  }, []);

  const creditsTotal = result?.creditsRemaining
    ? result.creditsRemaining.plan + result.creditsRemaining.topup
    : null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Code Review</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {result ? `${result.lineCount} lines · ${result.creditsUsed} credits used` : "Paste code and run review"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {result && (
            <ScoreRing key={reviewKey} score={result.masterScore} size={80} strokeWidth={6} />
          )}
          <Button
            onClick={handleReview}
            disabled={isReviewing || !code.trim()}
            className="bg-[var(--cw-coral)] hover:bg-[var(--cw-coral)]/90 text-white border-0"
          >
            {isReviewing ? "Reviewing..." : "Run Review"}
          </Button>
        </div>
      </div>

      {/* Credit balance display */}
      {creditsTotal !== null && (
        <div className="mb-6 flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Credits remaining: <strong className="text-foreground">{creditsTotal}</strong>
            {" "}(plan: {result!.creditsRemaining.plan}, top-up: {result!.creditsRemaining.topup})
          </span>
        </div>
      )}

      {/* Language selector */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mr-2">Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-background border rounded px-2 py-1 text-sm"
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Source code editor */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Source
          </h2>
          <ReviewEditor
            code={code}
            onChange={setCode}
            language={language}
          />
        </div>

        {/* Results panel */}
        <div>
          {result ? (
            <>
              {/* Tabs */}
              <div className="flex gap-4 mb-3 border-b">
                <button
                  onClick={() => setActiveTab("issues")}
                  className={`pb-2 text-sm font-medium uppercase tracking-wider ${
                    activeTab === "issues"
                      ? "text-foreground border-b-2 border-[var(--cw-coral)]"
                      : "text-muted-foreground"
                  }`}
                >
                  Issues ({result.findings.length})
                </button>
                {result.rewrite && (
                  <button
                    onClick={() => setActiveTab("rewrite")}
                    className={`pb-2 text-sm font-medium uppercase tracking-wider ${
                      activeTab === "rewrite"
                        ? "text-foreground border-b-2 border-[var(--cw-coral)]"
                        : "text-muted-foreground"
                    }`}
                  >
                    Rewrite
                  </button>
                )}
              </div>

              {/* Issues tab */}
              {activeTab === "issues" && (
                <div className="space-y-3">
                  {result.findings.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No issues found. Great job!</p>
                  ) : (
                    result.findings.map((finding, i) => (
                      <IssueCard
                        key={`${finding.line}-${i}`}
                        issue={{
                          id: `${finding.line}-${i}`,
                          severity: finding.severity.toLowerCase() as Issue["severity"],
                          title: finding.title,
                          description: finding.description,
                          file: `${language} file`,
                          line: finding.line,
                        }}
                        index={i}
                        onFix={handleFix}
                      />
                    ))
                  )}
                </div>
              )}

              {/* Rewrite tab */}
              {activeTab === "rewrite" && result.rewrite && (
                <div className="rounded-xl border border-white/8 bg-[var(--cw-surface)] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8">
                    <span className="text-xs text-muted-foreground">Suggested rewrite</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(result.rewrite!);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <pre className="p-4 text-sm font-mono overflow-x-auto max-h-[500px] overflow-y-auto">
                    <code>{result.rewrite}</code>
                  </pre>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
              {isReviewing ? "Running specialists..." : "Run a review to see results"}
            </div>
          )}
        </div>
      </div>

      {/* Summary footer */}
      {result && (
        <div className="mt-6 p-4 rounded-lg bg-[var(--cw-surface)] border border-white/8">
          <p className="text-sm text-muted-foreground">{result.summary}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Specialists: {result.specialistsRun.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
