import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signInAction } from "@/app/admin/actions";
import { getStaffSession, staffAuthConfigured } from "@/lib/auth";
import { Lock } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const session = await getStaffSession();
  if (session) redirect("/admin");
  const configured = staffAuthConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-bone px-5 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-8 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-clay">
            <Lock className="h-5 w-5" />
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
              BBVF staff
            </p>
          </div>
          <h1 className="mt-4 font-display text-3xl text-ink">Sign in</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            This area is for authorised BBVF staff. Every sign-in and content
            change is written to the audit log.
          </p>

          {!configured && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-clay/30 bg-clay/[0.06] p-4 text-xs leading-relaxed text-clay-dark"
            >
              Admin authentication is not connected in this environment. Set
              SUPABASE_URL and SUPABASE_ANON_KEY, then create a staff user and a
              profile row before signing in.
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-clay/30 bg-clay/[0.06] p-4 text-xs leading-relaxed text-clay-dark"
            >
              {error}
            </p>
          )}

          <form action={signInAction} className="mt-6 space-y-4">
            <input type="hidden" name="next" value={next ?? "/admin"} />
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink/70"
              >
                Staff email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink/70"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={8}
                required
                className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink focus:border-clay focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-bone hover:bg-ink-3"
            >
              Sign in
            </button>
          </form>

          <p className="mt-5 text-[0.68rem] leading-relaxed text-ink/65">
            Multi-factor authentication is enforced by Supabase Auth policy, not
            by this page. Ask a super administrator to enrol your second factor
            before you are given a publishing role.
          </p>
        </div>
      </div>
    </main>
  );
}
