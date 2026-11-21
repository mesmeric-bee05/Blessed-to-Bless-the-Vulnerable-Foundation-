import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { governance } from "@/content/governance";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArrowUpRight, Check } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Governance & registration",
  description:
    "BBVF's governance commitments, registration status under Kenya's Public Benefit Organizations framework, ODPC registration progress and published documents.",
  path: "/about/governance",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Governance", path: "/about/governance" },
];

export default function GovernancePage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Governance & registration"
        title="Accountability stated plainly — including what is not yet confirmed."
        intro={<p>{governance.statement}</p>}
        meta={<span>Last reviewed 21 November 2026</span>}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">Commitments</p>
              <h2 className="display-sm mt-4 text-ink">Five rules we can be held to.</h2>
              <p className="mt-5 text-sm leading-relaxed text-ink/70">
                These commitments describe how BBVF intends to operate as it
                formalises its governance. They are published so that partners and
                donors can ask whether they are being kept.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ul className="space-y-6">
                {governance.commitments.map((item) => (
                  <li key={item.title} className="flex gap-4 border-t border-ink/10 pt-5">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section border-t border-ink/10 bg-bone/60">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow text-clay">Status register</p>
            <h2 className="display-sm mt-4 max-w-3xl text-ink">
              The diligence questions, with the current answer.
            </h2>
          </Reveal>

          <div className="mt-9 overflow-hidden rounded-2xl border border-ink/10 bg-paper">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                BBVF governance and registration status register
              </caption>
              <thead>
                <tr className="border-b border-ink/10 bg-bone/50">
                  <th scope="col" className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink/65">
                    Item
                  </th>
                  <th scope="col" className="hidden px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink/65 sm:table-cell">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink/65">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {governance.register.map((row) => (
                  <tr key={row.item} className="border-b border-ink/[0.07] last:border-0">
                    <th scope="row" className="px-5 py-5 align-top text-sm font-semibold text-ink">
                      {row.item}
                      <span className="mt-1 block text-[0.65rem] font-medium uppercase tracking-[0.12em] text-clay sm:hidden">
                        {row.status}
                      </span>
                    </th>
                    <td className="hidden px-5 py-5 align-top sm:table-cell">
                      <span className="inline-flex whitespace-nowrap rounded-full border border-ink/15 px-2.5 py-1 text-[0.62rem] font-medium text-ink/70">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-5 align-top text-sm leading-relaxed text-ink/70">
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <PendingNote title="Why we do not publish a registration number">
              Kenya&rsquo;s NGO-to-PBO transition has been legislated, litigated and
              extended. Publishing an unverified number would be worse than
              publishing none. BBVF&rsquo;s counsel is confirming the entity type and
              current filing position; this page will be updated with the verified
              number and registering authority.
            </PendingNote>
            <PendingNote title="Why there are no named board members yet">
              Each board and leadership profile requires a real person&rsquo;s written
              consent to be named and photographed. Inventing names to fill a page
              would be a serious misrepresentation and a safeguarding failure.
            </PendingNote>
          </div>
        </div>
      </section>

      <section className="section border-t border-ink/10">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">Documents</p>
              <h2 className="display-sm mt-4 text-ink">Published and in draft.</h2>
              <p className="mt-5 text-sm leading-relaxed text-ink/70">
                Draft documents are published openly so that partners can review
                them, but they are labelled as drafts because they have not yet
                completed legal review.
              </p>
              <Link
                href="/transparency"
                className="group mt-7 inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm font-semibold text-ink hover:border-clay hover:text-clay"
              >
                Transparency hub
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal delay={100}>
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {governance.documents.map((doc) => (
                  <li key={doc.href}>
                    <Link
                      href={doc.href}
                      className="group flex items-center justify-between gap-4 py-4"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-ink">
                          {doc.title}
                        </span>
                        <span className="mt-0.5 block text-[0.68rem] text-ink/65">
                          {doc.note}
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
