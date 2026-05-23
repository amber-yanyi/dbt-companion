import { db } from "./db";
import { getLatestDearman } from "./dearman";
import { getPleaseEntriesForDates } from "./please";
import { getLibraryLogsThisWeek } from "./library-logs";
import { OPPOSITE_ACTION_SKILL_ID } from "./skills/opposite-action";
import { getCurrentAssignment } from "./assignments";
import { last7Days } from "./week";
import { DearmanStatus, DEARMAN_PLAN_STEPS } from "./skills/dearman";

export type StudentOverview = {
  id: string;
  name: string;
  dearmanStatus: DearmanStatus | null;
  dearmanStepsFilled: number;
  dearmanUpdatedAt: string | null;
  pleaseEntryCount: number;
  sleepAvg: number | null;
  libraryLogs: { skillId: string; selfInitiated: boolean }[];
  hasAnyActivity: boolean;
};

export type FlaggedEntry = {
  id: string;
  studentId: string;
  studentName: string;
  skillId: string;
  status: string;
  updatedAt: string;
  dateLabel: string | null;
};

export type DashboardOverview = {
  total: number;
  active: number;
  perStudent: StudentOverview[];
  flagged: FlaggedEntry[];
};

const PLAN_KEYS = DEARMAN_PLAN_STEPS.map((s) => s.key);

function isWithinLast7Days(iso: string): boolean {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return now - t <= sevenDays;
}

export async function getDashboardOverview(
  clinicianId: string
): Promise<DashboardOverview> {
  const { data: students } = await db
    .from("users")
    .select("id, name")
    .eq("role", "student")
    .eq("linked_clinician_id", clinicianId)
    .order("name");
  const list = students ?? [];

  const perStudent = await Promise.all(
    list.map(async (s) => {
      const [latestDearman, pleaseEntries, libraryLogs, assignment] =
        await Promise.all([
          getLatestDearman(s.id),
          getPleaseEntriesForDates(s.id, last7Days()),
          getLibraryLogsThisWeek(s.id, [OPPOSITE_ACTION_SKILL_ID]),
          getCurrentAssignment(s.id),
        ]);

      const dearmanRecent =
        latestDearman && isWithinLast7Days(latestDearman.updated_at)
          ? latestDearman
          : null;

      const sleeps = Object.values(pleaseEntries)
        .map((e) => e.data.sleep_hours)
        .filter((v): v is number => typeof v === "number");
      const sleepAvg =
        sleeps.length >= 3
          ? sleeps.reduce((a, b) => a + b, 0) / sleeps.length
          : null;

      const stepsFilled = dearmanRecent
        ? PLAN_KEYS.filter((k) => {
            const v = dearmanRecent.data[k];
            return typeof v === "string" && v.trim().length > 0;
          }).length
        : 0;

      const pleaseCount = Object.keys(pleaseEntries).length;
      const focusId = assignment?.focus_skill_id ?? null;

      return {
        id: s.id,
        name: s.name,
        dearmanStatus: dearmanRecent?.status ?? null,
        dearmanStepsFilled: stepsFilled,
        dearmanUpdatedAt: dearmanRecent?.updated_at ?? null,
        pleaseEntryCount: pleaseCount,
        sleepAvg,
        libraryLogs: libraryLogs.map((l) => ({
          skillId: l.skill_id,
          selfInitiated: l.skill_id !== focusId,
        })),
        hasAnyActivity:
          !!dearmanRecent || pleaseCount > 0 || libraryLogs.length > 0,
      } as StudentOverview;
    })
  );

  const flagged = await getFlaggedEntries(
    list.map((s) => ({ id: s.id as string, name: s.name as string }))
  );

  return {
    total: list.length,
    active: perStudent.filter((s) => s.hasAnyActivity).length,
    perStudent,
    flagged,
  };
}

async function getFlaggedEntries(
  students: { id: string; name: string }[]
): Promise<FlaggedEntry[]> {
  if (students.length === 0) return [];
  const { data, error } = await db
    .from("skill_entries")
    .select("id, user_id, skill_id, status, data, updated_at")
    .in(
      "user_id",
      students.map((s) => s.id)
    )
    .filter("data->>flagged", "eq", "true")
    .order("updated_at", { ascending: false });
  if (error) return [];
  const byId: Record<string, string> = {};
  students.forEach((s) => {
    byId[s.id] = s.name;
  });
  return (data ?? []).map((row) => {
    const r = row as {
      id: string;
      user_id: string;
      skill_id: string;
      status: string;
      data: Record<string, unknown>;
      updated_at: string;
    };
    const dateLabel = typeof r.data?.date === "string" ? r.data.date : null;
    return {
      id: r.id,
      studentId: r.user_id,
      studentName: byId[r.user_id] ?? "Student",
      skillId: r.skill_id,
      status: r.status,
      updatedAt: r.updated_at,
      dateLabel,
    };
  });
}
