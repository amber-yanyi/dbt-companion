"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { saveClinicianNote } from "@/app/therapist/students/[id]/actions";

export function NotesEditor({
  studentId,
  initialContent,
}: {
  studentId: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [pending, startTransition] = useTransition();
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef(initialContent);

  useEffect(() => {
    if (content === lastSavedContentRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        await saveClinicianNote(studentId, content);
        lastSavedContentRef.current = content;
        setLastSavedAt(new Date());
      });
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content, studentId]);

  const status = pending
    ? "Saving…"
    : lastSavedAt
      ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
      : content !== initialContent
        ? "Unsaved"
        : "";

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-xs uppercase tracking-wide text-foreground-muted font-medium">
          My notes
        </div>
        <span className="text-xs text-foreground-muted">{status}</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        placeholder="Private to you. Anything you want to remember about this student or next session."
        className="w-full bg-surface border border-border rounded-xl p-3 text-foreground placeholder:text-foreground-muted/60 focus:border-accent focus:outline-none resize-y leading-relaxed"
      />
      <p className="text-xs text-foreground-muted mt-2">
        Only you can see this. The student never sees these notes.
      </p>
    </div>
  );
}
