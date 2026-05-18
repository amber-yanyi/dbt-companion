import Link from "next/link";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { notFound } from "next/navigation";

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

  return (
    <div className="space-y-6">
      <div>
        <Link href="/therapist/dashboard" className="text-sm text-foreground-muted hover:text-foreground">
          ← Students
        </Link>
      </div>

      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">{student.name}</h1>
          <p className="text-foreground-muted mt-1">No activity this week yet.</p>
        </div>
      </header>

      <section className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
          This week
        </h2>
        <p className="mt-3 text-foreground">No focus set for this week.</p>
      </section>
    </div>
  );
}
