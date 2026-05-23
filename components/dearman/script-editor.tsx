"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveDearmanScript } from "@/app/student/skills/dearman/script/actions";

export function ScriptEditor({
  initialScript,
  alreadyPlanned,
}: {
  initialScript: string;
  alreadyPlanned: boolean;
}) {
  const router = useRouter();
  const [script, setScript] = useState(initialScript);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function save() {
    setSaved(false);
    startTransition(async () => {
      await saveDearmanScript(script);
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <textarea
        value={script}
        onChange={(e) => {
          setScript(e.target.value);
          setSaved(false);
        }}
        rows={12}
        autoFocus={!alreadyPlanned}
        className="w-full bg-surface border border-border rounded-xl p-5 text-foreground placeholder:text-foreground-muted/60 focus:border-accent focus:outline-none resize-y leading-relaxed text-base"
        placeholder="Read it aloud. Adjust the wording so it sounds like you."
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending
            ? "Saving…"
            : alreadyPlanned
              ? "Update script"
              : "Save my script"}
        </button>
        {saved && !pending && (
          <span className="text-sm text-foreground-muted">Saved.</span>
        )}
      </div>
    </div>
  );
}
