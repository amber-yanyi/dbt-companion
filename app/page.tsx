"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState<"student" | "clinician" | null>(null);

  async function signIn(role: "student" | "clinician") {
    setPending(role);
    const res = await fetch("/api/demo-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, action: "signin" }),
    });
    const json = await res.json();
    if (json.redirect) router.push(json.redirect);
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-medium tracking-tight text-foreground mb-3">
            DBT Companion
          </h1>
          <p className="text-foreground-muted">
            A practice tool used between sessions.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn("student")}
            disabled={pending !== null}
            className="w-full py-4 px-6 bg-surface border border-border rounded-xl text-foreground hover:border-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-left"
          >
            <div className="font-medium">Sign in as student</div>
            <div className="text-sm text-foreground-muted mt-0.5">
              {pending === "student" ? "Signing in…" : "Practice skills between sessions"}
            </div>
          </button>

          <button
            onClick={() => signIn("clinician")}
            disabled={pending !== null}
            className="w-full py-4 px-6 bg-surface border border-border rounded-xl text-foreground hover:border-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-left"
          >
            <div className="font-medium">Sign in as clinician</div>
            <div className="text-sm text-foreground-muted mt-0.5">
              {pending === "clinician" ? "Signing in…" : "See how your students are practicing"}
            </div>
          </button>
        </div>

        <p className="mt-10 text-xs text-foreground-muted text-center">
          Demo mode — no real account data is stored.
        </p>
      </div>
    </main>
  );
}
