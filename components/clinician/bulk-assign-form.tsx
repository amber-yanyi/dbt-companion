"use client";

import { useState, useTransition } from "react";
import { saveBulkAssignment } from "@/app/therapist/assign/actions";
import { FOCUS_SKILLS, DAILY_CHECKIN_SKILLS } from "@/lib/skills/registry";

type StudentOption = { id: string; name: string };

export function BulkAssignForm({
  students,
}: {
  students: StudentOption[];
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(students.map((s) => s.id))
  );
  const [focusSkillId, setFocusSkillId] = useState<string | null>(null);
  const [dailyCheckins, setDailyCheckins] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  function toggleStudent(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleDaily(id: string) {
    setDailyCheckins((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function selectAll() {
    setSelected(new Set(students.map((s) => s.id)));
  }
  function selectNone() {
    setSelected(new Set());
  }

  function submit() {
    if (selected.size === 0) return;
    startTransition(async () => {
      await saveBulkAssignment({
        studentIds: Array.from(selected),
        focusSkillId,
        dailyCheckins,
        note,
      });
    });
  }

  const allSelected = selected.size === students.length;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">Students</div>
            <div className="text-xs text-foreground-muted mt-0.5">
              Default is everyone. Uncheck anyone you want to handle
              individually.
            </div>
          </div>
          <button
            type="button"
            onClick={allSelected ? selectNone : selectAll}
            className="text-xs text-foreground-muted hover:text-foreground transition-colors"
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
        </div>
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          {students.map((s) => {
            const checked = selected.has(s.id);
            return (
              <label
                key={s.id}
                className={
                  "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors " +
                  (checked
                    ? "bg-accent-soft/40 border-accent/30"
                    : "bg-surface border-border hover:border-accent")
                }
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleStudent(s.id)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-foreground">{s.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-foreground">Focus this week</div>
        <div className="text-xs text-foreground-muted mt-0.5">
          One skill the selected students should center on.
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {FOCUS_SKILLS.map((s) => (
            <Chip
              key={s.id}
              active={focusSkillId === s.id}
              onClick={() => setFocusSkillId(s.id)}
            >
              {s.name}
            </Chip>
          ))}
          <Chip
            active={focusSkillId === null}
            onClick={() => setFocusSkillId(null)}
          >
            No focus
          </Chip>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-foreground">Daily check-ins</div>
        <div className="text-xs text-foreground-muted mt-0.5">
          Adds a small card to each selected student&rsquo;s home.
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
          Note to students
        </div>
        <div className="text-xs text-foreground-muted mt-0.5">
          Optional. Same note goes to everyone selected.
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-3 w-full bg-surface border border-border rounded-xl p-3 text-foreground placeholder:text-foreground-muted/60 focus:border-accent focus:outline-none resize-y leading-relaxed"
          placeholder="e.g. We covered DEARMAN in group today — try it with one conversation that's been weighing on you."
        />
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-xs text-foreground-muted mb-4 leading-relaxed">
          This overwrites this week&rsquo;s assignment for each selected
          student. You can still edit individual students after.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={pending || selected.size === 0}
            className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending
              ? "Saving…"
              : `Save for ${selected.size} student${selected.size === 1 ? "" : "s"}`}
          </button>
        </div>
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
