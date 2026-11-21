import { NextResponse } from "next/server";
import { darajaQuery } from "@/lib/payments";
import { dbInsert, dbSelect, dbUpdate, eq } from "@/lib/rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daraja does not sign callbacks. This handler therefore treats the callback
 * purely as a trigger: it looks up the donation by CheckoutRequestID and asks
 * Safaricom's query API for the authoritative result before changing state.
 * The amount in the callback is checked against the stored donation amount.
 */
type CallbackItem = { Name?: string; Value?: string | number };
type DarajaCallback = {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: { Item?: CallbackItem[] };
    };
  };
};

function accepted() {
  // Safaricom expects this exact shape, and a 200 stops retries.
  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" }, { status: 200 });
}

export async function POST(request: Request) {
  let body: DarajaCallback;
  try {
    body = (await request.json()) as DarajaCallback;
  } catch {
    return accepted();
  }

  const callback = body.Body?.stkCallback;
  const checkoutRequestId = callback?.CheckoutRequestID;
  if (!checkoutRequestId) return accepted();

  const donation = (
    await dbSelect<{
      id: string;
      reference: string;
      amount: string;
      state: string;
      donor_email: string | null;
    }>(
      "donations",
      `select=id,reference,amount,state,donor_email&provider=eq.mpesa&provider_reference=${eq(
        checkoutRequestId,
      )}&limit=1`,
    )
  )[0];

  if (!donation) {
    // Unknown request id: acknowledge, never create money from a stray callback.
    return accepted();
  }

  const items = callback?.CallbackMetadata?.Item ?? [];
  const amountItem = items.find((item) => item.Name === "Amount");
  const receiptItem = items.find((item) => item.Name === "MpesaReceiptNumber");
  const callbackAmount = Number(amountItem?.Value ?? 0);

  if (callback?.ResultCode !== 0) {
    await dbInsert(
      "payment_events",
      {
        provider: "mpesa",
        provider_event_id: `${checkoutRequestId}:${callback?.ResultCode ?? "unknown"}`,
        event_type: "stk_callback_failed",
        payload: body,
        signature_verified: false,
        processed_at: new Date().toISOString(),
        donation_reference: donation.reference,
      },
      { ignoreDuplicates: true },
    );
    await dbUpdate("donations", `id=${eq(donation.id)}&state=in.(pending,initiated)`, {
      state: "failed",
      notes: callback?.ResultDesc?.slice(0, 200) ?? "M-Pesa reported a failed payment",
    });
    return accepted();
  }

  const verification = await darajaQuery(checkoutRequestId);
  if (!verification.ok || verification.resultCode !== 0) {
    // Do not credit on an unverifiable result. Return 500 so Daraja retries.
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Pending verification" }, {
      status: 500,
    });
  }

  if (!Number.isFinite(callbackAmount) || callbackAmount < Number(donation.amount)) {
    await dbUpdate("donations", `id=${eq(donation.id)}`, {
      state: "under_review",
      notes: `M-Pesa amount ${callbackAmount} did not match ${donation.amount}`,
    });
    return accepted();
  }

  const recorded = await dbInsert<{ id: string }>(
    "payment_events",
    {
      provider: "mpesa",
      provider_event_id: checkoutRequestId,
      event_type: "stk_callback_succeeded",
      payload: body,
      signature_verified: true,
      processed_at: new Date().toISOString(),
      donation_reference: donation.reference,
    },
    { ignoreDuplicates: true },
  );
  if (!recorded) return accepted();

  await dbUpdate("donations", `id=${eq(donation.id)}&state=in.(pending,initiated)`, {
    state: "succeeded",
    provider_reference: String(receiptItem?.Value ?? checkoutRequestId),
    reconciled_at: new Date().toISOString(),
  });

  if (donation.donor_email) {
    await dbInsert("receipts", {
      donation_id: donation.id,
      sent_to: donation.donor_email,
      provider_message_id: String(receiptItem?.Value ?? checkoutRequestId),
    });
  }

  return accepted();
}
