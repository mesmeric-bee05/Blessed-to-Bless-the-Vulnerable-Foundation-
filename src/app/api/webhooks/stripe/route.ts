import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { dbInsert, dbSelect, dbUpdate, eq } from "@/lib/rest";
import { verifyStripeSignature } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 512_000;

type StripeEvent = {
  id?: string;
  type?: string;
  data?: { object?: Record<string, unknown> };
};

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? null;
  const raw = await request.text();
  if (raw.length > MAX_BODY) return NextResponse.json({ received: false }, { status: 413 });

  if (!verifyStripeSignature(raw, request.headers.get("stripe-signature"), secret)) {
    // No detail: an attacker learns nothing about why it failed.
    return NextResponse.json({ received: false }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(raw) as StripeEvent;
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  const object = event.data?.object ?? {};
  const metadata = (object.metadata ?? {}) as Record<string, unknown>;
  const reference =
    text(metadata.reference) || text(object.client_reference_id) || null;

  if (!event.id || !event.type) {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // Persist the raw event before acting on it. The unique (provider,
  // provider_event_id) constraint makes retries idempotent.
  const recorded = await dbInsert<{ id: string }>(
    "payment_events",
    {
      provider: "stripe",
      provider_event_id: event.id,
      event_type: event.type,
      payload: event,
      signature_verified: true,
      processed_at: new Date().toISOString(),
      donation_reference: reference,
    },
    { ignoreDuplicates: true },
  );
  if (!recorded) {
    // Either a duplicate delivery or a storage failure. Duplicates are fine.
    return NextResponse.json({ received: true }, { status: 200 });
  }

  if (!reference) {
    await dbUpdate("payment_events", `provider_event_id=${eq(event.id)}`, {
      processing_error: "No donation reference on the event",
    });
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const donation = (
    await dbSelect<{
      id: string;
      reference: string;
      amount: string;
      state: string;
      donor_email: string | null;
    }>(
      "donations",
      `select=id,reference,amount,state,donor_email&reference=${eq(reference)}&limit=1`,
    )
  )[0];

  if (!donation) {
    await dbUpdate("payment_events", `provider_event_id=${eq(event.id)}`, {
      processing_error: "Donation reference not found",
    });
    return NextResponse.json({ received: true }, { status: 200 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const amountTotal = Number(object.amount_total ?? 0);
      const expected = Math.round(Number(donation.amount) * 100);
      if (!Number.isFinite(amountTotal) || amountTotal !== expected) {
        // Never credit a mismatched amount; park it for a human.
        await dbUpdate("donations", `id=${eq(donation.id)}`, {
          state: "under_review",
          notes: `Stripe amount ${amountTotal} did not match expected ${expected}`,
        });
        return NextResponse.json({ received: true }, { status: 200 });
      }

      await dbUpdate("donations", `id=${eq(donation.id)}`, {
        state: "succeeded",
        provider_reference: text(object.payment_intent) || text(object.id) || null,
        reconciled_at: new Date().toISOString(),
      });

      if (donation.donor_email) {
        await dbInsert(
          "receipts",
          {
            donation_id: donation.id,
            sent_to: donation.donor_email,
            provider_message_id: text(object.payment_intent) || null,
            pdf_path: null,
          },
          { ignoreDuplicates: false },
        );
      }
    } else if (event.type === "charge.refunded") {
      const amount = Number(object.amount_refunded ?? 0) / 100;
      await dbUpdate("donations", `id=${eq(donation.id)}`, { state: "refunded" });
      if (amount > 0) {
        await dbInsert("refunds", {
          donation_id: donation.id,
          amount,
          reason: "Refund recorded from Stripe webhook",
          provider_reference: text(object.id) || null,
          processed_at: new Date().toISOString(),
        });
      }
    } else if (
      event.type === "charge.dispute.created" ||
      event.type === "charge.dispute.funds_withdrawn"
    ) {
      await dbUpdate("donations", `id=${eq(donation.id)}`, { state: "chargeback" });
    }
  } catch {
    await dbUpdate("payment_events", `provider_event_id=${eq(event.id)}`, {
      processing_error: `Unhandled exception ${randomUUID()}`,
    });
    return NextResponse.json({ received: true }, { status: 200 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
