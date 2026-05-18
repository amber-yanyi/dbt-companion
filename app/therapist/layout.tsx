import Link from "next/link";
import { RoleSwitcher } from "@/components/role-switcher";

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/therapist/dashboard" className="text-foreground font-medium">
            DBT Companion
          </Link>
          <RoleSwitcher currentRole="clinician" />
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
