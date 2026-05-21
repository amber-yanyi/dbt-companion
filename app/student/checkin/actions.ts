"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { upsertPleaseEntry } from "@/lib/please";
import { PleaseData } from "@/lib/skills/please";

export async function savePleaseEntry(data: PleaseData) {
  const me = await requireSession();
  if (me.role !== "student") throw new Error("Not allowed");
  await upsertPleaseEntry(me.id, data);
  revalidatePath("/student/checkin");
  revalidatePath("/student/home");
  revalidatePath(`/therapist/students/${me.id}`);
}
