import { z } from "zod";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[0-9+()\-\s]{7,32}$/;

const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Email address is too long")
  .regex(EMAIL, "Enter a valid email address");

const name = z
  .string()
  .trim()
  .min(2, "Please enter your name")
  .max(120, "Name is too long");

const message = z
  .string()
  .trim()
  .min(20, "Please give us at least a sentence or two")
  .max(4000, "Message is too long (4,000 characters maximum)");

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value === "" ? undefined : value));

const base = z.object({
  fullName: optionalText(120),
  email: z
    .string()
    .trim()
    .max(254)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  phone: optionalText(32),
  organisation: optionalText(160),
  message: optionalText(4000),
  topic: optionalText(80),
  amountBand: optionalText(40),
  method: optionalText(40),
  consent: z.boolean().optional(),
  // Submission-hardening fields (never rendered).
  website: z.string().max(0).optional(),
  startedAt: z.number().int().positive().optional(),
  sourcePage: optionalText(200),
  policyVersion: optionalText(20),
});

export type FormKind =
  | "contact"
  | "volunteer"
  | "partner"
  | "institutional"
  | "donation-notify"
  | "safeguarding"
  | "accessibility"
  | "newsletter";

type FormConfig = {
  table: string;
  schema: z.ZodType<Record<string, unknown>>;
  /** Column that receives the free-text body, for audit clarity. */
  messageColumn: "message" | null;
};

const consent = z.literal(true, {
  message: "Please confirm you have read the privacy notice",
});

export const formConfig: Record<FormKind, FormConfig> = {
  contact: {
    table: "contact_submissions",
    messageColumn: "message",
    schema: base.extend({
      fullName: name,
      email: email,
      message,
      consent,
    }),
  },
  volunteer: {
    table: "volunteer_applications",
    messageColumn: "message",
    schema: base.extend({
      fullName: name,
      email: email,
      phone: z
        .string()
        .trim()
        .regex(PHONE, "Enter a valid phone number")
        .optional()
        .or(z.literal("")),
      message,
      consent,
    }),
  },
  partner: {
    table: "partnership_inquiries",
    messageColumn: "message",
    schema: base.extend({
      fullName: name,
      email: email,
      organisation: z
        .string()
        .trim()
        .min(2, "Please tell us the name of your organisation")
        .max(160),
      message,
      consent,
    }),
  },
  institutional: {
    table: "institutional_inquiries",
    messageColumn: "message",
    schema: base.extend({
      fullName: name,
      email: email,
      organisation: z.string().trim().min(2).max(160),
      amountBand: optionalText(40),
      message,
      consent,
    }),
  },
  "donation-notify": {
    table: "donation_intents",
    messageColumn: "message",
    schema: base.extend({
      fullName: name,
      email: email,
      amountBand: z.string().trim().min(1).max(40),
      method: z.string().trim().min(1).max(40),
      message: optionalText(1000),
      consent,
    }),
  },
  safeguarding: {
    table: "safeguarding_reports",
    messageColumn: "message",
    schema: base.extend({
      fullName: optionalText(120),
      email: z
        .string()
        .trim()
        .max(254)
        .optional()
        .transform((v) => (v === "" ? undefined : v)),
      message: z
        .string()
        .trim()
        .min(20, "Please describe the concern")
        .max(4000),
      consent: z.boolean().optional(),
    }),
  },
  accessibility: {
    table: "contact_submissions",
    messageColumn: "message",
    schema: base.extend({
      fullName: name,
      email: email,
      message,
      topic: z.literal("Accessibility"),
      consent,
    }),
  },
  newsletter: {
    table: "newsletter_subscribers",
    messageColumn: null,
    schema: z.object({
      email,
      consent,
      website: z.string().max(0).optional(),
      startedAt: z.number().int().positive().optional(),
      sourcePage: optionalText(200),
      policyVersion: optionalText(20),
    }),
  },
};

export function isFormKind(value: string): value is FormKind {
  return Object.prototype.hasOwnProperty.call(formConfig, value);
}

export type ParseResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; fields: Record<string, string> };

export function parseSubmission(
  kind: FormKind,
  input: unknown,
): ParseResult {
  const result = formConfig[kind].schema.safeParse(input);
  if (result.success) return { ok: true, data: result.data as Record<string, unknown> };

  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fields[key]) fields[key] = issue.message;
  }
  return { ok: false, fields };
}
