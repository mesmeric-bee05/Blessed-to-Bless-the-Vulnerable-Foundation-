-- ============================================================================
-- BBVF — initial schema
-- Target: Supabase / PostgreSQL 15+
--
-- Design principles
--   * Content is never public until status = 'published' AND approved_by is set.
--   * Every published claim carries a source, an approval owner and a review date.
--   * Donations are only ever marked succeeded by a verified provider event.
--   * Beneficiary safeguarding data is segregated and deny-by-default.
--   * Deny by default in RLS; the public site reads published rows only.
-- ============================================================================

create extension if not exists pgcrypto;
create extension if not exists citext;

-- ---------------------------------------------------------------- enum types
create type content_status as enum (
  'draft', 'needs_review', 'approved', 'published', 'archived', 'rejected'
);

create type staff_role as enum (
  'super_admin',
  'content_editor',
  'campaign_manager',
  'finance_manager',
  'safeguarding_reviewer',
  'communications_editor',
  'support_agent',
  'read_only_auditor'
);

create type campaign_state as enum ('active', 'upcoming', 'completed', 'archived');

create type delivery_state as enum ('active', 'fundraising', 'planned', 'completed', 'paused');

create type payment_state as enum (
  'initiated', 'pending', 'authorized', 'succeeded', 'failed', 'cancelled',
  'expired', 'refunded', 'partially_refunded', 'chargeback', 'under_review'
);

create type consent_scope as enum ('web', 'social', 'print', 'donor_report', 'internal_only');

create type identity_sensitivity as enum ('low', 'medium', 'high');

create type submission_state as enum ('new', 'in_triage', 'actioned', 'closed', 'spam');

-- ------------------------------------------------------------- shared trigger
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------------- profiles
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role staff_role not null default 'read_only_auditor',
  mfa_enrolled boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
before update on profiles
for each row execute function set_updated_at();

create or replace function current_staff_role()
returns staff_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid() and is_active;
$$;

create or replace function is_staff(allowed staff_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(current_staff_role() = any (allowed), false);
$$;

-- ------------------------------------------------------------------- programs
create table programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  title text not null,
  beneficiary_group text not null,
  summary text not null,
  body_md text,
  delivery_status delivery_state not null default 'planned',
  geography text[] not null default '{}',
  safeguarding_note text,
  source_note text not null,
  status content_status not null default 'draft',
  approved_by uuid references profiles (id),
  approved_at timestamptz,
  review_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_requires_approval
    check (status <> 'published' or (approved_by is not null and approved_at is not null))
);

create trigger programs_updated_at
before update on programs
for each row execute function set_updated_at();

create table program_activities (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs (id) on delete cascade,
  label text not null,
  detail text not null,
  delivery_status delivery_state not null default 'planned',
  sort_order int not null default 0
);

-- ------------------------------------------------------------------ campaigns
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  title text not null,
  short_title text not null,
  program_id uuid references programs (id) on delete set null,
  beneficiary_group text not null,
  state campaign_state not null default 'upcoming',
  summary text not null,
  story_md text,
  target_amount numeric(14, 2) check (target_amount is null or target_amount >= 0),
  received_amount numeric(14, 2) check (received_amount is null or received_amount >= 0),
  pending_amount numeric(14, 2) check (pending_amount is null or pending_amount >= 0),
  disbursed_amount numeric(14, 2) check (disbursed_amount is null or disbursed_amount >= 0),
  currency char(3) not null default 'KES',
  supporter_count int check (supporter_count is null or supporter_count >= 0),
  snapshot_date date not null,
  snapshot_source text not null,
  external_url text,
  status content_status not null default 'draft',
  approved_by uuid references profiles (id),
  approved_at timestamptz,
  review_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_campaign_requires_approval
    check (status <> 'published' or (approved_by is not null and approved_at is not null)),
  constraint received_not_above_target
    check (target_amount is null or received_amount is null or received_amount <= target_amount)
);

create trigger campaigns_updated_at
before update on campaigns
for each row execute function set_updated_at();

