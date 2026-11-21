import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgramGlyph } from "@/components/brand/ProgramGlyph";
import { PendingNote } from "@/components/ui/PendingNote";
import { Reveal } from "@/components/motion/Reveal";
import { programs, getProgram } from "@/content/programs";
import { getCampaign } from "@/content/campaigns";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { formatDate } from "@/lib/format";
import { ArrowUpRight, Check } from "@/components/ui/icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) return { title: "Programme not found" };
  return pageMetadata({
    title: program.title,
    description: program.summary,
    path: `/programs/${program.slug}`,
  });
}

const statusStyles: Record<string, string> = {
  active: "border-sage/40 bg-sage/[0.10] text-ink/70",
  fundraising: "border-ochre/50 bg-ochre/[0.12] text-ink/70",
  planned: "border-ink/15 bg-ink/[0.04] text-ink/65",
};

const statusLabels: Record<string, string> = {
  active: "Delivering now",
  fundraising: "Fundraising priority",
  planned: "Planned",
};

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const related = getCampaign(program.relatedCampaignSlug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Programs", path: "/programs" },
    { name: program.title, path: `/programs/${program.slug}` },
  ];

  return (
    <>
      <div className="woven relative overflow-hidden border-b border-ink/10 bg-bone">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-10" aria-hidden="true">
          <ProgramGlyph glyph={program.glyph} className="h-full w-full" />
        </div>
        <div className="wrap relative z-10 pb-12 pt-6 md:pb-16">
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div>
              <p className="eyebrow text-clay">{program.beneficiaryGroup}</p>
              <h1 className="display-sm mt-4 max-w-3xl text-ink">{program.title}</h1>
              <p className="lede mt-5 max-w-2xl">{program.summary}</p>
            </div>
            <div className="flex flex-col gap-3 text-xs text-ink/65">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/15 bg-paper px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden="true" />
                {statusLabels[program.status]}
              </span>
              <p>
                <span className="font-semibold text-ink/70">Geography:</span>{" "}
                {program.geography.join(" · ")}
              </p>
              <p>
                <span className="font-semibold text-ink/70">Last reviewed:</span>{" "}
                {formatDate(program.lastReviewed)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.42fr] lg:gap-16">
            <div>
              <Reveal>
                <div className="prose-bbvf max-w-2xl">
                  {program.intro.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>

              <Reveal>
                <h2 className="display-sm mt-14 text-ink">What the programme does</h2>
                <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                  {program.activities.map((activity) => (
                    <div key={activity.label} className="grid gap-3 py-5 sm:grid-cols-[0.9fr_1.1fr] sm:gap-6">
                      <div>
                        <h3 className="text-sm font-semibold text-ink">
                          {activity.label}
                        </h3>
                        <span
                          className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[0.6rem] font-medium ${
                            statusStyles[activity.status]
                          }`}
                        >
                          {statusLabels[activity.status]}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-ink/70">
                        {activity.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal>
                <h2 className="display-sm mt-14 text-ink">Current needs</h2>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {program.needs.map((need) => (
                    <li
                      key={need}
                      className="flex items-start gap-2.5 rounded-xl border border-ink/10 bg-paper px-4 py-3 text-sm text-ink/70"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                      {need}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal>
                <div className="mt-12 rounded-2xl border border-ink/10 bg-bone/70 p-6">
                  <h2 className="font-display text-xl text-ink">Safeguarding</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">
                    {program.safeguarding}
                  </p>
                  <Link
                    href="/safeguarding"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-clay underline underline-offset-4"
                  >
                    Read the safeguarding route
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>

              <Reveal>
                <div className="mt-8">
                  <PendingNote title="Evidence note">
                    {program.sourceNote}
                  </PendingNote>
                </div>
              </Reveal>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              {related && (
                <Reveal>
                  <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 shadow-[var(--shadow-soft)]">
                    <p className="eyebrow text-clay">Related campaign</p>
                    <h2 className="mt-3 font-display text-xl leading-tight text-ink">
                      {related.shortTitle}
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-ink/70">
                      {related.summary}
                    </p>
                    <Link
                      href={`/campaigns/${related.slug}`}
                      className="mt-5 inline-flex w-full items-center justify-between rounded-full bg-clay px-5 py-3 text-xs font-semibold text-paper hover:bg-clay-dark"
                    >
                      View campaign
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Reveal>
              )}

              <Reveal>
                <div className="rounded-[var(--radius-card)] border border-ink/10 bg-ink p-6 text-bone">
                  <p className="eyebrow text-ochre">Support this work</p>
                  <h2 className="mt-3 font-display text-xl leading-tight">
                    Give supplies, time or funding.
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-bone/65">
                    Every route reaches a named person. We will tell you what is
                    actually needed before you commit.
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <Link
                      href="/donate"
                      className="inline-flex items-center justify-between rounded-full bg-ochre px-5 py-3 text-xs font-semibold text-ink"
                    >
                      Ways to give
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-between rounded-full border border-bone/25 px-5 py-3 text-xs font-semibold text-bone hover:bg-bone/[0.06]"
                    >
                      Ask a question
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
