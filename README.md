# BBVF — Blessed to Bless the Vulnerable Foundation

The official website, secure intake platform, staff CMS and dual-rail donation
flow for **Blessed to Bless the Vulnerable Foundation (BBVF)**, a Nairobi-based
community foundation supporting vulnerable children, older persons, persons with
disabilities and amputee veterans.

One rule runs through every page and every table:

> **Nothing is published unless BBVF has supplied or approved it.** No invented
> statistics, testimonials, leadership, registration numbers, certifications,
> stock photographs of beneficiaries, or progress bars that move on their own.

---

## What is built

| Area | State |
| --- | --- |
| Public site (all sitemap routes, static where possible) | Built, type-checked, production build passing |
| Design system, responsive layout, 3D motion with reduced-motion support | Built |
| SEO: metadata, canonicals, sitemap, robots, JSON-LD (NGO, WebSite, FAQPage, Article, DonateAction, BreadcrumbList) | Built |
| Secure form intake (contact, volunteer, partner, institutional, safeguarding, donation interest, newsletter) | Built — requires Supabase env to persist, fails closed with 503 |
| Database schema, RLS, audit trail, consent model, payment hardening | Applied to Supabase (0001, 0002) |
| Seed data (4 programmes, 16 activities, 4 campaigns, 4 FAQs, 7 policy drafts) | Inserted as needs_review, never published |
| Staff CMS at /admin (auth, content publishing, triage, finance view, audit) | Built |
| M-Pesa Daraja STK Push | Implemented; opens only when merchant credentials are set |
| Stripe hosted Checkout (cards) | Implemented; opens only when keys are set |
| Contact phone / email / office address | Withheld — unverified |

`NEXT_PUBLIC_SITE_STATUS` controls the pre-launch banner and robots policy.
Switch it to `live` only after the launch checklist in
`docs/CONTENT-GOVERNANCE.md` is signed off.

---

## Stack

