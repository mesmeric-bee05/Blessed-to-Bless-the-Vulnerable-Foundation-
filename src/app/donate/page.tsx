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
import {
  ArrowUpRight,
  ExternalLink,
  Heart,
  Lock,
  Shield,
} from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Donate",
  description:
    "Give to BBVF through the published M-Pesa route today, register interest in card, bank or recurring giving, or make an institutional inquiry. No card data is collected on this site.",
  path: "/donate",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Donate", path: "/donate" },
];

export default function DonatePage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Give"
        title="Give with certainty about where it goes."
        intro={
          <p>
            BBVF publishes the campaign, the target and the amount displayed as
            received. Today, the giving route published is BBVF&rsquo;s Our Jamii
            profile, which accepts M-Pesa. Card, bank and recurring giving are not
            live yet — we will not take a payment we cannot reconcile.
          </p>
        }
        meta={
          <>
            <span>M-Pesa available now</span>
            <span>Card & bank pending</span>
            <span>No card data collected here</span>
          </>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={site.externalProfile.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-semibold text-paper hover:bg-clay-dark"
          >
            Give via Our Jamii (M-Pesa)
            <ExternalLink className="h-4 w-4" />
          </a>
          <Link
            href="#notify"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-sm font-semibold text-ink hover:border-ink/40"
          >
            Notify me about other rails
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-3">
            <Reveal>
              <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-sage/40 bg-paper p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sage/15 text-sage">
                    <Heart className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-sage/40 bg-sage/[0.10] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-ink/70">
                    Available
                  </span>
                </div>
                <h2 className="mt-5 font-display text-2xl text-ink">
                  M-Pesa via Our Jamii
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                  Choose a campaign on BBVF&rsquo;s public profile and give by
                  M-Pesa. The platform issues the receipt.
                </p>
                <a
                  href={site.externalProfile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-between rounded-full bg-ink px-5 py-3 text-xs font-semibold text-bone hover:bg-ink-3"
                >
                  Open Our Jamii profile
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-ochre/40 bg-paper p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ochre/15 text-clay">
                    <Lock className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-ochre/50 bg-ochre/[0.12] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-ink/70">
                    Pending
                  </span>
                </div>
                <h2 className="mt-5 font-display text-2xl text-ink">
                  Card, bank & recurring
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                  Requires a verified merchant account, settlement currency,
                  refunds and reconciliation. Not yet live — register interest and
                  we will tell you when it is tested.
                </p>
                <Link
                  href="#notify"
                  className="mt-5 inline-flex items-center justify-between rounded-full border border-ink/20 px-5 py-3 text-xs font-semibold text-ink hover:border-ink/40"
                >
                  Register interest
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-ink/12 bg-ink p-6 text-bone">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-bone/10 text-ochre">
                    <Shield className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-bone/25 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-bone/70">
                    Open
                  </span>
                </div>
                <h2 className="mt-5 font-display text-2xl">Institutional giving</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-bone/70">
                  Foundations, companies and major donors can request a scoped
                  budget and a due-diligence conversation.
                </p>
                <Link
                  href="/donate/international"
                  className="mt-5 inline-flex items-center justify-between rounded-full bg-ochre px-5 py-3 text-xs font-semibold text-ink"
                >
                  Institutional inquiry
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <PendingNote title="What we will not do">
                We will not display a paybill or bank account until BBVF has
                verified that it belongs to the organisation. We will not describe
                a payment as successful because a browser redirected to a thank-you
                page. We will not claim tax-deductibility in any jurisdiction.
              </PendingNote>
              <PendingNote title="Your safety">
                {site.contact.whatsappPolicy} If someone contacts you claiming to
                represent BBVF and asks for these, stop and report it through the
                contact form.
              </PendingNote>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-ink/10 bg-bone/60">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">How your gift is handled</p>
              <h2 className="display-sm mt-4 text-ink">
                A short chain of custody, stated plainly.
              </h2>
              <ol className="mt-6 space-y-5">
                {[
                  {
                    t: "You choose a campaign",
                    d: "The campaign page states the target, the reported received amount and the date of that snapshot.",
                  },
                  {
                    t: "You give through a published route",
                    d: "Today that is Our Jamii. When BBVF's own rails go live, the provider will be named before you confirm.",
                  },
                  {
                    t: "The provider confirms the payment",
                    d: "Payments are credited only on a verified provider confirmation — never on a browser redirect.",
                  },
                  {
                    t: "BBVF reconciles and reports",
                    d: "Received, pending and disbursed balances will be published only when finance can reconcile them.",
                  },
                ].map((step, index) => (
                  <li key={step.t} className="flex gap-4">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-clay/30 font-display text-[0.7rem] text-clay">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">{step.t}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink/70">
                        {step.d}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={100}>
              <div id="notify" className="scroll-mt-28 rounded-[var(--radius-card)] border border-ink/10 bg-ink p-6 text-bone md:p-9">
                <p className="eyebrow text-ochre">Stay informed</p>
                <h2 className="mt-3 font-display text-3xl leading-tight">
                  Tell us which giving route you need.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-bone/70">
                  This is not a donation and no payment details are collected. We
                  will contact you when the route you selected is live and tested.
                </p>
                <div className="mt-6">
                  <InquiryForm
                    kind="donation-notify"
                    tone="dark"
                    submitLabel="Register interest"
                    show={{ amountBand: true, method: true }}
                    messageLabel="Anything else? (optional)"
                    messagePlaceholder="For example: a recurring gift, a company match, or a specific campaign."
                    requiredMessage={false}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section border-t border-ink/10">
        <div className="wrap">
          <div className="flex flex-col items-start justify-between gap-5 rounded-[var(--radius-card)] border border-ink/10 bg-paper p-7 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl text-ink">
                Prefer to give supplies instead?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/70">
                Mattresses, blankets, school supplies and mobility equipment are
                always needed. Tell us what you have before delivering anything to a
                partner home.
              </p>
            </div>
            <Link
              href="/get-involved"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-bone hover:bg-ink-3"
            >
              Give in kind
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-ink/65">
            Read the{" "}
            <Link href="/policies/donations" className="text-clay underline underline-offset-2">
              donation terms
            </Link>
            ,{" "}
            <Link href="/policies/privacy" className="text-clay underline underline-offset-2">
              privacy notice
            </Link>{" "}
            and{" "}
            <Link href="/policies/accessibility" className="text-clay underline underline-offset-2">
              accessibility statement
            </Link>
            . Institutional funders can{" "}
            <Link href="/investors" className="text-clay underline underline-offset-2">
              request the due-diligence pack
            </Link>
            .
          </p>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
