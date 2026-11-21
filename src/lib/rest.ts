/**
 * Server-only PostgREST helpers.
 *
 * Used by payment webhooks and the admin CMS, both of which run on the server
 * with the service-role key. The key is never imported into client code: every
 * caller of this module is a route handler or a server component/action.
 *
 * All values are passed through PostgREST's filter syntax and encoded; no SQL
 * string is ever assembled from user input.
 */

const TIMEOUT_MS = 8_000;

export function isDbConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function baseUrl(): string | null {
  const url = process.env.SUPABASE_URL;
  return url ? url.replace(/\/+$/, "") : null;
}

function serviceKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

/** Table names are internal constants; reject anything else defensively. */
function tableIsValid(table: string): boolean {
  return /^[a-z_]{3,64}$/.test(table);
}

type RequestOptions = {
  method: "GET" | "POST" | "PATCH";
  table: string;
  query?: string;
  body?: unknown;
  prefer?: string;
};

async function request({
  method,
  table,
  query,
  body,
  prefer,
}: RequestOptions): Promise<Response | null> {
  const url = baseUrl();
  const key = serviceKey();
  if (!url || !key || !tableIsValid(table)) return null;

  const qs = query ? `?${query}` : "";
  try {
    return await fetch(`${url}/rest/v1/${table}${qs}`, {
      method,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(prefer ? { Prefer: prefer } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return null;
  }
}

/**
 * Read published rows with the publishable/anon key. RLS still applies, so this
 * can only ever see what an anonymous visitor may see. Used for public content,
 * which keeps the service-role key out of the rendering path entirely.
 */
export async function publicSelect<T>(
  table: string,
  query: string,
): Promise<T[]> {
  const url = baseUrl();
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !tableIsValid(table)) return [];

  try {
    const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

export async function dbSelect<T>(
  table: string,
  query: string,
): Promise<T[]> {
  const response = await request({ method: "GET", table, query });
  if (!response || !response.ok) return [];
  try {
    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

export async function dbInsert<T>(
  table: string,
  row: Record<string, unknown>,
  options: { ignoreDuplicates?: boolean } = {},
): Promise<T | null> {
  const prefer = options.ignoreDuplicates
    ? "resolution=ignore-duplicates,return=representation"
    : "return=representation";
  const response = await request({ method: "POST", table, body: row, prefer });
  if (!response || !response.ok) return null;
  try {
    const data: unknown = await response.json();
    if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
      return data[0] as T;
    }
    return null;
  } catch {
    return null;
  }
}

/** Filter values must already use PostgREST operators, e.g. `reference=eq.X`. */
export async function dbUpdate(
  table: string,
  filters: string,
  patch: Record<string, unknown>,
): Promise<boolean> {
  const response = await request({
    method: "PATCH",
    table,
    query: filters,
    body: patch,
    prefer: "return=minimal",
  });
  return Boolean(response && response.ok);
}

export async function dbCount(table: string, filters: string): Promise<number> {
  const response = await request({
    method: "GET",
    table,
    query: `select=id&${filters}`,
    prefer: "count=exact",
  });
  if (!response || !response.ok) return 0;
  const range = response.headers.get("content-range");
  if (range) {
    const total = Number(range.split("/")[1]);
    if (Number.isFinite(total)) return total;
  }
  try {
    const data: unknown = await response.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

export function eq(value: string): string {
  return `eq.${encodeURIComponent(value)}`;
}
