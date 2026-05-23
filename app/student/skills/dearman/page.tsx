import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getCurrentDearman } from "@/lib/dearman";
import { firstIncompleteStep } from "@/lib/skills/dearman";

export default async function DearmanEntry() {
  const me = await requireSession();
  if (me.role !== "student") return null;

  const current = await getCurrentDearman(me.id);

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
  const firstStep = "situation";
  return (
    <div>
      <h2 className="text-foreground font-medium">Plan a conversation</h2>
      <p className="text-foreground-muted text-sm mt-1">
        Step through the letters one at a time. You can stop and come back.
      </p>
      <Link
        href={`/student/skills/dearman/plan/${firstStep}`}
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
  entry: { status: string; data: import("@/lib/skills/dearman").DearmanData };
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

function countFilled(data: import("@/lib/skills/dearman").DearmanData): number {
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
