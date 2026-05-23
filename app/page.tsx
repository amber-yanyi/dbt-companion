import { redirect } from "next/navigation";
import { getSession, listDemoAccounts } from "@/lib/auth";
import { LoginButtons } from "@/components/login-buttons";

export default async function LoginPage() {
  const me = await getSession();
  if (me) {
    redirect(me.role === "student" ? "/student/home" : "/therapist/dashboard");
  }

  const { seededStudents, customStudents, clinicians } =
    await listDemoAccounts();

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-medium tracking-tight text-foreground mb-3">
            DBT Companion
          </h1>
          <p className="text-foreground-muted">
            A practice tool used between sessions.
          </p>
        </div>

        <LoginButtons
          seededStudents={seededStudents}
          customStudents={customStudents}
          clinicians={clinicians}
        />

        <p className="mt-10 text-xs text-foreground-muted text-center leading-relaxed">
          Demo mode — this uses fictional shared data. Anything entered here
          may be visible to others with the demo link.
        </p>
      </div>
    </main>
  );
}
