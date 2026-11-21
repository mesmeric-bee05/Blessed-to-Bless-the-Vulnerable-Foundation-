import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PendingNote } from "@/components/ui/PendingNote";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArrowUpRight, Check, Heart, Shield, Spark } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Get involved",
  description:
    "Volunteer, partner, fundraise or give supplies to BBVF. What each route involves, what we need, and how to start safely.",
  path: "/get-involved",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Get involved", path: "/get-involved" },
];

const inKind = [
  "Mattresses, blankets, sheets and towels",
  "School uniforms, shoes, bags and stationery",
  "Wheelchairs, crutches, walking frames and hearing aid batteries",
  "Non-perishable food staples and hygiene supplies",
  "Transport for deliveries (van, fuel, driver time)",
  "Professional services: physiotherapy, counselling, accounting, legal review",
];

const needs = [
  {
    icon: Heart,
    title: "Volunteer time",
    body: "Sorting and packing supplies, delivery support, supervised reading or homework help, event logistics, and skilled professional support.",
    id: "volunteer",
  },
  {
    icon: Shield,
    title: "Partnership",
    body: "Care homes, clinics, schools, employers and companies that can provide supplies, services, referrals or matched funding.",
    id: "partner",
  },
  {
    icon: Spark,
    title: "Fundraising",
    body: "A workplace collection, a birthday appeal, a faith-group drive or a community event for a specific, agreed campaign.",
    id: "fundraise",
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Get involved"
        title="Every route starts with a real need, not a photo opportunity."
        intro={
          <p>
            BBVF works with a small team and a clear rule: nothing is delivered to a
            partner home without the home agreeing that it is needed. That applies
            to volunteers, corporate teams and donations in kind.
          </p>
        }
        meta={
          <>
            <span>Volunteering</span>
            <span>Partnership</span>
            <span>Fundraising</span>
            <span>In-kind supplies</span>
          </>
        }
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-3">
            {needs.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <a
                  href={`#${item.id}`}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 transition-shadow hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-clay/[0.08] text-clay">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 font-display text-xl text-ink">{item.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                    {item.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-clay">
                    Start here
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="volunteer" className="section scroll-mt-24 border-t border-ink/10 bg-bone/60">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">Volunteer</p>
              <h2 className="display-sm mt-4 text-ink">
                Reliable beats enthusiastic.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-ink/65">
                Vulnerable people are not a volunteering experience. We look for
                people who can commit to a specific, supervised role and turn up
                when they say they will.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-ink/65">
                {[
                  "Every role involving contact with vulnerable people is vetted and supervised.",
                  "Visits to children's homes are arranged in advance — never unannounced.",
                  "Photography of beneficiaries is not a volunteer activity.",
                  "We will explain the safeguarding rules before your first shift.",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <PendingNote title="No guaranteed placement">
                  BBVF cannot guarantee a placement. Offers are matched to current,
                  agreed needs and to the safeguarding requirements of each partner
                  home.
                </PendingNote>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 shadow-[var(--shadow-soft)] md:p-8">
                <h2 className="font-display text-2xl text-ink">Offer your time</h2>
                <p className="mt-2 text-sm text-ink/65">
                  Tell us what you can do, where you are and how often.
                </p>
                <div className="mt-6">
                  <InquiryForm
                    kind="volunteer"
                    submitLabel="Send volunteer offer"
                    show={{ phone: true, topic: true }}
                    messageLabel="What can you offer?"
                    messagePlaceholder="Your skills, availability, location and any experience relevant to the role."
                    messageHint="Please do not include medical details or identity document numbers."
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="partner" className="section scroll-mt-24 border-t border-ink/10">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <Reveal>
              <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 shadow-[var(--shadow-soft)] md:p-8">
                <h2 className="font-display text-2xl text-ink">Start a partnership</h2>
                <p className="mt-2 text-sm text-ink/65">
                  Companies, foundations, care homes, clinics, schools and
                  community groups.
                </p>
                <div className="mt-6">
                  <InquiryForm
                    kind="partner"
                    submitLabel="Send partnership inquiry"
                    show={{ organisation: true, phone: true }}
                    messageLabel="What kind of partnership are you considering?"
                    messagePlaceholder="Supplies, services, matched funding, staff volunteering, referral pathway or something else."
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <p className="eyebrow text-clay">Partner</p>
              <h2 className="display-sm mt-4 text-ink">
                A partnership should change something measurable.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-ink/65">
                We will agree the scope, the beneficiary group, the delivery
                evidence and the recognition terms in writing before work starts. We
                do not trade a partner logo for a claim we cannot support.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-ink/65">
                {[
                  "In-kind: supplies, transport, venues, equipment.",
                  "Skills: pro bono clinical, legal, finance, communications or technical support.",
                  "Funding: a scoped campaign or programme budget with reporting.",
                  "Referrals: a clear pathway for people who need support.",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/investors"
                className="group mt-7 inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm font-semibold text-ink hover:border-clay hover:text-clay"
              >
                Institutional due-diligence access
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="fundraise" className="section scroll-mt-24 border-t border-ink/10 bg-ink text-bone">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-ochre">Fundraise</p>
              <h2 className="display-sm mt-4 text-bone">
                Raise for a need that exists.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-bone/70">
                A workplace collection, a birthday appeal or a community drive works
                best when it is tied to one specific campaign and one specific list
                of items. Tell us what you have in mind and we will give you the
                approved wording — including what not to claim.
              </p>
              <div className="mt-8">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-bone/60">
                  What we can provide
                </p>
                <ul className="mt-3 space-y-2.5 text-sm text-bone/65">
                  {[
                    "A scoped campaign brief and approved messaging",
                    "A needs list agreed with the partner home",
                    "A named contact for donor questions",
                    "A short post-campaign report on what was delivered",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-2xl border border-bone/15 bg-bone/[0.04] p-6">
                <h2 className="font-display text-xl text-bone">What we will not do</h2>
                <p className="mt-2 text-sm leading-relaxed text-bone/70">
                  We will not approve a fundraising page that invents a beneficiary
                  story, uses an unconsented photograph, promises a fixed unit cost we
                  cannot support, or suggests that a donation is tax-deductible.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-bone/70">
                  If you are raising funds on our behalf, tell us before you publish
                  so that we can confirm the campaign is current and the wording is
                  accurate.
                </p>
                <a
                  href="#volunteer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-ochre px-5 py-3 text-xs font-semibold text-ink"
                >
                  Contact the team
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">Give in kind</p>
              <h2 className="display-sm mt-4 text-ink">What is actually needed.</h2>
              <p className="mt-5 text-sm leading-relaxed text-ink/70">
                Ask before you collect. A well-intentioned donation of the wrong
                item creates storage and disposal work for a partner home.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {inKind.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl border border-ink/10 bg-paper px-4 py-3 text-sm text-ink/70"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-ink/65">
                Do not deliver to a children&rsquo;s home or care home unannounced.
                Use the{" "}
                <Link href="/contact" className="text-clay underline underline-offset-2">
                  contact form
                </Link>{" "}
                and we will arrange a drop-off and a receipt.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
