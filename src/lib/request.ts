import { headers } from "next/headers";
import { createHash } from "node:crypto";

/** Best-effort client address. Values are only ever used ephemeral / hashed. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return h.get("x-real-ip") ?? "unknown";
}

export function hashIp(ip: string): string {
  const pepper = process.env.FORM_HASH_PEPPER ?? "bbvf-form";
  return createHash("sha256").update(`${pepper}:${ip}`).digest("hex").slice(0, 32);
}

/**
 * Reject cross-site form posts. Browsers always send Origin on a cross-origin
 * POST; comparing it to Host is a cheap, effective CSRF signal for a
 * cookie-less public form. Requests with no Origin (some privacy browsers,
 * server-to-server) are allowed only when Sec-Fetch-Site says same-origin.
 */
export async function isSameOriginRequest(): Promise<boolean> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  const fetchSite = h.get("sec-fetch-site");

  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return false;
  }
  if (!origin) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
