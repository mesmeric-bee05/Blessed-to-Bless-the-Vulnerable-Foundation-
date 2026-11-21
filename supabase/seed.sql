-- ============================================================================
-- BBVF — seed data
--
-- CONTENT-INTEGRITY RULE: every row here is either verified public information
-- or explicitly marked 'needs_review'. Nothing is seeded as 'published'.
-- Publishing requires a real staff profile to approve the row, which is the
-- control that prevents unverified content reaching the public site.
--
-- Figures are the ones displayed on BBVF's public Our Jamii profile on
-- 21 November 2026. They are a dated snapshot, not a bank ledger.
-- ============================================================================

insert into programs
  (slug, title, beneficiary_group, summary, body_md, delivery_status, geography, safeguarding_note, source_note, status, review_date)
values
  (
    'children-education',
    'Children & education',
    'Vulnerable children and school-age learners',
    'School supplies, uniforms, retention support and home visits so that a child''s education is not interrupted by poverty.',
    'School supplies, uniforms, retention support and home visits. Source narrative: BBVF public campaign copy and the November 2026 Eastern Bypass drive.',
    'active',
    array['Eastern Bypass corridor, Nairobi', 'Kamae, Kahawa West'],
    'Any story, image or name of a child is published only with written guardian consent and a named safeguarding reviewer''s approval.',
    'BBVF supplied organisational material and public campaign pages.',
    'needs_review',
    '2027-05-21'
  ),
  (
    'elderly-care',
    'Elderly care & dignity',
    'Older persons living in care homes and community settings',
    'Food, clothing, bedding, healthcare access, companionship and grief counselling for older persons who should not face old age alone.',
    'Food staples, bedding, clothing, hygiene items, healthcare access, companionship and grief counselling. Source narrative: "Ageing with Dignity" campaign copy.',
    'active',
    array['Nairobi County'],
    'Older persons are consulted about how they are photographed and described. Health details and precise locations are never published.',
    'BBVF public campaign narrative.',
    'needs_review',
    '2027-05-21'
  ),
  (
    'disability-inclusion',
    'Disability inclusion',
    'Children and adults with physical, intellectual, developmental and psychosocial disabilities',
    'Assistive devices, inclusive education support, rehabilitation and dignity items that remove the everyday barriers to participation.',
    'Wheelchairs, crutches, walking frames, hearing and visual support devices, assistive learning materials, personal care supplies and rehabilitation access. Source narrative: "Breaking Barriers" campaign copy.',
    'active',
    array['Nairobi County'],
    'Disability details are sensitive personal data, collected only with consent and never published without explicit approval.',
    'BBVF public campaign narrative.',
    'needs_review',
    '2027-05-21'
  ),
  (
    'amputee-veterans',
    'Amputee veterans',
    'Veterans living with limb loss and their families',
    'Prosthetic and mobility support, rehabilitation, psychosocial care and economic reintegration for veterans rebuilding life after service.',
    'Prosthetic assessment and fitting support, rehabilitation, psychosocial support and economic reintegration. Source narrative: "Beyond Service" campaign copy.',
    'active',
    array['Nairobi County and referral partners'],
    'Military service details and medical information are treated as highly sensitive and are never published without written veteran consent.',
    'BBVF public campaign narrative.',
    'needs_review',
    '2027-05-21'
  )
on conflict (slug) do nothing;

