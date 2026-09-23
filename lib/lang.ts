import { cookies } from "next/headers";
import { isLang, LANG_COOKIE, strings, type Lang, type Strings } from "@/lib/i18n";

/** Language for pages without a `/es` route: the cookie the switcher sets, else English. */
export async function currentLang(): Promise<Lang> {
  const store = await cookies();
  const v = store.get(LANG_COOKIE)?.value;
  return isLang(v) ? v : "en";
}

export async function currentStrings(): Promise<Strings> {
  return strings[await currentLang()];
}
