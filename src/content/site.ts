/**
 * The single source of truth for BBVF's public identity.
 *
 * CONTENT-INTEGRITY RULE: nothing in this file is invented. Values marked
 * `verified: false` or `null` are deliberately withheld from public rendering
 * until BBVF supplies and approves them (see docs/CONTENT-GOVERNANCE.md).
 */

export const site = {
  name: "Blessed to Bless the Vulnerable Foundation",
  shortName: "BBVF",
  legalName: null as string | null,
  tagline: "Dignity, care and opportunity for Nairobi's most vulnerable.",
  description:
    "BBVF is a Nairobi-based community foundation supporting vulnerable children, older persons, persons with disabilities and amputee veterans through education support, care outreach, assistive devices and reintegration.",
  county: "Nairobi County, Kenya",
  serviceAreas: [
    "Eastern Bypass corridor, Nairobi",
    "Spirit of Mercy Children's Home, Kamae, Kahawa West",
  ],
  founded: null as string | null,
  registration: {
    status: "pending" as const,
    note: "Legal entity type, registration number and registering authority are being confirmed with BBVF's counsel and are not published until verified.",
  },
  odcRegistration: null as string | null,
  contact: {
    // The discovery record contains a phone number from a third-party donation
    // listing. It has not been verified by BBVF, so it is not published.
    phone: null as string | null,
    phoneStatus: "pending_verification",
    email: null as string | null,
    officeAddress: null as string | null,
    officeHours: null as string | null,
    whatsappPolicy:
      "We will never ask for your M-Pesa PIN, card number, password or ID documents by phone, WhatsApp, email or social media.",
  },
  social: [] as { label: string; href: string }[],
  externalProfile: {
    label: "Our Jamii community profile",
    href: "https://jamii.esoqo.com/o/blessed-to-bless-the-vulnerable-foundation",
  },
  status: (process.env.NEXT_PUBLIC_SITE_STATUS ?? "prelaunch") as
    | "prelaunch"
    | "live",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bbvf.org",
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  children?: { label: string; href: string; description?: string }[];
};

export const primaryNav: NavItem[] = [
  {
    label: "About",
    href: "/about",
    description: "Who we are, how we are governed and who is accountable.",
    children: [
      { label: "Our story & mission", href: "/about" },
      { label: "Governance", href: "/about/governance" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "Where we work", href: "/where-we-work" },
    ],
  },
  {
    label: "Programs",
    href: "/programs",
    description: "Four focus areas, each with a clear beneficiary group.",
    children: [
      { label: "Children & education", href: "/programs/children-education" },
      { label: "Elderly care", href: "/programs/elderly-care" },
      { label: "Disability inclusion", href: "/programs/disability-inclusion" },
      { label: "Amputee veterans", href: "/programs/amputee-veterans" },
    ],
  },
  {
    label: "Campaigns",
    href: "/campaigns",
    description: "Active fundraising appeals with published targets.",
  },
  {
    label: "Impact",
    href: "/impact",
    description: "What has been delivered, what is pending and how we report.",
    children: [
      { label: "Impact & evidence", href: "/impact" },
      { label: "Reports", href: "/impact/reports" },
      { label: "Stories & updates", href: "/stories" },
    ],
  },
  {
    label: "Get involved",
    href: "/get-involved",
    description: "Volunteer, partner, fundraise or give in kind.",
    children: [
      { label: "Ways to help", href: "/get-involved" },
      { label: "Events & drives", href: "/events" },
      { label: "Gallery", href: "/gallery" },
      { label: "Institutional partners", href: "/investors" },
    ],
  },
  { label: "Transparency", href: "/transparency" },
];

export const footerNav: { title: string; items: { label: string; href: string }[] }[] =
  [
    {
      title: "Organisation",
      items: [
        { label: "About BBVF", href: "/about" },
        { label: "Governance", href: "/about/governance" },
        { label: "Leadership", href: "/about/leadership" },
        { label: "Where we work", href: "/where-we-work" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Our work",
      items: [
        { label: "Programs", href: "/programs" },
        { label: "Campaigns", href: "/campaigns" },
        { label: "Impact", href: "/impact" },
        { label: "Stories", href: "/stories" },
        { label: "Reports", href: "/impact/reports" },
      ],
    },
    {
      title: "Take action",
      items: [
        { label: "Donate", href: "/donate" },
        { label: "Volunteer", href: "/get-involved#volunteer" },
        { label: "Partner with us", href: "/get-involved#partner" },
        { label: "Institutional giving", href: "/donate/international" },
        { label: "Events", href: "/events" },
      ],
    },
    {
      title: "Trust & policies",
      items: [
        { label: "Transparency hub", href: "/transparency" },
        { label: "Safeguarding", href: "/safeguarding" },
        { label: "Privacy notice", href: "/policies/privacy" },
        { label: "Accessibility statement", href: "/policies/accessibility" },
        { label: "All policies", href: "/policies" },
      ],
    },
  ];
