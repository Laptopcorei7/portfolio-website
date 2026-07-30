import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact/schema";
import { submitContactMessage } from "@/lib/contact/service";
import { pruneRateLimits, rateLimit } from "@/lib/rate-limit";

/**
 * Thin HTTP adapter over `submitContactMessage`. Everything here is
 * request/response plumbing; the actual work lives in the service so it stays
 * portable.
 */

export const runtime = "nodejs";

function clientKey(request: Request): string {
  // Vercel and most proxies set x-forwarded-for; first entry is the client.
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  pruneRateLimits();

  const limit = await rateLimit(`contact:${clientKey(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Honeypot tripped: accept silently so bots get no signal to adapt to.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const result = await submitContactMessage(parsed.data);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: result.delivered }, { status: 200 });
}
