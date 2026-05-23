import { PleaseData } from "@/lib/skills/please";
import { formatLongDate } from "@/lib/week";

export function PleaseEntryList({
  entries,
}: {
  entries: Record<string, PleaseData>;
}) {
  const sorted = Object.values(entries).sort((a, b) =>
    a.date < b.date ? 1 : -1
  );
  if (sorted.length === 0) return null;
  return (
    <ul className="space-y-4">
      {sorted.map((entry) => (
        <li key={entry.date} className="border-l-2 border-border pl-4 py-0.5">
          <div className="text-sm font-medium text-foreground">
            {formatLongDate(entry.date)}
          </div>
          <div className="text-sm text-foreground-muted mt-0.5">
            {summarize(entry)}
          </div>
          {entry.substances?.used && (
            <div className="text-sm text-foreground-muted mt-1.5">
              <span className="text-foreground-muted">Substances</span>
              {entry.substances.note && (
                <span className="text-foreground"> — {entry.substances.note}</span>
              )}
            </div>
          )}
          {entry.illness?.present && (
            <div className="text-sm text-foreground-muted mt-1.5">
              <span className="text-foreground-muted">Not feeling well</span>
              {entry.illness.note && (
                <span className="text-foreground"> — {entry.illness.note}</span>
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
