import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { dbCount, dbSelect, isDbConfigured } from "@/lib/rest";

export const dynamic = "force-dynamic";

type Submission = {
  reference: string;
  full_name: string | null;
  message: string;
  created_at: string;
  state: string;
};

export default async function AdminOverview({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const session = await requireStaff();
  const { denied } = await searchParams;

  if (!isDbConfigured()) {
    return (
      <div className="rounded-2xl border border-clay/30 bg-paper p-8">
        <h1 className="font-display text-2xl text-ink">Database not connected</h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink/70">
          Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SUPABASE_ANON_KEY in the
          hosting environment, then redeploy. The admin area will not fake data
          while the store is missing.
        </p>
      </div>
    );
  }

  const [newSubmissions, publishedPrograms, publishedCampaigns, donations] =
    await Promise.all([
      dbCount("contact_submissions", "state=eq.new"),
      dbCount("programs", "status=eq.published"),
      dbCount("campaigns", "status=eq.published"),
      dbCount("donations", "state=eq.succeeded"),
    ]);

  const recent = await dbSelect<Submission>(
    "contact_submissions",
    "select=reference,full_name,message,created_at,state&order=created_at.desc&limit=5",
  );

  return (
    <div>
      {denied && (
        <p
          role="alert"
          className="mb-6 rounded-xl border border-clay/30 bg-clay/[0.06] p-4 text-xs text-clay-dark"
        >
          Your role ({session.role.replace(/_/g, " ")}) does not include that
          action.
        </p>
      )}

      <h1 className="font-display text-3xl text-ink">
        Welcome, {session.fullName.split(" ")[0] || "colleague"}
      </h1>
      <p className="mt-2 text-sm text-ink/70">
        Nothing on the public site changes without a recorded approval.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "New messages", value: newSubmissions, href: "/admin/submissions" },
          { label: "Published programmes", value: publishedPrograms, href: "/admin/content" },
          { label: "Published campaigns", value: publishedCampaigns, href: "/admin/content" },
          { label: "Successful donations", value: donations, href: "/admin/donations" },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-ink/10 bg-paper p-6 hover:border-clay/40"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink/60">
              {card.label}
            </p>
            <p className="mt-3 font-display text-3xl text-ink">{card.value}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Latest messages</h2>
          <Link href="/admin/submissions" className="text-xs font-semibold text-clay">
            Open triage
          </Link>
        </div>
        <div className="mt-4 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-paper">
          {recent.length === 0 && (
            <p className="p-6 text-sm text-ink/65">No messages yet.</p>
          )}
          {recent.map((item) => (
            <div key={item.reference} className="flex flex-wrap gap-2 p-5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">
                  {item.full_name ?? "Unnamed sender"}
                  <span className="ml-2 font-mono text-[0.65rem] font-normal text-ink/55">
                    {item.reference}
                  </span>
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/65">
                  {item.message}
                </p>
              </div>
              <span className="self-start rounded-full bg-bone px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-ink/70">
                {item.state.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
