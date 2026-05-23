import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getLibraryLogs, LibraryLogEntry } from "@/lib/library-logs";
import {
  OPPOSITE_ACTION_SKILL_ID,
  OppositeActionData,
  SHIFT_LABEL,
} from "@/lib/skills/opposite-action";
import { FlagButton } from "@/components/flag-button";

export default async function OppositeActionPage() {
  const me = await requireSession();
  if (me.role !== "student") return null;

  const logs = await getLibraryLogs<OppositeActionData>(
    me.id,
    OPPOSITE_ACTION_SKILL_ID
  );

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/student/skills"
          className="text-sm text-foreground-muted hover:text-foreground"
        >
          ← All skills
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-medium text-foreground">Opposite Action</h1>
        <p className="text-foreground-muted mt-2 leading-relaxed">
          When an emotion is more intense than the situation calls for, or
          acting on the urge would hurt you, try doing the opposite of what
          the emotion wants.
        </p>
      </header>

      <section className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
            How it works
          </h2>
          <ul className="mt-3 space-y-2 text-foreground leading-relaxed">
            <li>
              · Afraid of something safe? <span className="text-foreground-muted">Approach it.</span>
            </li>
            <li>
              · Angry at someone you care about? <span className="text-foreground-muted">Be kind, or step away.</span>
            </li>
            <li>
              · Sad and pulled to isolate? <span className="text-foreground-muted">Reach out instead.</span>
            </li>
            <li>
              · Ashamed when you haven&rsquo;t done anything wrong?{" "}
              <span className="text-foreground-muted">Show up anyway.</span>
            </li>
          </ul>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-sm text-foreground-muted leading-relaxed">
            The point isn&rsquo;t to suppress the emotion — it&rsquo;s to give
            yourself a different option than what the urge is asking for.
          </p>
        </div>
      </section>

      <div>
        <Link
          href="/student/skills/opposite-action/log"
          className="inline-block px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          I used this
        </Link>
      </div>

      {logs.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
            Times you&rsquo;ve used this
          </h2>
          <ul className="mt-3 space-y-3">
            {logs.map((entry) => (
              <LogItem key={entry.id} entry={entry} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function LogItem({
  entry,
}: {
  entry: LibraryLogEntry<OppositeActionData>;
}) {
  const when = new Date(entry.created_at);
  const whenLabel = when.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const shiftLabel = entry.data.shift ? SHIFT_LABEL[entry.data.shift] : null;
  return (
    <li className="bg-surface border border-border rounded-2xl p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="text-sm font-medium text-foreground">{whenLabel}</div>
        <div className="flex items-center gap-2">
          {shiftLabel && (
            <span className="text-xs text-foreground bg-accent-soft/60 px-3 py-1 rounded-full">
              {shiftLabel}
            </span>
          )}
          <FlagButton
            entryId={entry.id}
            flagged={entry.data.flagged ?? false}
          />
        </div>
      </div>
      <p className="text-foreground mt-2 leading-relaxed whitespace-pre-wrap">
        {entry.data.situation}
      </p>
      {entry.data.note && (
        <p className="text-sm text-foreground-muted mt-2 leading-relaxed whitespace-pre-wrap">
          {entry.data.note}
        </p>
      )}
    </li>
  );
}