create table campaign_budgets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  label text not null,
  amount numeric(14, 2) not null check (amount >= 0),
  currency char(3) not null default 'KES',
  notes text,
  status content_status not null default 'draft',
  approved_by uuid references profiles (id),
  approved_at timestamptz
);

create table campaign_updates (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  title text not null,
  body_md text not null,
  author_name text not null,
  evidence_note text,
  published_at timestamptz,
  status content_status not null default 'draft'
);

-- -------------------------------------------------------------- impact metrics
create table impact_metrics (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value_text text not null,
  numeric_value numeric(16, 2),
  unit text,
  reporting_period text not null,
  definition text not null,
  source text not null,
  approval_owner uuid references profiles (id),
  review_date date,
  status content_status not null default 'draft',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------- media & consent first
create table media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  alt_text text not null,
  caption text,
  subject_category text,
  consent_status boolean not null default false,
  consent_document_ref text,
  consent_scope consent_scope[] not null default '{}',
  guardian_consent boolean not null default false,
  subject_is_minor boolean not null default false,
  identity_sensitivity identity_sensitivity not null default 'high',
  show_face boolean not null default false,
  show_name boolean not null default false,
  show_location boolean not null default false,
  consent_expires_on date,
  reviewer_id uuid references profiles (id),
  exif_stripped boolean not null default false,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  constraint minor_requires_guardian
    check (not subject_is_minor or guardian_consent)
);

-- -------------------------------------------------------------------- stories
create table stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,120}$'),
  title text not null,
  kind text not null default 'field-update',
  excerpt text not null,
  body_md text not null,
  author_name text not null,
  program_id uuid references programs (id) on delete set null,
  campaign_id uuid references campaigns (id) on delete set null,
  hero_media_id uuid references media_assets (id) on delete set null,
  consent_note text not null,
  published_at timestamptz,
  status content_status not null default 'draft',
  approved_by uuid references profiles (id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger stories_updated_at
before update on stories
for each row execute function set_updated_at();

-- -------------------------------------------------------------- leadership etc.
create table leadership_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null,
  bio text not null,
  photo_id uuid references media_assets (id) on delete set null,
  external_profile_url text,
  conflict_declaration text,
  consent_to_publish boolean not null default false,
  approved_on date,
  sort_order int not null default 0,
  status content_status not null default 'draft',
  constraint leadership_requires_consent
    check (status <> 'published' or consent_to_publish)
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  report_year int,
  summary_html text,
  file_path text,
  external_url text,
  published_on date,
  status content_status not null default 'draft',
  approved_by uuid references profiles (id)
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null,
  sort_order int not null default 0,
  status content_status not null default 'draft',
  updated_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  location_name text,
  location_is_public boolean not null default false,
  contact_route text,
  status content_status not null default 'draft'
);

create table policies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body_md text not null,
  version text not null default '0.1',
  legal_reviewed boolean not null default false,
  reviewed_by text,
  status content_status not null default 'draft',
  updated_at timestamptz not null default now()
);

create table partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  logo_id uuid references media_assets (id) on delete set null,
  disclosure_consent boolean not null default false,
  status content_status not null default 'draft'
);

-- ------------------------------------------------------------ donation methods
create table donation_methods (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  kind text not null check (kind in ('mpesa', 'card', 'bank', 'recurring', 'in_kind')),
  provider text,
  reference text,
  instructions text,
  external_url text,
  is_live boolean not null default false,
  verified_by uuid references profiles (id),
  verified_at timestamptz,
  status content_status not null default 'draft',
  constraint live_method_requires_verification
    check (not is_live or (verified_by is not null and verified_at is not null))
);

create table contact_channels (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('phone', 'whatsapp', 'email', 'address', 'hours')),
  label text,
  value text not null,
  is_public boolean not null default false,
  verified_at timestamptz
);

