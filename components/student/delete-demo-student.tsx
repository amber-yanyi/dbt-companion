"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteCurrentDemoStudent } from "@/app/student/home/actions";

export function DeleteDemoStudent({ name }: { name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!confirming) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirming(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirming]);

  function onDelete() {
    startTransition(async () => {
      await deleteCurrentDemoStudent();
    });
  }

  return (
    <>
      <div className="border-t border-border pt-6">
        <p className="text-sm text-foreground-muted">
          This is a custom demo student you added.{" "}
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="text-foreground hover:underline"
          >
            Delete this demo student
          </button>
        </p>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
          onClick={() => setConfirming(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="bg-surface rounded-2xl shadow-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-foreground font-medium">
              Delete this demo student?
            </h3>
            <p className="text-foreground-muted text-sm mt-2 leading-relaxed">
              This will remove {name} and all practice data created for them
              in this shared demo. The seeded demo students aren&rsquo;t
              affected.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={pending}
                className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={pending}
                className="px-4 py-2 text-sm bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pending ? "Deleting…" : "Delete demo student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
