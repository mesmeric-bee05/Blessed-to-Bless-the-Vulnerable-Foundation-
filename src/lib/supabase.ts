/**
 * Minimal server-side Supabase REST client.
 *
 * Deliberately dependency-free: no Supabase SDK reaches the browser, and the
 * service-role key cannot be bundled into client code because this module is
 * only imported from route handlers. Every query uses PostgREST's parameter
 * encoding — no SQL string interpolation anywhere.
 */

type InsertResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: "not_configured" | "request_failed"; status?: number };

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function insertRow(
  table: string,
  row: Record<string, unknown>,
): Promise<InsertResult> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, reason: "not_configured" };

  // Table names are internal constants, never user input.
  if (!/^[a-z_]{3,64}$/.test(table)) return { ok: false, reason: "request_failed" };

  try {
    const response = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      // Never log the response body: it can echo submitted personal data.
      return { ok: false, reason: "request_failed", status: response.status };
    }

    const data: unknown = await response.json();
    const id =
      Array.isArray(data) && data[0] && typeof data[0] === "object"
        ? String((data[0] as Record<string, unknown>).id ?? "")
        : "";
    return { ok: true, id: id || null };
  } catch {
    return { ok: false, reason: "request_failed" };
  }
}
