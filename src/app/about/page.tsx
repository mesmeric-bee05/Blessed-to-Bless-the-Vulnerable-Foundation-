import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "About BBVF",
  description:
    "Who BBVF is, how it works with vulnerable children, older persons, persons with disabilities and amputee veterans in Nairobi, and what it is still verifying before launch.",
  path: "/about",
});

const values = [
  {
    title: "Dignity first",
    body: "People are not case studies. Consent, privacy and the right to say no come before any photograph, quote or fundraising story.",
  },
  {
    title: "Specific, not sentimental",
    body: "We describe the actual missing thing — a mattress, a fitting, a uniform — and avoid language that turns poverty into spectacle.",
  },
  {
    title: "Evidence over impression",
    body: "Every published number has a source, a date and an owner. Where we do not have one, the page says so.",
  },
  {
    title: "Follow-through",
    body: "A delivery is the beginning of a relationship, not the end of a campaign. We check whether the support actually held.",
  },
];

const approach = [
  {
    step: "01",
    title: "Identify",
    body: "A family, care home, rehabilitation partner or county officer raises a specific need. We do not select people from a crowd.",
  },
  {
    step: "02",
    title: "Agree",
    body: "The need and the response are agreed with the people closest to it — the home's leadership, the family, the clinician.",
  },
  {
    step: "03",
    title: "Supply",
    body: "We buy or collect exactly what was agreed, record what was delivered, and keep the receipt trail for reconciliation.",
  },
  {
    step: "04",
    title: "Follow up",
    body: "We return. We ask whether the child stayed in school, the device fits, the older person is safer. Then we report.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the foundation"
        title="A Nairobi foundation built around four specific groups of people."
        intro={
          <p>
            Blessed to Bless the Vulnerable Foundation (BBVF) is a community
            organisation working in Nairobi, Kenya. We support vulnerable
            children, older persons, persons with disabilities and amputee
            veterans — not as a broad gesture, but through named, agreed needs.
          </p>
        }
        meta={<span>Last reviewed 21 November 2026</span>}
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-clay">Mission & vision</p>
              <h2 className="display-sm mt-4 text-ink">
                Restore dignity. Create opportunity. Stay accountable.
              </h2>
              <div className="mt-6">
                <PendingNote title="Working statement — pending board approval">
                  The wording below is a synthesis of BBVF&rsquo;s supplied
                  programme material and public campaign narratives. It is
                  published as a working statement until the board approves a
                  final mission, vision and values text.
                </PendingNote>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/65">
                    Mission
                  </h3>
                  <p className="mt-3 font-display text-[1.6rem] leading-[1.4] text-ink/90">
                    To restore dignity and create opportunity for vulnerable
                    children, older persons, persons with disabilities and amputee
                    veterans in Kenya through practical support, respectful
                    partnership and honest reporting.
                  </p>
                </div>
                <div className="rule" />
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/65">
                    Vision
                  </h3>
                  <p className="mt-3 font-display text-[1.4rem] leading-[1.45] text-ink/85">
                    Communities where a child stays in school, an older person is
                    not left alone, a wheelchair is not a barrier, and a veteran
                    can rebuild a life with dignity.
                  </p>
                </div>
                <div className="rule" />
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/65">
                    Where we work
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">
                    Nairobi County, with documented outreach along the Eastern
                    Bypass corridor and at Spirit of Mercy Children&rsquo;s Home in
                    Kamae, Kahawa West.{" "}
                    <Link href="/where-we-work" className="text-clay underline underline-offset-4">
                      See service areas
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section border-t border-ink/10 bg-bone/60">
        <div className="wrap">
          <Reveal>
            <SectionHeading
              eyebrow="How we work"
              title="Four steps, repeated honestly."
              description="The method is intentionally unglamorous. It is also what makes a small organisation trustworthy."
            />
          </Reveal>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((item, index) => (
              <Reveal key={item.step} delay={index * 80}>
                <li className="flex h-full flex-col rounded-[var(--radius-card)] border border-ink/10 bg-paper p-6">
                  <span className="font-display text-sm text-clay">{item.step}</span>
                  <h3 className="mt-4 font-display text-xl text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-ink/10">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-clay">What we hold to</p>
              <h2 className="display-sm mt-4 text-ink">Values with teeth.</h2>
              <p className="mt-5 text-sm leading-relaxed text-ink/70">
                These are not poster slogans. Each one changes a decision we make
                about content, money or people.
              </p>
            </Reveal>
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {values.map((value, index) => (
                <Reveal key={value.title} delay={index * 70}>
                  <div className="border-t border-ink/15 pt-4">
                    <h3 className="font-display text-xl text-ink">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">
                      {value.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-ink/10 bg-ink text-bone">
        <div className="wrap">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="eyebrow text-ochre">Accountability</p>
              <h2 className="display-sm mt-4 max-w-2xl text-bone">
                See who is responsible, and what is still being verified.
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/about/governance"
                className="flex items-center justify-between rounded-full bg-ochre px-5 py-3.5 text-sm font-semibold text-ink"
              >
                Governance & registration
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about/leadership"
                className="flex items-center justify-between rounded-full border border-bone/25 px-5 py-3.5 text-sm font-semibold text-bone hover:bg-bone/[0.06]"
              >
                Leadership
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap max-w-3xl">
          <p className="eyebrow text-clay">Contact</p>
          <h2 className="display-sm mt-4 text-ink">Speak to a person.</h2>
          <p className="mt-5 text-sm leading-relaxed text-ink/65">
            {site.contact.phone
              ? `Call ${site.contact.phone}.`
              : "BBVF's dedicated phone, email and office details are being verified before publication, so they are not shown here yet. The contact form reaches the project team now and gives you a reference for your message."}
          </p>
          <Link
            href="/contact"
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-bone hover:bg-ink-3"
          >
            Use the contact form
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
