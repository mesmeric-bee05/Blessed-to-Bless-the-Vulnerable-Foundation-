import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CampaignCard } from "@/components/cards/CampaignCard";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { getPublicCampaigns } from "@/lib/cms-content";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { formatKES, formatDate } from "@/lib/format";

export const metadata: Metadata = pageMetadata({
  title: "Campaigns",
  description:
    "BBVF's four active fundraising campaigns for amputee veterans, older persons, children and persons with disabilities — with published targets and dated received amounts.",
  path: "/campaigns",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Campaigns", path: "/campaigns" },
];

export const revalidate = 300;

export default async function CampaignsPage() {
  const campaigns = await getPublicCampaigns();
  const campaignTotals = {
    target: campaigns.reduce((sum, campaign) => sum + (campaign.target ?? 0), 0),
    received: campaigns.reduce((sum, campaign) => sum + (campaign.received ?? 0), 0),
    supporters: campaigns.reduce((sum, campaign) => sum + (campaign.supporters ?? 0), 0),
    reportedOn: campaigns
      .map((campaign) => campaign.reportedOn)
      .sort()
      .at(-1) ?? "2026-11-21",
  };

  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Active campaigns"
        title="A target is not an achievement. Here is what we can show."
        intro={
          <p>
            BBVF runs four active campaigns across its four programme areas. Each
            page states the target, the amount displayed as received, the date of
            that snapshot and what the money is intended to fund. Pending and
            disbursed balances are published only after reconciliation.
          </p>
        }
        meta={
          <>
            <span>{campaigns.length} active campaigns</span>
            <span>Snapshot {formatDate(campaignTotals.reportedOn)}</span>
            <span>Currency: KES</span>
          </>
        }
      >
        <dl className="grid gap-6 border-t border-ink/15 pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-ink/65">
              Combined target
            </dt>
            <dd className="mt-1.5 font-display text-2xl text-ink">
              {formatKES(campaignTotals.target)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-ink/65">
              Displayed as received
            </dt>
            <dd className="mt-1.5 font-display text-2xl text-ink">
              {formatKES(campaignTotals.received)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-ink/65">
              Supporters displayed
            </dt>
            <dd className="mt-1.5 font-display text-2xl text-ink">
              {campaignTotals.supporters}
            </dd>
          </div>
        </dl>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
            {campaigns.map((campaign, index) => (
              <Reveal key={campaign.slug} delay={index * 70}>
                <CampaignCard campaign={campaign} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <PendingNote title="Read the progress figures correctly">
                A low percentage is not hidden here. It is the truthful position of
                a young organisation with ambitious targets. Hiding it would make
                every other number on this site less believable.
              </PendingNote>
              <PendingNote title="Where the figures come from">
                Targets, received amounts and supporter counts are as displayed on
                BBVF&rsquo;s public Our Jamii profile on {formatDate(campaignTotals.reportedOn)}.
                They are not a live bank ledger, and BBVF has not yet published a
                reconciled disbursement figure.
              </PendingNote>
            </div>
          </Reveal>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
