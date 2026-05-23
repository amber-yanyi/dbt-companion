"use client";

import { useState, useTransition } from "react";
import { toggleEntryFlag } from "@/app/actions/flags";

export function FlagButton({
  entryId,
  flagged,
}: {
  entryId: string;
  flagged: boolean;
}) {
  const [optimistic, setOptimistic] = useState(flagged);
  const [pending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !optimistic;
    setOptimistic(next);
    startTransition(async () => {
      try {
        await toggleEntryFlag(entryId);
      } catch {
        setOptimistic(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={optimistic}
      aria-label={
        optimistic ? "Unflag for next session" : "Flag for next session"
      }
      title={
        optimistic
          ? "Flagged for next session — tap to unflag"
          : "Flag for next session"
      }
      className={
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors " +
        (optimistic
          ? "text-accent bg-accent-soft hover:bg-accent-soft/80"
          : "text-foreground-muted hover:text-foreground hover:bg-surface-muted")
      }
    >
      <span aria-hidden className="text-base leading-none">
        {optimistic ? "★" : "☆"}
      </span>
      <span className="hidden sm:inline">
        {optimistic ? "Flagged" : "Flag for session"}
      </span>
    </button>
  );
}
