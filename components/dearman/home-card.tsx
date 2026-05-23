import Link from "next/link";
import { DearmanEntry } from "@/lib/dearman";

const PLAN_KEYS = [
  "situation",
  "concrete_goal",
  "relationship_goal",
  "describe",
  "express",
  "assert",
  "reinforce",
  "mindful",
  "appear",
  "negotiate",
] as const;

export function DearmanHomeCard({ entry }: { entry: DearmanEntry }) {
  const planned = entry.status === "planned";
  const filled = PLAN_KEYS.filter((k) => {
    const v = entry.data[k];
    return typeof v === "string" && v.trim().length > 0;
  }).length;

  return (
    <Link
      href="/student/skills/dearman"
      className="block bg-surface border border-border rounded-2xl p-6 hover:border-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-foreground font-medium">DEARMAN</h2>
          {entry.data.situation && (
            <p className="text-sm text-foreground-muted mt-1 line-clamp-2">
              {entry.data.situation}
            </p>
          )}
          <p className="text-sm text-foreground-muted mt-2">
            {planned
              ? "Plan ready — come back when you've had the conversation."
              : `Pick up where you left off — ${filled} of ${PLAN_KEYS.length} steps.`}
          </p>
        </div>
        {planned && (
          <span className="text-xs text-accent bg-accent-soft px-2 py-0.5 rounded-full mt-1 whitespace-nowrap">
            Ready
          </span>
        )}
      </div>
    </Link>
  );
}
