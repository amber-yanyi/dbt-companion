import Link from "next/link";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export default async function Dashboard() {
  const me = await requireSession();
  const { data: students } = await db
    .from("users")
    .select("id, name")
    .eq("role", "student")
    .eq("linked_clinician_id", me.id)
    .order("name");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-medium text-foreground">Students</h1>
        <p className="text-foreground-muted mt-1">
          {students && students.length > 0
            ? `${students.length} student${students.length === 1 ? "" : "s"}`
            : "No students yet."}
        </p>
      </header>

      <div className="grid gap-3">
        {(students ?? []).map((s) => (
          <Link
            key={s.id}
            href={`/therapist/students/${s.id}`}
            className="block bg-surface border border-border rounded-2xl px-5 py-4 hover:border-accent transition-colors"
          >
            <div className="font-medium text-foreground">{s.name}</div>
            <div className="text-sm text-foreground-muted mt-0.5">
              No activity this week yet
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