- **Next.js 16** (App Router, Turbopack, React Server Components)
- **React 19**, **TypeScript** strict
- **Tailwind CSS 4** with tokens in `src/app/globals.css`
- **Supabase / PostgreSQL** for intake, content, donations, consent and audit
- **Zod 4** for server-side validation
- No client-side UI, animation, icon or payment SDKs. Stripe and Daraja are
  called from route handlers with fetch, so no vendor JavaScript reaches the
  browser.

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
npm run typecheck
npm run build && npm start
BASE_URL=http://127.0.0.1:3000 npm run smoke
```

Node 20.9+ is required. The public site renders fully without Supabase; forms
return an honest 503 rather than pretending to save a message.

### Environment variables

| Variable | Purpose | Client-exposed? |
| --- | --- | --- |
| NEXT_PUBLIC_SITE_URL | Canonical origin for metadata and sitemap | Yes (public by design) |
| NEXT_PUBLIC_SITE_STATUS | prelaunch or live | Yes |
| SUPABASE_URL | Supabase project URL | No |
| SUPABASE_SERVICE_ROLE_KEY | Server-only key for intake, CMS reads and webhooks | **No** |
| SUPABASE_ANON_KEY | Publishable key used to verify staff sign-in | Publishable, but keep server-side here |
| FORM_HASH_PEPPER | Pepper for hashed IP abuse signals | No |
| STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET | Stripe Checkout and webhook verification | No |
| CARD_CURRENCY | Currency for card gifts (default USD) | No |
| MPESA_ENV | sandbox or production | No |
| MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET | Daraja app credentials | No |
| MPESA_SHORTCODE / MPESA_PASSKEY | Paybill/till and STK password | No |
| MPESA_CALLBACK_URL | Public HTTPS callback URL | No |

---

## Database

Project: `upshfqorxwefxdorphku.supabase.co`. The schema and seed have been applied.

1. `supabase/migrations/0001_initial_schema.sql` — 29 tables, enums, consent
   model, RLS deny-by-default, audit triggers, private media bucket.
2. `supabase/migrations/0002_payment_hardening.sql` — ties a verified payment
   event to the exact donation it credits, and caps refunds at the captured
   amount.
3. `supabase/seed.sql` — verified public figures, inserted as needs_review.

### First staff account

1. Supabase → Authentication → Users → create the user (enable MFA for
   privileged roles).
2. Insert the profile:

```sql
insert into profiles (id, full_name, role, mfa_enrolled)
values ('<auth-user-uuid>', 'Full Name', 'super_admin', true);
```

Users without an active profile cannot sign in, even with a correct password.
See `docs/ADMIN.md` for the role matrix and publishing rules.

### Data model highlights

- content_status gate on every content table; published rows need approved_by +
  approved_at (and legal review for policies).
- media_assets records consent scope, guardian consent, sensitivity,
  face/name/location permissions, expiry and EXIF-stripping. A minor cannot be
  stored without guardian consent.
- safeguarding_reports are reviewer-only under RLS.
- donations + payment_events use an inbox pattern; a trigger blocks succeeded
  unless a verified event for that exact reference exists.
- audit_log is append-only for staff.

---

## Payments

Two rails, both server-verified. A donation is credited only after the provider
confirms it; the browser is never trusted.

- **Card (Stripe hosted Checkout).** BBVF never sees card data. Webhook
  signatures are verified with HMAC-SHA256 and a 5-minute tolerance; the paid
  amount is compared with the stored donation before crediting.
- **M-Pesa (Daraja STK Push).** The PIN is entered on the phone. Daraja callbacks
  are not signed, so the handler re-queries Safaricom for the result and checks
  the amount before crediting.

Both rails report pending/failed honestly and refunds are recorded in refunds.
Receipts are written only after a verified success. Activation steps and the
state machine are in `docs/PAYMENTS.md`; the pages at /donate/checkout show a
"not connected" state until the relevant keys exist.

---

## Admin CMS

/admin is a staff tool: noindex, middleware-gated, verified against Supabase Auth
on every request, then checked against profiles.role. It supports publishing with
recorded approval, content editing, submission triage, safeguarding queues, a
read-only finance view and the audit log. Full guide: `docs/ADMIN.md`.

---

## Security

- CSP, HSTS (production), X-Frame-Options: DENY, nosniff, Referrer-Policy,
  Permissions-Policy and COOP in `next.config.ts`.
- Public intake has no anonymous INSERT policy. Route handlers validate with Zod,
  check same-origin, rate-limit, hash the IP and insert with the service role
  only.
- Webhooks verify signatures (Stripe) or re-query the provider (Daraja), record
  the raw event before acting, and are idempotent.
- Threat model and ASVS mapping: `docs/SECURITY.md`.

---

## Tests and CI

`npm run smoke` checks every public route, the admin redirect, form validation
and origin rejection, donation input validation and unsigned-webhook rejection.
CI runs npm ci, typecheck, production build and npm audit --audit-level=high.

---

## Known gaps — stated, not hidden

1. **Legal identity and registration** must be confirmed by counsel and entered
   into `src/content/site.ts` and the governance page.
2. **ODPC registration** must be completed.
3. **Leadership profiles** require written consent, biographies and photographs.
4. **Contact channels** require BBVF verification.
5. **Merchant onboarding**: Daraja and Stripe credentials, sandbox-to-production
   tests, reconciliation exports. The code is ready and env-gated.
6. **Transactional email** with SPF/DKIM/DMARC before receipts are emailed.
7. **Gated investor area** with passkey/TOTP and scoped document access.
8. **Independent WCAG 2.2 AA audit** and a screen-reader pass.
9. **End-to-end donation tests** against provider sandboxes.
10. **Backup/restore drill**, monitoring, uptime alerts and a penetration test.

---

## Licence

MIT (see `LICENSE`). Content, brand assets and beneficiary stories are not
covered by the software licence and may not be reused.
