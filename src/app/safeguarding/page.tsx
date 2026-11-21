import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PendingNote } from "@/components/ui/PendingNote";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Shield, Lock, ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Safeguarding & reporting a concern",
  description:
    "How to raise a safeguarding concern with BBVF, what happens next, the limits of confidentiality, and the emergency route if someone is in immediate danger.",
  path: "/safeguarding",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Safeguarding", path: "/safeguarding" },
];

const principles = [
  {
    title: "The person comes first",
    body: "A concern is about the safety and dignity of a vulnerable person — not about protecting the organisation's reputation.",
  },
  {
    title: "Consent shapes content",
    body: "No image, name or story of an identifiable child, older person, person with a disability or veteran is published without a recorded consent and safeguarding approval.",
  },
  {
    title: "Restricted access",
    body: "Safeguarding reports are stored separately from general enquiries and are visible only to the safeguarding reviewer and, where necessary, the appropriate authorities.",
  },
  {
    title: "No absolute confidentiality promise",
    body: "We will treat a report sensitively, but we cannot promise absolute confidentiality where a person is at risk or where the law requires disclosure.",
  },
  {
    title: "Takedown without interrogation",
    body: "A beneficiary, family member or guardian can ask us to remove an image or story at any time. We will act promptly and confirm what was done.",
  },
];

export default function SafeguardingPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Safeguarding"
        title="A visible route for a serious concern."
        intro={
          <p>
            BBVF works with children, older persons, persons with disabilities and
            injured veterans. This page explains how to raise a safeguarding or
            complaints concern, what happens next, and what this website can and
            cannot do.
          </p>
        }
        meta={<span>Separate from general enquiries</span>}
      >
        <div className="rounded-2xl border border-clay/40 bg-clay/[0.08] p-5">
          <p className="text-sm font-semibold text-clay-dark">
            If someone is in immediate danger, contact the Kenyan emergency services
            now (999 or 112). This website is not an emergency-response channel and
            cannot guarantee an immediate response.
          </p>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">Our principles</p>
              <h2 className="display-sm mt-4 text-ink">Five commitments.</h2>
              <dl className="mt-7 divide-y divide-ink/10 border-y border-ink/10">
                {principles.map((item) => (
                  <div key={item.title} className="py-5">
                    <dt className="text-sm font-semibold text-ink">{item.title}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink/70">
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>

              <h2 className="display-sm mt-12 text-ink">What happens next</h2>
              <ol className="mt-5 space-y-4">
                {[
                  "Your report is recorded with a reference and restricted to the safeguarding reviewer.",
                  "The reviewer assesses immediate risk and decides whether statutory authorities or a partner organisation must be informed.",
                  "Where the concern involves a BBVF activity or a partner home, the relevant leadership is informed on a need-to-know basis.",
                  "You may be contacted for clarification using the details you provide. Anonymous reports are accepted but may limit what we can do.",
                  "The outcome and any action taken are recorded. We will tell you what we can, within the limits of confidentiality and the law.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage/15 font-display text-[0.65rem] text-sage">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-ink/65">{step}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <PendingNote title="Policy status">
                  BBVF&rsquo;s full child-safeguarding and vulnerable-adult policies are
                  being finalised. This public summary describes the process
                  implemented in this application and is published so that concerns
                  can be raised now.
                </PendingNote>
                <PendingNote title="Takedown requests">
                  To request removal of a photograph or story, use this form and
                  state the page. You do not need to explain why. See the{" "}
                  <Link href="/policies/media-consent" className="text-clay underline underline-offset-2">
                    media consent policy
                  </Link>
                  .
                </PendingNote>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 shadow-[var(--shadow-soft)] md:p-8">
                <div className="flex items-center gap-2 text-clay">
                  <Lock className="h-5 w-5" />
                  <p className="eyebrow">Restricted route</p>
                </div>
                <h2 className="mt-3 font-display text-2xl text-ink">
                  Report a concern
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  You can report anonymously by leaving your name and email blank.
                  If you want a response, give us a safe way to reach you.
                </p>
                <div className="mt-6">
                  <InquiryForm
                    kind="safeguarding"
                    submitLabel="Send safeguarding report"
                    show={{ fullName: true, email: true, phone: true }}
                    messageLabel="What is the concern?"
                    messagePlaceholder="What happened, when, who is affected, and whether anyone is in immediate danger. Do not include unnecessary medical or identity details."
                    messageHint="If someone is in immediate danger, call 999 or 112 first."
                    requiredMessage
                  />
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-ink/10 bg-bone/60 p-4">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                <p className="text-[0.68rem] leading-relaxed text-ink/65">
                  Reports are never published, never used in fundraising content and
                  never sent to a third-party AI service. Access is restricted to the
                  safeguarding reviewer.
                </p>
              </div>

              <Link
                href="/policies"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ink underline underline-offset-4 hover:text-clay"
              >
                All policies
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
