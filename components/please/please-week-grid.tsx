import { PleaseData } from "@/lib/skills/please";
import { last7Days, shortWeekday, dayOfMonth, todayISO } from "@/lib/week";

export function PleaseWeekGrid({
  entries,
}: {
  entries: Record<string, PleaseData>;
}) {
  const days = last7Days();
  const today = todayISO();

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((iso) => {
        const entry = entries[iso];
        const isToday = iso === today;
        return (
          <div
            key={iso}
            className={
              "flex flex-col items-center gap-1.5 py-3 rounded-lg border " +
              (isToday ? "border-accent/40 bg-accent-soft/40" : "border-border bg-surface")
            }
          >
            <div className="text-[10px] uppercase tracking-wide text-foreground-muted">
              {shortWeekday(iso)}
            </div>
            <div className="text-sm font-medium text-foreground">{dayOfMonth(iso)}</div>
            <DayDot entry={entry} />
          </div>
        );
      })}
    </div>
  );
}

function DayDot({ entry }: { entry: PleaseData | undefined }) {
  if (!entry) {
    return <div className="w-2 h-2 rounded-full bg-border" aria-label="no entry" />;
  }
  return <div className="w-2 h-2 rounded-full bg-accent" aria-label="logged" />;
}
