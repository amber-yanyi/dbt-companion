export const FOCUS_SKILLS = [
  { id: "dearman", name: "DEARMAN", route: "/student/skills/dearman" },
  { id: "please", name: "PLEASE", route: "/student/checkin" },
] as const;

export const DAILY_CHECKIN_SKILLS = [
  { id: "please", name: "PLEASE" },
] as const;

export type FocusSkillId = (typeof FOCUS_SKILLS)[number]["id"];

export function getFocusSkill(
  id: string | null | undefined
): (typeof FOCUS_SKILLS)[number] | null {
  if (!id) return null;
  return FOCUS_SKILLS.find((s) => s.id === id) ?? null;
}