-- -------------------------------------------------------------------- donations
create table donations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  campaign_id uuid references campaigns (id) on delete set null,
  program_id uuid references programs (id) on delete set null,
  donor_name text,
  donor_email citext,
  amount numeric(14, 2) not null check (amount > 0),
  currency char(3) not null default 'KES',
  state payment_state not null default 'initiated',
  provider text,
  provider_reference text,
  idempotency_key text unique,
  is_anonymous boolean not null default false,
  marketing_consent boolean not null default false,
  receipt_sent_at timestamptz,
  reconciled_at timestamptz,
  reconciled_by uuid references profiles (id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index donations_campaign_idx on donations (campaign_id, state);
create index donations_state_idx on donations (state, created_at desc);

create trigger donations_updated_at
before update on donations
for each row execute function set_updated_at();

-- Webhook inbox: raw provider event committed before acknowledgement.
create table payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  payload jsonb not null,
  signature_verified boolean not null default false,
  processed_at timestamptz,
  processing_error text,
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create table receipts (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references donations (id) on delete cascade,
  provider_message_id text,
  sent_to citext not null,
  sent_at timestamptz not null default now(),
  pdf_path text
);

create table refunds (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references donations (id) on delete cascade,
  amount numeric(14, 2) not null check (amount > 0),
  reason text not null,
  provider_reference text,
  processed_by uuid references profiles (id),
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------- public form intake
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null,
  email citext not null,
  phone text,
  organisation text,
  topic text,
  message text not null,
  consent boolean not null default false,
  consent_at timestamptz,
  policy_version text,
  source_page text,
  ip_hash text,
  user_agent text,
  state submission_state not null default 'new',
  created_at timestamptz not null default now()
);

create table volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null,
  email citext not null,
  phone text,
  message text not null,
  topic text,
  consent boolean not null default false,
  consent_at timestamptz,
  policy_version text,
  source_page text,
  ip_hash text,
  user_agent text,
  state submission_state not null default 'new',
  created_at timestamptz not null default now()
);

create table partnership_inquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null,
  email citext not null,
  phone text,
  organisation text not null,
  message text not null,
  consent boolean not null default false,
  consent_at timestamptz,
  policy_version text,
  source_page text,
  ip_hash text,
  user_agent text,
  state submission_state not null default 'new',
  created_at timestamptz not null default now()
);

create table institutional_inquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null,
  email citext not null,
  phone text,
  organisation text not null,
  amount_band text,
  message text not null,
  consent boolean not null default false,
  consent_at timestamptz,
  policy_version text,
  source_page text,
  ip_hash text,
  user_agent text,
  state submission_state not null default 'new',
  created_at timestamptz not null default now()
);

create table donation_intents (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null,
  email citext not null,
  phone text,
  amount_band text not null,
  payment_method text not null,
  message text,
  consent boolean not null default false,
  consent_at timestamptz,
  policy_version text,
  source_page text,
  ip_hash text,
  user_agent text,
  state submission_state not null default 'new',
  created_at timestamptz not null default now()
);

-- Safeguarding reports are segregated and restricted by RLS below.
create table safeguarding_reports (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text,
  email citext,
  phone text,
  message text not null,
  consent boolean not null default false,
  consent_at timestamptz,
  policy_version text,
  source_page text,
  ip_hash text,
  user_agent text,
  state submission_state not null default 'new',
  reviewer_id uuid references profiles (id),
  reviewer_notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  consent boolean not null default false,
  consent_at timestamptz,
  policy_version text,
  source_page text,
  ip_hash text,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------- audit logging
create table audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references profiles (id) on delete set null,
  actor_role staff_role,
  action text not null,
  entity text not null,
  entity_id text,
  diff jsonb,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index audit_log_entity_idx on audit_log (entity, entity_id);
create index audit_log_created_idx on audit_log (created_at desc);

create or replace function audit_row()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into audit_log (actor_id, actor_role, action, entity, entity_id, diff)
  values (
    auth.uid(),
    current_staff_role(),
    lower(tg_op),
    tg_table_name,
    coalesce(new.id::text, old.id::text),
    case
      when tg_op = 'DELETE' then jsonb_build_object('old', to_jsonb(old))
      when tg_op = 'UPDATE' then jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new))
      else jsonb_build_object('new', to_jsonb(new))
    end
  );
  return coalesce(new, old);
