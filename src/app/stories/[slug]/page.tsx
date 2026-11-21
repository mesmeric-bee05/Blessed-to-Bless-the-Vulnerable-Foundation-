import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PendingNote } from "@/components/ui/PendingNote";
import { stories, getStory } from "@/content/stories";
import { getProgram } from "@/content/programs";
import { getCampaign } from "@/content/campaigns";
import { pageMetadata, breadcrumbSchema, articleSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { formatDate } from "@/lib/format";
import { ArrowUpRight } from "@/components/ui/icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return { title: "Story not found" };
  return pageMetadata({
    title: story.title,
    description: story.excerpt,
    path: `/stories/${story.slug}`,
    type: "article",
    publishedTime: story.publishedOn,
  });
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const program = story.relatedProgramSlug
    ? getProgram(story.relatedProgramSlug)
    : undefined;
  const campaign = story.relatedCampaignSlug
    ? getCampaign(story.relatedCampaignSlug)
    : undefined;

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Stories", path: "/stories" },
    { name: story.title, path: `/stories/${story.slug}` },
  ];

  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <article className="section pt-10">
        <div className="wrap">
          <header className="max-w-3xl">
            <p className="eyebrow text-clay">
              {story.kind === "field-update"
                ? "Field update"
                : story.kind === "explainer"
                  ? "Explainer"
                  : "Announcement"}
            </p>
            <h1 className="display-sm mt-4 text-ink">{story.title}</h1>
            <p className="lede mt-5">{story.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-ink/10 py-4 text-xs text-ink/65">
              <span>{story.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={story.publishedOn}>{formatDate(story.publishedOn)}</time>
              <span aria-hidden="true">·</span>
              <span>{story.readingMinutes} min read</span>
            </div>
          </header>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_0.42fr] lg:gap-16">
            <div className="prose-bbvf max-w-2xl">
              {story.body.map((paragraph) => (
                <p key={paragraph.slice(0, 50)}>{paragraph}</p>
              ))}

              <div className="not-prose mt-10">
                <PendingNote title="Consent & safeguarding note">
                  {story.consentNote}
                </PendingNote>
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              {program && (
                <div className="rounded-2xl border border-ink/10 bg-paper p-6">
                  <p className="eyebrow text-clay">Related programme</p>
                  <h2 className="mt-2 font-display text-lg text-ink">{program.title}</h2>
                  <Link
                    href={`/programs/${program.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-clay"
                  >
                    Read more
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
              {campaign && (
                <div className="rounded-2xl border border-ink/10 bg-paper p-6">
                  <p className="eyebrow text-clay">Related campaign</p>
                  <h2 className="mt-2 font-display text-lg text-ink">
                    {campaign.shortTitle}
                  </h2>
                  <Link
                    href={`/campaigns/${campaign.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-clay"
                  >
                    View campaign
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
              <div className="rounded-2xl bg-ink p-6 text-bone">
                <p className="eyebrow text-ochre">More updates</p>
                <Link
                  href="/stories"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-bone hover:text-ochre"
                >
                  All stories
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <JsonLd data={[breadcrumbSchema(crumbs), articleSchema(story)]} />
    </>
  );
}
