import Link from "next/link";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { getStudentWeekSummary } from "@/lib/student-summary";

export default async function Dashboard() {
  const me = await requireSession();
  const { data: students } = await db
    .from("users")
    .select("id, name")
    .eq("role", "student")
    .eq("linked_clinician_id", me.id)
    .order("name");

  const list = students ?? [];
  const summaries = await Promise.all(
    list.map((s) => getStudentWeekSummary(s.id))
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-medium text-foreground">Students</h1>
        <p className="text-foreground-muted mt-1">
          {list.length > 0
            ? `${list.length} student${list.length === 1 ? "" : "s"}`
            : "No students yet."}
        </p>
      </header>

      <div className="grid gap-3">
        {list.map((s, i) => (
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
    </div>
  );
}
