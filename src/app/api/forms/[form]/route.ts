import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import {
  formConfig,
  isFormKind,
  parseSubmission,
  type FormKind,
} from "@/lib/forms";
import { insertRow, isSupabaseConfigured } from "@/lib/supabase";
import { clientIp, hashIp, isSameOriginRequest } from "@/lib/request";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32_000;

const successMessages: Record<FormKind, string> = {
  contact:
    "Thank you — your message has been recorded. Our team will respond using the email address you gave.",
  volunteer:
    "Thank you for offering your time. We have recorded your interest and will follow up with the next steps and any vetting requirements.",
  partner:
    "Thank you — your partnership enquiry has been recorded. We will respond with a short scope and a named contact.",
  institutional:
    "Thank you — your institutional enquiry has been recorded. We will respond with due-diligence information through a verified channel.",
  "donation-notify":
    "Thank you — we have recorded your interest and will contact you when the giving route you selected is live and tested.",
  safeguarding:
    "Your concern has been recorded and routed to the safeguarding reviewer. If someone is in immediate danger, contact the Kenyan emergency services now.",
  accessibility:
    "Thank you — your accessibility report has been recorded. We aim to acknowledge these reports within five working days.",
  newsletter:
    "You are subscribed. We will only send updates, and every message will include an unsubscribe link.",
};

function reference(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `BBVF-${date}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

function noStore(body: unknown, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ form: string }> },
) {
  const { form } = await context.params;

  if (!isFormKind(form)) {
    return noStore({ ok: false, error: "Unknown form." }, 404);
  }

  if (!(await isSameOriginRequest())) {
    return noStore({ ok: false, error: "Request rejected." }, 403);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return noStore({ ok: false, error: "Submission is too large." }, 413);
  }

  const ip = await clientIp();
  const limit = rateLimit(`form:${form}:${ip}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.ok) {
    return noStore(
      {
        ok: false,
        error:
          "Too many submissions from this connection. Please try again in a few minutes.",
      },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return noStore({ ok: false, error: "Could not read the submission." }, 400);
  }

  if (text.length > MAX_BODY_BYTES) {
    return noStore({ ok: false, error: "Submission is too large." }, 413);
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return noStore({ ok: false, error: "Invalid submission." }, 400);
  }

  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    return noStore({ ok: false, error: "Invalid submission." }, 400);
  }

  const candidate = json as Record<string, unknown>;

  // Honeypot: a real person never fills a hidden field. Answer 201 so bots
  // cannot distinguish a silent rejection from success.
  if (typeof candidate.website === "string" && candidate.website.trim() !== "") {
    return noStore(
      { ok: true, reference: reference(), message: successMessages[form] },
      201,
    );
  }

  // Reject implausibly fast submissions (an automated fill) without blocking
  // keyboard users, who need at least a couple of seconds to type a message.
  if (typeof candidate.startedAt === "number") {
    const elapsed = Date.now() - candidate.startedAt;
    if (elapsed >= 0 && elapsed < 1200) {
      return noStore({ ok: false, error: "Please take a moment and try again." }, 400);
    }
  }

  const parsed = parseSubmission(form, candidate);
  if (!parsed.ok) {
    return noStore(
      { ok: false, error: "Please check the highlighted fields.", fields: parsed.fields },
      422,
    );
  }

  if (!isSupabaseConfigured()) {
    // Fail closed and say so. Never pretend a submission was stored.
    console.error(
      `[forms] ${form} submission rejected: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured`,
    );
    return noStore(
      {
        ok: false,
        error:
          "Our secure intake store is not connected in this environment, so your message was not saved. Please try again later, or contact us using the details on the contact page once they are published.",
      },
      503,
    );
  }

  const data = parsed.data;
  const ref = reference();
  const now = new Date().toISOString();
  const config = formConfig[form];

  const row: Record<string, unknown> = {
    reference: ref,
    source_page: data.sourcePage ?? null,
    policy_version: data.policyVersion ?? "2026-11-21",
    ip_hash: hashIp(ip),
    user_agent: (request.headers.get("user-agent") ?? "").slice(0, 300),
    consent: data.consent === true,
    consent_at: data.consent === true ? now : null,
  };

  if (config.messageColumn) {
    row.full_name = data.fullName ?? null;
    row.email = data.email ?? null;
    row.phone = data.phone ?? null;
    row.organisation = data.organisation ?? null;
    row.message = data.message ?? null;
    row.topic = data.topic ?? null;
    row.amount_band = data.amountBand ?? null;
    row.payment_method = data.method ?? null;
  } else {
    row.email = data.email ?? null;
  }

  const inserted = await insertRow(config.table, row);
  if (!inserted.ok) {
    console.error(`[forms] ${form} insert failed: ${inserted.reason}`);
    return noStore(
      {
        ok: false,
        error:
          "We could not record your message just now. Please try again in a few minutes.",
      },
      502,
    );
  }

  return noStore(
    { ok: true, reference: ref, message: successMessages[form] },
    201,
  );
}
