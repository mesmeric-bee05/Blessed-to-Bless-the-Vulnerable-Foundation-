import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowRight, Check } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Donate", path: "/donate" },
  { name: "Thank you", path: "/donate/thank-you" },
];

export const dynamic = "force-dynamic";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const valid = typeof ref === "string" && /^BBVF-\d{8}-[A-Z0-9]{8}$/.test(ref);

  return (
    <section className="section">
      <div className="wrap max-w-2xl">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 rounded-[var(--radius-card)] border border-ink/10 bg-paper p-8 shadow-[var(--shadow-soft)]">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage-dark">
            <Check className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-3xl text-ink">
            Thank you for giving.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            If your payment went through, the provider will confirm it to BBVF
            directly and a receipt will be recorded against your gift. This page
            cannot see that confirmation, so please keep the reference below and
            check your email before assuming a payment failed.
          </p>
          {valid && (
            <p className="mt-5 rounded-xl border border-ink/10 bg-bone p-4 text-sm text-ink">
              Your reference:{" "}
              <span className="font-mono tracking-tight">{ref}</span>
            </p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-ink/65">
            If no confirmation arrives within two working days, contact BBVF with
            the reference — never with your PIN or card number.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-bone hover:bg-ink-3"
            >
              Back to giving routes
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3.5 text-sm font-semibold text-ink hover:border-clay hover:text-clay"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
