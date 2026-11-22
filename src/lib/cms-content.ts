/**
 * Public content from the CMS.
 *
 * The site ships reviewed editorial content in `src/content/*`. When staff
 * publish a row in Supabase, that row overrides the built-in copy by slug (or
 * by question for FAQs) and appears on the public pages within the revalidation
 * window. If Supabase is not configured, or nothing is published yet, the
 * reviewed static content is used unchanged.
 *
 * Server-only: this module must never be imported from a client component. It
 * reads with the publishable key, so RLS decides what is visible.
 */

import { publicSelect } from "@/lib/rest";
import { faqs as staticFaqs, type Faq } from "@/content/faqs";
import {
  policies as staticPolicies,
  type Policy,
  type PolicySection,
} from "@/content/policies";
import { programs as staticPrograms, type Program } from "@/content/programs";
import {
  campaigns as staticCampaigns,
  type Campaign,
  type CampaignStatus,
} from "@/content/campaigns";
import { stories as staticStories, type Story } from "@/content/stories";

/** Pages using this data revalidate every five minutes. */
export const CMS_REVALIDATE_SECONDS = 300;

const FAQ_CATEGORIES: readonly Faq["category"][] = [
  "Giving",
  "Programs",
  "Trust",
  "Privacy",
  "Volunteering",
];

const PROGRAM_STATUSES = ["active", "fundraising", "planned"] as const;
const CAMPAIGN_STATES: readonly CampaignStatus[] = [
  "active",
  "completed",
  "upcoming",
];
const STORY_KINDS: readonly Story["kind"][] = [
  "field-update",
  "explainer",
  "announcement",
];

function mapFaqCategory(value: unknown): Faq["category"] {
  const match = FAQ_CATEGORIES.find(
    (category) => category.toLowerCase() === String(value ?? "").toLowerCase(),
  );
  return match ?? "Trust";
}

function mapProgramStatus(
  value: unknown,
  fallback: Program["status"],
): Program["status"] {
  return (PROGRAM_STATUSES as readonly string[]).includes(String(value))
    ? (value as Program["status"])
    : fallback;
}

function mapCampaignState(
  value: unknown,
  fallback: CampaignStatus,
): CampaignStatus {
  return (CAMPAIGN_STATES as readonly string[]).includes(String(value))
    ? (value as CampaignStatus)
    : fallback;
}

function mapStoryKind(value: unknown, fallback: Story["kind"]): Story["kind"] {
  return (STORY_KINDS as readonly string[]).includes(String(value))
    ? (value as Story["kind"])
    : fallback;
}

