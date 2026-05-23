import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getDashboardOverview } from "@/lib/dashboard-overview";
import { getStudentWeekSummary } from "@/lib/student-summary";
import { ThisWeekAtAGlance } from "@/components/clinician/this-week-at-a-glance";

export default async function Dashboard() {
  const me = await requireSession();
  const overview = await getDashboardOverview(me.id);
  const summaries = await Promise.all(
    overview.perStudent.map((s) => getStudentWeekSummary(s.id))
  );

  return (
    <div className="space-y-8">
      <header className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Students</h1>
          <p className="text-foreground-muted mt-1">
            {overview.total > 0
              ? `${overview.total} student${overview.total === 1 ? "" : "s"}`
              : "No students yet."}
          </p>
        </div>
        {overview.total > 0 && (
          <Link
            href="/therapist/assign"
            className="text-sm px-4 py-2 bg-surface border border-border rounded-xl text-foreground hover:border-accent transition-colors whitespace-nowrap"
          >
            Assign focus to multiple →
          </Link>
        )}
      </header>

      <ThisWeekAtAGlance overview={overview} />

      <section>
        <div className="text-xs uppercase tracking-wide text-foreground-muted font-medium mb-3">
          Open a student
        </div>
        <div className="grid gap-3">
          {overview.perStudent.map((s, i) => (
            <Link
              key={s.id}
              href={`/therapist/students/${s.id}`}
              className="block bg-surface border border-border rounded-2xl px-5 py-4 hover:border-accent transition-colors"
            >
              <div className="font-medium text-foreground">{s.name}</div>
              <div className="text-sm text-foreground-muted mt-0.5">
                {summaries[i].text}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
