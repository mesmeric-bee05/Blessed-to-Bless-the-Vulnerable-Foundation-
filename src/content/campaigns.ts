export type CampaignStatus = "active" | "completed" | "upcoming";

export type Campaign = {
  slug: string;
  title: string;
  shortTitle: string;
  programSlug: string;
  beneficiaryGroup: string;
  status: CampaignStatus;
  summary: string;
  story: string[];
  /** Figures exactly as reported on the public campaign pages, 21 Nov 2026. */
  target: number | null;
  received: number | null;
  supporters: number | null;
  currency: "KES";
  /** ISO date of the source snapshot. */
  reportedOn: string;
  reportNote: string;
  whatItFunds: string[];
  externalUrl: string;
  priority: number;
};

export const campaigns: Campaign[] = [
  {
    slug: "ageing-with-dignity",
    title: "Ageing with Dignity: Equipping Elderly People's Homes",
    shortTitle: "Ageing with Dignity",
    programSlug: "elderly-care",
    beneficiaryGroup: "Older persons in care homes",
    status: "active",
    summary:
      "Equip elderly people's homes with bedding, household essentials and mobility equipment so that older persons can live with safety and dignity.",
    story: [
      "Growing older should never mean living without comfort, dignity or proper care. Many elderly people living in care homes face daily shortages of essential household items, inadequate bedding and limited mobility equipment.",
      "This campaign equips elderly people's homes with the items their leadership identifies as most urgent: mattresses and bedding, clothing, hygiene supplies, mobility aids and safer living equipment.",
      "Support is delivered against an agreed needs list rather than a generic parcel, and every delivery is recorded so that BBVF can report honestly on what was received and what was disbursed.",
    ],
    target: 50_000_000,
    received: 1_500,
    supporters: 2,
    currency: "KES",
    reportedOn: "2026-11-21",
    reportNote:
      "Received amount and supporter count are as displayed on the public campaign page at the time of review. They are not a live ledger and will be updated after BBVF reconciliation.",
    whatItFunds: [
      "Mattresses, blankets, sheets and clothing",
      "Food staples and household essentials",
      "Walking frames, wheelchairs and bathroom safety equipment",
      "Companionship visits and grief counselling support",
    ],
    externalUrl:
      "https://jamii.esoqo.com/o/blessed-to-bless-the-vulnerable-foundation",
    priority: 1,
  },
  {
    slug: "beyond-service",
    title:
      "Beyond Service: Restoring Dignity and Empowering Amputee Veterans",
    shortTitle: "Beyond Service",
    programSlug: "amputee-veterans",
    beneficiaryGroup: "Amputee veterans",
    status: "active",
    summary:
      "Help amputee veterans access prosthetic support, rehabilitation, mobility equipment and pathways to independent living and economic reintegration.",
    story: [
      "Behind every veteran is a story of service, sacrifice and commitment. For amputee veterans, the journey after military service can bring additional physical, emotional and economic challenges.",
      "Adjusting to life after limb loss affects mobility, independence, employment, family life and participation in everyday activities. Prosthetic limbs, rehabilitation and assistive devices can make a significant difference, yet often remain out of reach.",
      "This campaign supports prosthetics and mobility, rehabilitation, medical assistance and psychosocial support — and goes further, into skills, enterprise and community reintegration.",
    ],
    target: 67_000_000,
    received: 0,
    supporters: 0,
    currency: "KES",
    reportedOn: "2026-11-21",
    reportNote:
      "Received amount and supporter count are as displayed on the public campaign page at the time of review.",
    whatItFunds: [
      "Prosthetic assessment, fitting and mobility support",
      "Rehabilitation and physiotherapy follow-up",
      "Psychosocial support for veterans and families",
      "Skills development and economic reintegration",
    ],
    externalUrl:
      "https://jamii.esoqo.com/o/blessed-to-bless-the-vulnerable-foundation",
    priority: 2,
  },
  {
    slug: "breaking-barriers",
    title:
      "Breaking Barriers, Creating Opportunities: Supporting Children and Persons with Disabilities",
    shortTitle: "Breaking Barriers",
    programSlug: "disability-inclusion",
    beneficiaryGroup: "Children and persons with disabilities",
    status: "active",
    summary:
      "Assistive devices, inclusive education support and essential resources that promote dignity, independence and participation.",
    story: [
      "Every person deserves the opportunity to live with dignity, pursue their dreams and participate fully in their community, regardless of ability.",
      "For many children and adults with disabilities, the absence of assistive devices, accessible facilities and specialised resources makes even simple daily activities challenging.",
      "This campaign provides wheelchairs, crutches, walking frames, mobility aids, hearing and visual support devices, assistive learning materials and personal care supplies — assessed against each person's actual needs.",
    ],
    target: 45_000_000,
    received: 0,
    supporters: 0,
    currency: "KES",
    reportedOn: "2026-11-21",
    reportNote:
      "Received amount and supporter count are as displayed on the public campaign page at the time of review.",
    whatItFunds: [
      "Wheelchairs, crutches and walking frames",
      "Hearing and visual support devices",
      "Assistive learning materials",
      "Rehabilitation and personal care supplies",
    ],
    externalUrl:
      "https://jamii.esoqo.com/o/blessed-to-bless-the-vulnerable-foundation",
    priority: 3,
  },
  {
    slug: "give-a-child-a-chance",
    title: "Give a Child a Chance: Back-to-School Fund Drive 2027",
    shortTitle: "Give a Child a Chance",
    programSlug: "children-education",
    beneficiaryGroup: "Vulnerable school-age children",
    status: "active",
    summary:
      "School supplies, uniforms, learning materials and retention support so that vulnerable children return to school with confidence.",
    story: [
      "A uniform, a pair of shoes and a set of exercise books can decide whether a child stays in school. For families already stretched by rent and food, these costs are often the first to go.",
      "The 2027 Back-to-School Fund Drive supplies the specific items each learner is missing, delivered with the involvement of families and care homes, and followed up with visits to check that the child has settled back into class.",
      "BBVF is raising funds and collecting in-kind supplies ahead of the 2027 school year. Itemised unit costs will be published only once BBVF has approved and reconciled them.",
    ],
    target: 43_000_000,
    received: 0,
    supporters: 0,
    currency: "KES",
    reportedOn: "2026-11-21",
    reportNote:
      "Received amount and supporter count are as displayed on the public campaign page at the time of review.",
    whatItFunds: [
      "School uniforms, shoes and bags",
      "Exercise books and writing materials",
      "Mattresses, blankets and bedding for care homes",
      "Home visits and school-retention follow-up",
    ],
    externalUrl:
      "https://jamii.esoqo.com/o/blessed-to-bless-the-vulnerable-foundation",
    priority: 4,
  },
];

export const campaignTotals = {
  target: campaigns.reduce((sum, c) => sum + (c.target ?? 0), 0),
  received: campaigns.reduce((sum, c) => sum + (c.received ?? 0), 0),
  supporters: campaigns.reduce((sum, c) => sum + (c.supporters ?? 0), 0),
  reportedOn: "2026-11-21",
};

export function getCampaign(slug: string): Campaign | undefined {
  return campaigns.find((c) => c.slug === slug);
}
