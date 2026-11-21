import Link from "next/link";
import type { Program } from "@/content/programs";
import { ProgramGlyph } from "@/components/brand/ProgramGlyph";
import { TiltCard } from "@/components/motion/TiltCard";
import { ArrowUpRight } from "@/components/ui/icons";

const statusLabel: Record<Program["status"], string> = {
  active: "Delivering",
  fundraising: "Fundraising",
  planned: "Planned",
};

export function ProgramCard({
  program,
  index,
}: {
  program: Program;
  index: number;
}) {
  return (
    <TiltCard className="group">
      <article className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)] md:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="text-clay/80">
            <ProgramGlyph glyph={program.glyph} className="h-20 w-20" />
          </span>
          <span className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ink/65">
            0{index + 1}
          </span>
        </div>

        <div className="mt-6 flex-1">
          <p className="eyebrow text-ink/65">{program.beneficiaryGroup}</p>
          <h3 className="mt-2 font-display text-[1.6rem] leading-tight text-ink">
            <Link href={`/programs/${program.slug}`} className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              {program.title}
            </Link>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            {program.summary}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-ink/65">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden="true" />
            {statusLabel[program.status]}
          </span>
          <span className="inline-flex items-center gap-1 text-[0.72rem] font-semibold text-clay">
            Explore
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </TiltCard>
  );
}
