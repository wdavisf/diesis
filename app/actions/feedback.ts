"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

/**
 * The feedback form (components/feedback.tsx) sends here; the message goes to Will by email
 * through Resend and is stored nowhere else. Same pattern as jeremy.es's enrolment form:
 * a honeypot field for bots and a best-effort per-instance rate limit.
 *
 * Env: RESEND_API_KEY, FEEDBACK_FROM_EMAIL (on a domain verified in Resend, e.g.
 * "Diesis <feedback@diesis.app>"), FEEDBACK_TO_EMAIL (where it lands). None of them is in the
 * repo, which is public.
 */

export type FeedbackState = {
  status: "idle" | "sent" | "error" | "empty";
  /** What was typed, sent back on a failure: React empties a form once its action resolves. */
  values?: { name: string; message: string; contact: string };
  attempt?: number;
};

const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 5 };
const submissions = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (submissions.get(key) ?? []).filter((ts) => now - ts < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    submissions.set(key, recent);
    return true;
  }
  recent.push(now);
  submissions.set(key, recent);
  return false;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const field = (formData: FormData, name: string, max: number) => String(formData.get(name) ?? "").trim().slice(0, max);

export async function sendFeedback(prev: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const name = field(formData, "name", 100);
  const message = field(formData, "message", 4000);
  const contact = field(formData, "contact", 200);
  const page = field(formData, "page", 200);
  const lang = field(formData, "lang", 5);
  const guitar = field(formData, "guitar", 40);

  const failed = (status: "error" | "empty"): FeedbackState => ({ status, values: { name, message, contact }, attempt: (prev.attempt ?? 0) + 1 });

  // Honeypot tripped: pretend it worked so the bot does not retry.
  if (field(formData, "website", 200)) return { status: "sent" };
  if (!message) return failed("empty");

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) return failed("error");

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.FEEDBACK_FROM_EMAIL?.trim();
  const to = process.env.FEEDBACK_TO_EMAIL?.trim();
  if (!apiKey || !from || !to) {
    console.error("[feedback] RESEND_API_KEY, FEEDBACK_FROM_EMAIL or FEEDBACK_TO_EMAIL is not configured.");
    return failed("error");
  }

  const rows: [string, string][] = [
    ["Nombre", name || "—"],
    ["Qué necesita", message],
    ["Email", contact || "—"],
    ["Página", page || "—"],
    ["Idioma", lang || "—"],
    ["Guitarra", guitar || "—"],
    ["Navegador", (h.get("user-agent") ?? "—").slice(0, 200)],
  ];
  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px">
      <h2 style="margin-bottom:4px">Feedback de Diesis</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#777;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>`;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ? contact : undefined;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: [to],
      replyTo,
      subject: `Feedback de Diesis${name ? ` · ${name}` : ""} · ${message.replace(/\s+/g, " ").slice(0, 50)}`,
      html,
      text,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[feedback] Failed to send:", error);
    return failed("error");
  }
  return { status: "sent" };
}
