import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting with a shared Redis counter, falling back to process memory.
 *
 * Why the fallback exists: the in-memory limiter alone is per-instance and
 * resets on cold start. On a serverless deploy that means the real ceiling is
 * `limit × number of live instances`, which is not a ceiling at all — enough of
 * a flood could burn the monthly email quota and stop genuine messages getting
 * through. Redis gives one counter that every instance shares.
 *
 * But a fresh clone, local dev and CI have no Redis, and the contact form must
 * still work there. So Redis is used when configured and the Map is used when
 * it is not — same behaviour either way, different guarantees.
 *
 * Note the env var names: the Vercel Upstash integration injects
 * `KV_REST_API_URL` / `KV_REST_API_TOKEN`, NOT the `UPSTASH_REDIS_REST_*` names
 * that `Redis.fromEnv()` expects. Constructing the client explicitly avoids a
 * silent misconfiguration where the limiter looks fine but never reaches Redis.
 */

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the caller may retry. */
  retryAfter: number;
  /** Which backend answered — surfaced so tests can assert Redis is really in use. */
  backend: "redis" | "memory";
};

type Options = { limit?: number; windowMs?: number };

/* ---------------------------------------------------------------- Redis --- */

const redisUrl = process.env.KV_REST_API_URL;
const redisToken = process.env.KV_REST_API_TOKEN;

const redis =
  redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

/**
 * One Ratelimit instance per limit/window pair. Building it per request would
 * be wasteful, and the sliding-window algorithm keeps its own state in Redis
 * rather than in the instance, so sharing is safe.
 */
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit | null {
  if (!redis) return null;

  const cacheKey = `${limit}:${windowMs}`;
  const existing = limiters.get(cacheKey);
  if (existing) return existing;

  const created = new Ratelimit({
    redis,
    // Sliding window rather than fixed: a fixed window lets a caller send
    // `limit` at the very end of one window and `limit` again immediately
    // after it rolls, i.e. double the intended rate across the boundary.
    limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
    // Off deliberately: analytics costs extra Redis commands per request and
    // buys nothing here.
    analytics: false,
    prefix: "rl",
  });

  limiters.set(cacheKey, created);
  return created;
}

/* --------------------------------------------------------------- Memory --- */

type Window = { count: number; resetAt: number };
const windows = new Map<string, Window>();

function memoryLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || now > existing.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0, backend: "memory" };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
      backend: "memory",
    };
  }

  return { allowed: true, retryAfter: 0, backend: "memory" };
}

/* ---------------------------------------------------------------- Public -- */

export async function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: Options = {},
): Promise<RateLimitResult> {
  const limiter = getLimiter(limit, windowMs);

  if (limiter) {
    try {
      const { success, reset } = await limiter.limit(key);
      return {
        allowed: success,
        retryAfter: success ? 0 : Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
        backend: "redis",
      };
    } catch (cause) {
      // Redis unreachable. Degrade to the in-memory limiter rather than either
      // blocking every genuine visitor or waving everything through — partial
      // protection beats none while the outage lasts.
      console.error("[rate-limit] Redis unavailable, falling back to memory:", cause);
    }
  }

  return memoryLimit(key, limit, windowMs);
}

/**
 * Drops expired in-memory windows so the Map cannot grow without bound. A no-op
 * in practice when Redis is handling the limiting; Redis expires its own keys.
 */
export function pruneRateLimits() {
  const now = Date.now();
  for (const [key, window] of windows) {
    if (now > window.resetAt) windows.delete(key);
  }
}
