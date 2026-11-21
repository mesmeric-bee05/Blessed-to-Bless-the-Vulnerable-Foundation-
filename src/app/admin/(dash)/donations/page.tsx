import { canSeeFinance, requireStaff } from "@/lib/auth";
import { dbSelect } from "@/lib/rest";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Donation = {
  reference: string;
  amount: string;
  currency: string;
  state: string;
  provider: string | null;
  created_at: string;
  donor_name: string | null;
  campaign_id: string | null;
};

export default async function DonationsPage() {
  const session = await requireStaff();
  if (!canSeeFinance(session.role)) {
    return (
      <div className="rounded-2xl border border-clay/30 bg-paper p-8">
        <h1 className="font-display text-2xl text-ink">Restricted</h1>
        <p className="mt-2 text-sm text-ink/70">
          Finance records are visible to finance managers, auditors and super
          administrators only.
        </p>
        <Link href="/admin" className="mt-4 inline-block text-xs font-semibold text-clay">
          Back to overview
        </Link>
      </div>
    );
  }

  const donations = await dbSelect<Donation>(
    "donations",
    "select=reference,amount,currency,state,provider,created_at,donor_name,campaign_id&order=created_at.desc&limit=100",
  );

  const totals = donations.reduce<Record<string, number>>((acc, donation) => {
    const amount = Number(donation.amount) || 0;
    acc[donation.state] = (acc[donation.state] ?? 0) + amount;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Donations</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
        Read-only. A gift becomes <strong>succeeded</strong> only when a verified
        provider event for that exact reference has been recorded. Nothing here
        can be changed by hand from this screen.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(totals).map(([state, amount]) => (
          <div key={state} className="rounded-xl border border-ink/10 bg-paper px-4 py-3">
            <p className="text-[0.6rem] font-semibold uppercase tracking-wide text-ink/60">
              {state.replace(/_/g, " ")}
            </p>
            <p className="mt-1 font-display text-lg text-ink">
              {amount.toLocaleString("en-KE", { maximumFractionDigits: 0 })}
            </p>
          </div>
        ))}
        {donations.length === 0 && (
          <p className="text-sm text-ink/65">No donations recorded yet.</p>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-paper">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="border-b border-ink/10 text-[0.6rem] uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">State</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.reference} className="border-b border-ink/10 last:border-b-0">
                <td className="px-4 py-3 font-mono text-[0.65rem] text-ink/80">
                  {donation.reference}
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {new Date(donation.created_at).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3 text-ink/70">{donation.provider ?? "—"}</td>
                <td className="px-4 py-3 text-right font-semibold text-ink">
                  {Number(donation.amount).toLocaleString("en-KE")} {donation.currency}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-bone px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-ink/70">
                    {donation.state.replace(/_/g, " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
