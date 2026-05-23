"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DemoAccount } from "@/lib/auth";

export function LoginButtons({
  seededStudents,
  customStudents,
  clinicians,
}: {
  seededStudents: DemoAccount[];
  customStudents: DemoAccount[];
  clinicians: DemoAccount[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function signIn(userId: string) {
    setPendingId(userId);
    const res = await fetch("/api/demo-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "signin" }),
    });
    const json = await res.json();
    if (json.redirect) router.push(json.redirect);
  }

  return (
    <div className="space-y-8">
      {(seededStudents.length > 0 || customStudents.length > 0) && (
        <Section label="Sign in as a student">
          <div className="grid sm:grid-cols-2 gap-3">
            {seededStudents.map((s) => (
              <AccountButton
                key={s.id}
                name={s.name}
                hint={STUDENT_HINTS[s.name] ?? "Demo student"}
                pending={pendingId === s.id}
                disabled={pendingId !== null}
                onClick={() => signIn(s.id)}
              />
            ))}
            {customStudents.map((s) => (
              <AccountButton
                key={s.id}
                name={s.name}
                hint="Custom demo student"
                pending={pendingId === s.id}
                disabled={pendingId !== null}
                onClick={() => signIn(s.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => setCreating(true)}
              disabled={pendingId !== null}
              className="w-full text-left py-3.5 px-5 bg-surface border border-dashed border-border rounded-xl hover:border-accent text-foreground-muted hover:text-foreground transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="font-medium">+ Add new student</div>
              <div className="text-sm mt-0.5">
                Try the product as someone new
              </div>
            </button>
          </div>
        </Section>
      )}

      {clinicians.length > 0 && (
        <Section label="Or sign in as a clinician">
          <div className="grid gap-3">
            {clinicians.map((c) => (
              <AccountButton
                key={c.id}
                name={c.name}
                hint={CLINICIAN_HINTS[c.name] ?? "Clinician account"}
                pending={pendingId === c.id}
                disabled={pendingId !== null}
                onClick={() => signIn(c.id)}
              />
            ))}
          </div>
        </Section>
      )}

      {creating && <CreateStudentModal onClose={() => setCreating(false)} />}
    </div>
  );
}

function CreateStudentModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPending(true);
    setError(null);
    const res = await fetch("/api/demo-auth/create-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Could not create");
      setPending(false);
      return;
    }
    if (json.redirect) router.push(json.redirect);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-surface rounded-2xl shadow-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-foreground font-medium">Create a demo student</h3>
        <p className="text-foreground-muted text-sm mt-1">
          They&rsquo;ll appear on this login screen alongside the others.
        </p>
        <div className="mt-5">
          <label className="text-xs uppercase tracking-wide text-foreground-muted font-medium">
            Name
          </label>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            maxLength={40}
            placeholder="e.g. Alex"
            className="mt-2 w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground placeholder:text-foreground-muted/60 focus:border-accent focus:outline-none"
          />
        </div>
        {error && (
          <p className="text-sm text-foreground mt-3" role="alert">
            {error}
          </p>
        )}
        <p className="text-xs text-foreground-muted mt-5 leading-relaxed">
          This creates a fictional demo student in this shared demo. Please
          don&rsquo;t enter real clinical information.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending || !name.trim()}
            className="px-4 py-2 text-sm bg-accent text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? "Creating…" : "Create student"}
          </button>
        </div>
      </div>
    </div>
  );
}

const STUDENT_HINTS: Record<string, string> = {
  Maya: "DEARMAN reflected this week",
  Luke: "DEARMAN in progress",
  Sarah: "PLEASE check-ins only",
  Jordan: "No activity this week yet",
};

const CLINICIAN_HINTS: Record<string, string> = {
  "Dr. Park": "Reviews the week across students",
};

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-foreground-muted font-medium mb-3">
        {label}
      </div>
      {children}
    </div>
  );
}

function AccountButton({
  name,
  hint,
  pending,
  disabled,
  onClick,
}: {
  name: string;
  hint: string;
  pending: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left py-3.5 px-5 bg-surface border border-border rounded-xl hover:border-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <div className="font-medium text-foreground">{name}</div>
      <div className="text-sm text-foreground-muted mt-0.5">
        {pending ? "Signing in…" : hint}
      </div>
    </button>
  );
}
