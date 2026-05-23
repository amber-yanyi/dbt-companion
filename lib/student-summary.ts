import { getLatestDearman } from "./dearman";
import { getPleaseEntriesForDates } from "./please";
import { last7Days } from "./week";

export type StudentWeekSummary = {
  dearmanStatus: "in_progress" | "planned" | "reflected" | null;
  pleaseEntryCount: number;
  text: string;
};

export async function getStudentWeekSummary(
  studentId: string
): Promise<StudentWeekSummary> {
  const [latestDearman, weekEntries] = await Promise.all([
    getLatestDearman(studentId),
    getPleaseEntriesForDates(studentId, last7Days()),
  ]);
  const pleaseEntryCount = Object.keys(weekEntries).length;
  const dearmanStatus = latestDearman?.status ?? null;

  const bits: string[] = [];
  if (dearmanStatus === "reflected") bits.push("DEARMAN reflected");
  else if (dearmanStatus === "planned") bits.push("DEARMAN plan ready");
  else if (dearmanStatus === "in_progress") bits.push("DEARMAN in progress");
  if (pleaseEntryCount > 0) {
    bits.push(
      `${pleaseEntryCount} PLEASE ${pleaseEntryCount === 1 ? "entry" : "entries"}`
    );
  }

  return {
    dearmanStatus,
    pleaseEntryCount,
    text: bits.length > 0 ? bits.join(" · ") : "No activity this week yet.",
  };
}
