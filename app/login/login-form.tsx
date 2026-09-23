"use client";

import { useActionState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import type { Lang, Strings } from "@/lib/i18n";
import { login, type LoginState } from "./actions";

export function LoginForm({
  t,
  lang,
  otherLang,
  otherLabel,
  otherName,
}: {
  t: Strings["login"];
  lang: Lang;
  otherLang: Lang;
  otherLabel: string;
  otherName: string;
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const next = params.get("next") ?? "/app";
  const here = `${pathname}?${params.toString()}`;
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: null });
  return (
    <form action={action} className="w-full max-w-sm space-y-6 rounded-2xl border border-line bg-surface p-8">
      <div className="flex items-start justify-between">
        <Logo />
        <a
          href={`/lang/${otherLang}?next=${encodeURIComponent(here)}`}
          hrefLang={otherLang}
          lang={otherLang}
          aria-label={otherName}
          className="inline-flex h-8 items-center rounded-lg border border-line bg-stage px-2.5 text-xs font-bold tracking-wider text-ink hover:bg-surface-raised"
        >
          {otherLabel}
        </a>
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{t.h1}</h1>
        <p className="text-sm text-dim">{t.lede}</p>
      </div>
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="lang" value={lang} />
      <div className="space-y-2">
        <Label htmlFor="code">{t.label}</Label>
        <Input id="code" name="code" type="password" autoFocus autoComplete="off" required className="h-10 bg-stage" />
        {state.error ? <p className="text-sm text-wrong">{t.wrong}</p> : null}
      </div>
      <Button type="submit" className="h-10 w-full" disabled={pending}>
        {pending ? t.checking : t.button}
      </Button>
      <p className="text-center text-sm text-dim">
        {t.noCode}{" "}
        <a href="mailto:hello@diesis.app" className="underline underline-offset-4">
          {t.ask}
        </a>
        {" · "}
        <Link href={lang === "es" ? "/es" : "/"} className="underline underline-offset-4">
          {t.back}
        </Link>
      </p>
    </form>
  );
}
