"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAssignment } from "@/app/therapist/students/[id]/actions";
import { FOCUS_SKILLS, DAILY_CHECKIN_SKILLS } from "@/lib/skills/registry";

export function AssignmentForm({
  studentId,
  initial,
}: {
  studentId: string;
  initial: {
    focusSkillId: string | null;
    dailyCheckins: string[];
    note: string;
  };
}) {
  const router = useRouter();
  const [focusSkillId, setFocusSkillId] = useState<string | null>(
    initial.focusSkillId
  );
  const [dailyCheckins, setDailyCheckins] = useState<string[]>(
    initial.dailyCheckins
  );
  const [note, setNote] = useState(initial.note);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function toggleDaily(id: string) {
    setSaved(false);
    setDailyCheckins((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function setFocus(id: string | null) {
    setSaved(false);
    setFocusSkillId(id);
  }

  function submit() {
    startTransition(async () => {
      await saveAssignment({ studentId, focusSkillId, dailyCheckins, note });
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-foreground">Focus this week</div>
        <div className="text-xs text-foreground-muted mt-0.5">
          One skill the student should center on.
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {FOCUS_SKILLS.map((s) => (
            <Chip
              key={s.id}
              active={focusSkillId === s.id}
              onClick={() => setFocus(s.id)}
            >
              {s.name}
            </Chip>
          ))}
          <Chip active={focusSkillId === null} onClick={() => setFocus(null)}>
            No focus
          </Chip>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-foreground">Daily check-ins</div>
        <div className="text-xs text-foreground-muted mt-0.5">
          Surfaces a small card on the student&rsquo;s home each day.
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {DAILY_CHECKIN_SKILLS.map((s) => (
            <Chip
              key={s.id}
              active={dailyCheckins.includes(s.id)}
              onClick={() => toggleDaily(s.id)}
            >
              {s.name}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-foreground">
          Note to student
        </div>
        <div className="text-xs text-foreground-muted mt-0.5">
          Optional. They&rsquo;ll see this on their home this week.
        </div>
        <textarea
          value={note}
          onChange={(e) => {
            setSaved(false);
            setNote(e.target.value);
          }}
          rows={3}
          className="mt-3 w-full bg-surface border border-border rounded-xl p-3 text-foreground placeholder:text-foreground-muted/60 focus:border-accent focus:outline-none resize-y leading-relaxed"
          placeholder="e.g. We talked about trying DEARMAN with the roommate situation. Take your time with it."
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : "Save assignment"}
        </button>
        {saved && !pending && (
          <span className="text-sm text-foreground-muted">Saved.</span>
        )}
      </div>
    </div>
  );
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
