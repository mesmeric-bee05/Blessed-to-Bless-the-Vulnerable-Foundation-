/**
 * Small fixed-window limiter for public form endpoints.
 *
 * LIMITATION: state is per server instance and resets on deploy. That is
 * adequate as a first line of defence for a low-traffic nonprofit site, but a
 * production deployment behind multiple instances should replace this with a
 * shared store (Upstash Redis or Supabase row-level counters). Documented in
 * docs/SECURITY.md.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size > MAX_KEYS) buckets.clear();
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}
