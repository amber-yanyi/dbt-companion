import { db } from "./db";
import { PLEASE_SKILL_ID, PleaseData } from "./skills/please";

type EntryRow = {
  id: string;
  data: PleaseData;
  updated_at: string;
};

export async function getPleaseEntry(
  userId: string,
  date: string
): Promise<EntryRow | null> {
  const { data, error } = await db
    .from("skill_entries")
    .select("id, data, updated_at")
    .eq("user_id", userId)
    .eq("skill_id", PLEASE_SKILL_ID)
    .eq("data->>date", date)
    .maybeSingle();
  if (error) throw error;
  return data as EntryRow | null;
}

export async function getPleaseEntriesForDates(
  userId: string,
  dates: string[]
): Promise<Record<string, PleaseData>> {
  const { data, error } = await db
    .from("skill_entries")
    .select("data")
    .eq("user_id", userId)
    .eq("skill_id", PLEASE_SKILL_ID)
    .in("data->>date", dates);
  if (error) throw error;
  const out: Record<string, PleaseData> = {};
  for (const row of data ?? []) {
    const d = (row as { data: PleaseData }).data;
    if (d?.date) out[d.date] = d;
  }
  return out;
}

export async function upsertPleaseEntry(
  userId: string,
  data: PleaseData
): Promise<void> {
  const existing = await getPleaseEntry(userId, data.date);
  if (existing) {
    const { error } = await db
      .from("skill_entries")
      .update({ data, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await db.from("skill_entries").insert({
      user_id: userId,
      skill_id: PLEASE_SKILL_ID,
      status: "logged",
      data,
    });
    if (error) throw error;
  }
}
