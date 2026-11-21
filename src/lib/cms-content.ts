/**
 * Public content from the CMS.
 *
 * The site ships reviewed editorial content in `src/content/*`. When staff
 * publish a row in Supabase, that row overrides the built-in copy by slug (or
 * by question for FAQs) and appears on the public pages within the revalidation
 * window. If Supabase is not configured, or nothing is published yet, the
 * reviewed static content is used unchanged.
 *
 * Server-only: this module imports the service-role REST helper and must never
 * be imported from a client component.
 */

import { publicSelect } from "@/lib/rest";
import { faqs as staticFaqs, type Faq } from "@/content/faqs";
import {
  policies as staticPolicies,
  type Policy,
  type PolicySection,
} from "@/content/policies";

/** Pages using this data revalidate every five minutes. */
export const CMS_REVALIDATE_SECONDS = 300;

const FAQ_CATEGORIES: readonly Faq["category"][] = [
  "Giving",
  "Programs",
  "Trust",
  "Privacy",
  "Volunteering",
];

function mapFaqCategory(value: unknown): Faq["category"] {
  const match = FAQ_CATEGORIES.find(
    (category) => category.toLowerCase() === String(value ?? "").toLowerCase(),
  );
  return match ?? "Trust";
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
