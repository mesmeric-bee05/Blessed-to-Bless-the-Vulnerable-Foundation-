export type Program = {
  slug: string;
  title: string;
  beneficiaryGroup: string;
  summary: string;
  status: "active" | "fundraising" | "planned";
  glyph: "child" | "elder" | "disability" | "veteran";
  intro: string[];
  activities: { label: string; detail: string; status: "active" | "fundraising" | "planned" }[];
  needs: string[];
  geography: string[];
  safeguarding: string;
  relatedCampaignSlug: string;
  sourceNote: string;
  lastReviewed: string;
};

export const programs: Program[] = [
  {
    slug: "children-education",
    title: "Children & education",
    beneficiaryGroup: "Vulnerable children and school-age learners",
    summary:
      "School supplies, uniforms, retention support and home visits so that a child's education is not interrupted by poverty.",
    status: "active",
    glyph: "child",
    intro: [
      "Every child deserves to return to school with confidence. For families living along Nairobi's Eastern Bypass corridor, the cost of a uniform, shoes, books and bedding can quietly end a school year — and sometimes a school career.",
      "BBVF works directly with children's homes and families to identify what a learner is missing, then supplies it. Our approach is practical and specific: a mattress, a pair of shoes, a school bag, a ream of exercise books. We follow up with home and care-home visits so that support is not a one-off delivery but a relationship.",
      "In November 2026, BBVF organised a donation drive collecting mattresses, blankets, shoes and children's clothing, with drop-off points along the Eastern Bypass, and delivered support to Spirit of Mercy Children's Home in Kamae, Kahawa West.",
    ],
    activities: [
      {
        label: "Back-to-school supplies",
        detail:
          "School uniforms, shoes, bags, exercise books and writing materials for children identified with partner homes and families.",
        status: "active",
      },
      {
        label: "Retention and follow-up",
        detail:
          "Home and care-home visits to check that a child has actually stayed in school, not simply received a parcel.",
        status: "active",
      },
      {
        label: "Care-home equipping",
        detail:
          "Mattresses, blankets and clothing delivered to children's homes with an agreed list from the home's leadership.",
        status: "active",
      },
      {
        label: "School fees and learning support",
        detail:
          "Fee support and specialised learning materials. Availability depends on funds raised and is assessed case by case.",
        status: "fundraising",
      },
    ],
    needs: [
      "School uniforms and shoes in sizes for ages 6–17",
      "Exercise books, pens, pencils and geometry sets",
      "Mattresses, blankets and mosquito nets",
      "Volunteers who can offer supervised reading or homework support",
    ],
    geography: ["Eastern Bypass corridor, Nairobi", "Kamae, Kahawa West"],
    safeguarding:
      "Any story, image or name of a child is published only with written guardian consent and a named safeguarding reviewer's approval. Faces may be blurred and names changed at the family's request.",
    relatedCampaignSlug: "give-a-child-a-chance",
    sourceNote:
      "Programme scope and the November 2026 drive are drawn from BBVF's supplied organisational material and public campaign pages. Outputs are published only when BBVF has reconciled them.",
    lastReviewed: "2026-11-21",
  },
  {
    slug: "elderly-care",
    title: "Elderly care & dignity",
    beneficiaryGroup: "Older persons living in care homes and community settings",
    summary:
      "Food, clothing, bedding, healthcare access, companionship and grief counselling for older persons who should not face old age alone.",
    status: "active",
    glyph: "elder",
    intro: [
      "Growing older should never mean living without comfort, dignity or proper care. Yet many older people in Nairobi's care homes face daily shortages: thin bedding, worn clothing, missing mobility equipment and limited access to routine healthcare.",
      "BBVF's vision for older persons is broad and deliberately human. It includes food and household essentials, healthcare access, companionship, grief counselling and social inclusion — because loneliness is as damaging as a missing mattress.",
      "We work with the leadership of each home to agree a needs list before delivery, so that support matches what is actually required rather than what is convenient to donate.",
    ],
    activities: [
      {
        label: "Essential household supplies",
        detail:
          "Food staples, bedding, clothing and hygiene items delivered against an agreed list from each home.",
        status: "active",
      },
      {
        label: "Healthcare access",
        detail:
          "Support with transport, medication and routine health checks where funds allow. This is not an emergency medical service.",
        status: "fundraising",
      },
      {
        label: "Companionship & grief support",
        detail:
          "Structured visits and counselling support for older persons who have lost partners, family or independence.",
        status: "active",
      },
      {
        label: "Mobility and safety equipment",
        detail:
          "Walking frames, wheelchairs, anti-slip mats and other equipment to reduce falls and restore independence.",
        status: "fundraising",
      },
    ],
    needs: [
      "Blankets, sheets, mattresses and adult diapers",
      "Walking frames, wheelchairs and bathroom safety equipment",
      "Non-perishable food staples and cooking fuel",
      "Volunteers for regular, consistent companionship visits",
    ],
    geography: ["Nairobi County"],
    safeguarding:
      "Older persons are consulted about how they are photographed and described. Health details, diagnoses and precise locations are never published.",
    relatedCampaignSlug: "ageing-with-dignity",
    sourceNote:
      "Elderly-care scope is drawn from BBVF's public campaign narrative. Delivery counts are pending BBVF reconciliation.",
    lastReviewed: "2026-11-21",
  },
  {
    slug: "disability-inclusion",
    title: "Disability inclusion",
    beneficiaryGroup:
      "Children and adults with physical, intellectual, developmental and psychosocial disabilities",
    summary:
      "Assistive devices, inclusive education support, rehabilitation and dignity items that remove the everyday barriers to participation.",
    status: "active",
    glyph: "disability",
    intro: [
      "Disability should never be a reason for exclusion. Yet for many children and adults in Nairobi, the absence of a wheelchair, a hearing aid, a walking frame or accessible learning materials turns ordinary daily tasks into barriers.",
      "BBVF identifies individual needs and helps provide the specific device or support that unlocks participation: mobility aids, hearing and visual support, assistive learning materials, personal care supplies and rehabilitation support.",
      "We do not treat assistive devices as charity objects. A wheelchair is a route to school, to work, to worship and to community. Our work is to remove the barrier, then step back.",
    ],
    activities: [
      {
        label: "Assistive devices",
        detail:
          "Wheelchairs, crutches, walking frames, hearing and visual support devices, assessed for fit and individual need.",
        status: "active",
      },
      {
        label: "Inclusive education support",
        detail:
          "Assistive learning materials and school support so that a learner with a disability can remain in class.",
        status: "fundraising",
      },
      {
        label: "Rehabilitation access",
        detail:
          "Referral and transport support for physiotherapy, occupational therapy and follow-up appointments.",
        status: "fundraising",
      },
      {
        label: "Personal care and dignity items",
        detail:
          "Personal care supplies agreed discreetly with the individual or their carer.",
        status: "active",
      },
    ],
    needs: [
      "Wheelchairs, crutches and walking frames in good repair",
      "Hearing aid batteries and visual support devices",
      "Assistive learning materials for inclusive classrooms",
      "Physiotherapy and rehabilitation partnerships",
    ],
    geography: ["Nairobi County"],
    safeguarding:
      "Disability details are sensitive personal data. They are collected only with consent, stored separately from public content and never published without explicit approval.",
    relatedCampaignSlug: "breaking-barriers",
    sourceNote:
      "Programme scope is drawn from BBVF's public 'Breaking Barriers' campaign narrative.",
    lastReviewed: "2026-11-21",
  },
  {
    slug: "amputee-veterans",
    title: "Amputee veterans",
    beneficiaryGroup: "Veterans living with limb loss and their families",
    summary:
      "Prosthetic and mobility support, rehabilitation, psychosocial care and economic reintegration for veterans rebuilding life after service.",
    status: "active",
    glyph: "veteran",
    intro: [
      "Behind every veteran is a story of service, sacrifice and commitment. For amputee veterans, the journey after service can bring physical, emotional and economic challenges that require continued support and understanding.",
      "Limb loss affects mobility, independence, employment, family life and participation in everyday activities. Access to prosthetic limbs, rehabilitation, assistive devices and psychosocial support can make a significant difference — yet these forms of support often remain financially or practically out of reach.",
      "BBVF's approach is centred on the individual: understanding personal needs, recognising personal strengths and creating pathways back to a better quality of life. Reintegration is not only physical recovery. It is skills, work, community and confidence.",
    ],
    activities: [
      {
        label: "Prosthetic and mobility support",
        detail:
          "Assessment, fitting support and mobility equipment for veterans living with limb loss.",
        status: "fundraising",
      },
      {
        label: "Rehabilitation",
        detail:
          "Physiotherapy, mobility practice and follow-up support after fitting.",
        status: "fundraising",
      },
      {
        label: "Psychosocial support",
        detail:
          "Confidential counselling and peer support for veterans and their families.",
        status: "planned",
      },
      {
        label: "Economic reintegration",
        detail:
          "Skills development, enterprise support and connections to dignified work.",
        status: "planned",
      },
    ],
    needs: [
      "Prosthetics and mobility equipment partners",
      "Rehabilitation and physiotherapy capacity",
      "Skills training and enterprise opportunities",
      "Employers willing to offer dignified, accessible work",
    ],
    geography: ["Nairobi County and referral partners"],
    safeguarding:
      "Military service details and medical information are treated as highly sensitive. Nothing identifying is published without written veteran consent.",
    relatedCampaignSlug: "beyond-service",
    sourceNote:
      "Programme scope is drawn from BBVF's public 'Beyond Service' campaign narrative. Delivery counts are pending BBVF reconciliation.",
    lastReviewed: "2026-11-21",
  },
];

export function getProgram(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