-- Activities
insert into program_activities (program_id, label, detail, delivery_status, sort_order)
select p.id, v.label, v.detail, v.status::delivery_state, v.sort_order
from (values
  ('children-education', 'Back-to-school supplies', 'Uniforms, shoes, bags, exercise books and writing materials for children identified with partner homes and families.', 'active', 1),
  ('children-education', 'Retention and follow-up', 'Home and care-home visits to confirm the child has stayed in school.', 'active', 2),
  ('children-education', 'Care-home equipping', 'Mattresses, blankets and clothing delivered against an agreed list.', 'active', 3),
  ('children-education', 'School fees and learning support', 'Availability depends on funds raised and is assessed case by case.', 'fundraising', 4),
  ('elderly-care', 'Essential household supplies', 'Food staples, bedding, clothing and hygiene items against an agreed list.', 'active', 1),
  ('elderly-care', 'Healthcare access', 'Transport, medication and routine health checks where funds allow. Not an emergency service.', 'fundraising', 2),
  ('elderly-care', 'Companionship & grief support', 'Structured visits and counselling support.', 'active', 3),
  ('elderly-care', 'Mobility and safety equipment', 'Walking frames, wheelchairs, anti-slip mats and fall-prevention equipment.', 'fundraising', 4),
  ('disability-inclusion', 'Assistive devices', 'Wheelchairs, crutches, walking frames, hearing and visual support, assessed for fit.', 'active', 1),
  ('disability-inclusion', 'Inclusive education support', 'Assistive learning materials so a learner can remain in class.', 'fundraising', 2),
  ('disability-inclusion', 'Rehabilitation access', 'Referral and transport support for physiotherapy and follow-up.', 'fundraising', 3),
  ('disability-inclusion', 'Personal care and dignity items', 'Agreed discreetly with the individual or their carer.', 'active', 4),
  ('amputee-veterans', 'Prosthetic and mobility support', 'Assessment, fitting support and mobility equipment.', 'fundraising', 1),
  ('amputee-veterans', 'Rehabilitation', 'Physiotherapy, mobility practice and follow-up after fitting.', 'fundraising', 2),
  ('amputee-veterans', 'Psychosocial support', 'Confidential counselling and peer support for veterans and families.', 'planned', 3),
  ('amputee-veterans', 'Economic reintegration', 'Skills development, enterprise support and connections to work.', 'planned', 4)
) as v(program_slug, label, detail, status, sort_order)
join programs p on p.slug = v.program_slug
where not exists (
  select 1 from program_activities a where a.program_id = p.id and a.label = v.label
);

-- Campaigns
insert into campaigns
  (slug, title, short_title, program_id, beneficiary_group, state, summary, story_md,
   target_amount, received_amount, supporter_count, currency, snapshot_date, snapshot_source,
   external_url, status)
select
  v.slug, v.title, v.short_title, p.id, v.beneficiary_group, 'active'::campaign_state,
  v.summary, v.story_md, v.target_amount, v.received_amount, v.supporter_count,
  'KES', '2026-11-21'::date,
  'Public campaign page snapshot, 21 November 2026',
  'https://jamii.esoqo.com/o/blessed-to-bless-the-vulnerable-foundation',
  'needs_review'::content_status
from (values
  (
    'ageing-with-dignity',
    'Ageing with Dignity: Equipping Elderly People''s Homes',
    'Ageing with Dignity',
    'elderly-care',
    'Older persons in care homes',
    'Equip elderly people''s homes with bedding, household essentials and mobility equipment so that older persons can live with safety and dignity.',
    'Growing older should never mean living without comfort, dignity or proper care. Support is delivered against an agreed needs list and recorded for reporting.',
    50000000, 1500, 2
  ),
  (
    'beyond-service',
    'Beyond Service: Restoring Dignity and Empowering Amputee Veterans',
    'Beyond Service',
    'amputee-veterans',
    'Amputee veterans',
    'Help amputee veterans access prosthetic support, rehabilitation, mobility equipment and pathways to independent living and economic reintegration.',
    'Limb loss affects mobility, independence, employment and family life. This campaign supports prosthetics, rehabilitation, psychosocial support and reintegration.',
    67000000, 0, 0
  ),
  (
    'breaking-barriers',
    'Breaking Barriers, Creating Opportunities: Supporting Children and Persons with Disabilities',
    'Breaking Barriers',
    'disability-inclusion',
    'Children and persons with disabilities',
    'Assistive devices, inclusive education support and essential resources that promote dignity, independence and participation.',
    'Assistive devices and inclusive education remove the everyday barriers that exclude children and adults with disabilities.',
    45000000, 0, 0
  ),
  (
    'give-a-child-a-chance',
    'Give a Child a Chance: Back-to-School Fund Drive 2027',
    'Give a Child a Chance',
    'children-education',
    'Vulnerable school-age children',
    'School supplies, uniforms, learning materials and retention support so that vulnerable children return to school with confidence.',
    'A uniform, shoes and exercise books can decide whether a child stays in school. The 2027 drive supplies what each learner is missing.',
    43000000, 0, 0
  )
) as v(slug, title, short_title, program_slug, beneficiary_group, summary, story_md, target_amount, received_amount, supporter_count)
join programs p on p.slug = v.program_slug
on conflict (slug) do nothing;

