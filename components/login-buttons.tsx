"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DemoAccount } from "@/lib/auth";

export function LoginButtons({
  students,
  clinicians,
}: {
  students: DemoAccount[];
  clinicians: DemoAccount[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

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
      {students.length > 0 && (
        <Section label="Sign in as a student">
          <div className="grid sm:grid-cols-2 gap-3">
            {students.map((s) => (
              <AccountButton
                key={s.id}
                name={s.name}
                hint={STUDENT_HINTS[s.name] ?? "Student account"}
                pending={pendingId === s.id}
                disabled={pendingId !== null}
                onClick={() => signIn(s.id)}
              />
            ))}
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