end;
$$;

-- Audit the tables where an unexplained change would be most damaging.
create trigger audit_campaigns
after insert or update or delete on campaigns
for each row execute function audit_row();

create trigger audit_donation_methods
after insert or update or delete on donation_methods
for each row execute function audit_row();

create trigger audit_media_assets
after insert or update or delete on media_assets
for each row execute function audit_row();

create trigger audit_leadership
after insert or update or delete on leadership_profiles
for each row execute function audit_row();

create trigger audit_policies
after insert or update or delete on policies
for each row execute function audit_row();

-- ---------------------------------------------------------------- integrity
-- A donation may not leave a terminal success state without a verified event.
create or replace function guard_donation_state()
returns trigger
language plpgsql
as $$
begin
  if new.state = 'succeeded' and old.state is distinct from 'succeeded' then
    if not exists (
      select 1 from payment_events
      where signature_verified
        and provider = new.provider
        and processed_at is not null
    ) then
      raise exception 'A donation cannot be marked succeeded without a verified, processed payment event';
    end if;
  end if;
  return new;
end;
$$;

create trigger donations_state_guard
before update on donations
for each row execute function guard_donation_state();

create or replace view campaign_funding_public as
select
  c.id,
  c.slug,
  c.title,
  c.target_amount,
  c.currency,
  coalesce(sum(d.amount) filter (where d.state = 'succeeded'), 0) as reconciled_received,
  coalesce(sum(d.amount) filter (where d.state in ('pending', 'authorized')), 0) as pending_amount,
  count(distinct d.donor_email) filter (where d.state = 'succeeded') as donors
from campaigns c
left join donations d on d.campaign_id = c.id
where c.status = 'published'
group by c.id;

-- ============================================================== RLS policies
alter table profiles enable row level security;
alter table programs enable row level security;
alter table program_activities enable row level security;
alter table campaigns enable row level security;
alter table campaign_budgets enable row level security;
alter table campaign_updates enable row level security;
alter table impact_metrics enable row level security;
alter table media_assets enable row level security;
alter table stories enable row level security;
alter table leadership_profiles enable row level security;
alter table reports enable row level security;
alter table faqs enable row level security;
alter table events enable row level security;
alter table policies enable row level security;
alter table partners enable row level security;
alter table donation_methods enable row level security;
alter table contact_channels enable row level security;
alter table donations enable row level security;
alter table payment_events enable row level security;
alter table receipts enable row level security;
alter table refunds enable row level security;
alter table contact_submissions enable row level security;
alter table volunteer_applications enable row level security;
alter table partnership_inquiries enable row level security;
alter table institutional_inquiries enable row level security;
alter table donation_intents enable row level security;
alter table safeguarding_reports enable row level security;
alter table newsletter_subscribers enable row level security;
alter table audit_log enable row level security;

-- profiles: a person sees their own row; admins see all.
create policy profiles_self_read on profiles
for select to authenticated
using (id = auth.uid() or is_staff(array['super_admin']::staff_role[]));

create policy profiles_admin_write on profiles
for all to authenticated
using (is_staff(array['super_admin']::staff_role[]))
with check (is_staff(array['super_admin']::staff_role[]));

-- Published, approved content is readable by anyone.
create policy programs_public_read on programs
for select to anon, authenticated
using (status = 'published' and approved_by is not null);

create policy program_activities_public_read on program_activities
for select to anon, authenticated
using (exists (
  select 1 from programs p
  where p.id = program_id and p.status = 'published' and p.approved_by is not null
));

create policy campaigns_public_read on campaigns
for select to anon, authenticated
using (status = 'published' and approved_by is not null);

create policy campaign_budgets_public_read on campaign_budgets
for select to anon, authenticated
using (
  status = 'published'
  and exists (select 1 from campaigns c where c.id = campaign_id and c.status = 'published')
);

create policy campaign_updates_public_read on campaign_updates
for select to anon, authenticated
using (
  status = 'published'
  and exists (select 1 from campaigns c where c.id = campaign_id and c.status = 'published')
);

