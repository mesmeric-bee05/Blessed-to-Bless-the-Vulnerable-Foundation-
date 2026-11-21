import type { Metadata } from "next";
import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { signOutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/donations", label: "Donations" },
  { href: "/admin/audit", label: "Audit log" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireStaff();

  return (
    <div className="min-h-screen bg-bone">
      <div className="border-b border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-display text-lg text-ink">
              BBVF admin
            </Link>
            <span className="hidden text-[0.65rem] uppercase tracking-[0.14em] text-ink/60 sm:inline">
              {session.role.replace(/_/g, " ")}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-ink/65">{session.email}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-ink/15 px-4 py-2 font-semibold text-ink hover:border-clay hover:text-clay"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-bone hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
