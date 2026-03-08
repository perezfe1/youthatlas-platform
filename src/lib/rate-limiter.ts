/**
 * Generic in-memory rate limiter.
 *
 * Uses a sliding-window algorithm backed by an in-memory Map.
 * State resets on each deployment — acceptable for the current scale.
 */

export interface RateLimitResult {
  /** Whether this request is allowed through. */
  allowed: boolean;
  /** How many requests remain in the current window (0 when blocked). */
  remaining: number;
  /** When the oldest request in the window expires and slots free up. */
  resetAt: Date;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
}

export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
}): RateLimiter {
  const { windowMs, maxRequests } = options;
  const store = new Map<string, number[]>();

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();

      // Prune expired timestamps
      const existing = store.get(key) ?? [];
      const valid = existing.filter((t) => now - t < windowMs);

      const allowed = valid.length < maxRequests;

      if (allowed) {
        valid.push(now);
      }

      if (valid.length > 0) {
        store.set(key, valid);
      } else {
        store.delete(key);
      }

      const remaining = allowed ? Math.max(0, maxRequests - valid.length) : 0;

      // Reset time = when the oldest request in the window falls off
      const oldestTs = valid[0] ?? now;
      const resetAt = new Date(oldestTs + windowMs);

      return { allowed, remaining, resetAt };
    },
  };
}

/**
 * Returns headers to attach to every rate-limited response so clients know
 * their current quota (whether the request was allowed or blocked).
 */
export function rateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.floor(result.resetAt.getTime() / 1000)),
  };
}

// ── Pre-configured limiters ───────────────────────────────────────────────────

/** Newsletter subscribe — 5 requests per IP per hour */
export const subscribeLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
});

/** Auth profile upsert — 10 requests per IP per hour */
export const authLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10,
});

/** Profile update — 20 requests per IP per hour */
export const profileLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 20,
});

/** Featured listing submission — 3 requests per IP per hour */
export const advertiseLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
});
