import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressLedger } from "@/components/ui/ProgressLedger";
import { PendingNote } from "@/components/ui/PendingNote";
import { ProgramGlyph } from "@/components/brand/ProgramGlyph";
import { Reveal } from "@/components/motion/Reveal";
import { campaigns as staticCampaigns } from "@/content/campaigns";
import { getPublicCampaign, getPublicProgram } from "@/lib/cms-content";
import { pageMetadata, breadcrumbSchema, donateActionSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";
import { ArrowUpRight, ExternalLink, Lock, Shield } from "@/components/ui/icons";

export const dynamicParams = true;
export const revalidate = 300;

/** Pre-render the reviewed campaigns; new CMS slugs render on demand. */
export function generateStaticParams() {
  return staticCampaigns.map((campaign) => ({ slug: campaign.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getPublicCampaign(slug);
  if (!campaign) return { title: "Campaign not found" };
  return pageMetadata({
    title: campaign.shortTitle,
    description: campaign.summary,
    path: `/campaigns/${campaign.slug}`,
  });
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getPublicCampaign(slug);
  if (!campaign) notFound();

  const program = campaign.programSlug
    ? await getPublicProgram(campaign.programSlug)
    : undefined;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Campaigns", path: "/campaigns" },
    { name: campaign.shortTitle, path: `/campaigns/${campaign.slug}` },
  ];

  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <section className="relative overflow-hidden border-b border-ink/10 bg-bone">
        <div className="woven pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="wrap relative z-10 grid gap-10 pb-12 pt-8 lg:grid-cols-[1fr_0.62fr] lg:gap-16 lg:pb-16">
          <div>
            <p className="eyebrow flex items-center gap-2 text-clay">
              <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden="true" />
              Active campaign · {campaign.beneficiaryGroup}
            </p>
            <h1 className="display-sm mt-4 max-w-3xl text-ink">{campaign.title}</h1>
            <p className="lede mt-5 max-w-2xl">{campaign.summary}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-semibold text-paper hover:bg-clay-dark"
              >
                How to give to this campaign
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href={campaign.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-sm font-semibold text-ink hover:border-ink/40"
              >
                Our Jamii profile
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <aside>
            <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 shadow-[var(--shadow-soft)] md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-ink/65">Funding position</p>
                  <p className="mt-1 text-[0.68rem] text-ink/65">
                    Snapshot {formatDate(campaign.reportedOn)}
                  </p>
                </div>
                {program && (
                  <span className="text-clay/40">
                    <ProgramGlyph glyph={program.glyph} className="h-12 w-12" />
                  </span>
                )}
              </div>
              <div className="mt-6">
                <ProgressLedger
                  target={campaign.target}
                  received={campaign.received}
                  supporters={campaign.supporters}
                  reportedOn={campaign.reportedOn}
                />
              </div>
              <div className="mt-6 rounded-xl bg-bone/70 p-4">
                <p className="text-[0.68rem] leading-relaxed text-ink/65">
                  {campaign.reportNote}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-ink/10 bg-paper/60 p-4">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <p className="text-[0.68rem] leading-relaxed text-ink/65">
                BBVF never asks for your M-Pesa PIN, card number or ID. Give only
                through a route published on this site or on the published Our Jamii
                profile.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.45fr] lg:gap-16">
            <div>
              <Reveal>
                <p className="eyebrow text-clay">The need</p>
                <div className="prose-bbvf mt-4 max-w-2xl">
                  {campaign.story.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>

              <Reveal>
                <h2 className="display-sm mt-12 text-ink">What the campaign funds</h2>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {campaign.whatItFunds.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl border border-ink/10 bg-paper px-4 py-3 text-sm text-ink/70"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-ink/65">
                  BBVF does not publish fixed unit-cost promises (&ldquo;KES X feeds a
                  family&rdquo;) unless it has a current, approved basis for that
                  figure. Itemised costs will be added here once approved.
                </p>
              </Reveal>

              <Reveal>
                <h2 className="display-sm mt-12 text-ink">How to give</h2>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-ink/10 bg-paper p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-ink">
                          M-Pesa via Our Jamii (available now)
                        </h3>
                        <p className="mt-1 text-xs text-ink/65">
                          BBVF&rsquo;s public campaign profile.
                        </p>
                      </div>
                      <a
                        href={site.externalProfile.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-bone hover:bg-ink-3"
                      >
                        Open profile
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-ink/20 bg-bone/50 p-6">
                    <div className="flex items-start gap-3">
                      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-ink/65" />
                      <div>
                        <h3 className="text-sm font-semibold text-ink">
                          Card, bank transfer and recurring giving — not yet live
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink/70">
                          These routes require a verified merchant account,
                          settlement currency, refund process and reconciliation
                          workflow. BBVF will publish them only once they have been
                          tested end to end. Register your interest and we will tell
                          you when they are available.
                        </p>
                        <Link
                          href="/donate#notify"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-clay underline underline-offset-4"
                        >
                          Notify me
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="mt-10">
                  <PendingNote title="Campaign updates">
                    Update timelines with dated posts, evidence and next steps will
                    be published here as the campaign progresses. No fabricated
                    progress updates are used to create momentum.
                  </PendingNote>
                </div>
              </Reveal>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              {program && (
                <Reveal>
                  <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6">
                    <p className="eyebrow text-clay">Programme</p>
                    <h2 className="mt-2 font-display text-xl text-ink">
                      {program.title}
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-ink/70">
                      {program.summary}
                    </p>
                    <Link
                      href={`/programs/${program.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-clay"
                    >
                      Programme detail
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Reveal>
              )}

              <Reveal>
                <div className="rounded-[var(--radius-card)] border border-ink/10 bg-ink p-6 text-bone">
                  <p className="eyebrow text-ochre">Institutional giving</p>
                  <h2 className="mt-2 font-display text-xl leading-tight">
                    Funding this at scale?
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-bone/65">
                    Foundations and institutional funders can request a
                    due-diligence conversation and a scoped budget.
                  </p>
                  <Link
                    href="/donate/international"
                    className="mt-4 inline-flex w-full items-center justify-between rounded-full bg-ochre px-5 py-3 text-xs font-semibold text-ink"
                  >
                    Institutional inquiry
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6">
                  <p className="eyebrow text-ink/65">Policies</p>
                  <ul className="mt-3 space-y-2 text-xs text-ink/70">
                    <li>
                      <Link href="/policies/donations" className="hover:text-clay">
                        Donation terms
                      </Link>
                    </li>
                    <li>
                      <Link href="/policies/privacy" className="hover:text-clay">
                        Privacy notice
                      </Link>
                    </li>
                    <li>
                      <Link href="/policies/accessibility" className="hover:text-clay">
                        Accessibility statement
                      </Link>
                    </li>
                  </ul>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      <JsonLd data={[breadcrumbSchema(crumbs), donateActionSchema(campaign)]} />
    </>
  );
}
