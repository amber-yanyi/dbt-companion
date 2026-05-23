import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DEARMAN_SKILL_ID, DearmanData } from "@/lib/skills/dearman";
import { ReflectForm } from "@/components/dearman/reflect-form";

export default async function EditReflectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await requireSession();
  if (me.role !== "student") return null;

  const { data: entry, error } = await db
    .from("skill_entries")
    .select("id, user_id, skill_id, status, data")
    .eq("id", id)
    .single();
  if (error || !entry) notFound();
  if (entry.user_id !== me.id) notFound();
  if (entry.skill_id !== DEARMAN_SKILL_ID) notFound();
  if (entry.status !== "reflected") {
    redirect("/student/skills/dearman");
  }

  const data = entry.data as DearmanData;
  const initial = data.reflection;

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/student/skills/dearman"
          className="text-sm text-foreground-muted hover:text-foreground"
        >
          ← DEARMAN
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-medium text-foreground">
          Edit reflection
        </h1>
        <p className="text-foreground-muted mt-2 leading-relaxed">
          Reflections can shift over time — feelings about how the
          conversation actually landed might be different a few days later.
          Update what feels true now.
        </p>
      </header>

      {data.situation && (
        <section className="bg-accent-soft/40 border border-accent/20 rounded-2xl p-5">
          <div className="text-xs uppercase tracking-wide text-accent font-medium">
            About this conversation
          </div>
          <p className="text-foreground mt-2 leading-relaxed">
            {data.situation}
          </p>
        </section>
      )}

      <ReflectForm initial={initial} entryId={entry.id} />
    </div>
  );
}
