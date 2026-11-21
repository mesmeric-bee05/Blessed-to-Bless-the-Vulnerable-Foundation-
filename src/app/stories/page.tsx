import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { stories } from "@/content/stories";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { formatDate } from "@/lib/format";
import { ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Stories & updates",
  description:
    "Dated field updates, explainers and announcements from BBVF — published with consent, without identifiable beneficiary details where consent is not recorded.",
  path: "/stories",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Stories", path: "/stories" },
];

const kindLabel: Record<string, string> = {
  "field-update": "Field update",
  explainer: "Explainer",
  announcement: "Announcement",
};

export default function StoriesPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Stories & updates"
        title="Updates written for verification, not for applause."
        intro={
          <p>
            Field notes, campaign updates and explainers from BBVF. Every post has
            an author, a date and a consent note. We do not publish identifiable
            beneficiary stories without a recorded consent.
          </p>
        }
        meta={<span>{stories.length} published updates</span>}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => (
              <Reveal key={story.slug} delay={index * 80}>
                <article className="group relative flex h-full flex-col rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 transition-shadow hover:shadow-[var(--shadow-lift)]">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-clay/25 bg-clay/[0.05] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-clay">
                      {kindLabel[story.kind]}
                    </span>
                    <span className="text-[0.62rem] text-ink/65">
                      {story.readingMinutes} min
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-[1.4rem] leading-tight text-ink">
                    <Link href={`/stories/${story.slug}`} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {story.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
                    {story.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-[0.68rem] text-ink/65">
                    <time dateTime={story.publishedOn}>
                      {formatDate(story.publishedOn)}
                    </time>
                    <ArrowUpRight className="h-4 w-4 text-clay transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
