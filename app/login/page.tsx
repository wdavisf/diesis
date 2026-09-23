"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { login, type LoginState } from "./actions";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/app";
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: null });
  return (
    <form action={action} className="w-full max-w-sm space-y-6 rounded-2xl border border-line bg-surface p-8">
      <div className="space-y-3">
        <Logo />
        <h1 className="font-display text-3xl font-semibold tracking-tight">Access code</h1>
        <p className="text-sm text-dim">
          Diesis is in private preview. Enter the code you were given and the browser will remember it.
        </p>
      </div>
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input id="code" name="code" type="password" autoFocus autoComplete="off" required className="h-10 bg-stage" />
        {state.error ? <p className="text-sm text-wrong">{state.error}</p> : null}
      </div>
      <Button type="submit" className="h-10 w-full" disabled={pending}>
        {pending ? "Checking…" : "Open the app"}
      </Button>
      <p className="text-center text-sm text-dim">
        No code yet?{" "}
        <a href="mailto:hello@diesis.app" className="underline underline-offset-4">
          Ask for one
        </a>
        {" · "}
        <Link href="/" className="underline underline-offset-4">
          Back to diesis.app
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
