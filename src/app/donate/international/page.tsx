import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PendingNote } from "@/components/ui/PendingNote";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Lock, Shield, Check } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "International & institutional giving",
  description:
    "BBVF's international card, bank and institutional giving routes: what is live, what is pending, and how funders can request a due-diligence conversation.",
  path: "/donate/international",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Donate", path: "/donate" },
  { name: "International & institutional", path: "/donate/international" },
];

export default function InternationalGivingPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="International & institutional giving"
        title="For funders who need the paperwork to be right."
        intro={
          <p>
            BBVF is preparing international card and bank routes. Until a provider
            is verified and the flow is tested end to end, this site will not accept
            a card payment or publish wire details. Institutional funders can start
            a due-diligence conversation now.
          </p>
        }
        meta={
          <>
            <span>Card rail: pending</span>
            <span>Bank rail: pending</span>
            <span>Institutional inquiries: open</span>
          </>
        }
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <Reveal>
                <div className="rounded-[var(--radius-card)] border border-dashed border-ink/20 bg-bone/50 p-6 md:p-8">
                  <div className="flex items-center gap-2 text-ink/65">
                    <Lock className="h-5 w-5" />
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
                      Not yet live
                    </p>
                  </div>
                  <h2 className="mt-4 font-display text-2xl text-ink">
                    Card, wallet and bank transfer
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">
                    Before opening an international rail, BBVF must confirm:
                  </p>
                  <ul className="mt-4 space-y-2.5 text-sm text-ink/65">
                    {[
                      "A verified merchant account in BBVF's legal name",
                      "Settlement currency, conversion and payout timing",
                      "Refund, chargeback and failed-payment handling",
                      "A reconciliation record that finance can sign off",
                      "PCI scope: hosted or tokenised fields only, never raw card data on BBVF servers",
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-xs leading-relaxed text-ink/65">
                    These are prerequisites, not marketing copy. A checkout that
                    looks live but cannot settle or refund is worse than no
                    checkout at all.
                  </p>
                  <Link
                    href="/donate/checkout?method=card"
                    className="mt-4 inline-block text-xs font-semibold text-clay underline underline-offset-4"
                  >
                    Open the card checkout status page
                  </Link>
                </div>
              </Reveal>

              <Reveal>
                <div className="mt-4">
                  <PendingNote title="No tax claims">
                    BBVF does not claim charitable or tax-deductible status in any
                    jurisdiction. If that changes, the exact approved wording and
                    evidence will be published before any donor relies on it.
                  </PendingNote>
                </div>
              </Reveal>

              <Reveal>
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-ink/10 bg-paper p-6">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
                  <div>
                    <h2 className="font-display text-lg text-ink">
                      What we will send a verified funder
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-ink/70">
                      Legal identity and registration status (including what is not
                      yet confirmed), governance structure, programme scope, the
                      campaign budget basis, safeguarding summary, and a named
                      contact. We will not send a fabricated due-diligence pack.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 shadow-[var(--shadow-soft)] md:p-8">
                <p className="eyebrow text-clay">Institutional inquiry</p>
                <h2 className="mt-3 font-display text-3xl leading-tight text-ink">
                  Start a scoped conversation.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  Tell us who you represent, the scale you are considering and what
                  your diligence process requires. We will respond with what exists
                  today and what is still in progress.
                </p>
                <div className="mt-6">
                  <InquiryForm
                    kind="institutional"
                    submitLabel="Send institutional inquiry"
                    show={{ organisation: true, amountBand: true, phone: true }}
                    messageLabel="What would you like to discuss?"
                    messagePlaceholder="Your funding focus, indicative scale, timeline and the documents your committee needs."
                    messageHint="Do not include bank details, card numbers or personal identity documents."
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
