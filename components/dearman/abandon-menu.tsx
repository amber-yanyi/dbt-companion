"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { abandonCurrentDearman } from "@/app/student/skills/dearman/actions";

export function AbandonMenu() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick() {
      setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpen]);

  useEffect(() => {
    if (!confirming) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirming(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirming]);

  function toggleMenu(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((o) => !o);
  }

  function openConfirm(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    setConfirming(true);
  }

  function onAbandon() {
    startTransition(async () => {
      await abandonCurrentDearman();
      setConfirming(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="More options"
          onClick={toggleMenu}
          className="w-8 h-8 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors flex items-center justify-center"
        >
          <span aria-hidden className="text-lg leading-none">
            ⋯
          </span>
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-9 z-10 min-w-[10rem] bg-surface border border-border rounded-xl shadow-sm py-1.5"
          >
            <button
              type="button"
              role="menuitem"
              onClick={openConfirm}
              className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-muted transition-colors"
            >
              Abandon plan
            </button>
          </div>
        )}
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
          onClick={() => setConfirming(false)}
        >
          <div
            className="bg-surface rounded-2xl shadow-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-foreground font-medium">
              Abandon this DEARMAN plan?
            </h3>
            <p className="text-foreground-muted text-sm mt-2 leading-relaxed">
              It will be removed from your home. You can start a new one
              anytime.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={pending}
                className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={onAbandon}
                disabled={pending}
                className="px-4 py-2 text-sm bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pending ? "Abandoning…" : "Abandon plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
