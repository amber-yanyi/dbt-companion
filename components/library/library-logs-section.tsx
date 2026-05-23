import { LibraryLogEntry } from "@/lib/library-logs";
import {
  OPPOSITE_ACTION_SKILL_ID,
  OppositeActionData,
  SHIFT_LABEL,
} from "@/lib/skills/opposite-action";
import { FlagBadge } from "@/components/flag-badge";

const SKILL_NAME: Record<string, string> = {
  [OPPOSITE_ACTION_SKILL_ID]: "Opposite Action",
};

export function LibraryLogsSection({
  logs,
  focusSkillId,
}: {
  logs: LibraryLogEntry[];
  focusSkillId: string | null;
}) {
  if (logs.length === 0) return null;

  return (
    <section className="bg-surface border border-border rounded-2xl p-6 space-y-5">
      <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
        Other activity this week
      </h2>
      <ul className="space-y-4">
        {logs.map((entry) => (
          <LogRow
            key={entry.id}
            entry={entry}
            selfInitiated={entry.skill_id !== focusSkillId}
          />
        ))}
      </ul>
    </section>
  );
}

function LogRow({
  entry,
  selfInitiated,
}: {
  entry: LibraryLogEntry;
  selfInitiated: boolean;
}) {
  const when = new Date(entry.created_at);
  const whenLabel = when.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeLabel = when.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const skillName = SKILL_NAME[entry.skill_id] ?? entry.skill_id;

  if (entry.skill_id === OPPOSITE_ACTION_SKILL_ID) {
    const data = entry.data as OppositeActionData;
    const shiftLabel = data.shift ? SHIFT_LABEL[data.shift] : null;
    return (
      <li className="border-l-2 border-border pl-4 py-0.5">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div className="text-sm font-medium text-foreground">
            {skillName} · <span className="text-foreground-muted font-normal">{whenLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            {data.flagged && <FlagBadge />}
            {selfInitiated && (
              <span
                className="text-[10px] uppercase tracking-wide text-accent bg-accent-soft px-2 py-0.5 rounded-full"
                title="Student used this on their own, not as the week's focus"
              >
                Self-initiated
              </span>
            )}
            <span className="text-xs text-foreground-muted">{timeLabel}</span>
          </div>
        </div>
        <p className="text-foreground mt-1.5 leading-relaxed whitespace-pre-wrap">
          {data.situation}
        </p>
        {(shiftLabel || data.note) && (
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {shiftLabel && (
              <span className="text-xs text-foreground bg-accent-soft/60 px-2.5 py-0.5 rounded-full">
                {shiftLabel}
              </span>
            )}
            {data.note && (
              <p className="text-sm text-foreground-muted leading-relaxed whitespace-pre-wrap">
                {data.note}
              </p>
            )}
          </div>
        )}
        <p className="text-[10px] uppercase tracking-wide text-foreground-muted mt-2">
          Asynchronous log — student logged this on their own time
        </p>
      </li>
    );
  }

  return (
    <li className="border-l-2 border-border pl-4 py-0.5">
      <div className="text-sm font-medium text-foreground">
        {skillName} · {whenLabel}
      </div>
    </li>
  );
}
