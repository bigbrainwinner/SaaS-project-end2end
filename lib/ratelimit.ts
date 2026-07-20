/**
 * Edge-compatible rate limiting backed by Upstash Redis.
 *
 * If `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set,
 * we build a real `@upstash/ratelimit` instance. If either is missing
 * we return `null` and callers treat every request as allowed (with a
 * single boot-time warning in production so the missing config is
 * visible in logs).
 *
 * Two limiters are exposed:
 *   - `authLimiter`   — strict, meant for /auth/* endpoints
 *                       (5 requests / 60s / IP)
 *   - `writeLimiter`  — looser, meant for authenticated mutating
 *                       server actions (30 requests / 60s / user or IP)
 *
 * Both operate on a caller-supplied identifier (IP address for
 * unauthenticated requests, user id for authenticated ones).
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let warned = false;
function warnOnce() {
  if (warned) return;
  warned = true;
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[ratelimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — rate limiting is DISABLED.',
    );
  }
}

function buildLimiter(
  requests: number,
  windowSeconds: number,
  prefix: string,
): Ratelimit | null {
  if (!REDIS_URL || !REDIS_TOKEN) {
    warnOnce();
    return null;
  }
  const redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    analytics: false,
    prefix,
  });
}

export const authLimiter = buildLimiter(5, 60, 'rl:auth');
export const writeLimiter = buildLimiter(30, 60, 'rl:write');

export type LimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export async function checkLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<LimitResult> {
  if (!limiter) return { ok: true };
  const { success, reset } = await limiter.limit(identifier);
  if (success) return { ok: true };
  const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return { ok: false, retryAfterSeconds };
}

/**
 * Extract a stable client identifier from request headers.
 * Prefers Netlify's `x-nf-client-connection-ip`, falls back to the
 * first entry of `x-forwarded-for`, then `x-real-ip`.
 */
export function clientIdFromHeaders(headers: Headers): string {
  const nf = headers.get('x-nf-client-connection-ip');
  if (nf) return nf;
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}
