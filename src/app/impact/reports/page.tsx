import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { PendingNote } from "@/components/ui/PendingNote";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArrowUpRight, Lock } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "Reports & downloads",
  description:
    "BBVF's reports, financial summaries and governance documents — published as accessible HTML with downloads once available, and clearly marked while pending.",
  path: "/impact/reports",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Impact", path: "/impact" },
  { name: "Reports", path: "/impact/reports" },
];

const documents = [
  {
    title: "Annual impact report",
    status: "Pending",
    detail:
      "Will cover the reporting period, programme outputs, methodology, financial summary and safeguarding summary, as an accessible HTML page with a PDF download.",
  },
  {
    title: "Audited or independently reviewed financial statements",
    status: "Not supplied",
    detail:
      "No statements have been provided to the project team. When supplied, they will be published with a plain-language summary and a note on who reviewed them.",
  },
  {
    title: "Campaign budget and allocation statement",
    status: "Pending",
    detail:
      "An itemised breakdown per campaign, reconciled against received funds. BBVF has not yet approved a budget for publication.",
  },
  {
    title: "Safeguarding policy",
    status: "Draft",
    detail:
      "A public summary is available now on the safeguarding page. The full policy is being finalised before publication.",
  },
  {
    title: "Governance and registration documents",
    status: "Pending",
    detail:
      "Registration certificate and constitutional documents will be published after BBVF&rsquo;s legal status is verified by counsel.",
  },
  {
    title: "Monitoring, evaluation and learning framework",
    status: "Pending",
    detail:
      "The MEL framework will define how outputs and outcomes are measured before results are reported, not after.",
  },
];

const statusTone: Record<string, string> = {
  Pending: "border-ochre/40 bg-ochre/[0.12] text-ink/70",
  "Not supplied": "border-clay/30 bg-clay/[0.07] text-clay-dark",
  Draft: "border-ink/15 bg-ink/[0.04] text-ink/70",
};

export default function ReportsPage() {
  return (
    <>
      <div className="wrap pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PageHero
        eyebrow="Reports & downloads"
        title="Documents, with their real status."
        intro={
          <p>
            BBVF will publish its annual report, financial summaries and governance
            documents here. Until a document exists and has been approved, the
            entry below states that plainly rather than offering a broken download
            or a template filled with invention.
          </p>
        }
        meta={<span>Last reviewed 21 November 2026</span>}
      />

      <section className="section">
        <div className="wrap max-w-4xl">
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {documents.map((doc, index) => (
              <Reveal key={doc.title} delay={index * 60}>
                <div className="grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div>
                    <h2 className="font-display text-xl leading-tight text-ink">
                      {doc.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
                      {doc.detail}
                    </p>
                  </div>
                  <span
                    className={`inline-flex h-fit whitespace-nowrap rounded-full border px-3 py-1 text-[0.62rem] font-medium ${
                      statusTone[doc.status] ?? "border-ink/15 text-ink/65"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <PendingNote title="Accessible by default">
                Published reports will have an HTML version as well as a download.
                A PDF alone is not accessible to every reader, and it is harder to
                cite, search and verify.
              </PendingNote>
              <PendingNote title="Request a document">
                Institutional funders who need a specific document for due
                diligence can{" "}
                <Link href="/investors" className="text-clay underline underline-offset-2">
                  request access
                </Link>{" "}
                to the gated pack. We will confirm what exists and what does not.
              </PendingNote>
            </div>
          </Reveal>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
