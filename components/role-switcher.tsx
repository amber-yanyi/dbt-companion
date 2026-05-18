"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RoleSwitcher({ currentRole }: { currentRole: "student" | "clinician" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const other = currentRole === "student" ? "clinician" : "student";

  async function flip() {
    setPending(true);
    const res = await fetch("/api/demo-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: other, action: "switch" }),
    });
    const json = await res.json();
    if (json.redirect) {
      router.push(json.redirect);
      router.refresh();
    }
  }

  async function signOut() {
    await fetch("/api/demo-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signout" }),
    });
    router.push("/");
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="px-2 py-0.5 rounded-full bg-accent-soft text-accent font-medium">
        Demo
      </span>
      <button
        onClick={flip}
        disabled={pending}
        className="text-foreground-muted hover:text-foreground transition-colors disabled:opacity-50"
      >
        View as {other}
      </button>
      <span className="text-border">·</span>
      <button
        onClick={signOut}
        className="text-foreground-muted hover:text-foreground transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
