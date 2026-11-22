import Link from "next/link";
import { HeroOrbit } from "@/components/motion/HeroOrbit";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { CampaignCard } from "@/components/cards/CampaignCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProgressLedger } from "@/components/ui/ProgressLedger";
import { PendingNote } from "@/components/ui/PendingNote";
import {
  getPublicPrograms,
  getPublicCampaigns,
  getPublicStories,
} from "@/lib/cms-content";
import { impact } from "@/content/impact";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Shield,
  Spark,
} from "@/components/ui/icons";

export const revalidate = 300;

const getInvolved = [
  {
    title: "Volunteer",
    body: "Sort supplies, drive deliveries, support reading in a partner home, or offer a professional skill under supervision.",
    href: "/get-involved#volunteer",
    label: "Offer your time",
  },
  {
    title: "Partner with us",
    body: "Corporate teams, care homes, clinics and schools can provide supplies, expertise, transport or referral pathways.",
    href: "/get-involved#partner",
    label: "Start a partnership",
  },
  {
    title: "Fundraise",
    body: "Run a workplace collection, a birthday appeal or a community drive for a specific, agreed campaign.",
    href: "/get-involved#fundraise",
    label: "Fundraise for BBVF",
  },
];

export default async function HomePage() {
  const [programs, campaigns, stories] = await Promise.all([
    getPublicPrograms(),
    getPublicCampaigns(),
    getPublicStories(),
  ]);
  const featuredCampaign = campaigns[0]!;
  const otherCampaigns = campaigns.slice(1);
  const featuredStory = stories[0]!;

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden bg-ink text-bone">
        <div className="woven-dark pointer-events-none absolute inset-0 opacity-45" aria-hidden="true" />
        <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(169,74,46,0.28),transparent_65%)] blur-3xl"
          aria-hidden="true"
        />

        <div className="wrap relative z-10 grid items-center gap-10 pb-16 pt-12 md:pb-24 md:pt-16 lg:grid-cols-[1.12fr_0.88fr] lg:gap-6">
          <div>
            <p className="eyebrow flex items-center gap-3 text-ochre">
              <span className="h-px w-8 bg-ochre/60" aria-hidden="true" />
              Nairobi, Kenya · Community foundation
            </p>

            <h1 className="display mt-6 max-w-[15ch] text-bone">
              Dignity is not a favour.
              <span className="mt-1 block text-ochre">It is a foundation.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-bone/70 md:text-lg">
              BBVF supports vulnerable children, older persons, persons with
              disabilities and amputee veterans across Nairobi — with school
              support, care outreach, assistive devices and pathways back to
              independence.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/donate"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-clay px-7 py-4 text-sm font-semibold text-paper transition-all duration-300 hover:bg-clay-dark hover:shadow-[0_16px_40px_-18px_rgba(169,74,46,0.9)]"
              >
                Donate or pledge support
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/programs"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-bone/25 px-7 py-4 text-sm font-semibold text-bone transition-colors hover:border-bone/60 hover:bg-bone/[0.06]"
              >
                Explore our programmes
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <dl className="mt-11 grid max-w-lg grid-cols-3 gap-4 border-t border-bone/15 pt-6">
              {[
                { k: "4", l: "Focus areas" },
                { k: "4", l: "Active campaigns" },
                { k: "Nairobi", l: "County, Kenya" },
              ].map((item) => (
                <div key={item.l}>
                  <dt className="sr-only">{item.l}</dt>
                  <dd>
                    <span className="block font-display text-2xl text-bone">
                      {item.k}
                    </span>
                    <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.14em] text-bone/60">
                      {item.l}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative hidden lg:block">
            <HeroOrbit />
            <div className="pointer-events-none absolute inset-x-2 bottom-1 flex justify-between text-[0.6rem] uppercase tracking-[0.16em] text-bone/60">
              <span>Children</span>
              <span>Older persons</span>
              <span>Disability</span>
              <span>Veterans</span>
            </div>
          </div>
        </div>

        {/* textile strip */}
        <div className="relative z-10 overflow-hidden border-y border-bone/10 bg-bone/[0.03]" aria-hidden="true">
          <div className="marquee py-3">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {programs.map((program) => (
                  <span
                    key={`${copy}-${program.slug}`}
                    className="flex items-center gap-6 whitespace-nowrap px-6 text-[0.66rem] uppercase tracking-[0.22em] text-bone/60"
                  >
                    <span className="h-1 w-1 rounded-full bg-ochre/70" />
                    {program.title}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- purpose */}
      <section className="section relative">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-clay">Why BBVF exists</p>
              <h2 className="display-sm mt-4 text-ink">
                Care that is specific enough to be useful.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-ink/70">
                A mattress. A prosthetic fitting. A school uniform. A visit on a
                quiet afternoon. Vulnerability is rarely abstract, and neither is
                the response.
              </p>
              <Link
                href="/about"
                className="group mt-7 inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
              >
                About the foundation
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <div className="space-y-6">
                <p className="font-display text-[1.5rem] leading-[1.45] text-ink/85 md:text-[1.75rem]">
                  BBVF works where vulnerability has a name, a household and a
                  specific missing thing — and stays long enough to see whether
                  that thing made a difference.
                </p>
                <div className="rule" />
                <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {programs.map((program, index) => (
                    <div key={program.slug} className="flex gap-3">
                      <span className="mt-1 font-display text-xs text-clay">
                        0{index + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-ink">
                          {program.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-ink/65">
                          {program.beneficiaryGroup}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ programs */}
      <section className="section border-t border-ink/10 bg-bone/60">
        <div className="wrap">
          <Reveal>
            <SectionHeading
              eyebrow="Programs"
              title="Four groups. One standard of care."
              description="Each programme has a distinct beneficiary group and a distinct barrier to remove. Support is agreed with the people closest to the need, then followed up."
              action={{ label: "All programmes", href: "/programs" }}
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:gap-6">
            {programs.map((program, index) => (
              <Reveal key={program.slug} delay={index * 80}>
                <ProgramCard program={program} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- campaigns */}
      <section className="section border-t border-ink/10">
        <div className="wrap">
          <Reveal>
            <SectionHeading
              eyebrow="Active campaigns"
              title="Fund a specific need, not a vague promise."
              description="Published targets and the received amounts displayed on BBVF's public campaign pages. We label snapshots by date and never invent a total."
              action={{ label: "All campaigns", href: "/campaigns" }}
            />
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <Reveal>
              <div className="h-full">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
                  <span className="text-[0.62rem] uppercase tracking-[0.2em] text-ink/65">
                    Featured appeal
                  </span>
                </div>
                <CampaignCard campaign={featuredCampaign} featured />
              </div>
            </Reveal>

            <div className="space-y-5">
              {otherCampaigns.map((campaign, index) => (
                <Reveal key={campaign.slug} delay={index * 80}>
                  <CampaignCard campaign={campaign} />
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal>
            <div className="mt-8">
              <PendingNote title="How these figures work">
                Campaign targets and received amounts are as displayed on BBVF&rsquo;s
                public Our Jamii profile on 21 November 2026. They are a dated
                snapshot, not a live bank ledger. Pending, committed and disbursed
                balances will only be published once BBVF&rsquo;s finance records
                have been reconciled.
              </PendingNote>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- impact */}
      <section className="relative overflow-hidden bg-ink text-bone">
        <div className="woven-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="wrap relative z-10 section">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-ochre">Evidence, not decoration</p>
              <h2 className="display-sm mt-4 text-bone">
                We publish what we can prove.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-bone/70">
                BBVF is early in its reporting practice. Instead of filling the
                page with impressive numbers, we show the dated figures we
                actually have — and name what is still being reconciled.
              </p>
              <Link
                href="/impact"
                className="group mt-7 inline-flex items-center gap-2 border-b border-bone/25 pb-1 text-sm font-semibold text-bone transition-colors hover:border-ochre hover:text-ochre"
              >
                How we report impact
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
                {impact.reported.map((metric) => (
                  <div key={metric.label} className="border-t border-bone/15 pt-4">
                    <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-bone/60">
                      {metric.label}
                    </dt>
                    <dd className="mt-2 font-display text-[1.65rem] leading-none text-bone md:text-[2rem]">
                      {metric.value}
                    </dd>
                    <p className="mt-2 text-[0.68rem] leading-relaxed text-bone/60">
                      {metric.period}
                    </p>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                <PendingNote tone="dark" title="What is deliberately missing">
                  Beneficiaries reached, devices delivered, school-retention
                  outcomes and disbursed funds are not shown because they have not
                  yet been reconciled. See the impact page for each item&rsquo;s
                  reason and status.
                </PendingNote>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- story */}
      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">From the field</p>
              <p className="mt-6 font-display text-3xl leading-tight text-ink md:text-4xl">
                &ldquo;What happens next matters more than the delivery photograph we
                have chosen not to publish.&rdquo;
              </p>
              <p className="mt-5 text-xs text-ink/65">
                From the November 2026 field update
              </p>
              <Link
                href="/stories"
                className="group mt-8 inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
              >
                All updates
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <article className="card overflow-hidden">
                <div className="woven relative flex h-40 items-end bg-ink/[0.04] p-6 md:h-48">
                  <div className="absolute right-5 top-5 text-clay/25">
                    <Spark className="h-16 w-16" />
                  </div>
                  <span className="rounded-full border border-ink/15 bg-paper px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink/65">
                    Field update
                  </span>
                </div>
                <div className="p-6 md:p-8">
                  <p className="text-[0.68rem] text-ink/65">
                    {formatDate(featuredStory.publishedOn)} ·{" "}
                    {featuredStory.readingMinutes} min read
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-tight text-ink md:text-[1.75rem]">
                    <Link href={`/stories/${featuredStory.slug}`} className="hover:text-clay">
                      {featuredStory.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    {featuredStory.excerpt}
                  </p>
                  <Link
                    href={`/stories/${featuredStory.slug}`}
                    className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-clay"
                  >
                    Read the update
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- get involved */}
      <section className="section border-t border-ink/10 bg-bone/60">
        <div className="wrap">
          <Reveal>
            <SectionHeading
              eyebrow="Get involved"
              title="Not everyone gives money. Everyone can give something."
              description="Time, skills, transport, supplies and influence all move the work forward. Every offer is reviewed against what partner homes actually need."
              action={{ label: "Ways to help", href: "/get-involved" }}
            />
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {getInvolved.map((item, index) => (
              <Reveal key={item.title} delay={index * 90}>
                <TiltCard intensity={5}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)] md:p-7"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-clay/[0.08] text-clay">
                      {index === 0 ? (
                        <Heart className="h-5 w-5" />
                      ) : index === 1 ? (
                        <Shield className="h-5 w-5" />
                      ) : (
                        <Spark className="h-5 w-5" />
                      )}
                    </span>
                    <h3 className="mt-5 font-display text-2xl text-ink">{item.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                      {item.body}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-clay">
                      {item.label}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- trust */}
      <section className="section border-t border-ink/10">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">Trust & accountability</p>
              <h2 className="display-sm mt-4 text-ink">
                The uncomfortable questions, answered early.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-ink/70">
                A serious donor or grant officer will ask who is accountable, what
                is registered, where the money goes and how a concern is raised.
                Here is the honest position on each, including what is still
                pending.
              </p>
              <Link
                href="/transparency"
                className="group mt-7 inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
              >
                Visit the transparency hub
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>

            <Reveal delay={100}>
              <dl className="divide-y divide-ink/10 border-y border-ink/10">
                {[
                  {
                    q: "Legal registration",
                    a: "Being confirmed with counsel under Kenya's PBO framework. No number is published until verified.",
                    href: "/about/governance",
                  },
                  {
                    q: "Leadership & board",
                    a: "Profiles are being prepared with each person's written consent. No invented names.",
                    href: "/about/leadership",
                  },
                  {
                    q: "Journals & accounts",
                    a: "No audited statements have been supplied yet. The reports page states this plainly.",
                    href: "/impact/reports",
                  },
                  {
                    q: "Safeguarding & complaints",
                    a: "A separate, visible reporting route for concerns involving a vulnerable person.",
                    href: "/safeguarding",
                  },
                  {
                    q: "Data protection",
                    a: "ODPC registration in progress. Granular consent, minimisation and a 72-hour breach workflow.",
                    href: "/policies/privacy",
                  },
                ].map((row) => (
                  <div key={row.q} className="grid gap-2 py-4 sm:grid-cols-[0.8fr_1.2fr] sm:gap-6">
                    <dt className="text-sm font-semibold text-ink">{row.q}</dt>
                    <dd className="text-sm leading-relaxed text-ink/70">
                      {row.a}{" "}
                      <Link
                        href={row.href}
                        className="whitespace-nowrap text-clay underline decoration-clay/30 underline-offset-2 hover:decoration-clay"
                      >
                        Details
                      </Link>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- closing */}
      <section className="relative overflow-hidden bg-clay text-paper">
        <div className="grain pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="wrap relative z-10 py-16 md:py-20">
          <div className="grid items-end gap-8 md:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="eyebrow text-paper/70">Stand with BBVF</p>
              <h2 className="display-sm mt-4 max-w-2xl text-paper">
                A dignified response starts with knowing exactly what is needed.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-paper/80">
                Give through a verified channel, offer a skill, or tell us about a
                need we should understand. Every route reaches a named person.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/donate"
                className="group inline-flex items-center justify-between gap-3 rounded-full bg-paper px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-bone"
              >
                Donate or pledge
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-between gap-3 rounded-full border border-paper/40 px-6 py-4 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
              >
                Contact the team
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <p className="mt-10 max-w-3xl border-t border-paper/25 pt-5 text-[0.68rem] leading-relaxed text-paper/80">
            {site.contact.whatsappPolicy}
          </p>
        </div>
      </section>
    </>
  );
}
