import { db } from "./db";
import {
  DEARMAN_SKILL_ID,
  DearmanData,
  DearmanReflection,
  DearmanStatus,
} from "./skills/dearman";

export type DearmanEntry = {
  id: string;
  status: DearmanStatus;
  data: DearmanData;
  updated_at: string;
  created_at: string;
};

export async function getCurrentDearman(
  userId: string
): Promise<DearmanEntry | null> {
  const { data, error } = await db
    .from("skill_entries")
    .select("id, status, data, updated_at, created_at")
    .eq("user_id", userId)
    .eq("skill_id", DEARMAN_SKILL_ID)
    .in("status", ["in_progress", "planned"])
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as DearmanEntry | null;
}

export async function getLatestDearman(
  userId: string
): Promise<DearmanEntry | null> {
  const { data, error } = await db
    .from("skill_entries")
    .select("id, status, data, updated_at, created_at")
    .eq("user_id", userId)
    .eq("skill_id", DEARMAN_SKILL_ID)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as DearmanEntry | null;
}

export async function getReflectedDearmans(
  userId: string,
  limit = 10
): Promise<DearmanEntry[]> {
  const { data, error } = await db
    .from("skill_entries")
    .select("id, status, data, updated_at, created_at")
    .eq("user_id", userId)
    .eq("skill_id", DEARMAN_SKILL_ID)
    .eq("status", "reflected")
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as DearmanEntry[];
}

export async function createDearman(userId: string): Promise<DearmanEntry> {
  const { data, error } = await db
    .from("skill_entries")
    .insert({
      user_id: userId,
      skill_id: DEARMAN_SKILL_ID,
      status: "in_progress" as DearmanStatus,
      data: {} as DearmanData,
    })
    .select("id, status, data, updated_at, created_at")
    .single();
  if (error) throw error;
  return data as DearmanEntry;
}

export async function ensureCurrentDearman(
  userId: string
): Promise<DearmanEntry> {
  const existing = await getCurrentDearman(userId);
  if (existing) return existing;
  return createDearman(userId);
}

export async function updateDearmanData(
  entryId: string,
  patch: Partial<DearmanData>
): Promise<void> {
  const { data: row, error: readErr } = await db
    .from("skill_entries")
    .select("data")
    .eq("id", entryId)
    .single();
  if (readErr) throw readErr;
  const merged = { ...((row?.data as DearmanData) ?? {}), ...patch };
  const { error } = await db
    .from("skill_entries")
    .update({ data: merged, updated_at: new Date().toISOString() })
    .eq("id", entryId);
  if (error) throw error;
}

export async function markDearmanPlanned(entryId: string): Promise<void> {
  const { error } = await db
    .from("skill_entries")
    .update({ status: "planned", updated_at: new Date().toISOString() })
    .eq("id", entryId);
  if (error) throw error;
}

export async function markDearmanReflected(
  entryId: string,
  reflection: DearmanReflection
): Promise<void> {
  const { data: row, error: readErr } = await db
    .from("skill_entries")
    .select("data")
    .eq("id", entryId)
    .single();
  if (readErr) throw readErr;
  const merged = { ...((row?.data as DearmanData) ?? {}), reflection };
  const { error } = await db
    .from("skill_entries")
    .update({
      data: merged,
      status: "reflected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", entryId);
  if (error) throw error;
}
