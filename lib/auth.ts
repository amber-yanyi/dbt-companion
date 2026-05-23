import { cookies } from "next/headers";
import { db } from "./db";

const COOKIE_NAME = "dbt_user";

export type UserRole = "student" | "clinician";

export type SessionUser = {
  id: string;
  role: UserRole;
  name: string;
};

export async function setSession(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const userId = jar.get(COOKIE_NAME)?.value;
  if (!userId) return null;

  const { data, error } = await db
    .from("users")
    .select("id, role, name")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as SessionUser;
}

export async function requireSession(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) throw new Error("No session");
  return user;
}

export type DemoAccount = {
  id: string;
  role: UserRole;
  name: string;
  isSeeded: boolean;
};

export async function listDemoAccounts(): Promise<{
  seededStudents: DemoAccount[];
  customStudents: DemoAccount[];
  clinicians: DemoAccount[];
}> {
  const { data, error } = await db
    .from("users")
    .select("id, role, name, created_at")
    .order("created_at", { ascending: true });
  if (error || !data) {
    return { seededStudents: [], customStudents: [], clinicians: [] };
  }
  const { isSeeded, seededOrderRank } = await import("./seeded-users");
  const all = (data as { id: string; role: UserRole; name: string }[]).map(
    (u) => ({ ...u, isSeeded: isSeeded(u.id) })
  );
  const students = all.filter((u) => u.role === "student");
  const seededStudents = students
    .filter((u) => u.isSeeded)
    .sort((a, b) => seededOrderRank(a.id) - seededOrderRank(b.id));
  const customStudents = students
    .filter((u) => !u.isSeeded)
    .sort((a, b) => a.name.localeCompare(b.name));
  const clinicians = all.filter((u) => u.role === "clinician");
  return { seededStudents, customStudents, clinicians };
}

export async function createDemoStudent(name: string): Promise<{ id: string }> {
  const cleaned = name.trim();
  if (!cleaned) throw new Error("Name required");
  if (cleaned.length > 40) throw new Error("Name too long");
  const { data: clinician } = await db
    .from("users")
    .select("id")
    .eq("role", "clinician")
    .limit(1)
    .single();
  if (!clinician) throw new Error("No clinician available");
  const { data, error } = await db
    .from("users")
    .insert({
      role: "student",
      name: cleaned,
      linked_clinician_id: clinician.id,
    })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("Failed to create student");
  return { id: data.id as string };
}
