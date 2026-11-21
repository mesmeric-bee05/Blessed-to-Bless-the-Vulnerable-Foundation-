import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { impact } from "@/content/impact";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArrowUpRight, Check } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Impact & evidence",
  description:
    "What BBVF can evidence today, what is deliberately not published yet, and the method that will govern every future impact figure.",
  path: "/impact",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Impact", path: "/impact" },
];

export default function ImpactPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Impact & evidence"
        title="The discipline of not knowing yet — and saying so."
        intro={<p>{impact.posture}</p>}
        meta={
          <>
            <span>Snapshot 21 November 2026</span>
            <span>Definitions and method published</span>
          </>
        }
      />

      <section className="section">
        <div className="wrap">
          <Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {impact.reported.map((metric) => (
                <div
                  key={metric.label}
                  className="flex h-full flex-col rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6"
                >
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-ink/65">
                    {metric.label}
                  </p>
                  <p className="mt-3 font-display text-[1.7rem] leading-none text-ink">
                    {metric.value}
                  </p>
                  <p className="mt-3 flex-1 text-xs leading-relaxed text-ink/70">
                    {metric.note}
                  </p>
                  <p className="mt-4 border-t border-ink/10 pt-3 text-[0.62rem] text-ink/65">
                    {metric.period}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-10">
              <PendingNote title="These are not outcome figures">
                Campaign targets and supporter counts describe fundraising, not
                delivery. BBVF has not yet published beneficiaries reached, devices
                delivered or retention outcomes. Those will appear only with a
                reporting period, a definition and an internal owner.
              </PendingNote>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-ink/10 bg-bone/60">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">Not yet reported</p>
              <h2 className="display-sm mt-4 text-ink">
                What is missing, and exactly why.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-ink/70">
                A blank space with an explanation is more useful than a number
                nobody can defend. Each item below has a stated reason and an
                internal owner.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <dl className="divide-y divide-ink/10 border-y border-ink/10">
                {impact.pending.map((item) => (
                  <div key={item.item} className="py-5">
                    <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <span className="h-1.5 w-1.5 rounded-full bg-ochre" aria-hidden="true" />
                      {item.item}
                    </dt>
                    <dd className="mt-2 pl-3.5 text-sm leading-relaxed text-ink/70">
                      {item.reason}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section border-t border-ink/10">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">Method</p>
              <h2 className="display-sm mt-4 text-ink">How a number earns its place.</h2>
              <p className="mt-5 text-sm leading-relaxed text-ink/70">
                BBVF&rsquo;s reporting method is published before the results, so that
                the standard cannot be adjusted after the fact to flatter the
                organisation.
              </p>
              <Link
                href="/impact/reports"
                className="group mt-7 inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm font-semibold text-ink hover:border-clay hover:text-clay"
              >
                Reports & downloads
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal delay={100}>
              <ul className="space-y-4">
                {impact.method.map((rule, index) => (
                  <li key={rule.slice(0, 30)} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage/15 font-display text-[0.65rem] text-sage">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-ink/65">{rule}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section border-t border-ink/10 bg-ink text-bone">
        <div className="wrap">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="eyebrow text-ochre">First annual report</p>
              <h2 className="display-sm mt-4 max-w-2xl text-bone">
                In preparation — not pre-written.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone/70">
                {impact.firstReport}
              </p>
            </div>
            <div className="rounded-2xl border border-bone/15 bg-bone/[0.04] p-6">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-bone/60">
                Publication status
              </p>
              <p className="mt-2 font-display text-2xl text-bone">Report pending</p>
              <p className="mt-2 text-xs leading-relaxed text-bone/60">
                Expected after BBVF&rsquo;s first reconciled reporting period. No date
                is promised until finance and programme records are ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
