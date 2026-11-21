import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { getPublicPolicies } from "@/lib/cms-content";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { formatDate } from "@/lib/format";
import { ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Policies",
  description:
    "BBVF's privacy notice, cookie notice, terms of use, accessibility statement, donation terms, media consent policy and data retention schedule.",
  path: "/policies",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Policies", path: "/policies" },
];

export const revalidate = 300;

export default async function PoliciesPage() {
  const policies = await getPublicPolicies();

  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Policies"
        title="The rules, including the ones we impose on ourselves."
        intro={
          <p>
            These documents describe how this website and the organisation behind
            it handle data, money, media and access. Drafts are labelled as drafts:
            they are published for transparency, not presented as legally reviewed
            instruments.
          </p>
        }
        meta={[<span key="count">{policies.length} documents</span>, <span key="review">Last reviewed 21 November 2026</span>]}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {policies.map((policy, index) => (
              <Reveal key={policy.slug} delay={index * 50}>
                <Link
                  href={`/policies/${policy.slug}`}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 transition-shadow hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-xl leading-tight text-ink">
                      {policy.title}
                    </h2>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                    {policy.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 text-[0.62rem] text-ink/65">
                    <span>Updated {formatDate(policy.updated)}</span>
                    <span
                      className={
                        policy.status === "published" ? "text-sage" : "text-clay"
                      }
                    >
                      {policy.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-8">
              <PendingNote title="Drafts for legal review">
                The privacy notice, cookie notice, terms, donation terms, media
                consent policy and data retention schedule are drafts prepared for
                review by Kenyan counsel. They describe what the application
                actually does; they are not legal advice and should not be treated
                as final.
              </PendingNote>
            </div>
          </Reveal>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
