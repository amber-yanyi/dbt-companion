import { db } from "./db";
import { currentMondayISO } from "./week";

export type Assignment = {
  id: string;
  student_id: string;
  clinician_id: string;
  week_starting: string;
  focus_skill_id: string | null;
  daily_checkins: string[];
  note: string | null;
};

export async function getCurrentAssignment(
  studentId: string
): Promise<Assignment | null> {
  const weekStarting = currentMondayISO();
  const { data, error } = await db
    .from("assignments")
    .select("id, student_id, clinician_id, week_starting, focus_skill_id, daily_checkins, note")
    .eq("student_id", studentId)
    .eq("week_starting", weekStarting)
    .maybeSingle();
  if (error) throw error;
  return data as Assignment | null;
}

export async function upsertCurrentAssignment(params: {
  studentId: string;
  clinicianId: string;
  focusSkillId: string | null;
  dailyCheckins: string[];
  note: string | null;
}): Promise<void> {
  const weekStarting = currentMondayISO();
  const { error } = await db
    .from("assignments")
    .upsert(
      {
        student_id: params.studentId,
        clinician_id: params.clinicianId,
        week_starting: weekStarting,
        focus_skill_id: params.focusSkillId,
        daily_checkins: params.dailyCheckins,
        note: params.note,
      },
      { onConflict: "student_id,week_starting" }
    );
  if (error) throw error;
}
