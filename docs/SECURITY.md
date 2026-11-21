# Security architecture

This document is the working security record for the BBVF website. It describes
what is implemented, what is deliberately deferred, and how the deferred items
must be completed. It is written against **OWASP ASVS 5.0 Level 2**, the
appropriate target for an application that will process donations and hold data
about vulnerable people.

The audience is a future developer, a penetration tester and BBVF's leadership.

---

## 1. Threat model (abbreviated)

| Asset | Threat | Impact | Primary controls |
| --- | --- | --- | --- |
| Donor payment intent and contact data | Automated form abuse, scraping, injection | Spam, data exposure, reputational harm | Server-side Zod validation, same-origin check, honeypot, timing check, rate limit, parameterised REST inserts, no client DB credentials |
| Beneficiary and safeguarding information | Unauthorised access, inference, over-retention | Serious harm to a vulnerable person | Segregated table, reviewer-only RLS, no public policy, no third-party AI, retention function |
| Beneficiary media | Re-identification via image metadata | Physical safety risk | EXIF stripping requirement, consent fields, private bucket, signed delivery after review |
| Donation integrity | Forged success, replay, double credit | Financial loss, false reporting | Provider-signed webhooks, unique `(provider, provider_event_id)`, idempotency key, DB trigger blocking success without a verified event |
| Admin access | Credential theft, privilege abuse | Full content/finance compromise | Supabase Auth, MFA required by policy, least-privilege roles, append-only audit log |
| Site availability and trust | Defacement, script injection, clickjacking | Loss of donor trust | Strict-ish CSP, `frame-ancestors 'none'`, no third-party scripts, immutable builds, dependency audit |
| Legal exposure | Unlawful processing, missing ODPC registration | Fines, enforcement | Consent logging, minimisation, retention, 72-hour breach workflow |

Out of scope for this repository: physical security, staff device management and
payment-provider internal security. These are covered by organisational policy.

---

## 2. Implemented controls

### Transport and headers

Set in `next.config.ts` for every route:

- `Content-Security-Policy` with `default-src 'self'`, `object-src 'none'`,
  `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`,
  `connect-src 'self' https://*.supabase.co`.
