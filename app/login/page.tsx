import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { currentStrings } from "@/lib/lang";

export default async function LoginPage() {
  const t = await currentStrings();
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Suspense>
        <LoginForm t={t.login} lang={t.code} otherLang={t.otherLang} otherLabel={t.otherLabel} otherName={t.otherName} />
      </Suspense>
    </main>
  );
}
