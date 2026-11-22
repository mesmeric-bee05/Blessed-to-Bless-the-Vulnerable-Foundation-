# Taking payments: Stripe (cards) and M-Pesa (Daraja)

The site can take money through two rails. Both are built, tested against their
providers' contracts, and deliberately switched off until real credentials exist.
Until the variables below are set, `/donate/checkout` says "not connected" and
`/api/donations/intent` refuses the request. The site never shows a success page
for a payment it cannot verify.

Nothing in this document requires a developer. Do the steps in order and keep
every secret in the hosting panel (Sites → Secrets), never in a file, email or
chat message.

---

## Stripe (cards) — test mode first

Test mode takes no real money and needs no company registration to start.

1. Create an account at `dashboard.stripe.com/register`. You can stay in test
   mode while the business details are being confirmed.
2. Make sure the dashboard toggle in the top right says **Test mode**.
3. Open **Developers → API keys**. Copy the **Secret key** — it starts with
   `sk_test_`. (The publishable key `pk_test_` is not needed by this site.)
4. Add it to the hosting environment as `STRIPE_SECRET_KEY`.
5. Create the webhook. **Developers → Webhooks → Add endpoint**:
   - Endpoint URL: `https://<your-domain>/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
     `charge.refunded`, `charge.refund.updated`
6. Copy the **Signing secret** (`whsec_…`) and add it as `STRIPE_WEBHOOK_SECRET`.
7. Redeploy so the new values are loaded, then donate KES 100 on
   `/donate/checkout` with the test card `4242 4242 4242 4242`, any future expiry,
   any three-digit CVC and any postcode.

What a correct result looks like: the browser lands on `/donate/thank-you`, a row
appears in `donations` with state `succeeded`, and an entry appears in
`payment_events`. If the webhook is wrong, the payment exists at Stripe but the
site does **not** credit it — that is intentional.

Going live later: repeat steps 3–6 with the toggle off (`sk_live_…`, a new
`whsec_…`), and complete Stripe's business verification. Kenya accepts card
payments through Stripe only where the entity and settlement bank are supported;
confirm this with Stripe before advertising card giving.

---

## M-Pesa (Daraja) — sandbox, then production

Daraja is Safaricom's developer portal. Sandbox uses fake money and a shared test
shortcode, so it is safe to practise on.

### Sandbox

1. Register at `developer.safaricom.co.ke` with an email you can access.
2. **My Apps → Add a new app**, choose *Lipa na M-Pesa Sandbox*. You receive a
   **Consumer Key** and **Consumer Secret**.
3. On the app page, note the **Passkey** shown for the sandbox shortcode
   `174379` (this is Safaricom's published test passkey).
4. Your callback must be a public HTTPS address — the site's own domain works:
   `https://<your-domain>/api/webhooks/mpesa`
5. Set these variables in hosting:
   - `MPESA_CONSUMER_KEY`
   - `MPESA_CONSUMER_SECRET`
   - `MPESA_SHORTCODE=174379`
   - `MPESA_PASSKEY`
   - `MPESA_CALLBACK_URL=https://<your-domain>/api/webhooks/mpesa`
   - `MPESA_ENV=sandbox`
6. Redeploy, donate on `/donate/local`, and approve the STK Push prompt on the
   Safaricom test handset number `254708374149` (Safaricom's published sandbox
   MSISDN). The sandbox PIN is `1234`.

The site does not trust the callback alone: on every callback it calls Daraja's
query API for that CheckoutRequestID and only credits the donation when the
provider itself says the payment completed. Duplicate callbacks are ignored.

### Production

1. Apply for a **Paybill or Till number** in the business name, and complete
   Safaricom's KYC. This is the step that takes time — start it before you need
   it.
2. Create a **production app** on the portal and request *Lipa na M-Pesa Online*
   access. You receive production consumer key/secret and the passkey for your
   shortcode.
3. Set the production values, with `MPESA_ENV=production` and
   `MPESA_SHORTCODE=<your paybill or till>`.
4. Do one real KES 10 donation end to end, then refund it from the M-Pesa portal
   and confirm the site records the refund.

### Things that go wrong

- **Callback never arrives.** Safaricom cannot reach `localhost`. The URL must be
  public HTTPS, with no port number and no query string.
- **"Bad Request — Invalid CallbackURL".** The URL is unreachable or too long.
- **STK prompt never appears.** The phone number must be in `2547XXXXXXXX` form
  and must be an active Safaricom line.
- **Payment succeeds but the site shows nothing.** Check the webhook secret/key
  variables and the `/admin/donations` view; the reconciliation is provider-
  verified, so a missing credit is safer than a false one.

---

## Rules the code enforces

- Card data never touches BBVF servers; Stripe's hosted page collects it.
- M-Pesa is re-queried server to server before a donation is marked paid.
- Webhook signatures are checked with a timestamp tolerance, and the amount and
  currency are compared with the intent that was created.
- Every event is stored once by provider reference, so replays cannot double
  credit a campaign.
- Refunds are recorded and cannot exceed the original amount.
- With no credentials the rail returns 503 rather than pretending to work.
