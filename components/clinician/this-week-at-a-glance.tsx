import Link from "next/link";
import { DashboardOverview, StudentOverview } from "@/lib/dashboard-overview";
import { OPPOSITE_ACTION_SKILL_ID } from "@/lib/skills/opposite-action";

const SKILL_NAME: Record<string, string> = {
  [OPPOSITE_ACTION_SKILL_ID]: "Opposite Action",
};

export function ThisWeekAtAGlance({
  overview,
}: {
  overview: DashboardOverview;
}) {
  if (overview.total === 0) return null;

  const reflected = overview.perStudent.filter(
    (s) => s.dearmanStatus === "reflected"
  );
  const planned = overview.perStudent.filter(
    (s) => s.dearmanStatus === "planned"
  );
  const inProgress = overview.perStudent.filter(
    (s) => s.dearmanStatus === "in_progress"
  );
  const noDearman = overview.perStudent.filter(
    (s) => s.dearmanStatus === null
  );

  const pleaseLogged = overview.perStudent.filter(
    (s) => s.pleaseEntryCount > 0
  );
  const lowSleep = overview.perStudent.filter(
    (s) => s.sleepAvg !== null && s.sleepAvg < 7
  );

  const withLibraryLogs = overview.perStudent.filter(
    (s) => s.libraryLogs.length > 0
  );

  const quiet = overview.perStudent.filter((s) => !s.hasAnyActivity);

  return (
    <section className="bg-surface border border-border rounded-2xl p-6 space-y-6">
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
        {reflected.length > 0 && (
          <Line label="Reflected" people={reflected} />
        )}
        {planned.length > 0 && <Line label="Plan ready" people={planned} />}
        {inProgress.length > 0 && (
          <Line
            label="Planning in progress"
            people={inProgress}
            renderName={(s) => `${s.name} (${s.dearmanStepsFilled}/10)`}
          />
        )}
        {noDearman.length > 0 && (
          <Line label="Not started" people={noDearman} muted />
        )}
      </Block>

      <Block title="PLEASE">
        {pleaseLogged.length > 0 ? (
          <Line
            label="Logged"
            people={pleaseLogged}
            renderName={(s) => `${s.name} (${s.pleaseEntryCount})`}
          />
        ) : (
          <p className="text-sm text-foreground-muted">
            No PLEASE entries this week.
          </p>
        )}
        {lowSleep.length > 0 && (
          <Line
            label="Sleep averaging under 7h"
            people={lowSleep}
            renderName={(s) => `${s.name} (${s.sleepAvg!.toFixed(1)}h)`}
          />
        )}
      </Block>

      {withLibraryLogs.length > 0 && (
        <Block title="Other activity">
          {withLibraryLogs.map((s) => {
            const skills = Array.from(
              new Set(s.libraryLogs.map((l) => SKILL_NAME[l.skillId] ?? l.skillId))
            );
            const anySelfInit = s.libraryLogs.some((l) => l.selfInitiated);
            return (
              <div key={s.id} className="text-sm">
                <Link
                  href={`/therapist/students/${s.id}`}
                  className="text-foreground hover:underline"
                >
                  {s.name}
                </Link>
                <span className="text-foreground-muted">
                  {" "}
                  — {skills.join(", ")}
                  {anySelfInit && " (self-initiated)"}
                </span>
              </div>
            );
          })}
        </Block>
      )}

      {quiet.length > 0 && (
        <Block title="Quiet this week">
          <div className="text-sm">
            {quiet.map((s, i) => (
              <span key={s.id}>
                <Link
                  href={`/therapist/students/${s.id}`}
                  className="text-foreground hover:underline"
                >
                  {s.name}
                </Link>
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

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-foreground-muted font-medium mb-2">
        {title}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Line({
  label,
  people,
  renderName,
  muted,
}: {
  label: string;
  people: StudentOverview[];
  renderName?: (s: StudentOverview) => string;
  muted?: boolean;
}) {
  if (people.length === 0) return null;
  return (
    <div className="text-sm">
      <span className={muted ? "text-foreground-muted" : "text-foreground-muted"}>
        {label}:
      </span>{" "}
      {people.map((s, i) => (
        <span key={s.id}>
          <Link
            href={`/therapist/students/${s.id}`}
            className={
              "hover:underline " +
              (muted ? "text-foreground-muted" : "text-foreground")
            }
          >
            {renderName ? renderName(s) : s.name}
          </Link>
          {i < people.length - 1 && (
            <span className="text-foreground-muted">, </span>
          )}
        </span>
      ))}
    </div>
  );
}
