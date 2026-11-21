import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";
import { ExternalLink, Shield, ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Give locally with M-Pesa",
  description:
    "The published M-Pesa giving route for BBVF, step by step, plus what to do if someone claims to represent BBVF and asks for your PIN.",
  path: "/donate/local",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Donate", path: "/donate" },
  { name: "Give locally", path: "/donate/local" },
];

export default function LocalGivingPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Local giving"
        title="M-Pesa, through a route we can verify."
        intro={
          <p>
            Most Kenyan giving happens on a phone, in seconds. BBVF&rsquo;s published
            local route today is its public Our Jamii campaign profile, which
            collects M-Pesa gifts and issues the receipt. BBVF does not publish a
            paybill or till number until the account has been verified in the
            organisation&rsquo;s name.
          </p>
        }
        meta={<span>Method: M-Pesa</span>}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">Step by step</p>
              <ol className="mt-6 space-y-6">
                {[
                  {
                    t: "Open BBVF's public profile",
                    d: "Use the link below. It goes to BBVF's organisation page on Our Jamii, not to a private message or a forwarded number.",
                  },
                  {
                    t: "Choose the campaign",
                    d: "Each campaign page states its target and the amount displayed as received. Read it before you give.",
                  },
                  {
                    t: "Follow the M-Pesa prompt",
                    d: "The platform initiates the request to your phone. Enter your PIN only in the official M-Pesa prompt — never in a website form, chat or phone call.",
                  },
                  {
                    t: "Keep your confirmation",
                    d: "Our Jamii issues the receipt. Keep the SMS and the platform confirmation for your records.",
                  },
                ].map((step, index) => (
                  <li key={step.t} className="flex gap-4">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-clay/30 font-display text-xs text-clay">
                      0{index + 1}
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-ink">{step.t}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-ink/70">{step.d}</p>
                    </div>
                  </li>
                ))}
              </ol>

                              <a
                href={site.externalProfile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-semibold text-paper hover:bg-clay-dark"
              >
                Open the public profile
                <ExternalLink className="h-4 w-4" />
              </a>

              <div className="mt-4">
                <Link
                  href="/donate/checkout?method=mpesa"
                  className="text-sm font-semibold text-ink underline underline-offset-4 hover:text-clay"
                >
                  Give directly through BBVF using the secure M-Pesa checkout
                </Link>
                <p className="mt-1.5 text-xs text-ink/65">
                  The direct rail opens only when Daraja is live and verified; the
                  page states its status before you enter anything.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-4">
                <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6">
                  <div className="flex items-center gap-2 text-clay">
                    <Shield className="h-5 w-5" />
                    <h2 className="font-display text-xl text-ink">Before you send</h2>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/65">
                    {[
                      "BBVF will never ask for your M-Pesa PIN.",
                      "Do not send money to a personal number shared on social media.",
                      "Check that the campaign page names BBVF in full.",
                      "If a message pressures you to give urgently, stop and verify through this site.",
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <PendingNote title="Direct paybill and Daraja integration">
                  A direct Safaricom Daraja STK Push flow requires a developer app
                  registered under BBVF&rsquo;s own KRA PIN and paybill or till number.
                  That onboarding is not complete, so this site does not simulate
                  it. When live, payment will be credited only after a verified,
                  signed server-side callback — never from a browser message.
                </PendingNote>

                <div className="rounded-[var(--radius-card)] border border-ink/10 bg-bone/70 p-6">
                  <h2 className="font-display text-lg text-ink">Need a receipt?</h2>
                  <p className="mt-2 text-xs leading-relaxed text-ink/70">
                    Receipts for gifts made on Our Jamii are issued by that platform.
                    If a receipt is missing,{" "}
                    <Link href="/contact" className="text-clay underline underline-offset-2">
                      contact us
                    </Link>{" "}
                    with the date, amount and reference — never with your PIN.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section border-t border-ink/10">
        <div className="wrap">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-clay"
          >
            Back to all giving routes
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
