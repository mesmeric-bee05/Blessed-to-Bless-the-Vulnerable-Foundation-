# Admin CMS — operating guide

The admin area lives at `/admin`. It is a staff tool, not a public page: every
route is `noindex`, gated by middleware, and re-checked on the server.

## 1. Create the first staff account

1. In Supabase → Authentication → Users, create a user with email and password
   (or send a magic link). Enable MFA for every publishing role.
2. Copy the user's UUID and insert a profile row with the service role:

```sql
insert into profiles (id, full_name, role, mfa_enrolled)
values ('<auth-user-uuid>', 'Full Name', 'super_admin', true);
```

If a user has no profile, or `is_active` is false, sign-in is refused even when
the password is correct. That is deliberate: Supabase Auth proves identity,
`profiles` grants authority.

## 2. Roles

| Role | Can do |
| --- | --- |
| `super_admin` | Everything, including audit log and staff profiles |
| `content_editor` | Edit and publish programmes, policies, FAQs, stories |
| `campaign_manager` | Edit campaigns and campaign metrics |
| `finance_manager` | Read donations, record refunds, manage giving methods |
| `safeguarding_reviewer` | Read and triage safeguarding reports, review media |
| `communications_editor` | Edit stories, FAQs and updates |
| `support_agent` | Triage contact, volunteer and donation-intent queues |
| `read_only_auditor` | Read donations, payments, receipts and the audit log |

The database enforces these roles with row-level security. The CMS also checks
them in the server action, because the service-role key bypasses RLS.

## 3. Publishing rules

A row is public only when:

* `status = 'published'`, **and**
* `approved_by` and `approved_at` are set (programmes, campaigns, stories), **and**
* for policies, `legal_reviewed = true`, **and**
* for leadership, `consent_to_publish = true`, **and**
* for media, `consent_status = true` and `exif_stripped = true`.

Publishing from the CMS records the signed-in user as approver and writes an
`audit_log` row. Nothing can jump straight from draft to public without that
record.

## 4. Submissions

The website writes intake rows with the service-role key only, after server-side
validation, a same-origin check, a honeypot check and rate limiting. There are no
anonymous insert policies, so a leaked anon key cannot write to the queues.

Safeguarding reports are visible only to `safeguarding_reviewer` and
`super_admin`. Triaging one records the reviewer and the review time.

## 5. Sessions

The access token is stored in an httpOnly, SameSite=Lax cookie, verified against
Supabase Auth on every request and expires after one hour. There is no refresh
in the browser: a staff member signs in again after expiry. This keeps the
cookie surface small; add server-side refresh if longer sessions are required.

## 6. Audit

Database triggers record changes to campaigns, policies, media, leadership and
donation methods. The CMS records content saves and triage changes. The log is
append-only for staff: there is no update or delete policy.
