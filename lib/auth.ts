import { cookies } from "next/headers";
import { db, DEMO_CLINICIAN_ID, DEMO_STUDENT_ID } from "./db";

const COOKIE_NAME = "dbt_user";

export type UserRole = "student" | "clinician";

export type SessionUser = {
  id: string;
  role: UserRole;
  name: string;
};

export async function setSession(role: UserRole) {
  const userId = role === "student" ? DEMO_STUDENT_ID : DEMO_CLINICIAN_ID;
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
