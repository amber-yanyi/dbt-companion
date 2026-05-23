import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { BulkAssignForm } from "@/components/clinician/bulk-assign-form";

export default async function BulkAssignPage() {
  const me = await requireSession();
  if (me.role !== "clinician") return null;

  const { data: students } = await db
    .from("users")
    .select("id, name")
    .eq("role", "student")
    .eq("linked_clinician_id", me.id)
    .order("name");
  const list = (students ?? []).map((s) => ({
    id: s.id as string,
    name: s.name as string,
  }));

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/therapist/dashboard"
          className="text-sm text-foreground-muted hover:text-foreground"
        >
          ← Students
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-medium text-foreground">
          Assign this week&rsquo;s focus
        </h1>
        <p className="text-foreground-muted mt-1 leading-relaxed">
          Set the same focus for multiple students at once — useful when you
          taught a skill in group session and want everyone to try it this
          week.
        </p>
      </header>

      <section className="bg-surface border border-border rounded-2xl p-6">
        {list.length === 0 ? (
          <p className="text-foreground-muted">No students yet.</p>
        ) : (
          <BulkAssignForm students={list} />
        )}
      </section>
    </div>
  );
}
