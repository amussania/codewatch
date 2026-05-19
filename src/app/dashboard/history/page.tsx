import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReviewRow {
  id: string;
  language: string | null;
  master_score: number | null;
  risk_level: string | null;
  ai_probability: number | null;
  credits_used: number | null;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function riskBadgeStyle(risk: string | null): React.CSSProperties {
  switch (risk) {
    case "critical":
      return { background: "rgba(200,68,10,0.10)", color: "var(--cw-signal-critical)", border: "0.5px solid rgba(200,68,10,0.25)" };
    case "high":
      return { background: "rgba(255,107,107,0.10)", color: "#ff6b6b", border: "0.5px solid rgba(255,107,107,0.25)" };
    case "medium":
      return { background: "rgba(176,122,32,0.10)", color: "var(--cw-signal-warn)", border: "0.5px solid rgba(176,122,32,0.25)" };
    default:
      return { background: "rgba(42,107,60,0.10)", color: "var(--cw-signal-pass)", border: "0.5px solid rgba(42,107,60,0.25)" };
  }
}

function scoreColor(score: number | null): string {
  if (score === null) return "var(--cw-ink-tertiary)";
  if (score >= 85) return "var(--cw-signal-pass)";
  if (score >= 70) return "#4a9fff";
  if (score >= 50) return "var(--cw-signal-warn)";
  return "var(--cw-signal-critical)";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const service = createServiceClient();

  const { data: reviews, error } = await service
    .from("reviews")
    .select("id, language, master_score, risk_level, ai_probability, credits_used, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-5">
      <div className="mb-6 shrink-0">
        <h1 className="text-base font-semibold tracking-tight">Review History</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Your last {reviews?.length ?? 0} reviews
        </p>
      </div>

      {error && (
        <div
          className="rounded-xl p-4 text-sm mb-4"
          style={{
            background: "rgba(200,68,10,0.08)",
            border: "0.5px solid rgba(200,68,10,0.25)",
            color: "var(--cw-signal-critical)",
          }}
        >
          Failed to load history. Please refresh.
        </div>
      )}

      {!error && (!reviews || reviews.length === 0) && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center py-16">
          <p className="text-sm font-medium" style={{ color: "var(--cw-ink-secondary)" }}>
            No reviews yet
          </p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Run your first code review and it will appear here.
          </p>
          <Link
            href="/dashboard"
            className="mt-2 text-sm font-medium underline"
            style={{ color: "var(--cw-ember)" }}
          >
            Start a review →
          </Link>
        </div>
      )}

      {reviews && reviews.length > 0 && (
        <div className="space-y-2">
          {(reviews as ReviewRow[]).map((review) => (
            <div
              key={review.id}
              className="flex items-center gap-4 rounded-xl px-4 py-3 border transition-colors"
              style={{
                background: "var(--cw-bg-surface)",
                border: "0.5px solid var(--cw-bg-secondary)",
              }}
            >
              {/* Score */}
              <div className="w-12 text-center shrink-0">
                <p
                  className="text-lg font-bold tabular-nums leading-none"
                  style={{ color: scoreColor(review.master_score) }}
                >
                  {review.master_score ?? "—"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">score</p>
              </div>

              <div className="w-px h-8 bg-white/8 shrink-0" />

              {/* Language + date */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium capitalize leading-none"
                  style={{ color: "var(--cw-ink-primary)" }}
                >
                  {review.language ?? "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(review.created_at)}
                </p>
              </div>

              {/* Risk badge */}
              {review.risk_level && (
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide shrink-0"
                  style={riskBadgeStyle(review.risk_level)}
                >
                  {review.risk_level}
                </span>
              )}

              {/* AI probability */}
              {review.ai_probability != null && (
                <div className="text-right shrink-0 w-16">
                  <p className="text-xs text-muted-foreground">AI origin</p>
                  <p
                    className="text-sm font-semibold tabular-nums"
                    style={{
                      color:
                        review.ai_probability > 80
                          ? "var(--cw-signal-critical)"
                          : review.ai_probability > 50
                          ? "var(--cw-signal-warn)"
                          : "var(--cw-signal-pass)",
                    }}
                  >
                    {review.ai_probability}%
                  </p>
                </div>
              )}

              {/* Credits used */}
              {review.credits_used != null && (
                <div className="text-right shrink-0 w-16">
                  <p className="text-xs text-muted-foreground">credits</p>
                  <p className="text-sm font-semibold tabular-nums" style={{ color: "var(--cw-ink-secondary)" }}>
                    {review.credits_used}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
