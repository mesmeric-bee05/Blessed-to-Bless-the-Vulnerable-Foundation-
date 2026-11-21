import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PendingNote } from "@/components/ui/PendingNote";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Lock, Shield, Check } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Institutional funders",
  description:
    "Request access to BBVF's institutional due-diligence material: governance status, programme scope, budget basis, safeguarding summary and reporting approach.",
  path: "/investors",
  noindex: true,
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Institutional funders", path: "/investors" },
];

const pack = [
  { title: "Legal identity & registration status", status: "In progress" },
  { title: "Governance structure & accountability roles", status: "Available" },
  { title: "Programme scope & delivery model", status: "Available" },
  { title: "Campaign budget basis & reporting approach", status: "Partial" },
  { title: "Safeguarding summary", status: "Available" },
  { title: "Audited financial statements", status: "Not yet available" },
  { title: "Monitoring, evaluation & learning framework", status: "In preparation" },
  { title: "Annual impact report", status: "In preparation" },
];

export default function InvestorsPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Institutional funders"
        title="Diligence material, released to verified funders."
        intro={
          <p>
            BBVF&rsquo;s detailed programme budgets, governance documents and MEL
            framework are shared with vetted institutional funders rather than
            published openly. This page is deliberately excluded from search
            engines. Access is granted manually after a short verification
            conversation.
          </p>
        }
        meta={
          <>
            <span>Noindex</span>
            <span>Manual verification</span>
            <span>No fabricated documents</span>
          </>
        }
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <Reveal>
                <div className="rounded-[var(--radius-card)] border border-ink/10 bg-ink p-6 text-bone md:p-8">
                  <div className="flex items-center gap-2 text-ochre">
                    <Lock className="h-5 w-5" />
                    <p className="eyebrow">Access controlled</p>
                  </div>
                  <h2 className="mt-4 font-display text-2xl leading-tight">
                    Why there is no public login.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-bone/70">
                    A login form without an account system, email verification and
                    access review is security theatre. Until BBVF&rsquo;s identity and
                    data-protection registration are confirmed, the gated pack is
                    released manually to a verified institutional contact.
                  </p>
                  <div className="mt-6 space-y-2.5 text-xs text-bone/65">
                    {[
                      "Request from an institutional email address.",
                      "We verify the organisation and the named contact.",
                      "We share only documents that actually exist.",
                      "Access is reviewed and can be revoked.",
                    ].map((item) => (
                      <p key={item} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="mt-6">
                  <PendingNote title="Security by design">
                    When a login is introduced, it will use passkeys or TOTP
                    multi-factor authentication, least-privilege roles, scoped
                    document access, full audit logging and per-user revocation.
                    Those controls are specified in the database schema but are not
                    simulated here.
                  </PendingNote>
                </div>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 shadow-[var(--shadow-soft)] md:p-8">
                <p className="eyebrow text-clay">Due-diligence pack</p>
                <h2 className="mt-3 font-display text-2xl text-ink">
                  What exists today
                </h2>
                <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
                  {pack.map((item) => (
                    <li
                      key={item.title}
                      className="flex items-start justify-between gap-4 py-3"
                    >
                      <span className="text-sm text-ink/70">{item.title}</span>
                      <span className="shrink-0 rounded-full border border-ink/15 px-2 py-0.5 text-[0.6rem] text-ink/65">
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>

                <h2 className="mt-8 font-display text-xl text-ink">
                  Request access
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  Tell us who you represent and what your committee needs. We will
                  reply with an honest inventory before sharing anything.
                </p>
                <div className="mt-5">
                  <InquiryForm
                    kind="institutional"
                    submitLabel="Request due-diligence access"
                    show={{ organisation: true, amountBand: true }}
                    messageLabel="What do you need?"
                    messagePlaceholder="Your organisation, the fund or mandate, the scale under consideration, and the documents your process requires."
                  />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <p className="mt-8 text-xs leading-relaxed text-ink/65">
              Prefer a public overview first?{" "}
              <Link href="/about/governance" className="text-clay underline underline-offset-2">
                Governance register
              </Link>
              ,{" "}
              <Link href="/impact" className="text-clay underline underline-offset-2">
                impact and method
              </Link>
              ,{" "}
              <Link href="/impact/reports" className="text-clay underline underline-offset-2">
                reports
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
