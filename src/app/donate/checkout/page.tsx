import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { DonationCheckout } from "@/components/donations/DonationCheckout";
import { PendingNote } from "@/components/ui/PendingNote";
import { paymentRails } from "@/lib/payments";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Give securely",
  description:
    "Give to BBVF by M-Pesa or international card through a verified, server-verified payment rail.",
  path: "/donate/checkout",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Donate", path: "/donate" },
  { name: "Give securely", path: "/donate/checkout" },
];

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string; campaign?: string; cancelled?: string }>;
}) {
  const { method, campaign, cancelled } = await searchParams;
  const rails = paymentRails();
  const initial = method === "card" && rails.card ? "card" : "mpesa";

  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Secure giving"
        title="Give directly, with a receipt you can trust."
        intro={
          <p>
            Choose M-Pesa or an international card. The payment is confirmed by
            the provider&rsquo;s server, not by this page, and a receipt is
            recorded only after that confirmation.
          </p>
        }
        meta={
          <>
            <span>M-Pesa: {rails.mpesa ? "open" : "pending"}</span>
            <span>Card: {rails.card ? "open" : "pending"}</span>
            <span>3-D Secure where required</span>
          </>
        }
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
            <Reveal>
              <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 shadow-[var(--shadow-soft)] md:p-8">
                {cancelled && (
                  <p className="mb-5 rounded-xl border border-ink/15 bg-bone p-4 text-xs text-ink/70">
                    That checkout was cancelled. Nothing was charged.
                  </p>
                )}
                <DonationCheckout
                  availability={rails}
                  initialMethod={initial}
                  campaignSlug={campaign}
                />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-4">
                <PendingNote title="How confirmation works">
                  An M-Pesa callback is not trusted on its own: BBVF re-queries
                  Safaricom for the transaction result before crediting a gift. A
                  card gift is credited only from a signature-verified Stripe
                  webhook, and the amount is compared with the stored donation.
                </PendingNote>

                <div className="rounded-[var(--radius-card)] border border-ink/10 bg-bone/70 p-6">
                  <h2 className="font-display text-lg text-ink">Fraud warning</h2>
                  <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-ink/70">
                    <li>BBVF will never ask for your M-Pesa PIN.</li>
                    <li>BBVF will never ask for a card number by email or chat.</li>
                    <li>If a message pressures you to give urgently, stop and verify here.</li>
                  </ul>
                </div>

                <div className="rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6">
                  <h2 className="font-display text-lg text-ink">No tax claims</h2>
                  <p className="mt-2 text-xs leading-relaxed text-ink/70">
                    BBVF does not claim tax-deductibility in any jurisdiction. This
                    checkout issues a donation record, not a tax certificate.
                  </p>
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
