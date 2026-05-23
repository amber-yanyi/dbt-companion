import { PleaseDayEntry } from "@/lib/please";
import { PleaseData } from "@/lib/skills/please";
import { formatLongDate } from "@/lib/week";
import { FlagButton } from "@/components/flag-button";
import { FlagBadge } from "@/components/flag-badge";

export function PleaseEntryList({
  entries,
  interactive = false,
}: {
  entries: Record<string, PleaseDayEntry>;
  interactive?: boolean;
}) {
  const sorted = Object.values(entries).sort((a, b) =>
    a.data.date < b.data.date ? 1 : -1
  );
  if (sorted.length === 0) return null;
  return (
    <ul className="space-y-4">
      {sorted.map((entry) => (
        <li key={entry.id} className="border-l-2 border-border pl-4 py-0.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="text-sm font-medium text-foreground">
              {formatLongDate(entry.data.date)}
            </div>
            {interactive ? (
              <FlagButton
                entryId={entry.id}
                flagged={entry.data.flagged ?? false}
              />
            ) : (
              entry.data.flagged && <FlagBadge />
            )}
          </div>
          <div className="text-sm text-foreground-muted mt-0.5">
            {summarize(entry.data)}
          </div>
          {entry.data.substances?.used && (
            <div className="text-sm text-foreground-muted mt-1.5">
              <span className="text-foreground-muted">Substances</span>
              {entry.data.substances.note && (
                <span className="text-foreground"> — {entry.data.substances.note}</span>
              )}
            </div>
          )}
          {entry.data.illness?.present && (
            <div className="text-sm text-foreground-muted mt-1.5">
              <span className="text-foreground-muted">Not feeling well</span>
              {entry.data.illness.note && (
                <span className="text-foreground"> — {entry.data.illness.note}</span>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function summarize(entry: PleaseData): string {
  const parts: string[] = [];

  if (entry.sleep_hours != null) {
    parts.push(`Sleep ${formatHours(entry.sleep_hours)}`);
  }

  if (entry.exercise_level) {
    if (entry.exercise_level === "none") {
      parts.push("No exercise");
    } else {
      const dur = entry.exercise_minutes ? ` ${entry.exercise_minutes}m` : "";
      const label =
        entry.exercise_level[0].toUpperCase() + entry.exercise_level.slice(1);
      parts.push(`${label} exercise${dur}`);
    }
  }

  if (entry.meals) {
    const eaten: string[] = [];
    if (entry.meals.breakfast) eaten.push("breakfast");
    if (entry.meals.lunch) eaten.push("lunch");
    if (entry.meals.dinner) eaten.push("dinner");
    if (eaten.length > 0) parts.push(eaten.join(", "));
  }

  return parts.join(" · ") || "—";
}

function formatHours(h: number): string {
  return Number.isInteger(h) ? `${h}h` : `${h}h`;
}
