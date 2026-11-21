import Link from "next/link";
import { footerNav, site } from "@/content/site";
import { Wordmark } from "@/components/brand/Wordmark";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ArrowUpRight } from "@/components/ui/icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-bone">
      <div className="woven-dark absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="wrap relative z-10">
        <div className="grid gap-12 py-16 md:py-20 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <Wordmark tone="bone" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone/65">
              {site.description}
            </p>

            <div className="mt-8 max-w-sm">
              <h2 className="font-display text-lg text-bone">
                Occasional updates, never noise
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-bone/65">
                Field updates, campaign reconciliations and reports. Separate
                consent, one-click unsubscribe.
              </p>
              <div className="mt-4">
                <NewsletterForm />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="eyebrow text-bone/60">{group.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={`${group.title}-${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        className="link-underline text-[0.82rem] text-bone/70 transition-colors hover:text-bone"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-bone/12 bg-bone/[0.04] p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="eyebrow text-ochre">Fraud warning</h2>
              <p className="mt-2 max-w-3xl text-xs leading-relaxed text-bone/70">
                BBVF will never ask for your M-Pesa PIN, card number, password or
                a copy of your identity document by phone, WhatsApp, email or
                social media. Only use giving routes published on this site or on
                BBVF&rsquo;s published{" "}
                <a
                  href={site.externalProfile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-bone/30 underline-offset-2 hover:text-bone"
                >
                  Our Jamii profile
                </a>
                .
              </p>
            </div>
            <div className="shrink-0 text-xs text-bone/60">
              <p>Nairobi County, Kenya</p>
              <p className="mt-1">
                {site.contact.phone ?? "Contact channels pending verification"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-bone/10 py-7 text-[0.7rem] text-bone/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/policies" className="hover:text-bone/80">
              Policies
            </Link>
            <Link href="/policies/accessibility" className="hover:text-bone/80">
              Accessibility
            </Link>
            <Link href="/transparency" className="hover:text-bone/80">
              Transparency
            </Link>
            <Link href="/sitemap.xml" className="hover:text-bone/80">
              Sitemap
            </Link>
            <a
              href={site.externalProfile.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-bone/80"
            >
              Our Jamii
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
