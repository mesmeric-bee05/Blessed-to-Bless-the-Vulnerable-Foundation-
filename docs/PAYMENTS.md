# Payment rails — activation contract

This document is the specification a developer must implement before enabling
direct giving. The website intentionally ships **without** a live checkout. A
checkout that cannot settle, refund or reconcile is worse than no checkout.

---

## 1. Non-negotiables

1. **Never trust the browser.** A redirect to `/thank-you` is not proof of payment.
   Only a cryptographically verified provider event may mark a donation
   `succeeded`.
2. **No raw card data.** Use hosted checkout or tokenised fields. BBVF's own
   servers must never see a PAN, CVV or full bank credential.
3. **Idempotency.** Every provider event is stored in `payment_events` with a
   unique `(provider, provider_event_id)`. Replays are no-ops.
4. **Single transaction.** Commit the raw event and the processing job before
   acknowledging the provider. Acknowledge only after commit.
5. **Server-side amount validation.** The amount and currency confirmed by the
   provider must match the intent created server-side. Never trust a posted amount.
6. **Consent separation.** Donation-processing consent is distinct from marketing
   consent; every downstream email re-checks the current preference.

---

## 2. Donation state machine

```
initiated → pending → authorized → succeeded
     │          │           │
     │          │           └→ failed / expired / cancelled
     │          └→ under_review → succeeded / failed / refunded
     └→ failed / cancelled / expired

succeeded → refunded | partially_refunded | chargeback
```

Transitions are guarded in the database: `succeeded` requires a processed,
signature-verified `payment_events` row. `refunded` requires a `refunds` row.

---

## 3. Local rail — M-Pesa

### Option A: Safaricom Daraja STK Push (preferred)

Prerequisites, all in BBVF's own name:

- KRA PIN and business registration.
- Paybill or Till number.
- Daraja developer app (consumer key/secret, passkey, shortcode).
- Confirmed tariff and settlement account.
- A publicly reachable HTTPS callback URL.

Flow:

1. `POST /api/donations/intent` validates the amount, campaign and consent, creates
   a `donations` row (`initiated`), and returns a reference.
2. Server requests an STK Push with that reference in `AccountReference`.
3. Donor enters their PIN on their own phone. The site receives nothing.
4. Daraja calls `POST /api/webhooks/daraja`. The handler:
   - verifies the request against the expected shortcode and a shared secret or
     IP allow-list (Daraja callbacks are not signed — treat source verification and
     the subsequent status query as mandatory);
   - inserts the raw payload into `payment_events`;
   - resolves the donation by `CheckoutRequestID`;
   - **queries the transaction status** before marking `succeeded`;
   - writes a receipt job and reconciliation entry.
5. `POST /api/webhooks/daraja/timeout` records the failure without deleting the
   intent.

Do not credit a donation from the callback body alone. Confirm with the status
query.

### Option B: Aggregator fallback (Paystack Kenya / IntaSend)

Use when direct Daraja onboarding is delayed, or as a resilience rail. Verify the
provider's current Kenyan coverage, fees, settlement currency and refund support
directly — fee tables change without notice.

---

## 4. International rail — card and wallet

- Stripe Checkout or Paystack hosted checkout. Hosted or tokenised fields only.
- Set the success URL to a page that **reads the session server-side** and shows
  the confirmed state; never a static "thank you".
- Verify the webhook signature with the provider's signing secret and a raw-body
  comparison.
- Enable 3-D Secure where the provider supports it.
- Recurring giving: store only the provider's customer/subscription token, never
  card details. Publish the cancellation route before accepting recurring gifts.
- Refunds and chargebacks: follow the provider's dispute API and record every
  action in `refunds`.

### PCI DSS scope

With fully hosted checkout, the target is **SAQ A**. Requirements 6.4.3 and 11.6.1
(script inventory and tamper detection) were removed from SAQ A for fully
outsourced payment pages, but keep a documented script inventory, SRI on any
third-party script, and a tamper-detection check on `/donate` as
defence-in-depth.

---

## 5. Required endpoints (to be implemented)

| Endpoint | Purpose | Controls |
| --- | --- | --- |
| `POST /api/donations/intent` | Create a server-side intent | Auth-less but rate-limited, Zod validation, CSRF/origin check, amount bounds, campaign must be published |
| `POST /api/webhooks/daraja` | M-Pesa callback | Source verification, status re-query, idempotent, raw body stored |
| `POST /api/webhooks/stripe` | Card events | Signature verification over raw body, idempotent |
| `POST /api/webhooks/paystack` | Aggregator events | HMAC verification, idempotent |
| `GET /api/donations/:reference` | Donor status lookup | Reference + email match, no enumeration, rate-limited |
| `POST /api/admin/refunds` | Finance-initiated refund | MFA session, role check, audit log |

All webhook handlers must:

- read the **raw** request body before JSON parsing (signature covers bytes);
- return `2xx` only after the event is committed;
- return `409`/`5xx` on processing failure so the provider retries;
- never log the full payload if it contains personal data.

---

## 6. Receipts and reconciliation

- Receipt email from a domain-based address, with SPF, DKIM and DMARC aligned.
- Include: legal name, amount, currency, date, campaign designation, provider
  reference, refund/cancellation route, privacy link, and the BBVF fraud warning.
- Do not claim tax-deductibility.
- Nightly job: export settled provider transactions, match to `donations`, flag
  unmatched or amount-mismatched rows for finance review.
- Monthly: reconcile campaign totals against the bank/provider statement and
  publish the reconciled figure with its reporting period.

---

## 7. Activating a rail — checklist

- [ ] Provider contract and merchant account verified in BBVF's legal name.
- [ ] Keys stored in the hosting secret manager (never in Git or the client bundle).
- [ ] Sandbox end-to-end test: success, failure, cancel, timeout.
- [ ] Duplicate webhook replay test: exactly one donation row.
- [ ] Amount tampering test: server rejects a mismatched amount.
- [ ] Refund test: donation moves to `refunded`, donor notified.
- [ ] Receipt email verified in Gmail, Outlook and a Kenyan mobile client.
- [ ] Reconciliation export reviewed by finance.
- [ ] `donation_methods` row marked `is_live` with `verified_by` and `verified_at`.
- [ ] Site copy updated: provider named, fees shown, terms linked.
