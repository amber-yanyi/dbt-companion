import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getCurrentDearman } from "@/lib/dearman";
import { composeDearmanScript } from "@/lib/skills/dearman";
import { ScriptEditor } from "@/components/dearman/script-editor";

export default async function ScriptPage() {
  const me = await requireSession();
  if (me.role !== "student") return null;

  const entry = await getCurrentDearman(me.id);
  if (!entry) redirect("/student/skills/dearman");

  const initialScript =
    entry.data.script && entry.data.script.length > 0
      ? entry.data.script
      : composeDearmanScript(entry.data);
  const alreadyPlanned = entry.status === "planned";

  const reminders = [
    { label: "Stay focused on", value: entry.data.mindful },
    { label: "How to show up", value: entry.data.appear },
    { label: "Willing to give", value: entry.data.negotiate },
  ].filter((r) => typeof r.value === "string" && r.value.trim().length > 0);

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/student/skills/dearman"
          className="text-sm text-foreground-muted hover:text-foreground"
        >
          ← DEARMAN
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-medium text-foreground">Your script</h1>
        <p className="text-foreground-muted mt-2 leading-relaxed">
          Read this before the conversation. Adjust the wording so it sounds
          like you, not like a worksheet.
        </p>
      </header>

      {(entry.data.concrete_goal || entry.data.relationship_goal) && (
        <section className="bg-accent-soft/50 border border-accent/20 rounded-2xl p-5 space-y-3">
          {entry.data.concrete_goal && (
            <div>
              <div className="text-xs uppercase tracking-wide text-accent font-medium">
                What you want
              </div>
              <div className="text-foreground mt-1">{entry.data.concrete_goal}</div>
            </div>
          )}
          {entry.data.relationship_goal && (
            <div>
              <div className="text-xs uppercase tracking-wide text-accent font-medium">
                How you want the relationship afterward
              </div>
              <div className="text-foreground mt-1">
                {entry.data.relationship_goal}
              </div>
            </div>
          )}
        </section>
      )}

      <ScriptEditor
        initialScript={initialScript}
        alreadyPlanned={alreadyPlanned}
      />

      {reminders.length > 0 && (
        <section className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
            Before you go in
          </h2>
          <ul className="space-y-3">
            {reminders.map((r) => (
              <li key={r.label}>
                <div className="text-xs text-foreground-muted">{r.label}</div>
                <div className="text-foreground mt-0.5">{r.value}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {alreadyPlanned && (
        <div className="pt-2">
          <Link
            href="/student/skills/dearman/reflect"
            className="inline-block px-5 py-2.5 bg-surface border border-border rounded-xl font-medium text-foreground hover:border-accent transition-colors"
          >
            I&rsquo;ve had the conversation →
          </Link>
        </div>
      )}
    </div>
  );
}
