"use client";

import { useState, useTransition } from "react";
import { saveOppositeActionLog } from "@/app/student/skills/opposite-action/log/actions";
import { OppositeActionShift } from "@/lib/skills/opposite-action";

const SHIFT_OPTIONS: { value: OppositeActionShift; label: string }[] = [
  { value: "shift", label: "Felt a shift" },
  { value: "some", label: "Some change" },
  { value: "none", label: "Not much change" },
];

export function OppositeActionLogForm() {
  const [situation, setSituation] = useState("");
  const [shift, setShift] = useState<OppositeActionShift | null>(null);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  const canSubmit = situation.trim().length > 0 && !pending;

  function submit() {
    if (!canSubmit) return;
    startTransition(async () => {
      await saveOppositeActionLog({
        situation,
        shift,
        note,
      });
    });
  }

  return (
    <div className="space-y-8">
      <Field
        label="What was going on?"
        helper="A line or two — what you were feeling, what the urge was."
      >
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          rows={4}
          autoFocus
          className="w-full bg-surface border border-border rounded-xl p-3 text-foreground placeholder:text-foreground-muted/60 focus:border-accent focus:outline-none resize-y leading-relaxed"
          placeholder="e.g. Anxious about econ midterm. Urge was to isolate and ruminate."
        />
      </Field>

      <Field label="After acting opposite, what did you notice?">
        <ChipRow>
          {SHIFT_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              active={shift === o.value}
              onClick={() => setShift(o.value)}
            >
              {o.label}
            </Chip>
          ))}
        </ChipRow>
      </Field>

      <Field label="Anything else worth remembering?" helper="Optional.">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full bg-surface border border-border rounded-xl p-3 text-foreground placeholder:text-foreground-muted/60 focus:border-accent focus:outline-none resize-y leading-relaxed"
          placeholder="A line about what you actually did, or what surprised you."
        />
      </Field>

      <div>
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : "Save log"}
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
