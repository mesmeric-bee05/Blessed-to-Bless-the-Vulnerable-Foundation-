import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { getPublicPrograms } from "@/lib/cms-content";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArrowRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Programs",
  description:
    "BBVF's four programme areas: children and education, elderly care, disability inclusion and amputee veterans. What each delivers, where, and what is still a fundraising priority.",
  path: "/programs",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Programs", path: "/programs" },
];

export const revalidate = 300;

export default async function ProgramsPage() {
  const programs = await getPublicPrograms();

  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Programs"
        title="Four groups. Four distinct barriers. One method."
        intro={
          <p>
            BBVF does not run a single generic programme. Each of the four areas
            below has its own beneficiary group, its own delivery method and its
            own evidence standard. A wheelchair, a school uniform and a prosthetic
            fitting are not interchangeable.
          </p>
        }
        meta={
          <>
            <span>4 active programme areas</span>
            <span>Nairobi County</span>
            <span>Last reviewed 21 November 2026</span>
          </>
        }
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
            {programs.map((program, index) => (
              <Reveal key={program.slug} delay={index * 80}>
                <ProgramCard program={program} index={index} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <PendingNote title="Delivery status is labelled">
                Each activity on a programme page is marked as delivering,
                fundraising or planned. A planned service is never described as
                though it is already operating.
              </PendingNote>
              <PendingNote title="Widows, orphans and sick individuals">
                BBVF&rsquo;s supplied material refers to widows, orphans and sick
                individuals, but these are not yet documented as standalone
                programmes with published criteria. They will be added only after
                BBVF confirms them as operational.
              </PendingNote>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-[var(--radius-card)] border border-ink/10 bg-paper p-7 sm:flex-row sm:items-center md:p-9">
              <div>
                <h2 className="font-display text-2xl text-ink">
                  Not sure where your support fits?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/70">
                  Tell us what you can offer — supplies, time, a professional skill
                  or funding — and we will match it to a documented need.
                </p>
              </div>
              <Link
                href="/get-involved"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-bone hover:bg-ink-3"
              >
                Get involved
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
