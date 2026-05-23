import Link from "next/link";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getPleaseEntriesForDates } from "@/lib/please";
import { getLatestDearman } from "@/lib/dearman";
import { getCurrentAssignment } from "@/lib/assignments";
import { getClinicianNote } from "@/lib/notes";
import { getStudentWeekSummary } from "@/lib/student-summary";
import { getLibraryLogsThisWeek } from "@/lib/library-logs";
import { OPPOSITE_ACTION_SKILL_ID } from "@/lib/skills/opposite-action";
import { last7Days } from "@/lib/week";
import { PleaseWeekGrid } from "@/components/please/please-week-grid";
import { PleasePatterns } from "@/components/please/please-patterns";
import { PleaseEntryList } from "@/components/please/please-entry-list";
import { DearmanClinicianSection } from "@/components/dearman/clinician-section";
import { AssignmentForm } from "@/components/assignment/assignment-form";
import { NotesEditor } from "@/components/clinician/notes-editor";
import { LibraryLogsSection } from "@/components/library/library-logs-section";

export default async function StudentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await requireSession();

  const { data: student } = await db
    .from("users")
    .select("id, name, linked_clinician_id")
    .eq("id", id)
    .eq("role", "student")
    .single();

  if (!student || student.linked_clinician_id !== me.id) {
    notFound();
  }

  const [weekEntries, latestDearman, assignment, note, summary, libraryLogs] =
    await Promise.all([
      getPleaseEntriesForDates(student.id, last7Days()),
      getLatestDearman(student.id),
      getCurrentAssignment(student.id),
      getClinicianNote(me.id, student.id),
      getStudentWeekSummary(student.id),
      getLibraryLogsThisWeek(student.id, [OPPOSITE_ACTION_SKILL_ID]),
    ]);
  const entryCount = Object.keys(weekEntries).length;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/therapist/dashboard"
          className="text-sm text-foreground-muted hover:text-foreground"
        >
          ← Students
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-medium text-foreground">{student.name}</h1>
        <p className="text-foreground-muted mt-1">{summary.text}</p>
      </header>

      <section className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
          This week&rsquo;s assignment
        </h2>
        <div className="mt-5">
          <AssignmentForm
            studentId={student.id}
            initial={{
              focusSkillId: assignment?.focus_skill_id ?? null,
              dailyCheckins: assignment?.daily_checkins ?? [],
              note: assignment?.note ?? "",
            }}
          />
        </div>
      </section>

      {latestDearman && <DearmanClinicianSection entry={latestDearman} />}

      <LibraryLogsSection
        logs={libraryLogs}
        focusSkillId={assignment?.focus_skill_id ?? null}
      />

      <section className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
            PLEASE check-ins
          </h2>
        </div>
        <PleaseWeekGrid entries={weekEntries} />
        <PleasePatterns entries={weekEntries} />
        {entryCount > 0 && (
          <div className="pt-2">
            <PleaseEntryList entries={weekEntries} />
          </div>
        )}
      </section>

      <section className="bg-surface border border-border rounded-2xl p-6">
        <NotesEditor studentId={student.id} initialContent={note} />
      </section>
    </div>
  );
}
