import { Resend } from "resend";
import type { ContactInput } from "./schema";

/**
 * Framework-agnostic contact handling.
 *
 * Deliberately imports nothing from `next/*`: the whole point of keeping this
 * separate from the route handler is that if the site ever outgrows Route
 * Handlers, this file moves into an Express service untouched and only the
 * thin HTTP adapter gets rewritten.
 */

export type ContactResult =
  | { ok: true; delivered: boolean }
  | { ok: false; error: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends a contact message.
 *
 * When RESEND_API_KEY / CONTACT_TO_EMAIL are unset (local dev, or a fresh
 * clone), this logs the submission and reports `delivered: false` rather than
 * throwing — so the form is testable end-to-end before email is configured.
 */
export async function submitContactMessage(input: ContactInput): Promise<ContactResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  // Resend requires a verified sender; onboarding@resend.dev works for testing.
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.warn(
      "[contact] Email is not configured (RESEND_API_KEY / CONTACT_TO_EMAIL missing). " +
        "Submission received but not delivered:",
      { name: input.name, email: input.email },
    );
    return { ok: true, delivered: false };
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to,
      // Replying in the mail client goes straight back to the sender.
      replyTo: input.email,
      subject: `Portfolio contact from ${input.name}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;</p>
        <hr />
        <p style="white-space: pre-wrap">${escapeHtml(input.message)}</p>
      `,
    });

    if (error) {
      console.error("[contact] Resend rejected the message:", error);
      return { ok: false, error: "We couldn't send that message. Please try again." };
    }

    return { ok: true, delivered: true };
  } catch (cause) {
    console.error("[contact] Unexpected failure sending message:", cause);
    return { ok: false, error: "We couldn't send that message. Please try again." };
  }
}
