import Link from "next/link";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getPleaseEntriesForDates } from "@/lib/please";
import { last7Days } from "@/lib/week";
import { PleaseWeekGrid } from "@/components/please/please-week-grid";
import { PleasePatterns } from "@/components/please/please-patterns";

export default async function StudentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await requireSession();

  const { data: student } = await db
    .from("users")
    .select("id, name, linked_clinician_id")
    .eq("id", id)
    .eq("role", "student")
    .single();

  if (!student || student.linked_clinician_id !== me.id) {
    notFound();
  }

  const weekEntries = await getPleaseEntriesForDates(student.id, last7Days());
  const entryCount = Object.keys(weekEntries).length;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/therapist/dashboard" className="text-sm text-foreground-muted hover:text-foreground">
          ← Students
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-medium text-foreground">{student.name}</h1>
        <p className="text-foreground-muted mt-1">
          {entryCount === 0
            ? "No PLEASE entries this week."
            : `${entryCount} PLEASE ${entryCount === 1 ? "entry" : "entries"} this week.`}
        </p>
      </header>

      <section className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
          This week
        </h2>
        <p className="mt-3 text-foreground">No focus set for this week.</p>
      </section>

      <section className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
            PLEASE check-ins
          </h2>
        </div>
        <PleaseWeekGrid entries={weekEntries} />
        <PleasePatterns entries={weekEntries} />
      </section>
    </div>
  );
}
