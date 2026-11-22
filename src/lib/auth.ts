/**
 * Staff authentication for the admin CMS.
 *
 * Supabase Auth issues the access token; the token lives in an httpOnly,
 * SameSite=Lax cookie and is verified against /auth/v1/user on every request.
 * Authorisation is a separate step: the user must have an active row in
 * `profiles`, and each action names the roles allowed to perform it.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbSelect, eq } from "@/lib/rest";

export const ACCESS_COOKIE = "bbvf_admin_access";
export const REFRESH_COOKIE = "bbvf_admin_refresh";

export type StaffRole =
  | "super_admin"
  | "content_editor"
  | "campaign_manager"
  | "finance_manager"
  | "safeguarding_reviewer"
  | "communications_editor"
  | "support_agent"
  | "read_only_auditor";

export type StaffSession = {
  userId: string;
  email: string;
  role: StaffRole;
  fullName: string;
};

function authBase(): string | null {
  const url = process.env.SUPABASE_URL;
  return url ? `${url.replace(/\/+$/, "")}/auth/v1` : null;
}

function publicKey(): string | null {
  return (
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    null
  );
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function staffAuthConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && publicKey());
}

export async function signInStaff(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const base = authBase();
  const key = publicKey();
  if (!base || !key) {
    return {
      ok: false,
      error: "Admin authentication is not configured in this environment.",
    };
  }

  let response: Response;
  try {
    response = await fetch(`${base}/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return { ok: false, error: "The authentication service is unreachable." };
  }

  if (!response.ok) {
    return { ok: false, error: "Email or password is incorrect." };
  }

  const data = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    user?: { id?: string; email?: string };
  };
  if (!data.access_token || !data.user?.id) {
    return { ok: false, error: "The authentication service returned no session." };
  }

  const profiles = await dbSelect<{ role: StaffRole; is_active: boolean; full_name: string }>(
    "profiles",
    `select=role,is_active,full_name&id=${eq(data.user.id)}`,
  );
  const profile = profiles[0];
  if (!profile || !profile.is_active) {
    return {
      ok: false,
      error:
        "This account has no active staff profile. Ask a super administrator to invite you.",
    };
  }

  const store = await cookies();
  const maxAge = Math.max(60, Math.min(data.expires_in ?? 3600, 3600));
  store.set(ACCESS_COOKIE, data.access_token, { ...cookieOptions, maxAge });
  if (data.refresh_token) {
    store.set(REFRESH_COOKIE, data.refresh_token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return { ok: true };
}

export async function signOutStaff(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const base = authBase();
  const key = publicKey();
  if (!base || !key) return null;

  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  try {
    const response = await fetch(`${base}/user`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;
    const user = (await response.json()) as { id?: string; email?: string };
    if (!user.id) return null;

    const profiles = await dbSelect<{
      role: StaffRole;
      is_active: boolean;
      full_name: string;
      mfa_enrolled: boolean;
    }>(
      "profiles",
      `select=role,is_active,full_name,mfa_enrolled&id=${eq(user.id)}`,
    );
    const profile = profiles[0];
    if (!profile || !profile.is_active) return null;

    return {
      userId: user.id,
      email: user.email ?? "",
      role: profile.role,
      fullName: profile.full_name,
    };
  } catch {
    return null;
  }
}

export async function requireStaff(
  allowed?: StaffRole[],
): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  if (allowed && !allowed.includes(session.role)) {
    redirect("/admin?denied=1");
  }
  return session;
}

export function canEditContent(role: StaffRole): boolean {
  return ["super_admin", "content_editor", "campaign_manager", "communications_editor"].includes(
    role,
  );
}

export function canPublish(role: StaffRole): boolean {
  return role === "super_admin" || role === "content_editor";
}

export function canTriage(role: StaffRole): boolean {
  return ["super_admin", "support_agent"].includes(role);
}

export function canSeeFinance(role: StaffRole): boolean {
  return ["super_admin", "finance_manager", "read_only_auditor"].includes(role);
}
