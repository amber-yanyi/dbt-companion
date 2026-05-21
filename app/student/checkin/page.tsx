import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getPleaseEntry, getPleaseEntriesForDates } from "@/lib/please";
import { todayISO, last7Days, formatLongDate } from "@/lib/week";
import { PleaseForm } from "@/components/please/please-form";
import { PleaseWeekGrid } from "@/components/please/please-week-grid";

export default async function CheckinPage() {
  const me = await requireSession();
  if (me.role !== "student") return null;

  const today = todayISO();
  const todayEntry = await getPleaseEntry(me.id, today);
  const weekEntries = await getPleaseEntriesForDates(me.id, last7Days());
  const entryCount = Object.keys(weekEntries).length;

  return (
    <div className="space-y-10">
      <div>
        <Link href="/student/home" className="text-sm text-foreground-muted hover:text-foreground">
          ← Home
        </Link>
      </div>

      <section>
        <h1 className="text-2xl font-medium text-foreground">Daily check-in</h1>
        <p className="text-foreground-muted mt-1">{formatLongDate(today)}</p>
      </section>

      <section className="bg-surface border border-border rounded-2xl p-6">
        <PleaseForm date={today} initial={todayEntry?.data ?? null} />
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
            This week
          </h2>
          <span className="text-xs text-foreground-muted">
            {entryCount === 0
              ? "No entries yet"
              : `${entryCount} ${entryCount === 1 ? "entry" : "entries"}`}
          </span>
        </div>
        <PleaseWeekGrid entries={weekEntries} />
      </section>
    </div>
  );
}
