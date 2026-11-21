# Content governance & launch gates

The specification's central discipline is that **a beautiful site built on
unverified claims loses trust the moment a diligent donor checks**. This document
is the operating rulebook that prevents that.

---

## 1. The publication rule

Nothing appears on the public site unless it has:

1. a **source** (where the fact came from),
2. an **approval owner** (a named person with authority to stand behind it),
3. an **approval date**, and
4. a **review date**.

Where a value is unknown, the public page states that it is pending. It is never
filled with a plausible-sounding guess — not a registration number, not a
leadership name, not a financial figure, not a testimonial, not a partner logo,
not a unit cost.

In the database this is enforced by:

- `content_status` values: `draft → needs_review → approved → published →
  archived` (plus `rejected`).
- A check constraint: a row can only be `published` if `approved_by` and
  `approved_at` are set.
- RLS: anonymous readers can only see `published` rows, plus consent/verification
  flags on media, leadership and donation methods.

---

## 2. Current public claims and their basis

| Claim | Source | Status |
| --- | --- | --- |
| Name, county, four focus areas | BBVF public profile and supplied material | Verified, published |
| Four campaign titles and targets | Public campaign pages, 21 Nov 2026 | Published with date and source note |
| KES 1,500 / 2 supporters on elderly campaign | Public campaign page, 21 Nov 2026 | Published with date and reconciliation caveat |
| November 2026 Eastern Bypass drive and Spirit of Mercy visit | BBVF supplied material / public profile | Published as a field update |
| Mission and vision wording | Synthesis of supplied programme copy | Published as a **working statement pending board approval** |
| Legal registration | Not supplied | **Withheld** |
| Leadership and board | Not supplied with consent | **Withheld** |
| Phone, email, office address | Not verified | **Withheld** |
| Audited accounts, impact outcomes | Not supplied | **Withheld** |
| ODPC registration number | Not issued / not supplied | **Withheld** |

When a withheld item is supplied and approved, update `src/content/*`, the
Supabase row, and the review date on the page.

---

## 3. Media and consent

Every media asset must record:

- subject category and identity sensitivity;
- consent status, consent document reference and scope
  (`web`, `social`, `print`, `donor_report`, `internal_only`);
- guardian consent where the subject is a minor (enforced by a database check);
- whether face, name and location may be shown;
- consent expiry / review date;
- the named safeguarding reviewer;
- EXIF-stripping status.

**Never publish:** home addresses, GPS coordinates, school schedules, unredacted
medical records or diagnoses, identity-document numbers, or any detail that could
expose a person to stigma, retaliation, exploitation or physical harm.

**Withdrawal:** any beneficiary, family member or guardian may ask for removal at
any time, without giving a reason. Remove promptly, record the request, confirm
what was done.

The current site uses **no photographs of people**. Programme pages use original
abstract artwork. This is deliberate: stock photographs of unrelated children
would be a misrepresentation, and field photography requires consent records that
do not yet exist.

---

## 4. Donation and financial claims

- A campaign **target** is a target. It is never described as money raised.
- `received` is the amount displayed on the public campaign page on a stated
  date, with a visible source note.
- `pending`, `committed` and `disbursed` are published only after finance
  reconciliation.
- No progress bar may be driven by client input; widths are computed from
  published figures at render time.
- No fixed unit-cost claims ("KES 2,000 feeds a family for a week") without a
  current, approved basis.
- No tax-deductibility claim in any jurisdiction without legal confirmation.

---

## 5. Launch gates

The following must be signed off before `NEXT_PUBLIC_SITE_STATUS=live`.

### Legal and governance
- [ ] Legal entity type, registration number, registering authority confirmed.
- [ ] ODPC registration certificate obtained; number ready to publish.
- [ ] Privacy notice, cookie notice, terms, donation terms, media consent and
      retention schedule reviewed by Kenyan counsel.
- [ ] Safeguarding policies adopted and a safeguarding lead named.
- [ ] Board and leadership consents on file.

### Content
- [ ] Every public page has a source, approval owner, approval date and review date.
- [ ] No `[CLIENT INPUT REQUIRED]` item is publicly visible.
- [ ] Contact phone, email and office address verified by BBVF.
- [ ] Every campaign figure reconciled against provider/bank records, or clearly
      labelled as a dated public snapshot.
- [ ] All photographs have complete consent records; EXIF stripped.
- [ ] FAQ answers reviewed by the person accountable for each topic.

### Money
- [ ] Payment provider contract signed and merchant account verified in BBVF's name.
- [ ] Provider webhook signature verification implemented and tested.
- [ ] Duplicate-webhook test passed (one event = one donation).
- [ ] Refund and chargeback procedure documented and tested in sandbox.
- [ ] Reconciliation export reviewed by finance.
- [ ] Receipt email authenticated with SPF, DKIM and DMARC.
- [ ] No card data touches BBVF servers (hosted or tokenised fields only).

### Technical
- [ ] `npm run build` and `npm run typecheck` pass in CI.
- [ ] `npm audit` clean at high and above; Dependabot enabled.
- [ ] Independent WCAG 2.2 AA audit and manual screen-reader pass completed.
- [ ] Lighthouse 90+ on Performance, Accessibility, Best Practices, SEO for
      homepage, programme, campaign and donate pages.
- [ ] Structured data validated with Google's Rich Results Test.
- [ ] Backup restore drill completed.
- [ ] Uptime and error monitoring connected; alert owners named.
- [ ] Search Console and Bing Webmaster Tools verified with BBVF-owned accounts.
- [ ] Secret scan of Git history; no keys in the client bundle.
- [ ] Rollback plan and named launch signatory documented.

---

## 6. Ongoing cadence

| Frequency | Activity |
| --- | --- |
| Daily | Uptime and error alerts; payment-webhook failure queue |
| Weekly | Test a giving path on mobile; review intake submissions; dependency alerts |
| Monthly | Core Web Vitals and Search Console review; backup integrity check; access review; content review-date sweep |
| Quarterly | Manual WCAG sample audit; site-wide broken-link crawl; content accuracy audit; restore drill |
| Annually | Penetration test; ASVS L2 review; ODPC renewal check; PBO/PBORA document review; annual report publication; full SEO audit |

Each activity needs a named owner and an expected response time. A cadence with no
owner is a wish, not a control.
