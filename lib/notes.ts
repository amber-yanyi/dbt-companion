import { db } from "./db";

export async function getClinicianNote(
  clinicianId: string,
  studentId: string
): Promise<string> {
  const { data, error } = await db
    .from("clinician_notes")
    .select("content")
    .eq("clinician_id", clinicianId)
    .eq("student_id", studentId)
    .maybeSingle();
  if (error) throw error;
  return (data?.content as string) ?? "";
}

export async function upsertClinicianNote(
  clinicianId: string,
  studentId: string,
  content: string
): Promise<void> {
  const { error } = await db
    .from("clinician_notes")
    .upsert(
      {
        clinician_id: clinicianId,
        student_id: studentId,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clinician_id,student_id" }
    );
  if (error) throw error;
}
