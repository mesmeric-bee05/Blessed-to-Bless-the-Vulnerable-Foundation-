import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArrowUpRight, Check } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Events & drives",
  description:
    "BBVF donation drives, volunteer days and community events. No public event is currently scheduled; past outreach is documented on the stories page.",
  path: "/events",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Events & drives", path: "/events" },
];

export default function EventsPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Events & drives"
        title="No public event is scheduled right now."
        intro={
          <p>
            When BBVF confirms a donation drive, volunteer day or community event,
            it will be published here with a date, a location, a named contact and a
            clear list of what is needed. We do not publish provisional events to
            create momentum.
          </p>
        }
        meta={<span>Updated 21 November 2026</span>}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <h2 className="display-sm text-ink">Past outreach</h2>
              <div className="mt-6 rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 md:p-8">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-clay">
                  November 2026 · Nairobi
                </p>
                <h3 className="mt-3 font-display text-2xl text-ink">
                  Children&rsquo;s essentials drive along the Eastern Bypass
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  Mattresses, blankets, shoes and children&rsquo;s clothing were
                  collected at drop-off points along the Eastern Bypass corridor and
                  delivered to Spirit of Mercy Children&rsquo;s Home in Kamae, Kahawa
                  West.
                </p>
                <Link
                  href="/stories/eastern-bypass-november-drive"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-clay underline underline-offset-4"
                >
                  Read the field update
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-8">
                <PendingNote title="Why there is no calendar widget">
                  An empty calendar is worse than no calendar. When there is a
                  confirmed event, it will be published as a proper page with
                  structured data and a real contact — not a placeholder entry.
                </PendingNote>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-[var(--radius-card)] border border-ink/10 bg-ink p-6 text-bone md:p-8">
                <p className="eyebrow text-ochre">Stay informed</p>
                <h2 className="mt-3 font-display text-3xl leading-tight">
                  Hear about the next drive first.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-bone/70">
                  Ask to be added to the update list, or tell us you would like to
                  volunteer at the next collection.
                </p>
                <ul className="mt-6 space-y-2.5 text-sm text-bone/65">
                  {[
                    "Only confirmed, dated events are announced.",
                    "Supply lists are agreed with the partner home in advance.",
                    "Unannounced visits to children's homes are not permitted.",
                    "Volunteer roles are vetted and supervised.",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-ochre px-5 py-3 text-xs font-semibold text-ink"
                >
                  Ask about upcoming drives
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
