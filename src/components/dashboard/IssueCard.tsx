"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export type Severity = "high" | "medium" | "low";

export interface Issue {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  line?: number;
  file?: string;
  fixed?: boolean;
}

interface IssueCardProps {
  issue: Issue;
  index: number;
  onFix?: (id: string) => void;
}

const SEVERITY_STYLES: Record<Severity, { border: string; dot: string; badge: string }> = {
  high: {
    border: "border-[#ff6b6b]/20",
    dot: "#ff6b6b",
    badge: "bg-[#ff6b6b]/10 text-[#ff6b6b] border-[#ff6b6b]/20",
  },
  medium: {
    border: "border-amber-500/20",
    dot: "#f59e0b",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  low: {
    border: "border-[#4a9fff]/20",
    dot: "#4a9fff",
    badge: "bg-[#4a9fff]/10 text-[#4a9fff] border-[#4a9fff]/20",
  },
};

const STAGGER_BY_SEVERITY: Record<Severity, number> = {
  high: 0,
  medium: 0.05,
  low: 0.1,
};

export default function IssueCard({ issue, index, onFix }: IssueCardProps) {
  const styles = SEVERITY_STYLES[issue.severity];
  const severityDelay = STAGGER_BY_SEVERITY[issue.severity];

  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        delay: index * 0.08 + severityDelay,
        type: "spring",
        stiffness: 320,
        damping: 28,
      }}
      className={`rounded-xl border ${styles.border} bg-[var(--cw-surface)] p-4 flex items-start gap-3 group`}
    >
      <div
        className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
        style={{ backgroundColor: styles.dot, boxShadow: `0 0 8px ${styles.dot}66` }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium leading-snug">{issue.title}</p>
          <Badge className={`text-[10px] shrink-0 ${styles.badge}`} variant="outline">
            {issue.severity}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{issue.description}</p>

        {(issue.file || issue.line) && (
          <p className="text-[11px] text-muted-foreground/50 font-mono mt-2">
            {issue.file}
            {issue.line ? `:${issue.line}` : ""}
          </p>
        )}
      </div>

      {onFix && !issue.fixed && (
        <button
          onClick={() => onFix(issue.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--cw-coral)] font-medium shrink-0 hover:underline"
        >
          Fix →
        </button>
      )}
      {issue.fixed && (
        <span className="text-[11px] text-emerald-400 font-medium shrink-0">Fixed ✓</span>
      )}
    </motion.div>
  );
}
