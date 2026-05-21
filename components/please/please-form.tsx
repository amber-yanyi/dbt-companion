"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PleaseData, ExerciseLevel, emptyPleaseEntry } from "@/lib/skills/please";
import { savePleaseEntry } from "@/app/student/checkin/actions";

const EXERCISE_LEVELS: { value: ExerciseLevel; label: string }[] = [
  { value: "none", label: "None" },
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "intense", label: "Intense" },
];

export function PleaseForm({
  date,
  initial,
}: {
  date: string;
  initial: PleaseData | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<PleaseData>(initial ?? emptyPleaseEntry(date));

  function update<K extends keyof PleaseData>(key: K, value: PleaseData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function toggleMeal(meal: "breakfast" | "lunch" | "dinner") {
    const next = { ...(data.meals ?? { breakfast: false, lunch: false, dinner: false }) };
    next[meal] = !next[meal];
    update("meals", next);
  }

  function submit() {
    startTransition(async () => {
      await savePleaseEntry(data);
      setSaved(true);
      router.refresh();
    });
  }

  const exerciseSelected = data.exercise_level ?? null;
  const showExerciseDuration = exerciseSelected && exerciseSelected !== "none";

  return (
    <div className="space-y-8">
      <Section
        label="Sleep last night"
        helper="Best estimate is fine — this is observation, not measurement."
      >
        <div className="flex items-baseline gap-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.5"
            min="0"
            max="24"
            value={data.sleep_hours ?? ""}
            onChange={(e) =>
              update(
                "sleep_hours",
                e.target.value === "" ? null : parseFloat(e.target.value)
              )
            }
            placeholder="—"
            className="w-20 bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:border-accent focus:outline-none"
          />
          <span className="text-foreground-muted text-sm">hours</span>
        </div>
      </Section>

      <Section label="Exercise">
        <ChipGroup>
          {EXERCISE_LEVELS.map((opt) => (
            <Chip
              key={opt.value}
              active={exerciseSelected === opt.value}
              onClick={() => update("exercise_level", opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
        </ChipGroup>
        {showExerciseDuration && (
          <div className="mt-3 flex items-baseline gap-2">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="600"
              value={data.exercise_minutes ?? ""}
              onChange={(e) =>
                update(
                  "exercise_minutes",
                  e.target.value === "" ? null : parseInt(e.target.value, 10)
                )
              }
              placeholder="—"
              className="w-20 bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:border-accent focus:outline-none"
            />
            <span className="text-foreground-muted text-sm">minutes (optional)</span>
          </div>
        )}
      </Section>

      <Section label="Meals today" helper="Tap whichever you had.">
        <ChipGroup>
          {(["breakfast", "lunch", "dinner"] as const).map((m) => (
            <Chip
              key={m}
              active={!!data.meals?.[m]}
              onClick={() => toggleMeal(m)}
            >
              {m[0].toUpperCase() + m.slice(1)}
            </Chip>
          ))}
        </ChipGroup>
      </Section>

      <Section label="Mood-altering substances">
        <ChipGroup>
          <Chip
            active={data.substances?.used === false}
            onClick={() => update("substances", { used: false })}
          >
            None today
          </Chip>
          <Chip
            active={data.substances?.used === true}
            onClick={() =>
              update("substances", {
                used: true,
                note: data.substances?.note ?? "",
              })
            }
          >
            Yes, some
          </Chip>
        </ChipGroup>
        {data.substances?.used === true && (
          <textarea
            value={data.substances.note ?? ""}
            onChange={(e) =>
              update("substances", { used: true, note: e.target.value })
            }
            placeholder="Anything you want to note (optional)"
            className="mt-3 w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:border-accent focus:outline-none resize-none"
            rows={2}
          />
        )}
      </Section>

      <Section label="Physical illness">
        <ChipGroup>
          <Chip
            active={data.illness?.present === false}
            onClick={() => update("illness", { present: false })}
          >
            Feeling ok
          </Chip>
          <Chip
            active={data.illness?.present === true}
            onClick={() =>
              update("illness", {
                present: true,
                note: data.illness?.note ?? "",
              })
            }
          >
            Not feeling well
          </Chip>
        </ChipGroup>
        {data.illness?.present === true && (
          <textarea
            value={data.illness.note ?? ""}
            onChange={(e) =>
              update("illness", { present: true, note: e.target.value })
            }
            placeholder="Anything you want to note (optional)"
            className="mt-3 w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:border-accent focus:outline-none resize-none"
            rows={2}
          />
        )}
      </Section>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={submit}
          disabled={pending}
          className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : initial ? "Update" : "Save"}
        </button>
        {saved && !pending && (
          <span className="text-sm text-foreground-muted">Saved.</span>
        )}
      </div>
    </div>
  );
}

function Section({
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
      <div className="text-sm font-medium text-foreground mb-1">{label}</div>
      {helper && <div className="text-xs text-foreground-muted mb-3">{helper}</div>}
      <div className={helper ? "" : "mt-2"}>{children}</div>
    </div>
  );
}

function ChipGroup({ children }: { children: React.ReactNode }) {
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
