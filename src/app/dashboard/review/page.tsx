"use client";

import { useState } from "react";
import ReviewEditor from "@/components/dashboard/ReviewEditor";
import ScoreRing from "@/components/dashboard/ScoreRing";
import IssueCard, { type Issue } from "@/components/dashboard/IssueCard";
import { Button } from "@/components/ui/button";

const MOCK_ISSUES: Issue[] = [
  {
    id: "1",
    severity: "high",
    title: "Timing attack on token comparison",
    description: "Direct string comparison of secrets is vulnerable to timing attacks. Use `crypto.timingSafeEqual` instead.",
    file: "auth.service.ts",
    line: 3,
  },
  {
    id: "2",
    severity: "medium",
    title: "Missing rate limiting",
    description: "This endpoint has no rate limiting. A brute-force attack could enumerate valid tokens.",
    file: "auth.service.ts",
    line: 1,
  },
  {
    id: "3",
    severity: "low",
    title: "Add explicit return type annotation",
    description: "Implicit return type `User | null`. Explicit typing improves readability and catches regressions.",
    file: "auth.service.ts",
    line: 1,
  },
];

export default function ReviewPage() {
  const [score, setScore] = useState(87);
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [reviewKey, setReviewKey] = useState(0);

  function handleFix(id: string) {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === id ? { ...issue, fixed: true } : issue))
    );
    setScore((s) => Math.min(100, s + 4));
  }

  function handleRerun() {
    setReviewKey((k) => k + 1);
    setScore(0);
    setTimeout(() => setScore(87), 300);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Code Review</h1>
          <p className="text-muted-foreground text-sm mt-1">auth.service.ts · 5 lines</p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreRing key={reviewKey} score={score} size={80} strokeWidth={6} />
          <Button
            onClick={handleRerun}
            className="bg-[var(--cw-coral)] hover:bg-[var(--cw-coral)]/90 text-white border-0"
          >
            Re-run review
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Source
          </h2>
          <ReviewEditor key={reviewKey} />
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Issues ({issues.filter((i) => !i.fixed).length} open)
          </h2>
          <div className="space-y-3">
            {issues.map((issue, i) => (
              <IssueCard key={issue.id} issue={issue} index={i} onFix={handleFix} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
