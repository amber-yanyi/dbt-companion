"use client";

import { useState, useTransition } from "react";
import { saveDearmanReflection } from "@/app/student/skills/dearman/reflect/actions";
import { DearmanReflection } from "@/lib/skills/dearman";

type Happened = "yes" | "no" | "postponed";
type GotWhat = "yes" | "partially" | "no";
type Relationship = "better" | "same" | "worse";

export function ReflectForm() {
  const [happened, setHappened] = useState<Happened | null>(null);
  const [overall, setOverall] = useState<number | null>(null);
  const [gotWhat, setGotWhat] = useState<GotWhat | null>(null);
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();

  const happenedYes = happened === "yes";
  const canSubmit = happened !== null;

  function submit() {
    if (!canSubmit) return;
    const reflection: DearmanReflection = {
      happened: happened!,
      ...(overall != null ? { overall } : {}),
      ...(gotWhat ? { got_what_asked: gotWhat } : {}),
      ...(relationship ? { relationship } : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };
    startTransition(async () => {
      await saveDearmanReflection(reflection);
    });
  }

  return (
    <div className="space-y-8">
      <Field label="Did the conversation happen?">
        <ChipRow>
          <Chip active={happened === "yes"} onClick={() => setHappened("yes")}>
            Yes
          </Chip>
          <Chip
            active={happened === "postponed"}
            onClick={() => setHappened("postponed")}
          >
            Postponed
          </Chip>
          <Chip active={happened === "no"} onClick={() => setHappened("no")}>
            No
          </Chip>
        </ChipRow>
      </Field>

      {happenedYes && (
        <>
          <Field label="How did it go overall?" helper="1 = not at all what you hoped, 5 = it went well.">
            <ChipRow>
              {[1, 2, 3, 4, 5].map((n) => (
                <Chip key={n} active={overall === n} onClick={() => setOverall(n)}>
                  {n}
                </Chip>
              ))}
            </ChipRow>
          </Field>

          <Field label="Did you get what you asked for?">
            <ChipRow>
              <Chip active={gotWhat === "yes"} onClick={() => setGotWhat("yes")}>
                Yes
              </Chip>
              <Chip
                active={gotWhat === "partially"}
                onClick={() => setGotWhat("partially")}
              >
                Partially
              </Chip>
              <Chip active={gotWhat === "no"} onClick={() => setGotWhat("no")}>
                No
              </Chip>
            </ChipRow>
          </Field>
        </>
      )}

      {happened !== null && (
        <Field label="How is the relationship now?">
          <ChipRow>
            <Chip
              active={relationship === "better"}
              onClick={() => setRelationship("better")}
            >
              Better
            </Chip>
            <Chip
              active={relationship === "same"}
              onClick={() => setRelationship("same")}
            >
              Same
            </Chip>
            <Chip
              active={relationship === "worse"}
              onClick={() => setRelationship("worse")}
            >
              Worse
            </Chip>
          </ChipRow>
        </Field>
      )}

      {happened !== null && (
        <Field label="Anything else worth noting?" helper="Optional.">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full bg-surface border border-border rounded-xl p-3 text-foreground placeholder:text-foreground-muted/60 focus:border-accent focus:outline-none resize-y leading-relaxed"
            placeholder="A line or two about how it went, what surprised you, anything you noticed."
          />
        </Field>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit || pending}
          className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : "Save reflection"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-foreground font-medium">{label}</div>
      {helper && (
        <div className="text-xs text-foreground-muted mt-0.5">{helper}</div>
      )}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-4 py-2 rounded-full border text-sm transition-colors " +
        (active
          ? "bg-accent text-white border-accent"
          : "bg-surface text-foreground border-border hover:border-accent")
      }
    >
      {children}
    </button>
  );
}