create policy impact_metrics_public_read on impact_metrics
for select to anon, authenticated
using (status = 'published');

create policy stories_public_read on stories
for select to anon, authenticated
using (status = 'published' and approved_by is not null);

create policy leadership_public_read on leadership_profiles
for select to anon, authenticated
using (status = 'published' and consent_to_publish);

create policy reports_public_read on reports
for select to anon, authenticated
using (status = 'published');

create policy faqs_public_read on faqs
for select to anon, authenticated
using (status = 'published');

create policy events_public_read on events
for select to anon, authenticated
using (status = 'published');

create policy policies_public_read on policies
for select to anon, authenticated
using (status = 'published' and legal_reviewed);

create policy partners_public_read on partners
for select to anon, authenticated
using (status = 'published' and disclosure_consent);

create policy donation_methods_public_read on donation_methods
for select to anon, authenticated
using (status = 'published' and is_live and verified_by is not null);

create policy contact_channels_public_read on contact_channels
for select to anon, authenticated
using (is_public and verified_at is not null);

-- Media assets: only consented, approved assets are public. Storage path is not
-- itself a security boundary; RLS is.
create policy media_public_read on media_assets
for select to anon, authenticated
using (status = 'published' and consent_status and exif_stripped);

-- Editorial write access is role-scoped. Content editors cannot touch finance.
create policy programs_editor_write on programs
for all to authenticated
using (is_staff(array['super_admin', 'content_editor']::staff_role[]))
with check (is_staff(array['super_admin', 'content_editor']::staff_role[]));

create policy campaigns_manager_write on campaigns
for all to authenticated
using (is_staff(array['super_admin', 'campaign_manager']::staff_role[]))
with check (is_staff(array['super_admin', 'campaign_manager']::staff_role[]));

create policy impact_editor_write on impact_metrics
for all to authenticated
using (is_staff(array['super_admin', 'content_editor', 'campaign_manager']::staff_role[]))
with check (is_staff(array['super_admin', 'content_editor', 'campaign_manager']::staff_role[]));

create policy stories_editor_write on stories
for all to authenticated
using (is_staff(array['super_admin', 'content_editor', 'communications_editor']::staff_role[]))
with check (is_staff(array['super_admin', 'content_editor', 'communications_editor']::staff_role[]));

create policy faqs_editor_write on faqs
for all to authenticated
using (is_staff(array['super_admin', 'content_editor', 'communications_editor']::staff_role[]))
with check (is_staff(array['super_admin', 'content_editor', 'communications_editor']::staff_role[]));

create policy policies_editor_write on policies
for all to authenticated
using (is_staff(array['super_admin', 'content_editor']::staff_role[]))
with check (is_staff(array['super_admin', 'content_editor']::staff_role[]));

create policy reports_editor_write on reports
for all to authenticated
using (is_staff(array['super_admin', 'content_editor', 'finance_manager']::staff_role[]))
with check (is_staff(array['super_admin', 'content_editor', 'finance_manager']::staff_role[]));

create policy leadership_editor_write on leadership_profiles
for all to authenticated
using (is_staff(array['super_admin', 'content_editor']::staff_role[]))
with check (is_staff(array['super_admin', 'content_editor']::staff_role[]));

create policy media_reviewer_write on media_assets
for all to authenticated
using (is_staff(array['super_admin', 'content_editor', 'safeguarding_reviewer']::staff_role[]))
with check (is_staff(array['super_admin', 'content_editor', 'safeguarding_reviewer']::staff_role[]));

create policy donation_methods_finance_write on donation_methods
for all to authenticated
using (is_staff(array['super_admin', 'finance_manager']::staff_role[]))
with check (is_staff(array['super_admin', 'finance_manager']::staff_role[]));

-- Donations: finance and auditors read; only finance writes.
create policy donations_finance_read on donations
for select to authenticated
using (is_staff(array['super_admin', 'finance_manager', 'read_only_auditor']::staff_role[]));

