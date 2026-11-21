import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { governance } from "@/content/governance";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Transparency hub",
  description:
    "BBVF's transparency hub: registration and governance status, financial reporting, safeguarding, policies, data protection and how to raise a concern.",
  path: "/transparency",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Transparency", path: "/transparency" },
];

const hub = [
  {
    title: "Governance & registration",
    body: "Legal entity status, registration progress, accountability roles and governance commitments.",
    href: "/about/governance",
    status: "Status register",
  },
  {
    title: "Leadership & board",
    body: "The roles that exist, and the consent standard each published profile must meet.",
    href: "/about/leadership",
    status: "Consent pending",
  },
  {
    title: "Impact & evidence",
    body: "What can be evidenced today, and exactly why other figures are not published yet.",
    href: "/impact",
    status: "Method published",
  },
  {
    title: "Reports & financials",
    body: "Annual report, financial statements, campaign budgets and the MEL framework.",
    href: "/impact/reports",
    status: "Report pending",
  },
  {
    title: "Safeguarding & complaints",
    body: "A separate, visible route for concerns involving a vulnerable person, with a takedown process.",
    href: "/safeguarding",
    status: "Route live",
  },
  {
    title: "Data protection",
    body: "What data is collected, why, how long it is kept and how to exercise your rights.",
    href: "/policies/privacy",
    status: "Draft for legal review",
  },
  {
    title: "Donation terms",
    body: "Current giving routes, receipts, refunds, designation of funds and the fraud warning.",
    href: "/policies/donations",
    status: "Draft for legal review",
  },
  {
    title: "Accessibility",
    body: "WCAG 2.2 AA commitment, what has been implemented, known limitations and how to report a barrier.",
    href: "/policies/accessibility",
    status: "Published",
  },
];

export default function TransparencyPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Transparency hub"
        title="Everything a diligent donor should be able to check."
        intro={
          <p>
            One page that gathers the evidence, the policies and the gaps. Where a
            document or figure does not exist yet, the entry says so instead of
            offering a template or a broken download.
          </p>
        }
        meta={<span>Last reviewed 21 November 2026</span>}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-4 md:grid-cols-2">
            {hub.map((item, index) => (
              <Reveal key={item.href} delay={index * 50}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 transition-shadow hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-xl leading-tight text-ink">
                      {item.title}
                    </h2>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                    {item.body}
                  </p>
                  <span className="mt-4 inline-flex w-fit rounded-full border border-ink/15 px-2.5 py-1 text-[0.6rem] font-medium text-ink/65">
                    {item.status}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-ink/10 bg-bone/60">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">Financial transparency</p>
              <h2 className="display-sm mt-4 text-ink">
                The money question, answered honestly.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-ink/65">
                BBVF publishes campaign targets and dated received amounts. It does
                not yet publish audited accounts or a reconciled disbursement
                statement, because none has been supplied to this project and
                inventing one would be a serious breach of trust.
              </p>
              <dl className="mt-6 space-y-3 text-sm">
                {[
                  ["Audited accounts", "Not supplied"],
                  ["Annual report", "First report in preparation"],
                  ["Campaign budgets", "Pending BBVF approval"],
                  ["Reconciled disbursements", "Not yet published"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-ink/10 pb-3">
                    <dt className="text-ink/70">{label}</dt>
                    <dd className="text-right text-ink/65">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-4">
                <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6">
                  <h2 className="font-display text-xl text-ink">Governance register</h2>
                  <ul className="mt-4 space-y-3">
                    {governance.register.slice(0, 4).map((row) => (
                      <li key={row.item} className="flex items-start justify-between gap-4 border-b border-ink/[0.07] pb-3 last:border-0">
                        <span className="text-sm text-ink/70">{row.item}</span>
                        <span className="shrink-0 rounded-full border border-ink/15 px-2 py-0.5 text-[0.6rem] text-ink/65">
                          {row.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/about/governance"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-clay"
                  >
                    Full register
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <PendingNote title="Corrections policy">
                  If any figure or statement on this site is wrong, tell us and we
                  will correct it visibly, with the date and what changed. A
                  correction is not an embarrassment; an uncorrected error is.
                </PendingNote>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
