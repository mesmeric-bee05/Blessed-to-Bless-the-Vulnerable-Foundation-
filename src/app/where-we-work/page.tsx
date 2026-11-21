import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Where we work",
  description:
    "BBVF works in Nairobi County, with documented outreach along the Eastern Bypass corridor and at Spirit of Mercy Children's Home in Kamae, Kahawa West.",
  path: "/where-we-work",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Where we work", path: "/where-we-work" },
];

export default function WhereWeWorkPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Where we work"
        title="Nairobi County — with named, documented locations."
        intro={
          <p>
            BBVF&rsquo;s work is concentrated in Nairobi, with outreach recorded
            along the Eastern Bypass corridor and at Spirit of Mercy
            Children&rsquo;s Home in Kamae, Kahawa West. We publish only locations
            that BBVF has confirmed.
          </p>
        }
        meta={<span>Last reviewed 21 November 2026</span>}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Reveal>
              <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-ink p-8 text-bone md:p-10">
                <div className="woven-dark absolute inset-0 opacity-50" aria-hidden="true" />
                <div className="relative z-10">
                  <p className="eyebrow text-ochre">Primary geography</p>
                  <p className="mt-4 font-display text-4xl leading-none">Nairobi</p>
                  <p className="mt-2 text-sm text-bone/65">Nairobi County, Kenya</p>

                  <div className="mt-10 space-y-5">
                    {site.serviceAreas.map((area, index) => (
                      <div key={area} className="flex gap-4 border-t border-bone/15 pt-4">
                        <span className="font-display text-xs text-ochre">
                          0{index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-bone">{area}</p>
                          <p className="mt-1 text-xs text-bone/60">
                            Documented outreach location
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-10 text-[0.68rem] leading-relaxed text-bone/60">
                    We do not publish a map of beneficiary homes, schools or
                    shelters. Precise locations of vulnerable people are never
                    shown, including through image metadata.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-6">
                <div>
                  <h2 className="display-sm text-ink">Service area, honestly stated.</h2>
                  <p className="mt-4 text-sm leading-relaxed text-ink/65">
                    Nairobi is a large county and BBVF is a small organisation. It
                    does not claim national coverage or county-wide reach. The
                    locations listed here are the areas where outreach has been
                    documented in BBVF&rsquo;s supplied material.
                  </p>
                </div>

                <div className="rule" />

                <div>
                  <h3 className="font-display text-xl text-ink">Planned expansion</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    Additional service areas will be published only when they are
                    operational, with a named partner and a delivery record. BBVF
                    does not create location pages for places it does not yet serve.
                  </p>
                </div>

                <PendingNote title="Why there is no interactive map">
                  An embedded map can reveal sensitive locations, load third-party
                  trackers and fail on slow connections. Until there is a
                  non-sensitive office address to publish, this page uses text and
                  confirmed place names instead.
                </PendingNote>

                <div className="rounded-2xl border border-ink/10 bg-paper p-6">
                  <h3 className="font-display text-xl text-ink">Referrals & support requests</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    If you represent a care home, clinic, school or family in one of
                    these areas, use the contact form and select &ldquo;Programmes and
                    referrals&rdquo;. BBVF will explain what information is needed and
                    how to share it safely. Do not send medical records or identity
                    documents through the form.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
