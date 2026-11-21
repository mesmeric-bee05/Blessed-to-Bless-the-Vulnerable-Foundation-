import Link from "next/link";
import type { Campaign } from "@/content/campaigns";
import { ProgressLedger } from "@/components/ui/ProgressLedger";
import { ProgramGlyph } from "@/components/brand/ProgramGlyph";
import { programs } from "@/content/programs";
import { ArrowUpRight } from "@/components/ui/icons";

export function CampaignCard({
  campaign,
  featured = false,
  tone = "light",
}: {
  campaign: Campaign;
  featured?: boolean;
  tone?: "light" | "dark";
}) {
  const program = programs.find((p) => p.slug === campaign.programSlug);
  const dark = tone === "dark";

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border p-6 transition-shadow duration-500 md:p-7 ${
        dark
          ? "border-bone/12 bg-bone/[0.04] hover:bg-bone/[0.06]"
          : "border-ink/10 bg-paper shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)]"
      } ${featured ? "md:p-9" : ""}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] ${
            dark
              ? "border-ochre/40 text-ochre"
              : "border-clay/25 bg-clay/[0.05] text-clay"
          }`}
        >
          <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
          {campaign.status === "active" ? "Active campaign" : campaign.status}
        </span>
        {program && (
          <span className={dark ? "text-ochre/60" : "text-clay/50"}>
            <ProgramGlyph glyph={program.glyph} className="h-10 w-10" />
          </span>
        )}
      </div>

      <h3
        className={`mt-5 font-display leading-tight ${
          featured ? "text-[1.9rem] md:text-[2.35rem]" : "text-[1.30rem]"
        } ${dark ? "text-bone" : "text-ink"}`}
      >
        <Link href={`/campaigns/${campaign.slug}`} className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          {featured ? campaign.title : campaign.shortTitle}
        </Link>
      </h3>

      <p
        className={`mt-3 flex-1 text-sm leading-relaxed ${
          dark ? "text-bone/70" : "text-ink/70"
        }`}
      >
        {campaign.summary}
      </p>

      <div className={`mt-6 border-t pt-5 ${dark ? "border-bone/12" : "border-ink/10"}`}>
        <ProgressLedger
          target={campaign.target}
          received={campaign.received}
          supporters={campaign.supporters}
          reportedOn={campaign.reportedOn}
          tone={tone}
        />
      </div>

      <p
        className={`mt-4 inline-flex items-center gap-1 text-[0.72rem] font-semibold ${
          dark ? "text-ochre" : "text-clay"
        }`}
      >
        View campaign and give
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </p>
    </article>
  );
}
