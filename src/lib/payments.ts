/**
 * Payment provider helpers.
 *
 * Two rails, both server-side only:
 *   * Stripe Checkout for international cards — card data never touches BBVF.
 *   * Safaricom Daraja STK Push for M-Pesa — the PIN is entered on the phone.
 *
 * A donation is only marked succeeded by a webhook that has been verified:
 * Stripe via its HMAC signature, Daraja by re-querying the transaction with
 * Safaricom before accepting the callback. Nothing here trusts a browser.
 */

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type PaymentMethod = "mpesa" | "card";

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

export function darajaConfigured(): boolean {
  return Boolean(
    process.env.MPESA_CONSUMER_KEY &&
      process.env.MPESA_CONSUMER_SECRET &&
      process.env.MPESA_SHORTCODE &&
      process.env.MPESA_PASSKEY &&
      process.env.MPESA_CALLBACK_URL,
  );
}

export function paymentRails(): { mpesa: boolean; card: boolean } {
  return { mpesa: darajaConfigured(), card: stripeConfigured() };
}

export function paymentReference(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `BBVF-${date}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export function formatMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/** Normalises Kenyan mobile numbers to the 2547XXXXXXXX form Daraja requires. */
export function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/[^\d]/g, "");
  let normalized: string;
  if (digits.startsWith("254") && digits.length === 12) normalized = digits;
  else if (digits.startsWith("0") && digits.length === 10) normalized = `254${digits.slice(1)}`;
  else if (digits.startsWith("7") && digits.length === 9) normalized = `254${digits}`;
  else if (digits.startsWith("1") && digits.length === 9) normalized = `254${digits}`;
  else return null;
  return /^254(7|1)\d{8}$/.test(normalized) ? normalized : null;
}

// ------------------------------------------------------------------- Stripe

function stripeForm(params: Record<string, string | number>): string {
  const form = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    form.append(key, String(value));
  }
  return form.toString();
}

export async function createStripeCheckout(input: {
  amount: number;
  currency: string;
  reference: string;
  campaignTitle?: string;
  email: string;
  origin: string;
}): Promise<{ ok: true; url: string; id: string } | { ok: false; error: string }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { ok: false, error: "Card giving is not configured." };

  const productName = input.campaignTitle
    ? `Donation to BBVF — ${input.campaignTitle}`
    : "Donation to Blessed to Bless the Vulnerable Foundation";

  const body = stripeForm({
    mode: "payment",
    success_url: `${input.origin}/donate/thank-you?ref=${encodeURIComponent(input.reference)}`,
    cancel_url: `${input.origin}/donate/checkout?cancelled=1`,
    customer_email: input.email,
    client_reference_id: input.reference,
    "metadata[reference]": input.reference,
    "payment_intent_data[metadata][reference]": input.reference,
    "line_items[0][quantity]": 1,
    "line_items[0][price_data][currency]": input.currency.toLowerCase(),
    "line_items[0][price_data][unit_amount]": formatMinorUnits(input.amount),
    "line_items[0][price_data][product_data][name]": productName,
    "line_items[0][price_data][product_data][description]":
      "Gift processed by Stripe. BBVF never sees your card details.",
  });

  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": input.reference,
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await response.json()) as {
      id?: string;
      url?: string;
      error?: { message?: string };
    };
    if (!response.ok || !data.url || !data.id) {
      console.error(`[payments] stripe checkout failed: ${response.status}`);
      return { ok: false, error: "The card provider could not start a checkout." };
    }
    return { ok: true, url: data.url, id: data.id };
  } catch {
    return { ok: false, error: "The card provider is unreachable right now." };
  }
}

/**
 * Verifies a Stripe webhook signature: `t=<timestamp>,v1=<hmac>` over
 * `<timestamp>.<raw body>`. Rejects timestamps older than five minutes so a
 * captured request cannot be replayed indefinitely.
 */
export function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string | null,
): boolean {
  if (!header || !secret) return false;
  const parts = header.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return signatures.some((signature) => {
    try {
      const actual = Buffer.from(signature, "hex");
      return (
        actual.length === expectedBuffer.length &&
        timingSafeEqual(actual, expectedBuffer)
      );
    } catch {
      return false;
    }
  });
}

// ------------------------------------------------------------------- Daraja

function darajaBase(): string {
  return process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

function darajaTimestamp(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(
    now.getHours(),
  )}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

export async function darajaAccessToken(): Promise<string | null> {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) return null;

  try {
    const response = await fetch(
      `${darajaBase()}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

function stkPassword(): { password: string; timestamp: string } | null {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  if (!shortcode || !passkey) return null;
  const timestamp = darajaTimestamp();
  return {
    password: Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64"),
    timestamp,
  };
}

export async function darajaStkPush(input: {
  amount: number;
  phone: string;
  reference: string;
  description: string;
}): Promise<
  { ok: true; checkoutRequestId: string; merchantRequestId: string } | { ok: false; error: string }
> {
  const token = await darajaAccessToken();
  const shortcode = process.env.MPESA_SHORTCODE;
  const callback = process.env.MPESA_CALLBACK_URL;
  const credentials = stkPassword();
  if (!token || !shortcode || !callback || !credentials) {
    return { ok: false, error: "M-Pesa giving is not configured." };
  }

  const body = {
    BusinessShortCode: shortcode,
    Password: credentials.password,
    Timestamp: credentials.timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(input.amount),
    PartyA: input.phone,
    PartyB: shortcode,
    PhoneNumber: input.phone,
    CallBackURL: callback,
    AccountReference: input.reference.slice(0, 12),
    TransactionDesc: input.description.slice(0, 60),
  };

  try {
    const response = await fetch(
      `${darajaBase()}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      },
    );
    const data = (await response.json()) as {
      CheckoutRequestID?: string;
      MerchantRequestID?: string;
      ResponseCode?: string;
      errorMessage?: string;
    };
    if (!response.ok || data.ResponseCode !== "0" || !data.CheckoutRequestID) {
      console.error(`[payments] daraja stk failed: ${response.status} ${data.ResponseCode ?? ""}`);
      return { ok: false, error: "M-Pesa could not send the prompt to that number." };
    }
    return {
      ok: true,
      checkoutRequestId: data.CheckoutRequestID,
      merchantRequestId: data.MerchantRequestID ?? "",
    };
  } catch {
    return { ok: false, error: "M-Pesa is unreachable right now." };
  }
}

/**
 * Daraja callbacks are not signed, so a callback is never trusted on its own:
 * the server asks Safaricom for the transaction result before any state change.
 */
export async function darajaQuery(checkoutRequestId: string): Promise<{
  ok: boolean;
  resultCode: number | null;
  amount: number | null;
  receipt: string | null;
}> {
  const token = await darajaAccessToken();
  const shortcode = process.env.MPESA_SHORTCODE;
  const credentials = stkPassword();
  if (!token || !shortcode || !credentials) {
    return { ok: false, resultCode: null, amount: null, receipt: null };
  }

  try {
    const response = await fetch(
      `${darajaBase()}/mpesa/stkpushquery/v1/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: credentials.password,
          Timestamp: credentials.timestamp,
          CheckoutRequestID: checkoutRequestId,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      },
    );
    const data = (await response.json()) as {
      ResultCode?: string;
      ResultDesc?: string;
      errorMessage?: string;
    };
    if (!response.ok) return { ok: false, resultCode: null, amount: null, receipt: null };
    // A query result has no amount; the callback metadata does. The amount is
    // compared against the donation row by the webhook handler.
    return {
      ok: true,
      resultCode: data.ResultCode ? Number(data.ResultCode) : null,
      amount: null,
      receipt: null,
    };
  } catch {
    return { ok: false, resultCode: null, amount: null, receipt: null };
  }
}
