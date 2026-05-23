import Link from "next/link";
import {
  DashboardOverview,
  StudentOverview,
  FlaggedEntry,
} from "@/lib/dashboard-overview";
import { OPPOSITE_ACTION_SKILL_ID } from "@/lib/skills/opposite-action";
import { DEARMAN_SKILL_ID } from "@/lib/skills/dearman";
import { PLEASE_SKILL_ID } from "@/lib/skills/please";

const SKILL_NAME: Record<string, string> = {
  [OPPOSITE_ACTION_SKILL_ID]: "Opposite Action",
};

const DEARMAN_STATUS_ORDER: Record<string, number> = {
  reflected: 0,
  planned: 1,
  in_progress: 2,
  not_started: 3,
};

function dearmanStatusKey(s: StudentOverview): string {
  return s.dearmanStatus ?? "not_started";
}

function dearmanStatusLabel(s: StudentOverview): string {
  switch (s.dearmanStatus) {
    case "reflected":
      return "reflected";
    case "planned":
      return "plan ready";
    case "in_progress":
      return `in progress, ${s.dearmanStepsFilled}/10`;
    default:
      return "not started";
  }
}

export function ThisWeekAtAGlance({
  overview,
}: {
  overview: DashboardOverview;
}) {
  if (overview.total === 0) return null;

  const dearmanSorted = [...overview.perStudent].sort((a, b) => {
    const da =
      DEARMAN_STATUS_ORDER[dearmanStatusKey(a)] ?? 99;
    const db =
      DEARMAN_STATUS_ORDER[dearmanStatusKey(b)] ?? 99;
    if (da !== db) return da - db;
    return a.name.localeCompare(b.name);
  });

  const pleaseLogged = overview.perStudent
    .filter((s) => s.pleaseEntryCount > 0)
    .sort((a, b) => b.pleaseEntryCount - a.pleaseEntryCount);

  const lowSleep = overview.perStudent.filter(
    (s) => s.sleepAvg !== null && s.sleepAvg < 7
  );

  const withLibraryLogs = overview.perStudent.filter(
    (s) => s.libraryLogs.length > 0
  );

  const quiet = overview.perStudent.filter((s) => !s.hasAnyActivity);

  return (
    <section className="bg-surface border border-border rounded-2xl p-6 space-y-7">
      <div>
        <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
          This week at a glance
        </h2>
        <p className="text-foreground mt-2">
          {overview.total} student{overview.total === 1 ? "" : "s"} ·{" "}
          {overview.active} active this week
        </p>
      </div>

      <Block title="DEARMAN">
        {dearmanSorted.map((s) => (
          <StudentLine key={s.id} student={s} status={dearmanStatusLabel(s)} muted={s.dearmanStatus === null} />
        ))}
      </Block>

      <Block title="PLEASE">
        {pleaseLogged.length > 0 ? (
          pleaseLogged.map((s) => (
            <StudentLine
              key={s.id}
              student={s}
              status={pleaseStatus(s)}
            />
          ))
        ) : (
          <p className="text-sm text-foreground-muted">
            No PLEASE entries this week.
          </p>
        )}
        {lowSleep.length > 0 && (
          <PatternCallout>
            Sleep averaging under 7h:{" "}
            {lowSleep.map((s, i) => (
              <span key={s.id}>
                <StudentName student={s} />
                {i < lowSleep.length - 1 && (
                  <span className="text-foreground-muted">, </span>
                )}
              </span>
            ))}
          </PatternCallout>
        )}
      </Block>

      {withLibraryLogs.length > 0 && (
        <Block title="Other activity">
          {withLibraryLogs.map((s) => {
            const skills = Array.from(
              new Set(
                s.libraryLogs.map((l) => SKILL_NAME[l.skillId] ?? l.skillId)
              )
            );
            const anySelfInit = s.libraryLogs.some((l) => l.selfInitiated);
            const status = `${skills.join(", ")}${anySelfInit ? " (self-initiated)" : ""}`;
            return <StudentLine key={s.id} student={s} status={status} />;
          })}
        </Block>
      )}

      {overview.flagged.length > 0 && (
        <Block title="★ Flagged for discussion">
          {overview.flagged.map((f) => (
            <FlaggedLine key={f.id} flagged={f} />
          ))}
        </Block>
      )}

      {quiet.length > 0 && (
        <Block title="Quiet this week">
          <div className="text-sm">
            {quiet.map((s, i) => (
              <span key={s.id}>
                <StudentName student={s} />
                {i < quiet.length - 1 && (
                  <span className="text-foreground-muted">, </span>
                )}
              </span>
            ))}
          </div>
        </Block>
      )}
    </section>
  );
}

function FlaggedLine({ flagged }: { flagged: FlaggedEntry }) {
  const label = flaggedLabel(flagged);
  return (
    <div className="text-sm">
      <Link
        href={`/therapist/students/${flagged.studentId}`}
        className="text-foreground font-medium hover:underline"
      >
        {flagged.studentName}
      </Link>
      <span className="text-foreground-muted"> — {label}</span>
    </div>
  );
}

function flaggedLabel(f: FlaggedEntry): string {
  if (f.skillId === DEARMAN_SKILL_ID) {
    if (f.status === "reflected") return "DEARMAN reflection";
    if (f.status === "planned") return "DEARMAN plan";
    return "DEARMAN in progress";
  }
  if (f.skillId === PLEASE_SKILL_ID) {
    if (f.dateLabel) {
      const d = new Date(f.dateLabel + "T00:00:00Z");
      const weekday = d.toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "UTC",
      });
      return `${weekday}'s PLEASE check-in`;
    }
    return "PLEASE check-in";
  }
  if (f.skillId === OPPOSITE_ACTION_SKILL_ID) {
    return "Opposite Action log";
  }
  return f.skillId;
}

function pleaseStatus(s: StudentOverview): string {
  const parts = [
    `${s.pleaseEntryCount} ${s.pleaseEntryCount === 1 ? "entry" : "entries"}`,
  ];
  if (s.sleepAvg !== null) {
    parts.push(`sleep avg ${s.sleepAvg.toFixed(1)}h`);
  }
  return parts.join(" · ");
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-foreground-muted font-medium mb-3">
        {title}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function StudentLine({
  student,
  status,
  muted,
}: {
  student: StudentOverview;
  status: string;
  muted?: boolean;
}) {
  return (
    <div className="text-sm flex items-baseline gap-2 flex-wrap">
      <StudentName student={student} muted={muted} />
      <span className={muted ? "text-foreground-muted/80" : "text-foreground-muted"}>
        — {status}
      </span>
    </div>
  );
}

function StudentName({
  student,
  muted,
}: {
  student: StudentOverview;
  muted?: boolean;
}) {
  return (
    <Link
      href={`/therapist/students/${student.id}`}
      className={
        "font-medium hover:underline " +
        (muted ? "text-foreground-muted" : "text-foreground")
      }
    >
      {student.name}
    </Link>
  );
}

function PatternCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 pt-3 border-t border-border text-sm text-foreground-muted">
      {children}
    </div>
  );
}
