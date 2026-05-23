import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getPleaseEntry } from "@/lib/please";
import { getCurrentDearman } from "@/lib/dearman";
import { getCurrentAssignment } from "@/lib/assignments";
import { todayISO } from "@/lib/week";
import { getFocusSkill } from "@/lib/skills/registry";
import { DearmanHomeCard } from "@/components/dearman/home-card";

export default async function StudentHome() {
  const me = await requireSession();
  if (me.role !== "student") return null;

  const today = todayISO();
  const [todayEntry, currentDearman, assignment] = await Promise.all([
    getPleaseEntry(me.id, today),
    getCurrentDearman(me.id),
    getCurrentAssignment(me.id),
  ]);
  const loggedToday = !!todayEntry;
  const focus = getFocusSkill(assignment?.focus_skill_id);
  const pleaseEnabled = assignment?.daily_checkins.includes("please") ?? false;

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-medium text-foreground">Hi there</h1>
        <p className="text-foreground-muted mt-1">Welcome back.</p>
      </section>

      <FocusCard focus={focus} note={assignment?.note ?? null} />

      {currentDearman && <DearmanHomeCard entry={currentDearman} />}

      {pleaseEnabled && (
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
      )}

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

function FocusCard({
  focus,
  note,
}: {
  focus: ReturnType<typeof getFocusSkill>;
  note: string | null;
}) {
  if (!focus) {
    return (
      <section className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
          This week&rsquo;s focus
        </h2>
        <p className="mt-3 text-foreground">
          No focus set yet — your clinician will share one when you next meet.
        </p>
      </section>
    );
  }
  return (
    <Link
      href={focus.route}
      className="block bg-accent-soft/40 border border-accent/30 rounded-2xl p-6 hover:border-accent transition-colors"
    >
      <h2 className="text-xs font-medium text-accent uppercase tracking-wide">
        This week&rsquo;s focus
      </h2>
      <p className="mt-2 text-xl text-foreground font-medium">{focus.name}</p>
      {note && (
        <p className="mt-3 text-foreground-muted leading-relaxed">
          {note}
        </p>
      )}
    </Link>
  );
}
