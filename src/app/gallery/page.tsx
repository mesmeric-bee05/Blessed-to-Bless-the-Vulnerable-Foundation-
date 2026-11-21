import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { ProgramGlyph } from "@/components/brand/ProgramGlyph";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description:
    "BBVF's media gallery will publish only consented, reviewed photography. Until consent records are complete, the gallery shows brand artwork rather than stock images of beneficiaries.",
  path: "/gallery",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Gallery", path: "/gallery" },
];

export default function GalleryPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Gallery"
        title="No borrowed faces. No unconsented photographs."
        intro={
          <p>
            A nonprofit gallery should show real work. It should not use stock
            photographs of unrelated children to manufacture emotion, or publish a
            beneficiary&rsquo;s face without a recorded consent. Until BBVF&rsquo;s media
            consent records are complete, this page shows the foundation&rsquo;s own
            artwork instead.
          </p>
        }
        meta={<span>Media consent records in progress</span>}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { glyph: "child" as const, title: "Children & education", place: "Kamae, Kahawa West" },
              { glyph: "elder" as const, title: "Elderly care", place: "Nairobi County" },
              { glyph: "disability" as const, title: "Disability inclusion", place: "Nairobi County" },
              { glyph: "veteran" as const, title: "Amputee veterans", place: "Nairobi County" },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="woven relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-bone p-6">
                  <div className="absolute inset-0 flex items-center justify-center text-clay/15" aria-hidden="true">
                    <ProgramGlyph glyph={item.glyph} className="h-[70%] w-[70%]" />
                  </div>
                  <span className="relative z-10 w-fit rounded-full border border-ink/15 bg-paper/80 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink/65">
                    Artwork placeholder
                  </span>
                  <div className="relative z-10">
                    <h2 className="font-display text-2xl text-ink">{item.title}</h2>
                    <p className="mt-1 text-xs text-ink/65">{item.place}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <PendingNote title="What will be published">
              Field photography and video only after a consent record exists for
              every identifiable person, including guardian consent for minors, with
              a named safeguarding reviewer&rsquo;s approval and a review date.
            </PendingNote>
            <PendingNote title="Metadata is stripped">
              Uploaded images are processed server-side to remove EXIF and GPS data
              before storage, so a photograph cannot reveal a home, school or care
              home location.
            </PendingNote>
          </div>

          <Reveal>
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-xl text-ink">
                  Need a photograph removed?
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink/70">
                  A beneficiary, family member or guardian can request removal at any
                  time, without giving a reason.
                </p>
              </div>
              <Link
                href="/safeguarding"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-semibold text-bone hover:bg-ink-3"
              >
                Takedown request
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
