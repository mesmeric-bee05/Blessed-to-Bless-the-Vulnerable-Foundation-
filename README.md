# BBVF — Blessed to Bless the Vulnerable Foundation

The official website and secure intake platform for **Blessed to Bless the
Vulnerable Foundation (BBVF)**, a Nairobi-based community foundation supporting
vulnerable children, older persons, persons with disabilities and amputee
veterans.

Built to the specification in *Master Prompt BBVF Website Design & Implementation
Specification* (21 November 2026), with one non-negotiable rule applied
throughout:

> **Nothing is published unless BBVF has supplied or approved it.** No invented
> statistics, testimonials, leadership, registration numbers, certifications,
> stock photographs of beneficiaries, or progress bars that move on their own.

---

## Current status

This repository is a **pre-launch production build**. It is complete as a
website and secure intake layer. It deliberately does **not** pretend to be a
finished donation platform.

| Area | State |
| --- | --- |
| Public site (all sitemap routes, 46 static pages) | Built and type-checked |
| Design system, responsive layout, 3D motion with reduced-motion support | Built |
| Accessibility (semantic landmarks, focus states, labels, skip link, WCAG 2.2 AA target) | Built; independent audit pending |
| SEO: metadata, canonicals, sitemap, robots, JSON-LD (NGO, WebSite, FAQPage, Article, DonateAction, BreadcrumbList) | Built |
| Secure form intake (contact, volunteer, partner, institutional, safeguarding, donation interest, newsletter) | Built — requires Supabase env to persist |
| Database schema, RLS, audit trail, consent model | Migrations provided |
| M-Pesa Daraja STK Push / card checkout | **Not live** — merchant onboarding not complete |
| Payload CMS admin UI | **Not included** — schema and roles provided; see “Known gaps” |
| Gated investor area with authentication | **Not included** — manual verification instead |
| Contact phone / email / office address | **Withheld** — unverified |

The honest pre-launch banner is controlled by `NEXT_PUBLIC_SITE_STATUS`. Set it
to `live` only after the launch checklist in `docs/CONTENT-GOVERNANCE.md` is
signed off.

---

## Stack

- **Next.js 16** (App Router, Turbopack builds, React Server Components)
- **React 19** with **TypeScript** in strict mode (`noUncheckedIndexedAccess`)
- **Tailwind CSS 4** with a token-based design system in `src/app/globals.css`
- **Supabase / PostgreSQL** for intake, content, donations, consent and audit
- **Zod 4** for server-side schema validation
- **No client-side UI, animation, icon or payment dependencies.** Everything is
  hand-built, which keeps the JavaScript payload small on the mid-range Android
  devices and 3G/4G connections most Kenyan donors use.

Fonts are self-hosted at build time through `next/font` (Fraunces + Inter), so
there is no third-party font request at runtime and no layout shift.

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
npm run typecheck
npm run build && npm start
```

Node 20.9+ is required (developed on Node 26).

### Environment variables

See `.env.example`. The site renders fully without Supabase; public forms will
return an honest `503` explaining that the secure intake store is not connected
rather than pretending to save a message.

| Variable | Purpose | Client-exposed? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, JSON-LD | Yes (public by design) |
| `NEXT_PUBLIC_SITE_STATUS` | `prelaunch` or `live`; controls banner and robots | Yes |
| `SUPABASE_URL` | Supabase project URL | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only REST key for intake writes | **No — never prefix with `NEXT_PUBLIC_`** |
| `FORM_HASH_PEPPER` | Pepper for hashed IP abuse signals | No |
| `RESEND_API_KEY` | Transactional email (receipts/notifications) | No |
| `BBVF_NOTIFICATION_EMAIL` | Internal notification recipient | No |

---

## Database setup

The Supabase project is `upshfqorxwefxdorphku.supabase.co`.

1. Open **SQL Editor** in Supabase.
2. Run `supabase/migrations/0001_initial_schema.sql`.
3. Run `supabase/seed.sql`. Seed rows are inserted as `needs_review`, never
   `published` — publishing requires a real staff approval.
4. Create the first staff user in **Authentication → Users**.
5. Insert their profile with a role:

```sql
insert into profiles (id, full_name, role, mfa_enrolled)
values ('<auth-user-uuid>', 'Full Name', 'super_admin', true);
```

6. Enable MFA for every privileged account in Supabase Auth settings.
7. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the hosting environment.

### Why the service role is used for intake

Public forms have **no** anonymous INSERT policy. The browser never talks to
Supabase directly. The Next.js route handler validates with Zod, checks same-origin,
rate-limits, hashes the IP, and only then inserts with the service role. This
keeps the database unreachable from a tampered client and makes every intake path
auditable in one place.

### Data model highlights

- `content_status` gate on every content table; `published` rows must have an
  `approved_by` and `approved_at`.
- `media_assets` records consent scope, guardian consent, identity sensitivity,
  face/name/location permissions, expiry and EXIF-stripping status. A minor
  cannot be stored without guardian consent (database check).
- `safeguarding_reports` are segregated with reviewer-only RLS.
- `donations` + `payment_events` implement an inbox pattern. A trigger **blocks**
  a donation moving to `succeeded` unless a verified payment event has been
  processed.
- `audit_log` is written by triggers on campaigns, donation methods, media,
  leadership and policies.
- Storage bucket `media` is private; public delivery must go through a signed URL
  issued after a consent check.

---

## Project structure

```
src/
  app/                 routes (App Router), sitemap, robots, manifest, API
  components/
    brand/             wordmark, seal, programme artwork
    cards/             programme and campaign cards
    forms/             accessible intake forms (client)
    motion/            reveal, tilt, 3D orbital hero (reduced-motion aware)
    site/              header, footer
    ui/                headings, breadcrumbs, progress ledger, JSON-LD, icons
  content/             verified editorial content as typed data
  lib/                 SEO, formatting, Supabase REST, validation, rate limit
