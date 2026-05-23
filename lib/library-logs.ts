import { db } from "./db";
import { last7Days } from "./week";

export type LibraryLogEntry<T = unknown> = {
  id: string;
  skill_id: string;
  data: T;
  created_at: string;
};

export async function getLibraryLogs<T = unknown>(
  userId: string,
  skillId: string,
  limit = 20
): Promise<LibraryLogEntry<T>[]> {
  const { data, error } = await db
    .from("skill_entries")
    .select("id, skill_id, data, created_at")
    .eq("user_id", userId)
    .eq("skill_id", skillId)
    .eq("status", "logged")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as LibraryLogEntry<T>[];
}

export async function getLibraryLogsThisWeek<T = unknown>(
  userId: string,
  skillIds: string[]
): Promise<LibraryLogEntry<T>[]> {
  if (skillIds.length === 0) return [];
  const days = last7Days();
  const start = days[0] + "T00:00:00Z";
  const end = days[days.length - 1] + "T23:59:59Z";
  const { data, error } = await db
    .from("skill_entries")
    .select("id, skill_id, data, created_at")
    .eq("user_id", userId)
    .in("skill_id", skillIds)
    .eq("status", "logged")
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as LibraryLogEntry<T>[];
}

export async function insertLibraryLog<T>(
  userId: string,
  skillId: string,
  data: T
): Promise<void> {
  const { error } = await db.from("skill_entries").insert({
    user_id: userId,
    skill_id: skillId,
    status: "logged",
    data,
  });
  if (error) throw error;
}
