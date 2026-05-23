import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getPleaseEntry } from "@/lib/please";
import { getCurrentDearman } from "@/lib/dearman";
import { todayISO } from "@/lib/week";
import { DearmanHomeCard } from "@/components/dearman/home-card";

export default async function StudentHome() {
  const me = await requireSession();
  if (me.role !== "student") return null;

  const today = todayISO();
  const [todayEntry, currentDearman] = await Promise.all([
    getPleaseEntry(me.id, today),
    getCurrentDearman(me.id),
  ]);
  const loggedToday = !!todayEntry;

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-medium text-foreground">Hi there</h1>
        <p className="text-foreground-muted mt-1">Welcome back.</p>
      </section>

      <section className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
          This week&apos;s focus
        </h2>
        <p className="mt-3 text-foreground">
          No focus set yet — your clinician will share one when you next meet.
        </p>
      </section>

      {currentDearman && <DearmanHomeCard entry={currentDearman} />}

      <Link
        href="/student/checkin"
        className="block bg-surface border border-border rounded-2xl p-6 hover:border-accent transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-foreground font-medium">Daily check-in</h2>
            <p className="text-foreground-muted text-sm mt-1">
              {loggedToday
                ? "Logged for today — tap to revise."
                : "A quick observation of how you slept, ate, moved."}
            </p>
          </div>
          {loggedToday && (
            <span className="text-xs text-accent bg-accent-soft px-2 py-0.5 rounded-full mt-1 whitespace-nowrap">
              Today
            </span>
          )}
        </div>
      </Link>

      <Link
        href="/student/skills"
        className="block bg-surface border border-border rounded-2xl p-6 hover:border-accent transition-colors"
      >
        <h2 className="text-foreground font-medium">All skills</h2>
        <p className="text-foreground-muted text-sm mt-1">
          Browse DBT skills you can use anytime.
        </p>
      </Link>
    </div>
  );
}
