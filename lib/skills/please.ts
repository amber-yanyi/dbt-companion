export const PLEASE_SKILL_ID = "please";

export type ExerciseLevel = "none" | "light" | "moderate" | "intense";

export type PleaseData = {
  date: string;
  sleep_hours?: number | null;
  exercise_level?: ExerciseLevel | null;
  exercise_minutes?: number | null;
  meals?: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  substances?: {
    used: boolean;
    note?: string;
  } | null;
  illness?: {
    present: boolean;
    note?: string;
  } | null;
  flagged?: boolean;
};

export function emptyPleaseEntry(date: string): PleaseData {
  return {
    date,
    sleep_hours: null,
    exercise_level: null,
    exercise_minutes: null,
    meals: { breakfast: false, lunch: false, dinner: false },
    substances: null,
    illness: null,
  };
}

export function hasAnyContent(data: PleaseData): boolean {
  if (data.sleep_hours != null) return true;
  if (data.exercise_level && data.exercise_level !== "none") return true;
  if (data.exercise_level === "none") return true;
  if (data.meals && (data.meals.breakfast || data.meals.lunch || data.meals.dinner)) return true;
  if (data.substances) return true;
  if (data.illness) return true;
  return false;
}
