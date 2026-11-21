import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PendingNote } from "@/components/ui/PendingNote";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";
import { Shield, ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact BBVF about programmes, referrals, donations, volunteering, partnerships or accessibility. Secure form with a reference, and clear guidance on what not to send.",
  path: "/contact",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Contact"
        title="Reach a person, and keep a record of it."
        intro={
          <p>
            Use this form for programmes, referrals, donations, volunteering,
            partnerships, media or accessibility. You will receive a reference for
            your message. BBVF&rsquo;s dedicated phone, email and office details are
            being verified and will be published here once confirmed.
          </p>
        }
        meta={
          <>
            <span>Secure form</span>
            <span>Reference issued</span>
            <span>No PINs or ID documents</span>
          </>
        }
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 shadow-[var(--shadow-soft)] md:p-8">
                <h2 className="font-display text-2xl text-ink">Send a message</h2>
                <p className="mt-2 text-sm text-ink/65">
                  Fields marked with an asterisk are required.
                </p>
                <div className="mt-6">
                  <InquiryForm
                    kind="contact"
                    submitLabel="Send message"
                    show={{ topic: true, phone: true }}
                    messageLabel="How can we help?"
                    messagePlaceholder="Tell us what you need, who it concerns and any deadline."
                    messageHint="Do not include medical records, ID numbers, card numbers or M-Pesa PINs."
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-5">
                <div className="rounded-[var(--radius-card)] border border-ink/10 bg-bone/70 p-6">
                  <h2 className="font-display text-xl text-ink">Response expectations</h2>
                  <ul className="mt-4 space-y-3 text-sm text-ink/65">
                    <li className="flex justify-between gap-4 border-b border-ink/10 pb-3">
                      <span>General enquiry</span>
                      <span className="text-ink/65">5 working days</span>
                    </li>
                    <li className="flex justify-between gap-4 border-b border-ink/10 pb-3">
                      <span>Accessibility barrier</span>
                      <span className="text-ink/65">5 working days</span>
                    </li>
                    <li className="flex justify-between gap-4 border-b border-ink/10 pb-3">
                      <span>Safeguarding concern</span>
                      <span className="text-ink/65">Routed immediately</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span>Privacy request</span>
                      <span className="text-ink/65">Within statutory period</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-[var(--radius-card)] border border-clay/25 bg-clay/[0.05] p-6">
                  <div className="flex items-center gap-2 text-clay">
                    <Shield className="h-5 w-5" />
                    <h2 className="font-display text-xl text-ink">
                      Safeguarding concern?
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">
                    Use the dedicated safeguarding route, not this general form. It
                    is logged separately and reaches the safeguarding reviewer.
                  </p>
                  <Link
                    href="/safeguarding"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-clay underline underline-offset-4"
                  >
                    Report a concern
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <PendingNote title="Contact details pending verification">
                  The discovery record contains a phone number from a third-party
                  donation listing. BBVF has not verified it, and publishing an
                  unverified number could expose donors to impersonation. The form is
                  the reliable channel today. {site.contact.phoneStatus === "pending_verification" ? "" : ""}
                </PendingNote>

                <div className="rounded-[var(--radius-card)] border border-ink/10 bg-ink p-6 text-bone">
                  <h2 className="font-display text-lg">What never to send</h2>
                  <ul className="mt-3 space-y-2 text-xs leading-relaxed text-bone/70">
                    {[
                      "M-Pesa PIN, card number or CVV",
                      "Passwords or one-time codes",
                      "Identity document numbers or scans",
                      "Unredacted medical records",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ochre" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
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