supabase/
  migrations/          full schema, RLS, triggers, storage
  seed.sql             verified public figures, marked needs_review
docs/
  SECURITY.md          threat model, ASVS mapping, incident response
  CONTENT-GOVERNANCE.md approval workflow, launch gates, publication rules
  PAYMENTS.md          rail-by-rail activation contract and state machine
```

Editorial content currently lives in `src/content/*` as typed data so that every
fact is reviewable in version control. The Supabase schema is ready for the CMS
phase; until that phase, changes to public copy go through a pull request and a
named approver.

---

## SEO and discovery

- Server-rendered/static HTML for every public page: no client-side rendering
  dependency for crawlers.
- Unique title, description and canonical on every route; Open Graph and Twitter
  metadata.
- `sitemap.xml` segmented by pages, programmes, campaigns, stories and published
  policies; drafts, gated and API routes excluded.
- `robots.txt` disallows everything while `NEXT_PUBLIC_SITE_STATUS=prelaunch`.
- JSON-LD: `NGO`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Article`,
  `DonateAction`. Structured data never claims more than the visible page
  (no registration number, no social profiles, no address until verified).
- Core Web Vitals targets: LCP < 2.5s, INP < 200ms, CLS < 0.1. The build avoids
  layout-shifting embeds, uses `next/font`, and ships no 3D/animation library.

---

## Deployment

Any Node host that supports Next.js 16 works. Vercel is the lowest-friction
option; Cloudflare in front adds WAF and DDoS protection.

1. Set the environment variables above (production values).
2. `npm run build` must pass in CI before deploy.
3. Point the domain, enable HSTS (already sent in production by `next.config.ts`),
   and submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools.
4. Keep the existing Jamii profile live until the new site has been stable for
   30 days.

Security headers (CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy,
Permissions-Policy, COOP) are applied to every response in `next.config.ts`.

---

## Known gaps — stated, not hidden

These are the remaining work items before this can be called a launched donation
platform. Each is deliberate.

1. **Legal identity and registration** must be confirmed by counsel and entered
   into `content/site.ts` and the governance page.
2. **ODPC registration** must be completed; the certificate number is not yet
   available.
3. **Leadership and board profiles** require written consent, biographies and
   photographs.
4. **Contact channels** (phone, email, office address) require BBVF verification.
   The phone number in the discovery record came from a third-party listing.
5. **Payment rails**: Safaricom Daraja onboarding, provider selection, webhook
   signature verification, sandbox tests, reconciliation exports and refunds.
   See `docs/PAYMENTS.md`.
6. **Transactional email** with SPF/DKIM/DMARC before receipts are sent.
7. **CMS admin UI** (Payload or Supabase-based) for non-technical staff; the
   schema and role model exist, the interface does not.
8. **Gated investor area** with passkey/TOTP authentication and scoped document
   access.
9. **Independent WCAG 2.2 AA audit** and a manual screen-reader pass.
10. **Automated test suite** (unit, integration, Playwright donation flow,
    `axe-core` in CI). CI currently runs typecheck, build and dependency audit.
11. **Backup/restore drill**, monitoring, uptime alerts and a penetration test.

---

## Licence

MIT (see `LICENSE` at the repository root). Content, brand assets and beneficiary
stories are **not** covered by the software licence and may not be reused.
