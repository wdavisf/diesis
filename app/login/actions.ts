"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = { error: string | null };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const expected = process.env.DIESIS_ACCESS_CODE;
  const given = String(formData.get("code") ?? "").trim();
  const next = String(formData.get("next") ?? "/app");
  if (expected && given.toUpperCase() !== expected.toUpperCase()) {
    return { error: "wrong" };
  }
  if (expected) {
    const store = await cookies();
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
