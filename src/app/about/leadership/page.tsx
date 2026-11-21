import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Shield, ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Leadership & board",
  description:
    "BBVF's leadership and board profiles are being published with each person's written consent. This page explains what will be published and why it is not filled with placeholders.",
  path: "/about/leadership",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Leadership", path: "/about/leadership" },
];

const roles = [
  {
    title: "Board of directors",
    body: "Overall strategy, financial oversight and legal accountability. Board members will be listed with their role, a short biography, and a declaration of any conflict of interest.",
  },
  {
    title: "Safeguarding lead",
    body: "Owns the child and vulnerable-adult safeguarding policy, reviews every consent record, and receives concerns raised through the public safeguarding route.",
  },
  {
    title: "Finance lead",
    body: "Approves campaign spending, reconciles received and disbursed funds, and signs off the figures published on this site.",
  },
  {
    title: "Privacy lead",
    body: "Accountable for ODPC registration, data-protection requests, retention schedules and the 72-hour breach workflow.",
  },
  {
    title: "Programme leads",
    body: "Named owners for each of the four programme areas, responsible for delivery records and follow-up.",
  },
  {
    title: "Communications editor",
    body: "Publishes approved content only, maintains review dates, and has no authority to approve a beneficiary story or a financial figure.",
  },
];

export default function LeadershipPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Leadership & board"
        title="Real names, real consent — or an honest gap."
        intro={
          <p>
            BBVF will not populate a leadership page with invented names,
            biographies or stock portraits. Profiles are published only after each
            person has agreed in writing to be named and photographed, and after
            any conflict of interest has been declared.
          </p>
        }
        meta={<span>Profiles pending consent · Last reviewed 21 November 2026</span>}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <div className="sticky top-28">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-clay/[0.08] text-clay">
                  <Shield className="h-6 w-6" />
                </span>
                <h2 className="display-sm mt-5 text-ink">Why this page is empty.</h2>
                <p className="mt-5 text-sm leading-relaxed text-ink/65">
                  On BBVF&rsquo;s previous platform, the leadership section was left
                  blank. The wrong fix is to fill it quickly. The right fix is to
                  publish a governance structure that tells a funder who is
                  accountable for what, then add named people as each consent
                  record is signed.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/65">
                  Until then, this page publishes the roles that exist and the
                  standard each will meet. It does not publish a placeholder person.
                </p>
                <Link
                  href="/about/governance"
                  className="group mt-7 inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm font-semibold text-ink hover:border-clay hover:text-clay"
                >
                  Governance register
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            <div>
              <p className="eyebrow text-clay">Accountability roles</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {roles.map((role, index) => (
                  <Reveal key={role.title} delay={index * 60}>
                    <div className="h-full rounded-2xl border border-ink/10 bg-paper p-5">
                      <h3 className="font-display text-lg leading-tight text-ink">
                        {role.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-ink/70">
                        {role.body}
                      </p>
                      <p className="mt-4 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink/60">
                        Named appointment pending
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <div className="mt-8 rounded-2xl border border-ochre/30 bg-ochre/[0.07] p-6">
                  <h3 className="font-display text-xl text-ink">
                    What each published profile will include
                  </h3>
                  <ul className="mt-4 grid gap-2 text-sm text-ink/65 sm:grid-cols-2">
                    {[
                      "Full name and title",
                      "Short, factual biography",
                      "Photograph with consent",
                      "Declared conflicts of interest",
                      "Date the profile was approved",
                      "External verification link, where consented",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-clay" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal>
                <div className="mt-6 text-sm leading-relaxed text-ink/70">
                  <p>
                    Are you a board member or staff lead who needs to supply a
                    profile and consent record? Use the contact form and select
                    &ldquo;Media and press&rdquo; or write to the safeguarding lead
                    through the{" "}
                    <Link href="/safeguarding" className="text-clay underline underline-offset-4">
                      safeguarding page
                    </Link>
                    . Please do not send identity documents through the form.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
