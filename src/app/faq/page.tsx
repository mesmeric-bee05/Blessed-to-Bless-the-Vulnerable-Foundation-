import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { getPublicFaqs } from "@/lib/cms-content";
import { pageMetadata, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Frequently asked questions",
  description:
    "Direct answers about giving, tax status, campaigns, registration, privacy, safeguarding and volunteering with BBVF.",
  path: "/faq",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

const categories = ["Giving", "Programs", "Trust", "Volunteering", "Privacy"] as const;

export const revalidate = 300;

export default async function FaqPage() {
  const faqs = await getPublicFaqs();

  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Questions"
        title="Direct answers, including the uncomfortable ones."
        intro={
          <p>
            These answers are written to be complete on their own — the same
            discipline that makes content useful to a donor, a journalist and an AI
            answer engine. Where the answer is &ldquo;not yet,&rdquo; we say so.
          </p>
        }
        meta={<span>{faqs.length} answers</span>}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16">
            <nav aria-label="FAQ sections" className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow text-ink/65">Sections</p>
              <ul className="mt-4 space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <a
                      href={`#${category.toLowerCase()}`}
                      className="text-sm text-ink/70 hover:text-clay"
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-xl border border-ink/10 bg-paper p-4">
                <p className="text-xs leading-relaxed text-ink/70">
                  Cannot find an answer?{" "}
                  <Link href="/contact" className="text-clay underline underline-offset-2">
                    Ask us directly
                  </Link>
                  .
                </p>
              </div>
            </nav>

            <div className="space-y-12">
              {categories.map((category) => {
                const items = faqs.filter((faq) => faq.category === category);
                if (items.length === 0) return null;
                return (
                  <section key={category} id={category.toLowerCase()} className="scroll-mt-28">
                    <Reveal>
                      <h2 className="display-sm text-ink">{category}</h2>
                    </Reveal>
                    <div className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
                      {items.map((faq, index) => (
                        <Reveal key={faq.question} delay={index * 40}>
                          <details className="group">
                            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left">
                              <span className="text-[0.95rem] font-semibold text-ink">
                                {faq.question}
                              </span>
                              <span
                                className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink/65 transition-transform group-open:rotate-45"
                                aria-hidden="true"
                              >
                                +
                              </span>
                            </summary>
                            <p className="max-w-2xl pb-5 pr-8 text-sm leading-relaxed text-ink/65">
                              {faq.answer}
                            </p>
                          </details>
                        </Reveal>
                      ))}
                    </div>
                  </section>
                );
              })}

              <Reveal>
                <div className="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-display text-xl text-ink">
                      Still need a person?
                    </h2>
                    <p className="mt-1 text-sm text-ink/65">
                      Send a message and keep the reference we issue.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-semibold text-bone hover:bg-ink-3"
                  >
                    Contact BBVF
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={[breadcrumbSchema(crumbs), faqSchema(faqs)]} />
    </>
  );
}
