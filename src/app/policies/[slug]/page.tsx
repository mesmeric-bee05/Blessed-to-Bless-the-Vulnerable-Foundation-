import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { policies as staticPolicies } from "@/content/policies";
import { getPublicPolicies } from "@/lib/cms-content";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { formatDate } from "@/lib/format";
import { ArrowUpRight } from "@/components/ui/icons";

/** Known slugs are prerendered; a newly published policy renders on demand. */
export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return staticPolicies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = (await getPublicPolicies()).find((item) => item.slug === slug);
  if (!policy) return { title: "Policy not found" };
  return pageMetadata({
    title: policy.title,
    description: policy.summary,
    path: `/policies/${policy.slug}`,
    noindex: policy.status !== "published",
  });
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policies = await getPublicPolicies();
  const policy = policies.find((item) => item.slug === slug);
  if (!policy) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Policies", path: "/policies" },
    { name: policy.title, path: `/policies/${policy.slug}` },
  ];

  const others = policies.filter((p) => p.slug !== policy.slug).slice(0, 4);

  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <header className="border-b border-ink/10 bg-bone">
        <div className="wrap py-12 md:py-16">
          <p className="eyebrow text-clay">Policy</p>
          <h1 className="display-sm mt-4 max-w-3xl text-ink">{policy.title}</h1>
          <p className="lede mt-5 max-w-2xl">{policy.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-ink/65">
            <span>Last updated {formatDate(policy.updated)}</span>
            <span aria-hidden="true">·</span>
            <span
              className={`rounded-full border px-2.5 py-0.5 ${
                policy.status === "published"
                  ? "border-sage/40 bg-sage/[0.08] text-ink/70"
                  : "border-clay/30 bg-clay/[0.06] text-clay-dark"
              }`}
            >
              {policy.status === "published"
                ? "Published"
                : "Draft — pending legal review"}
            </span>
          </div>
        </div>
      </header>

      <article className="section">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.36fr] lg:gap-16">
            <div>
              {policy.status !== "published" && (
                <div className="mb-8 rounded-2xl border border-clay/30 bg-clay/[0.05] p-5">
                  <p className="text-sm leading-relaxed text-clay-dark">
                    <strong className="font-semibold">Draft for legal review.</strong>{" "}
                    This document describes the practices implemented in this
                    application. It has not yet been reviewed by Kenyan counsel and
                    is published for transparency only.
                  </p>
                </div>
              )}

              <div className="prose-bbvf max-w-2xl">
                {policy.sections.map((section) => (
                  <section key={section.heading}>
                    <h2>{section.heading}</h2>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                    {section.list && (
                      <ul>
                        {section.list.map((item) => (
                          <li key={item.slice(0, 40)}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              <p className="mt-10 text-xs leading-relaxed text-ink/65">
                Questions about this policy? Use the{" "}
                <Link href="/contact" className="text-clay underline underline-offset-2">
                  contact form
                </Link>{" "}
                and select &ldquo;Privacy request&rdquo; or &ldquo;Accessibility&rdquo; as
                appropriate.
              </p>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6">
                <p className="eyebrow text-ink/65">Other policies</p>
                <ul className="mt-4 space-y-3">
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={`/policies/${other.slug}`}
                        className="group flex items-start justify-between gap-3 text-sm text-ink/65 hover:text-clay"
                      >
                        {other.title}
                        <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-40" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/policies"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-clay"
                >
                  All policies
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