- `Strict-Transport-Security` (production only, two years, preload).
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` denying camera, microphone, geolocation and USB,
  `Cross-Origin-Opener-Policy: same-origin`.
- `poweredByHeader: false` so the framework is not advertised.
- API responses are `private, no-store`.

### Input handling

- Every form submission is parsed with a per-form **Zod** schema server-side.
  Client validation is a convenience only.
- Body size capped at 32 KB before and after reading.
- Honeypot field and a minimum completion time for automated submissions.
- `isSameOriginRequest()` rejects cross-site POSTs using `Origin`/`Sec-Fetch-Site`.
- Error responses return field-level messages but never echo stack traces,
  database errors or submitted personal data.
- Email is normalised and length-capped; free text is length-capped and rendered
  as text by React (no `dangerouslySetInnerHTML` for user content).

### Data access

- No Supabase SDK in the browser. Intake writes go through the Next.js route
  handler using a server-only service key.
- PostgREST endpoints are called with an internal table allow-list and JSON body —
  never string-interpolated SQL.
- Row Level Security is enabled on every table and **deny-by-default**: there is
  no anonymous INSERT policy anywhere.
- Public read policies require `status = 'published'` **and** the relevant
  approval/consent flag.
- `safeguarding_reports` has no public policy at all.
- Storage bucket `media` is private; uploads and reads are restricted to
  reviewer/editor roles.

### Logging and audit

- Server errors log only the form kind and failure reason, never payloads.
- IP addresses are never stored raw; a SHA-256 hash with a server-side pepper is
  kept for abuse correlation.
- `audit_log` records inserts, updates and deletes on campaigns, donation methods,
  media assets, leadership profiles and policies, including actor, role and diff.
- Payment events store the raw provider payload in a restricted table for replay
  and forensic use.

### Rate limiting

`src/lib/rate-limit.ts` implements a fixed-window limiter (5 submissions per
10 minutes per IP per form, plus a 32 KB cap).

**Limitation:** state is in-memory and per-instance. It resets on deploy and does
not coordinate across serverless instances. Before launch, replace it with a
shared store (Upstash Redis, or a Supabase counter table with an atomic RPC) and
add provider-level bot protection on `/donate` and `/contact`.

### Secrets

- No secret is referenced with a `NEXT_PUBLIC_` prefix.
- `.env*` files are git-ignored except `.env.example`.
- The service-role key must be stored in the hosting provider's secret manager and
  rotated immediately if exposed. GitHub secret scanning and push protection are
  enabled on the repository.

---

## 3. Architecture decisions

### ADR-001 — Static rendering over nonce-based CSP

**Decision:** Public pages are statically generated. CSP allows `'unsafe-inline'`
for scripts and styles.

**Rationale:** A nonce-based policy forces every page to render dynamically,
which would defeat the pre-rendering and caching that Core Web Vitals and
low-bandwidth users depend on. The site loads **zero** third-party scripts, has
no user-generated HTML and sets `object-src 'none'` and `frame-ancestors 'none'`.
The residual XSS risk is confined to first-party code, where React escaping is in
force.

**Revisit when:** a payment SDK or analytics script is added, or an admin UI with
rich text is introduced. At that point, move `/donate` and `/admin` to a
nonce-based policy and keep the marketing pages static. A nonce must be generated
per request in middleware and threaded through the layout.

### ADR-002 — Service-role writes instead of anonymous insert policies

**Decision:** Public forms never write directly to Supabase.

**Rationale:** A direct-from-browser insert cannot enforce same-origin, rate
limits, honeypots or consistent hashing. Centralising intake in one route handler
gives a single audited choke point and keeps the database key off the client.

**Revisit when:** a CMS admin UI is added. Admin writes should use authenticated
sessions with RLS, not the service key.

### ADR-003 — Editorial content in typed source files

**Decision:** Public copy lives in `src/content/*.ts` until a CMS is introduced.

**Rationale:** During a pre-launch build, every public fact must be reviewable in
a diff with a named reviewer. A CMS at this stage would add an attack surface
without adding governance. The database schema is already prepared for migration.

### ADR-004 — Withholding unverified contact details

**Decision:** No phone number, email address or office address is rendered until
BBVF verifies it.

**Rationale:** The only phone number in the discovery material came from a
third-party donation listing. Publishing it could expose donors to impersonation.
An honest gap is safer than a plausible-looking error.

---

## 4. OWASP ASVS 5.0 Level 2 — status map

| Chapter | Control | Status |
| --- | --- | --- |
| V1 Encoding | Output encoding via React, no raw HTML from input | Implemented |
| V2 Validation | Server-side schema validation, size limits, allow-lists | Implemented |
| V3 Web frontend | CSP, HSTS, frame protection, no third-party scripts | Implemented; CSP upgrade path documented (ADR-001) |
| V4 API | Same-origin enforcement, method restriction, no mass assignment | Implemented |
| V5 File handling | Upload validation, MIME allow-list, EXIF stripping | Schema + bucket policy implemented; **processing pipeline not built** |
| V6 Authentication | MFA, passkeys/TOTP, credential recovery | Supabase-managed; **admin UI not built** |
| V7 Session | Secure/HttpOnly/SameSite cookies, logout, timeout | Delegated to Supabase Auth; verify on admin build |
| V8 Authorization | Least privilege, server-side checks, RLS | Implemented at database level |
| V9 Self-contained tokens | N/A (no JWTs issued by this app) | — |
| V10 OAuth/OIDC | N/A until investor login | — |
| V11 Cryptography | TLS 1.3, no custom crypto, hashed IP with pepper | Implemented |
| V12 Files/resources | No file upload from public forms | Implemented by omission |
| V13 API/Web service | Rate limits, input limits, no verbose errors | Implemented; shared limiter pending |
| V14 Configuration | Secrets separation, dependency pinning, headers | Implemented; dependency scanning in CI |
| V15 Data protection | Minimisation, retention function, segregated sensitive data, hashed identifiers | Implemented; legal review pending |
| V16 Security logging | Audit log, no PII in logs, error monitoring | Audit implemented; monitoring tooling pending |
| V17 WebRTC | N/A | — |

---

## 5. Incident response

**Named roles to fill before launch:** incident lead, technical lead, privacy
lead, safeguarding lead, communications lead. Until named, the board is the
escalation point.

1. **Detect and contain.** Revoke exposed keys, disable the affected route or
   account, preserve logs (`audit_log`, `payment_events`, hosting logs). Do not
   delete evidence.
2. **Assess.** Determine categories of data and number of people affected, and
   whether a vulnerable person is at risk.
3. **Notify.** If a personal-data breach creates a risk to rights and freedoms,
   notify the **Office of the Data Protection Commissioner within 72 hours** of
   becoming aware, and inform affected individuals without undue delay where
   required. Payment providers have their own notification duties — follow them.
4. **Remediate.** Rotate credentials, patch, add a regression test, and document
   the change.
5. **Review.** Publish a short, non-defensive incident note when donors are
   affected. Update this document and the threat model.

### Key rotation checklist

- Supabase service-role key (immediate).
- Payment provider keys and webhook signing secrets.
- Transactional email API key.
- `FORM_HASH_PEPPER` (invalidates abuse-correlation history by design).

---

## 6. Pre-launch security gates

- [ ] Shared rate limiter in place, tested across two instances.
- [ ] Penetration test or structured internal ASVS L2 review completed.
- [ ] CSP reviewed after any third-party script is added; `/donate` hardened.
- [ ] Supabase MFA enforced for every privileged account; roles reviewed.
- [ ] Backup restore drill completed and timed.
- [ ] Log redaction verified with real form submissions.
- [ ] Secret scan of the full Git history.
- [ ] `npm audit` clean at `high` and above.
- [ ] Incident contacts and 72-hour ODPC workflow rehearsed.
- [ ] `NEXT_PUBLIC_SITE_STATUS=live` only after sign-off.

---

## 7. Reporting a vulnerability

Until a dedicated security address is verified, report vulnerabilities through
the website contact form, selecting **Privacy request**, and state that it is a
security report. Do not include exploit code in the first message. We will
acknowledge and arrange a private channel.
