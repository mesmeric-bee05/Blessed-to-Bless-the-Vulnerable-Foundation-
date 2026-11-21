export type Story = {
  slug: string;
  title: string;
  kind: "field-update" | "explainer" | "announcement";
  publishedOn: string;
  updatedOn?: string;
  author: string;
  readingMinutes: number;
  excerpt: string;
  body: string[];
  relatedProgramSlug?: string;
  relatedCampaignSlug?: string;
  consentNote: string;
};

export const stories: Story[] = [
  {
    slug: "eastern-bypass-november-drive",
    title: "A November drive along the Eastern Bypass",
    kind: "field-update",
    publishedOn: "2026-11-12",
    author: "BBVF field team",
    readingMinutes: 3,
    excerpt:
      "Mattresses, blankets, shoes and children's clothing were collected at drop-off points along the Eastern Bypass and delivered to Spirit of Mercy Children's Home in Kamae, Kahawa West.",
    body: [
      "In November 2026, BBVF organised a donation drive for children's essentials. Neighbours, supporters and volunteers dropped off mattresses, blankets, shoes and children's clothing at collection points along the Eastern Bypass corridor in Nairobi.",
      "The supplies were sorted, checked for condition and packed against a list agreed in advance with the leadership of Spirit of Mercy Children's Home in Kamae, Kahawa West. The team then delivered the items to the home.",
      "The drive was practical rather than ceremonial. The most requested items were bedding and shoes — the things that are easiest to overlook and hardest to replace when a household budget is already stretched.",
      "What happens next matters more than the delivery photograph we have chosen not to publish. The team will follow up with the home to confirm what was received, what is still short and which children need support to stay in school through the coming term. Those follow-up figures will be published on our impact page once they are reconciled.",
      "If you would like to contribute supplies, please use the contact form rather than arriving at a children's home unannounced. Unannounced visits can disrupt safeguarding routines, and the home's first duty is to the children in its care.",
    ],
    relatedProgramSlug: "children-education",
    relatedCampaignSlug: "give-a-child-a-chance",
    consentNote:
      "No image, name or identifying detail of a child is published in this update. Media involving children requires written guardian consent and safeguarding review.",
  },
  {
    slug: "why-we-publish-what-we-can-verify",
    title: "Why we publish what we can verify — and say so when we cannot",
    kind: "explainer",
    publishedOn: "2026-11-21",
    author: "BBVF",
    readingMinutes: 4,
    excerpt:
      "Trust is not built by looking impressive. It is built by being specific, dated and honest — especially about the things a young organisation has not yet done.",
    body: [
      "A donor scanning a charity website in 2026 is not only asking \"what do they do?\" They are asking \"can I check it?\" Grant officers, journalists and increasingly AI answer engines all apply a version of the same test: is this claim specific, sourced and consistent with everything else the organisation publishes?",
      "That is why this website does not show a filled leadership page until leadership has consented to be named. It does not show an impact total we cannot reconcile. It does not show unit costs — \"KES 2,000 feeds a family for a week\" — until BBVF has an approved, current basis for that figure. And it does not show a progress bar creeping upward on its own.",
      "Where a figure comes from a public campaign page, we say so and date it. Where a register entry is still being confirmed with counsel, we say that too. A visible gap is more trustworthy than a confident invention, because a diligent reader will eventually find the gap anyway.",
      "This is also a safeguarding decision. The people BBVF serves — children, older persons, persons with disabilities and injured veterans — are not content. Their stories are published only with consent, only where necessary, and never with details that could expose them to stigma or harm.",
      "Over the coming months this page will fill with delivered outputs, reconciled campaign figures, audited reports and named governance. The order matters: evidence first, presentation second.",
    ],
    consentNote:
      "This is an editorial statement by BBVF about its own publishing standards. No beneficiary information is included.",
  },
  {
    slug: "four-focus-areas",
    title: "Four groups, one standard of care",
    kind: "explainer",
    publishedOn: "2026-11-05",
    author: "BBVF",
    readingMinutes: 5,
    excerpt:
      "Children and education. Older persons. Persons with disabilities. Amputee veterans. Why BBVF works across four groups — and what stays the same in each.",
    body: [
      "BBVF's work is organised around four groups: vulnerable children, older persons, persons with disabilities and amputee veterans. Each has a distinct set of barriers. A school uniform, a walking frame, a hearing aid and a prosthetic limb are not interchangeable interventions.",
      "What stays the same is the method. Identify a specific person or household with a specific need. Agree the need with the people who know them best — a care home's leadership, a family, a rehabilitation professional. Supply the thing that removes the barrier. Follow up. Record what happened.",
      "That method is slower than a large ceremonial handover, and it produces fewer photographs. It also produces better outcomes, because it treats the person receiving support as the author of their own recovery rather than the backdrop to a donor's generosity.",
      "It also shapes how we ask for money. BBVF publishes campaign targets because they are the targets its supporters have set. We do not pretend that a target is an amount raised, and we do not invent a unit-cost promise to make a large goal feel smaller. Where we can publish an itemised cost, we will — once it is approved.",
      "If you are a care home, a rehabilitation partner, a county officer or a family seeking support, the contact form is the right first step. Please do not send medical records or identity documents through the form; we will tell you what is needed and how to share it safely.",
    ],
    relatedProgramSlug: "elderly-care",
    consentNote:
      "This is an organisational explainer. No beneficiary information is included.",
  },
];

export function getStory(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}
