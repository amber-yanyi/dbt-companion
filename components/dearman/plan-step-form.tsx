"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveStep, saveStepAndExit } from "@/app/student/skills/dearman/plan/[step]/actions";

export function PlanStepForm({
  stepKey,
  initialValue,
  isLast,
}: {
  stepKey: string;
  initialValue: string;
  isLast: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [pending, startTransition] = useTransition();
  const [savingExit, setSavingExit] = useState(false);

  function handleContinue() {
    setSavingExit(false);
    startTransition(async () => {
      await saveStep(stepKey, value);
    });
  }

  function handleSaveExit() {
    setSavingExit(true);
    startTransition(async () => {
      await saveStepAndExit(stepKey, value);
    });
  }

  function handleBack() {
    router.back();
  }

  return (
    <div className="space-y-6">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Take your time — you can edit this later."
        rows={6}
        autoFocus
        className="w-full bg-surface border border-border rounded-xl p-4 text-foreground placeholder:text-foreground-muted/60 focus:border-accent focus:outline-none resize-y leading-relaxed"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleContinue}
          disabled={pending}
          className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending && !savingExit
            ? "Saving…"
            : isLast
              ? "Save and review script →"
              : "Save and continue →"}
        </button>
        <button
          type="button"
          onClick={handleSaveExit}
          disabled={pending}
          className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors disabled:opacity-60"
        >
          {pending && savingExit ? "Saving…" : "Save and come back later"}
        </button>
        <button
          type="button"
          onClick={handleBack}
          disabled={pending}
          className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors disabled:opacity-60"
        >
          Back
        </button>
      </div>
    </div>
  );
}
