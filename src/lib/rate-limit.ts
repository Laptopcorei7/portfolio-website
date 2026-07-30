/**
 * Minimal fixed-window rate limiter, held in process memory.
 *
 * Caveat worth knowing: this is per-instance and resets on cold start, so on a
 * serverless deploy it throttles casual abuse but is not a hard guarantee. For
 * a portfolio contact form that is the right trade-off — it costs nothing and
 * needs no external service. If this ever needs to be authoritative, swap the
 * Map for Upstash Redis; the call site does not change.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the current window resets. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || now > existing.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return { allowed: true, retryAfter: 0 };
}

/**
 * Drops expired windows. Called opportunistically from the route so the Map
 * cannot grow without bound on a long-lived server.
 */
export function pruneRateLimits() {
  const now = Date.now();
  for (const [key, window] of windows) {
    if (now > window.resetAt) windows.delete(key);
  }
}
