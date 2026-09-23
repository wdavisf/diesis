"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isLang, LANG_COOKIE } from "@/lib/i18n";

export type LoginState = { error: string | null };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const expected = process.env.DIESIS_ACCESS_CODE;
  const given = String(formData.get("code") ?? "").trim();
  const next = String(formData.get("next") ?? "/app");
  if (expected && given.toUpperCase() !== expected.toUpperCase()) {
    return { error: "wrong" };
  }
  const store = await cookies();
  const lang = formData.get("lang");
  if (isLang(lang)) {
    store.set({ name: LANG_COOKIE, value: lang, path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  }
  if (expected) {
    store.set({
      name: "diesis_access",
      value: expected,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    });
  }
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/app");
}
