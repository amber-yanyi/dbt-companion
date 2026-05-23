import { DearmanEntry } from "@/lib/dearman";
import { composeDearmanScript } from "@/lib/skills/dearman";

export function DearmanClinicianSection({ entry }: { entry: DearmanEntry }) {
  const { data, status, updated_at } = entry;
  const updated = new Date(updated_at);
  const updatedLabel = updated.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const statusLabel =
    status === "reflected"
      ? `Reflected ${updatedLabel}`
      : status === "planned"
        ? `Plan ready ${updatedLabel}`
        : `Planning in progress · updated ${updatedLabel}`;

  const scriptText =
    data.script && data.script.trim().length > 0
      ? data.script
      : composeDearmanScript(data);

  const reminders = [
    { label: "Stay focused on", value: data.mindful },
    { label: "How to show up", value: data.appear },
    { label: "Willing to give", value: data.negotiate },
  ].filter((r) => typeof r.value === "string" && r.value.trim().length > 0);

  return (
    <section className="bg-surface border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
          DEARMAN
        </h2>
        <span className="text-xs text-foreground-muted">{statusLabel}</span>
      </div>

      {data.situation && (
        <Field label="Situation">{data.situation}</Field>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {data.concrete_goal && (
          <Field label="What they want">{data.concrete_goal}</Field>
        )}
        {data.relationship_goal && (
          <Field label="Relationship goal">{data.relationship_goal}</Field>
        )}
      </div>

      {scriptText && (
        <div>
          <div className="text-xs text-foreground-muted mb-2">
            Script they planned to use
          </div>
          <blockquote className="border-l-2 border-accent/60 pl-4 text-foreground leading-relaxed whitespace-pre-wrap">
            {scriptText}
          </blockquote>
        </div>
      )}

      {reminders.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-foreground-muted hover:text-foreground">
            Before-the-conversation notes
          </summary>
          <ul className="mt-3 space-y-2">
            {reminders.map((r) => (
              <li key={r.label}>
                <div className="text-xs text-foreground-muted">{r.label}</div>
                <div className="text-foreground mt-0.5">{r.value}</div>
              </li>
            ))}
          </ul>
        </details>
      )}

      {data.reflection && <ReflectionBlock reflection={data.reflection} />}
    </section>
  );
}

function ReflectionBlock({
  reflection,
}: {
  reflection: NonNullable<DearmanEntry["data"]["reflection"]>;
}) {
  const happenedLabel = {
    yes: "Yes, it happened",
    postponed: "Postponed",
    no: "Didn't happen",
  }[reflection.happened];

  const gotLabel = reflection.got_what_asked
    ? {
        yes: "Got what asked",
        partially: "Partially",
        no: "Didn't",
      }[reflection.got_what_asked]
    : null;

  const relLabel = reflection.relationship
    ? {
        better: "Relationship better",
        same: "Same",
        worse: "Worse",
      }[reflection.relationship]
    : null;

  const chips = [
    happenedLabel,
    reflection.overall != null ? `Overall ${reflection.overall}/5` : null,
    gotLabel,
    relLabel,
  ].filter((s): s is string => !!s);

  return (
    <div className="pt-2 border-t border-border space-y-3">
      <div className="text-xs text-foreground-muted">How it went</div>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className="text-sm text-foreground bg-accent-soft/60 px-3 py-1 rounded-full"
          >
            {c}
          </span>
        ))}
      </div>
      {reflection.notes && (
        <div className="text-sm text-foreground leading-relaxed pt-1">
          {reflection.notes}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs text-foreground-muted">{label}</div>
      <div className="text-foreground mt-0.5 leading-relaxed">{children}</div>
    </div>
  );
}