/** Split a Markdown body into plain paragraphs; headings are dropped. */
function toStringParagraphs(markdown: string | null | undefined): string[] {
  if (!markdown) return [];
  return markdown
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim().replace(/^#{1,3}\s+/, ""))
    .filter(Boolean);
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function readingMinutes(paragraphs: string[]): number {
  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getPublicFaqs(): Promise<Faq[]> {
  const rows = await publicSelect<{
    question: string;
    answer: string;
    category: string;
    sort_order: number;
  }>(
    "faqs",
    "select=question,answer,category,sort_order&status=eq.published&order=sort_order.asc",
  );

  if (rows.length === 0) return staticFaqs;

  const byQuestion = new Map(staticFaqs.map((faq) => [faq.question, faq]));
  for (const row of rows) {
    byQuestion.set(row.question, {
      question: row.question,
      answer: row.answer,
      category: mapFaqCategory(row.category),
    });
  }
  return [...byQuestion.values()];
}

/**
 * A small Markdown reader for policy bodies: `## Heading`, `- item` lists and
 * blank-line separated paragraphs. Deliberately not a full Markdown engine —
 * policy text is plain prose, and rendering raw HTML from the database would
 * create an injection path.
 */
export function parsePolicyBody(markdown: string): PolicySection[] {
  const sections: PolicySection[] = [];
  const paragraphs: string[] = [];
  const list: string[] = [];
  let heading = "Policy";
  let buffer: string[] = [];

  const flushParagraph = () => {
    const text = buffer.join(" ").trim();
    if (text) paragraphs.push(text);
    buffer = [];
  };

  const flushSection = () => {
    flushParagraph();
    if (paragraphs.length > 0 || list.length > 0) {
      sections.push({
        heading,
        paragraphs: paragraphs.length > 0 ? [...paragraphs] : undefined,
        list: list.length > 0 ? [...list] : undefined,
      });
    }
    paragraphs.length = 0;
    list.length = 0;
  };

  for (const raw of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      flushSection();
      heading = line.slice(3).trim() || "Policy";
      continue;
    }
    if (line.startsWith("# ")) continue;
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }
    if (line === "") {
      flushParagraph();
      continue;
    }
    buffer.push(line);
  }
  flushSection();

  if (sections.length === 0) {
    sections.push({
      heading: "Policy",
      paragraphs: [markdown.trim() || "This policy has no published text yet."],
    });
  }
  return sections;
}

export async function getPublicPolicies(): Promise<Policy[]> {
  const rows = await publicSelect<{
    slug: string;
    title: string;
    summary: string;
    body_md: string | null;
    updated_at: string | null;
  }>(
    "policies",
    "select=slug,title,summary,body_md,updated_at&status=eq.published&legal_reviewed=is.true&order=updated_at.desc",
  );

  if (rows.length === 0) return staticPolicies;

  const merged = new Map(staticPolicies.map((policy) => [policy.slug, policy]));
  for (const row of rows) {
    merged.set(row.slug, {
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      updated: row.updated_at ? row.updated_at.slice(0, 10) : "2026-11-21",
      status: "published",
      sections: parsePolicyBody(row.body_md ?? ""),
    });
  }
  return [...merged.values()];
}

type ProgramRow = {
  id: string;
  slug: string;
  title: string;
  beneficiary_group: string;
  summary: string;
  body_md: string | null;
  delivery_status: string;
  geography: string[] | null;
  safeguarding_note: string | null;
  source_note: string;
  review_date: string | null;
};

type ActivityRow = {
  program_id: string;
  label: string;
  detail: string;
  delivery_status: string;
  sort_order: number;
};

export async function getPublicPrograms(): Promise<Program[]> {
  const [rows, activities] = await Promise.all([
    publicSelect<ProgramRow>(
      "programs",
      "select=id,slug,title,beneficiary_group,summary,body_md,delivery_status,geography,safeguarding_note,source_note,review_date&status=eq.published",
    ),
    publicSelect<ActivityRow>(
      "program_activities",
      "select=program_id,label,detail,delivery_status,sort_order&order=sort_order.asc",
    ),
  ]);

  if (rows.length === 0) return staticPrograms;

  const activitiesByProgram = new Map<string, Program["activities"]>();
  for (const activity of activities) {
    const list = activitiesByProgram.get(activity.program_id) ?? [];
    list.push({
      label: activity.label,
      detail: activity.detail,
      status: mapProgramStatus(activity.delivery_status, "active"),
    });
    activitiesByProgram.set(activity.program_id, list);
  }

  const merged = new Map(staticPrograms.map((program) => [program.slug, program]));
  const extras: Program[] = [];

  for (const row of rows) {
    const base = merged.get(row.slug);
    const mapped: Program = {
      slug: row.slug,
      title: row.title,
      beneficiaryGroup: row.beneficiary_group,
      summary: row.summary,
      status: mapProgramStatus(row.delivery_status, base?.status ?? "active"),
      glyph: base?.glyph ?? "child",
      intro:
        toStringParagraphs(row.body_md).length > 0
          ? toStringParagraphs(row.body_md)
          : (base?.intro ?? [row.summary]),
      activities:
        activitiesByProgram.get(row.id) ?? base?.activities ?? ([] as Program["activities"]),
      needs: base?.needs ?? [],
      geography: row.geography ?? base?.geography ?? [],
      safeguarding: row.safeguarding_note ?? base?.safeguarding ?? "",
      relatedCampaignSlug: base?.relatedCampaignSlug ?? "",
      sourceNote: row.source_note,
      lastReviewed: row.review_date ?? base?.lastReviewed ?? "2026-11-21",
    };

    if (base) {
      merged.set(row.slug, mapped);
    } else {
      extras.push(mapped);
    }
  }

  return [...merged.values(), ...extras];
}

export async function getPublicProgram(slug: string): Promise<Program | undefined> {
  const programs = await getPublicPrograms();
  return programs.find((program) => program.slug === slug);
}

type CampaignRow = {
  id: string;
  slug: string;
  title: string;
  short_title: string;
  program_id: string | null;
  beneficiary_group: string;
  state: string;
  summary: string;
  story_md: string | null;
  target_amount: number | string | null;
  received_amount: number | string | null;
  supporter_count: number | null;
  snapshot_date: string;
  snapshot_source: string;
  external_url: string | null;
};

export async function getPublicCampaigns(): Promise<Campaign[]> {
  const [rows, programRows] = await Promise.all([
    publicSelect<CampaignRow>(
      "campaigns",
      "select=id,slug,title,short_title,program_id,beneficiary_group,state,summary,story_md,target_amount,received_amount,supporter_count,snapshot_date,snapshot_source,external_url&status=eq.published",
    ),
    publicSelect<{ id: string; slug: string }>(
      "programs",
      "select=id,slug&status=eq.published",
    ),
  ]);

  if (rows.length === 0) return staticCampaigns;

  const programSlugById = new Map(programRows.map((row) => [row.id, row.slug]));
  const merged = new Map(staticCampaigns.map((campaign) => [campaign.slug, campaign]));
  const extras: Campaign[] = [];

  for (const row of rows) {
    const base = merged.get(row.slug);
    const mapped: Campaign = {
      slug: row.slug,
      title: row.title,
      shortTitle: row.short_title,
      programSlug:
        (row.program_id ? programSlugById.get(row.program_id) : undefined) ??
        base?.programSlug ??
        "",
      beneficiaryGroup: row.beneficiary_group,
      status: mapCampaignState(row.state, base?.status ?? "active"),
      summary: row.summary,
      story:
        toStringParagraphs(row.story_md).length > 0
          ? toStringParagraphs(row.story_md)
          : (base?.story ?? [row.summary]),
      target: toNumber(row.target_amount) ?? base?.target ?? null,
      received: toNumber(row.received_amount) ?? base?.received ?? null,
      supporters: toNumber(row.supporter_count) ?? base?.supporters ?? null,
      currency: "KES",
      reportedOn: row.snapshot_date ?? base?.reportedOn ?? "2026-11-21",
      reportNote: row.snapshot_source,
      whatItFunds: base?.whatItFunds ?? [],
      externalUrl:
        row.external_url ??
        base?.externalUrl ??
        "https://jamii.esoqo.com/o/blessed-to-bless-the-vulnerable-foundation",
      priority: base?.priority ?? merged.size + extras.length + 1,
    };

    if (base) {
      merged.set(row.slug, mapped);
    } else {
      extras.push(mapped);
    }
  }

  return [...merged.values(), ...extras];
}

export async function getPublicCampaign(slug: string): Promise<Campaign | undefined> {
  const campaigns = await getPublicCampaigns();
  return campaigns.find((campaign) => campaign.slug === slug);
}

type StoryRow = {
  id: string;
  slug: string;
  title: string;
  kind: string;
  excerpt: string;
  body_md: string;
  author_name: string;
  program_id: string | null;
  campaign_id: string | null;
  consent_note: string;
  published_at: string | null;
  updated_at: string | null;
};

export async function getPublicStories(): Promise<Story[]> {
  const [rows, programRows, campaignRows] = await Promise.all([
    publicSelect<StoryRow>(
      "stories",
      "select=id,slug,title,kind,excerpt,body_md,author_name,program_id,campaign_id,consent_note,published_at,updated_at&status=eq.published",
    ),
    publicSelect<{ id: string; slug: string }>(
      "programs",
      "select=id,slug&status=eq.published",
    ),
    publicSelect<{ id: string; slug: string }>(
      "campaigns",
      "select=id,slug&status=eq.published",
    ),
  ]);

  if (rows.length === 0) return staticStories;

  const programSlugById = new Map(programRows.map((row) => [row.id, row.slug]));
  const campaignSlugById = new Map(campaignRows.map((row) => [row.id, row.slug]));
  const merged = new Map(staticStories.map((story) => [story.slug, story]));
  const extras: Story[] = [];

  for (const row of rows) {
    const base = merged.get(row.slug);
    const body = toStringParagraphs(row.body_md);
    const mapped: Story = {
      slug: row.slug,
      title: row.title,
      kind: mapStoryKind(row.kind, base?.kind ?? "announcement"),
      publishedOn:
        (row.published_at ?? row.updated_at ?? "2026-11-21").slice(0, 10),
      author: row.author_name,
      readingMinutes: base?.readingMinutes ?? readingMinutes(body),
      excerpt: row.excerpt,
      body: body.length > 0 ? body : (base?.body ?? [row.excerpt]),
      relatedProgramSlug:
        (row.program_id ? programSlugById.get(row.program_id) : undefined) ??
        base?.relatedProgramSlug,
      relatedCampaignSlug:
        (row.campaign_id ? campaignSlugById.get(row.campaign_id) : undefined) ??
        base?.relatedCampaignSlug,
      consentNote: row.consent_note,
    };

    if (base) {
      merged.set(row.slug, mapped);
    } else {
      extras.push(mapped);
    }
  }

  return [...merged.values(), ...extras];
}

export async function getPublicStory(slug: string): Promise<Story | undefined> {
  const stories = await getPublicStories();
  return stories.find((story) => story.slug === slug);
}
