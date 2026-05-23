import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { OppositeActionLogForm } from "@/components/library/opposite-action-log-form";

export default async function LogOppositeActionPage() {
  const me = await requireSession();
  if (me.role !== "student") return null;

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/student/skills/opposite-action"
          className="text-sm text-foreground-muted hover:text-foreground"
        >
          ← Opposite Action
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-medium text-foreground">
          Log how you used Opposite Action
        </h1>
        <p className="text-foreground-muted mt-2 leading-relaxed">
          A short note for yourself — and something your clinician can see
          alongside the rest of the week.
        </p>
      </header>

      <OppositeActionLogForm />
    </div>
  );
}