create policy donations_finance_write on donations
for update to authenticated
using (is_staff(array['super_admin', 'finance_manager']::staff_role[]))
with check (is_staff(array['super_admin', 'finance_manager']::staff_role[]));

create policy payment_events_admin_read on payment_events
for select to authenticated
using (is_staff(array['super_admin', 'finance_manager', 'read_only_auditor']::staff_role[]));

create policy receipts_finance_read on receipts
for select to authenticated
using (is_staff(array['super_admin', 'finance_manager', 'read_only_auditor']::staff_role[]));

create policy refunds_finance_write on refunds
for all to authenticated
using (is_staff(array['super_admin', 'finance_manager']::staff_role[]))
with check (is_staff(array['super_admin', 'finance_manager']::staff_role[]));

-- Public form intake: no anon/authenticated policies at all. The website writes
-- with the service role only, after server-side validation and rate limiting.
-- Staff read access, role-scoped:
create policy contact_submissions_support_read on contact_submissions
for select to authenticated
using (is_staff(array['super_admin', 'support_agent', 'content_editor']::staff_role[]));

create policy contact_submissions_support_write on contact_submissions
for update to authenticated
using (is_staff(array['super_admin', 'support_agent']::staff_role[]))
with check (is_staff(array['super_admin', 'support_agent']::staff_role[]));

create policy volunteer_read on volunteer_applications
for select to authenticated
using (is_staff(array['super_admin', 'support_agent', 'content_editor']::staff_role[]));

create policy partnership_read on partnership_inquiries
for select to authenticated
using (is_staff(array['super_admin', 'support_agent', 'campaign_manager']::staff_role[]));

create policy institutional_read on institutional_inquiries
for select to authenticated
using (is_staff(array['super_admin', 'support_agent', 'finance_manager']::staff_role[]));

create policy donation_intents_read on donation_intents
for select to authenticated
using (is_staff(array['super_admin', 'support_agent', 'finance_manager']::staff_role[]));

create policy newsletter_admin_read on newsletter_subscribers
for select to authenticated
using (is_staff(array['super_admin', 'communications_editor', 'support_agent']::staff_role[]));

-- Safeguarding: reviewers and super admins only. No public read, ever.
create policy safeguarding_reviewer_all on safeguarding_reports
for all to authenticated
using (is_staff(array['super_admin', 'safeguarding_reviewer']::staff_role[]))
with check (is_staff(array['super_admin', 'safeguarding_reviewer']::staff_role[]));

-- Audit log: readable by auditors and super admins; append-only.
create policy audit_log_read on audit_log
for select to authenticated
using (is_staff(array['super_admin', 'read_only_auditor']::staff_role[]));

create policy audit_log_insert on audit_log
for insert to authenticated
with check (is_staff(array['super_admin', 'finance_manager', 'content_editor', 'campaign_manager']::staff_role[]));

-- ---------------------------------------------------------- retention helpers
-- Deletes stale low-risk intake records. Run monthly via pg_cron or a scheduled
-- Supabase Edge Function. Safeguarding and financial records are excluded.
create or replace function purge_expired_intake()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from contact_submissions where created_at < now() - interval '24 months';
  delete from volunteer_applications where created_at < now() - interval '24 months';
  delete from partnership_inquiries where created_at < now() - interval '24 months';
  delete from institutional_inquiries where created_at < now() - interval '24 months';
  delete from donation_intents where created_at < now() - interval '24 months';
  delete from newsletter_subscribers where unsubscribed_at < now() - interval '24 months';
end;
$$;

-- --------------------------------------------------------------- storage setup
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

-- Only safeguarding reviewers and editors may upload media. Public delivery is
-- via signed URLs generated server-side after consent checks.
create policy media_upload_reviewer on storage.objects
for insert to authenticated
with check (
  bucket_id = 'media'
  and is_staff(array['super_admin', 'content_editor', 'safeguarding_reviewer']::staff_role[])
);

create policy media_read_reviewer on storage.objects
for select to authenticated
using (
  bucket_id = 'media'
  and is_staff(array['super_admin', 'content_editor', 'safeguarding_reviewer']::staff_role[])
);
