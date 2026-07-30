"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { contactSchema } from "@/lib/contact/schema";

/**
 * NOTE: the source mockups have no contact form — they only list an email and
 * a Discord handle. This was added so the site has a genuine server-side
 * concern to justify a Node backend. Delete this component and its usage on
 * the contacts page if you'd rather match the design exactly.
 */

type FieldErrors = Partial<Record<"name" | "email" | "message", string[]>>;
type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; delivered: boolean }
  | { state: "error"; message: string };

const fieldClasses =
  "border-line/60 focus:border-accent bg-transparent w-full border px-4 py-2 text-base " +
  "text-heading placeholder:text-line/50 outline-none transition-colors";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));

    // Validate before hitting the network so obvious mistakes are instant.
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors as FieldErrors);
      setStatus({ state: "idle" });
      return;
    }

    setFieldErrors({});
    setStatus({ state: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFieldErrors((data.fieldErrors as FieldErrors) ?? {});
        setStatus({
          state: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      form.reset();
      setStatus({ state: "success", delivered: data.delivered !== false });
    } catch {
      setStatus({
        state: "error",
        message: "Couldn't reach the server. Please check your connection.",
      });
    }
  }

  const submitting = status.state === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-lg">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-base">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={fieldClasses}
          />
          {fieldErrors.name ? (
            <p id="name-error" className="text-accent mt-1 text-sm">
              {fieldErrors.name[0]}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-base">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={fieldClasses}
          />
          {fieldErrors.email ? (
            <p id="email-error" className="text-accent mt-1 text-sm">
              {fieldErrors.email[0]}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-base">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
            className={`${fieldClasses} resize-y`}
          />
          {fieldErrors.message ? (
            <p id="message-error" className="text-accent mt-1 text-sm">
              {fieldErrors.message[0]}
            </p>
          ) : null}
        </div>

        {/* Honeypot — hidden from users, catches naive bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Send message"}{" "}
          <span aria-hidden="true">-&gt;</span>
        </Button>

        <p role="status" aria-live="polite" className="text-sm">
          {status.state === "success" ? (
            <span className="text-accent">
              {status.delivered
                ? "Thanks — your message is on its way."
                : "Received. (Email isn't configured yet, so it was logged server-side.)"}
            </span>
          ) : null}
          {status.state === "error" ? (
            <span className="text-accent">{status.message}</span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
