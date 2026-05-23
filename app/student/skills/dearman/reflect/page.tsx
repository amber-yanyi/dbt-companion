import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getCurrentDearman } from "@/lib/dearman";
import { ReflectForm } from "@/components/dearman/reflect-form";

export default async function ReflectPage() {
  const me = await requireSession();
  if (me.role !== "student") return null;

  const entry = await getCurrentDearman(me.id);
  if (!entry || entry.status !== "planned") {
    redirect("/student/skills/dearman");
  }

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
        <h1 className="text-2xl font-medium text-foreground">
          How did it go?
        </h1>
        <p className="text-foreground-muted mt-2 leading-relaxed">
          A short reflection — there&rsquo;s no right answer. This stays with
          you and is shared with your clinician.
        </p>
      </header>

      <ReflectForm />
    </div>
  );
}
