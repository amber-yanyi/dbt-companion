import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getCurrentDearman, getReflectedDearmans } from "@/lib/dearman";
import { firstIncompleteStep, DearmanData } from "@/lib/skills/dearman";
import { DearmanArchivedView } from "@/components/dearman/archived-view";
import { formatLongDate } from "@/lib/week";

export default async function DearmanEntry() {
  const me = await requireSession();
  if (me.role !== "student") return null;

  const [current, past] = await Promise.all([
    getCurrentDearman(me.id),
    getReflectedDearmans(me.id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/student/home"
          className="text-sm text-foreground-muted hover:text-foreground"
        >
          ← Home
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-medium text-foreground">DEARMAN</h1>
        <p className="text-foreground-muted mt-2 leading-relaxed">
          A way to plan a conversation you want to approach intentionally. Not
          for sudden conflicts — use this when you have the time to think
          before you talk.
        </p>
      </header>

      <section className="bg-surface border border-border rounded-2xl p-6">
        {current ? <ResumeCard entry={current} /> : <StartCard />}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
            Previous DEARMANs
          </h2>
          <div className="mt-3 space-y-3">
            {past.map((entry) => {
              const updatedISO = entry.updated_at.slice(0, 10);
              return (
                <details
                  key={entry.id}
                  className="bg-surface border border-border rounded-2xl"
                >
                  <summary className="cursor-pointer list-none px-5 py-4 flex items-baseline justify-between gap-3 flex-wrap">
                    <span className="text-foreground font-medium">
                      {formatLongDate(updatedISO)}
                    </span>
                    {entry.data.situation && (
                      <span className="text-sm text-foreground-muted line-clamp-1">
                        {entry.data.situation}
                      </span>
                    )}
                  </summary>
                  <div className="px-5 pb-5">
                    <DearmanArchivedView entry={entry} />
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      )}

      <details className="text-sm text-foreground-muted">
        <summary className="cursor-pointer hover:text-foreground">
          What the letters mean
        </summary>
        <ul className="mt-3 space-y-2 leading-relaxed">
          <li>
            <strong className="text-foreground">D</strong>escribe the
            situation, factually.
          </li>
          <li>
            <strong className="text-foreground">E</strong>xpress how you feel,
            using &ldquo;I&rdquo; statements.
          </li>
          <li>
            <strong className="text-foreground">A</strong>ssert: ask clearly
            for what you want.
          </li>
          <li>
            <strong className="text-foreground">R</strong>einforce: explain
            what&rsquo;s in it for them.
          </li>
          <li>
            <strong className="text-foreground">M</strong>indful — stay focused
            if the conversation drifts.
          </li>
          <li>
            <strong className="text-foreground">A</strong>ppear confident in
            how you carry yourself.
          </li>
          <li>
            <strong className="text-foreground">N</strong>egotiate — be open to
            give-and-take.
          </li>
        </ul>
      </details>
    </div>
  );
}

function StartCard() {
  return (
    <div>
      <h2 className="text-foreground font-medium">Plan a conversation</h2>
      <p className="text-foreground-muted text-sm mt-1">
        Step through the letters one at a time. You can stop and come back.
      </p>
      <Link
        href="/student/skills/dearman/plan/situation"
        className="inline-block mt-5 px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        Start planning
      </Link>
    </div>
  );
}

function ResumeCard({
  entry,
}: {
  entry: { status: string; data: DearmanData };
}) {
  if (entry.status === "planned") {
    return (
      <div>
        <h2 className="text-foreground font-medium">Your plan is ready</h2>
        <p className="text-foreground-muted text-sm mt-1">
          Come back when you&rsquo;ve had the conversation.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/student/skills/dearman/script"
            className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Read your script
          </Link>
          <Link
            href="/student/skills/dearman/reflect"
            className="px-5 py-2.5 bg-surface border border-border rounded-xl font-medium text-foreground hover:border-accent transition-colors"
          >
            I&rsquo;ve had the conversation
          </Link>
        </div>
      </div>
    );
  }

  const resumeAt = firstIncompleteStep(entry.data);
  const filledCount = countFilled(entry.data);
  return (
    <div>
      <h2 className="text-foreground font-medium">Pick up where you left off</h2>
      <p className="text-foreground-muted text-sm mt-1">
        {filledCount} of 10 steps filled in.
      </p>
      <Link
        href={`/student/skills/dearman/plan/${resumeAt.key}`}
        className="inline-block mt-5 px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        Continue
      </Link>
    </div>
  );
}

function countFilled(data: DearmanData): number {
  const keys = [
    "situation",
    "concrete_goal",
    "relationship_goal",
    "describe",
    "express",
    "assert",
    "reinforce",
    "mindful",
    "appear",
    "negotiate",
  ] as const;
  return keys.filter((k) => {
    const v = data[k];
    return typeof v === "string" && v.trim().length > 0;
  }).length;
}
