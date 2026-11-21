import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, hashIp, isSameOriginRequest } from "@/lib/request";
import { rateLimit } from "@/lib/rate-limit";
import { eq, isDbConfigured, dbInsert, dbSelect, dbUpdate } from "@/lib/rest";
import {
  createStripeCheckout,
  darajaStkPush,
  normalizeKenyanPhone,
  paymentRails,
  paymentReference,
  stripeConfigured,
} from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  amount: z.number().finite().positive(),
  method: z.enum(["mpesa", "card"]),
  email: z.string().trim().toLowerCase().max(254).regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
  name: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(32).optional(),
  campaignSlug: z.string().trim().max(80).optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
  startedAt: z.number().int().positive().optional(),
});

function noStore(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

export async function POST(request: Request) {
  if (!(await isSameOriginRequest())) {
    return noStore({ ok: false, error: "Request rejected." }, 403);
  }

  const ip = await clientIp();
  const limit = rateLimit(`donation:intent:${ip}`, { limit: 8, windowMs: 10 * 60 * 1000 });
  if (!limit.ok) {
    return noStore({ ok: false, error: "Too many attempts. Please wait a few minutes." }, 429);
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > 8_000) return noStore({ ok: false, error: "Request too large." }, 413);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return noStore({ ok: false, error: "Invalid request." }, 400);
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return noStore({ ok: false, error: "Please check the donation details." }, 422);
  }
  const data = parsed.data;

  if (data.website) {
    // Honeypot: accept silently so a bot cannot learn it was rejected.
    return noStore({ ok: true, reference: paymentReference() }, 201);
  }

  const rails = paymentRails();
  const railOpen = data.method === "mpesa" ? rails.mpesa : rails.card;
  if (!railOpen || !isDbConfigured()) {
    return noStore(
      {
        ok: false,
        error:
          "This giving route is not connected in this environment yet, so no payment was taken. Please use the verified Our Jamii route, or try again once the rail is live.",
      },
      503,
    );
  }

  const currency = data.method === "card" ? (process.env.CARD_CURRENCY ?? "USD") : "KES";
  const minAmount = data.method === "card" ? 5 : 10;
  const maxAmount = data.method === "card" ? 25_000 : 1_000_000;
  if (data.amount < minAmount || data.amount > maxAmount) {
    return noStore(
      {
        ok: false,
        error:
          data.method === "card"
            ? `Card gifts must be between ${minAmount} and ${maxAmount} ${currency}.`
            : `M-Pesa gifts must be between ${minAmount} and ${maxAmount} KES.`,
      },
      422,
    );
  }

  let phone: string | null = null;
  if (data.method === "mpesa") {
    const normalized = data.phone ? normalizeKenyanPhone(data.phone) : null;
    if (!normalized) {
      return noStore(
        { ok: false, error: "Enter a valid Safaricom number, for example 0712 345 678." },
        422,
      );
    }
    phone = normalized;
  }

  const reference = paymentReference();
  const campaign = data.campaignSlug
    ? (
        await dbSelect<{ id: string; title: string }>(
          "campaigns",
          `select=id,title&slug=${eq(data.campaignSlug)}&limit=1`,
        )
      )[0] ?? null
    : null;

  const inserted = await dbInsert<{ id: string }>("donations", {
    reference,
    campaign_id: campaign?.id ?? null,
    donor_name: data.name?.slice(0, 120) ?? null,
    donor_email: data.email,
    amount: data.amount,
    currency,
    state: "initiated",
    provider: data.method === "mpesa" ? "mpesa" : "stripe",
    is_anonymous: false,
    marketing_consent: false,
    notes: `ip_hash:${hashIp(ip)}`,
  });
  if (!inserted) {
    return noStore({ ok: false, error: "We could not start the donation just now." }, 502);
  }

  if (data.method === "mpesa") {
    if (!phone) {
      return noStore({ ok: false, error: "Enter a valid Safaricom number." }, 422);
    }
    const result = await darajaStkPush({
      amount: data.amount,
      phone,
      reference,
      description: campaign ? `BBVF ${campaign.title}` : "BBVF donation",
    });
    if (!result.ok) {
      await dbUpdate("donations", `reference=${eq(reference)}&state=eq.initiated`, {
        state: "failed",
        notes: `STK push failed: ${result.error}`,
      });
      return noStore({ ok: false, error: result.error }, 502);
    }

    await dbUpdate("donations", `reference=${eq(reference)}&state=eq.initiated`, {
      state: "pending",
      provider_reference: result.checkoutRequestId,
    });

    return noStore(
      {
        ok: true,
        reference,
        method: "mpesa",
        pending: true,
        message:
          "Check your phone for the M-Pesa prompt and enter your PIN there. Never enter your PIN on a website.",
      },
      201,
    );
  }

  if (!stripeConfigured()) {
    return noStore({ ok: false, error: "Card giving is not configured." }, 503);
  }

  const origin = new URL(request.url).origin;
  const checkout = await createStripeCheckout({
    amount: data.amount,
    currency,
    reference,
    campaignTitle: campaign?.title,
    email: data.email,
    origin,
  });
  if (!checkout.ok) {
    await dbUpdate("donations", `reference=${eq(reference)}&state=eq.initiated`, {
      state: "failed",
      notes: `Checkout failed: ${checkout.error}`,
    });
    return noStore({ ok: false, error: checkout.error }, 502);
  }

  await dbUpdate("donations", `reference=${eq(reference)}&state=eq.initiated`, {
    state: "pending",
    provider_reference: checkout.id,
  });

  return noStore({ ok: true, reference, method: "card", redirectUrl: checkout.url }, 201);
}
