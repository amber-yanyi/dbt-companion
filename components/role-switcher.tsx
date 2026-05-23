"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RoleSwitcher({
  name,
}: {
  name: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function switchAccount() {
    setPending(true);
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
      <span className="text-foreground-muted">Signed in as {name}</span>
      <span className="text-border">·</span>
      <button
        onClick={switchAccount}
        disabled={pending}
        className="text-foreground-muted hover:text-foreground transition-colors disabled:opacity-50"
      >
        Switch account
      </button>
    </div>
  );
}
