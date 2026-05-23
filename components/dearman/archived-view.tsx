import { DearmanEntry } from "@/lib/dearman";
import { composeDearmanScript } from "@/lib/skills/dearman";

export function DearmanArchivedView({ entry }: { entry: DearmanEntry }) {
  const { data } = entry;
  const scriptText =
    data.script && data.script.trim().length > 0
      ? data.script
      : composeDearmanScript(data);

  return (
    <div className="space-y-4 pt-4">
      {data.concrete_goal && (
        <div>
          <div className="text-xs text-foreground-muted">What you wanted</div>
          <div className="text-foreground mt-0.5">{data.concrete_goal}</div>
        </div>
      )}

      {scriptText && (
        <div>
          <div className="text-xs text-foreground-muted mb-2">
            What you planned to say
          </div>
          <blockquote className="border-l-2 border-accent/60 pl-4 text-foreground leading-relaxed whitespace-pre-wrap">
            {scriptText}
          </blockquote>
        </div>
      )}

      {data.reflection && <ReflectionBlock reflection={data.reflection} />}
    </div>
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
        yes: "Got what you asked",
        partially: "Partially",
        no: "Didn't get it",
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
    <div className="pt-3 border-t border-border space-y-3">
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
