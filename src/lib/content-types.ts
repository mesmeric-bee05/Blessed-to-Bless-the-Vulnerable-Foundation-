/**
 * The content types the admin CMS may edit.
 *
 * Deliberately a closed list: a table name from the browser is never used
 * directly in a query. Each entry names the columns the editor exposes and the
 * approval rule that applies before a row can be published.
 */

export type ContentTypeKey = "programs" | "campaigns" | "stories" | "faqs" | "policies";

export type ContentType = {
  key: ContentTypeKey;
  table: string;
  label: string;
  /** Primary text column. */
  titleField: "title" | "question";
  /** Short summary column, or the answer for FAQs, or a story's excerpt. */
  summaryField: "summary" | "answer" | "excerpt";
  /** Optional long-form column. */
  bodyField: "body_md" | "story_md" | null;
  bodyLabel?: string;
  /** Publishing requires approved_by/approved_at to be set. */
  requiresApproval: boolean;
  /** Policies additionally require a recorded legal review. */
  requiresLegalReview?: boolean;
};

export const contentTypes: Record<ContentTypeKey, ContentType> = {
  programs: {
    key: "programs",
    table: "programs",
    label: "Programs",
    titleField: "title",
    summaryField: "summary",
    bodyField: "body_md",
    bodyLabel: "Programme detail (Markdown)",
    requiresApproval: true,
  },
  campaigns: {
    key: "campaigns",
    table: "campaigns",
    label: "Campaigns",
    titleField: "title",
    summaryField: "summary",
    bodyField: "story_md",
    bodyLabel: "Campaign narrative (Markdown)",
    requiresApproval: true,
  },
  stories: {
    key: "stories",
    table: "stories",
    label: "Stories",
    titleField: "title",
    summaryField: "excerpt",
    bodyField: "body_md",
    requiresApproval: true,
  },
  faqs: {
    key: "faqs",
    table: "faqs",
    label: "FAQs",
    titleField: "question",
    summaryField: "answer",
    bodyField: null,
    requiresApproval: false,
  },
  policies: {
    key: "policies",
    table: "policies",
    label: "Policies",
    titleField: "title",
    summaryField: "summary",
    bodyField: "body_md",
    bodyLabel: "Policy text (Markdown)",
    requiresApproval: true,
    requiresLegalReview: true,
  },
};

export function isContentTypeKey(value: string): value is ContentTypeKey {
  return Object.prototype.hasOwnProperty.call(contentTypes, value);
}

export const CONTENT_STATUSES = [
  "draft",
  "needs_review",
  "approved",
  "published",
  "archived",
  "rejected",
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export function isContentStatus(value: string): value is ContentStatus {
  return (CONTENT_STATUSES as readonly string[]).includes(value);
}
