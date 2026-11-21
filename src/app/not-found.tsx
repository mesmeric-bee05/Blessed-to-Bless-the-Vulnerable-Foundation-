import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-clay">404 — page not found</p>
          <h1 className="display-sm mt-4 text-ink">
            This page is not here. The work still is.
          </h1>
          <p className="lede mx-auto mt-5 max-w-lg">
            The link may be old, or the page may have moved. Try one of these
            instead — or tell us what you were looking for and we will point you to
            it.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-bone hover:bg-ink-3"
            >
              Return home
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-sm font-semibold text-ink hover:border-ink/40"
            >
              Contact us
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <nav aria-label="Helpful links" className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-ink/65">
            <Link href="/programs" className="hover:text-clay">Programmes</Link>
            <Link href="/campaigns" className="hover:text-clay">Campaigns</Link>
            <Link href="/donate" className="hover:text-clay">Donate</Link>
            <Link href="/impact" className="hover:text-clay">Impact</Link>
            <Link href="/faq" className="hover:text-clay">FAQ</Link>
            <Link href="/sitemap.xml" className="hover:text-clay">Sitemap</Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