-- FAQs
insert into faqs (question, answer, category, sort_order, status)
select v.question, v.answer, v.category, v.sort_order, 'needs_review'::content_status
from (values
  ('How can I donate to BBVF today?', 'The verified giving route currently available is BBVF''s public Our Jamii campaign profile, which accepts M-Pesa. Card, bank transfer and recurring giving are being set up; until those rails are live and tested, no account details are displayed on this site.', 'Giving', 1),
  ('Are donations tax-deductible?', 'We do not claim tax-deductibility in any jurisdiction. BBVF''s registration and charitable status are being confirmed, and an incorrect tax claim would be a serious misrepresentation.', 'Giving', 2),
  ('Is BBVF a registered organisation?', 'BBVF is a Nairobi-based community foundation. Its exact legal form, registration number and registering authority are being confirmed with counsel under Kenya''s Public Benefit Organizations framework, and no unverified number is published.', 'Trust', 3),
  ('How do I report a safeguarding concern?', 'Use the safeguarding page to reach the safeguarding route, which is separate from general enquiries. If someone is in immediate danger, contact the Kenyan emergency services first.', 'Privacy', 4)
) as v(question, answer, category, sort_order)
where not exists (select 1 from faqs f where f.question = v.question);

-- Policies (drafts; legal_reviewed = false so they can never be published by RLS)
insert into policies (slug, title, summary, body_md, version, legal_reviewed, status)
values
  ('privacy', 'Privacy notice', 'What personal data BBVF collects, why, how long it is kept and how to exercise your rights.', 'Draft. See the website policy page for the current text.', '0.1', false, 'draft'),
  ('cookies', 'Cookie notice', 'This site is designed to work without advertising or analytics cookies.', 'Draft. See the website policy page.', '0.1', false, 'draft'),
  ('terms', 'Terms of use', 'The basis on which you may use this website.', 'Draft. See the website policy page.', '0.1', false, 'draft'),
  ('accessibility', 'Accessibility statement', 'WCAG 2.2 AA commitment and current limitations.', 'Draft pending independent audit.', '0.1', false, 'draft'),
  ('donations', 'Donation terms', 'Giving routes, receipts, refunds and the fraud warning.', 'Draft. See the website policy page.', '0.1', false, 'draft'),
  ('media-consent', 'Media consent policy', 'How BBVF decides whether a photograph, name or story may be published.', 'Draft. See the website policy page.', '0.1', false, 'draft'),
  ('data-retention', 'Data retention schedule', 'How long each category of data is kept.', 'Draft. See the website policy page.', '0.1', false, 'draft')
on conflict (slug) do nothing;

-- The known public route. Not marked live in the database because BBVF has not
-- yet recorded an internal verification sign-off in this system.
insert into donation_methods (label, kind, provider, external_url, instructions, is_live, status)
select
  'M-Pesa via Our Jamii',
  'mpesa',
  'Our Jamii (Esoqo)',
  'https://jamii.esoqo.com/o/blessed-to-bless-the-vulnerable-foundation',
  'Choose a campaign on BBVF''s public profile and follow the M-Pesa prompt. The platform issues the receipt. BBVF will never ask for your M-Pesa PIN.',
  false,
  'needs_review'::content_status
where not exists (select 1 from donation_methods where provider = 'Our Jamii (Esoqo)');

-- No contact channel is seeded: the phone number in the discovery record came
-- from a third-party listing and must be verified by BBVF first.
