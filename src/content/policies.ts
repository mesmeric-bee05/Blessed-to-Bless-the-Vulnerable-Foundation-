export type PolicySection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type Policy = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  status: "draft-legal-review" | "published";
  sections: PolicySection[];
};

const draft = "draft-legal-review" as const;

export const policies: Policy[] = [
  {
    slug: "privacy",
    title: "Privacy notice",
    summary:
      "What personal data BBVF collects through this website, why, how long it is kept and how to exercise your rights under Kenya's Data Protection Act, 2019.",
    updated: "2026-11-21",
    status: draft,
    sections: [
      {
        heading: "Who is responsible for your data",
        paragraphs: [
          "Blessed to Bless the Vulnerable Foundation (BBVF) is the data controller for personal data collected through this website. BBVF is in the process of confirming its registration with the Office of the Data Protection Commissioner (ODPC). The registration number and a named privacy contact will be published here once verified.",
          "This notice is a draft prepared for legal review. It describes the data practices actually implemented in this application; it is not a substitute for advice from Kenyan counsel.",
        ],
      },
      {
        heading: "What we collect",
        list: [
          "Contact enquiries: your name, email address, optional phone number, subject and message.",
          "Donation notifications: your name, email address, amount band, preferred payment method and optional message. We do not collect card numbers, M-Pesa PINs or bank credentials on this site.",
          "Volunteer and partnership enquiries: your name, email address, organisation (if any), the skills or support you are offering and your message.",
          "Safeguarding reports: the details you choose to provide, which may include sensitive information about a vulnerable person. These are handled under a separate restricted process.",
          "Newsletter sign-ups: your email address and the date and version of the consent you gave.",
          "Technical data: a hashed, truncated network identifier and a timestamp used only for abuse prevention and rate limiting. We do not use advertising cookies or third-party tracking scripts.",
        ],
      },
      {
        heading: "Why we use it, and our lawful basis",
        paragraphs: [
          "We process enquiry and notification data to respond to you and to administer the relationship you initiated. We process newsletter data only on the basis of your separate, explicit consent, which you can withdraw at any time.",
          "Safeguarding reports may involve sensitive personal data. We process them to protect a vulnerable person and to meet our safeguarding duties, with access restricted to the safeguarding reviewer and, where necessary, the appropriate authorities.",
          "We do not sell personal data, do not use it for automated decision-making, and do not send beneficiary case information to third-party AI services.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "General enquiries are kept for up to 24 months after the last contact. Newsletter records are kept until you unsubscribe, plus a short suppression record so that you are not re-added by mistake. Safeguarding records are kept only as long as necessary for the concern and any legal obligation. Financial records, once direct giving is live, will be kept for the period required by Kenyan accounting and tax law.",
        ],
      },
      {
        heading: "Who we share it with",
        paragraphs: [
          "We use a small number of processors: a managed database provider (Supabase) to store submissions, a transactional email provider to deliver notifications, and a hosting provider to serve this site. Each processor is bound to process data only on our instructions. We do not share donor or enquirer data with advertisers or data brokers.",
          "We may disclose information where required by law, or where necessary to protect a person from serious harm, in line with our safeguarding policy.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Under the Data Protection Act, 2019 you may request access to your personal data, correction of inaccurate data, deletion where there is no legal obligation to retain it, restriction of processing, and portability of data you provided. You may also object to processing and withdraw consent for marketing at any time.",
          "To make a request, use the contact form and select 'Privacy request'. We will verify your identity before acting and respond within the period required by law. If you are not satisfied, you may complain to the Office of the Data Protection Commissioner.",
        ],
      },
      {
        heading: "Security and breaches",
        paragraphs: [
          "We apply access controls, encryption in transit, server-side validation, rate limiting and audit logging. No system is perfectly secure. If a breach creates a risk to your rights, we will notify the ODPC within 72 hours of becoming aware and inform affected individuals without undue delay where required.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie notice",
    summary:
      "This site is designed to work without advertising or analytics cookies. Here is exactly what is stored and why.",
    updated: "2026-11-21",
    status: draft,
    sections: [
      {
        heading: "What we use today",
        paragraphs: [
          "This website does not set advertising cookies, does not embed third-party tracking pixels and does not run cross-site analytics. Any cookie required for the site to function securely is strictly necessary and is exempt from consent under a consent-based regime.",
        ],
      },
      {
        heading: "If analytics are added",
        paragraphs: [
          "If BBVF adopts analytics, we will prefer a privacy-respecting, cookieless option. If a cookie-based tool is used, it will load only after you give consent, and you will be able to refuse without losing access to any part of the site. The consent choice will be recorded with a timestamp and policy version.",
        ],
      },
      {
        heading: "Managing cookies",
        paragraphs: [
          "You can block or delete cookies through your browser settings. Because this site does not depend on non-essential cookies, blocking them will not prevent you from donating, contacting us or reading any page.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of use",
    summary:
      "The basis on which you may use this website, and the limits of the information published on it.",
    updated: "2026-11-21",
    status: draft,
    sections: [
      {
        heading: "Using this site",
        paragraphs: [
          "You may read, print and share the public content of this website for personal, educational or charitable purposes, provided you do not alter it or present it as your own. Commercial reuse, scraping at scale and automated bulk download require written permission.",
        ],
      },
      {
        heading: "Accuracy",
        paragraphs: [
          "We work to keep published information accurate and dated. Organisational and campaign figures are snapshots and may change after reconciliation. Nothing on this site is a promise of a particular outcome, a guarantee of support, or an offer of employment.",
        ],
      },
      {
        heading: "Acceptable use",
        list: [
          "Do not attempt to gain unauthorised access to any part of the site or its systems.",
          "Do not submit unlawful, abusive or knowingly false information through any form.",
          "Do not submit another person's personal data without their permission.",
          "Do not use the site to impersonate BBVF, a partner organisation or a beneficiary.",
        ],
      },
      {
        heading: "External links",
        paragraphs: [
          "Where we link to a third-party platform, including Our Jamii, that platform's own terms and privacy notice apply. We are not responsible for content we do not control.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "These terms are governed by the laws of Kenya. Any dispute will be subject to the jurisdiction of the Kenyan courts. This clause is pending confirmation by counsel.",
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility statement",
    summary:
      "BBVF's commitment to WCAG 2.2 AA, what has been built in, known limitations and how to report a barrier.",
    updated: "2026-11-21",
    status: "published",
    sections: [
      {
        heading: "Our commitment",
        paragraphs: [
          "BBVF's mission includes persons with disabilities, so an inaccessible website would contradict the organisation's own purpose. We aim to meet WCAG 2.2 Level AA and to align with Kenya's Persons with Disabilities Act, 2025 (section 26) and the national ICT accessibility standard KS 2952-1:2022.",
          "Accessibility is treated as an engineering requirement in this build, not a retrofit: semantic landmarks, a skip link, visible focus states, keyboard-operable navigation, reduced-motion support, labelled form fields, specific error messages and text alternatives are part of the component library.",
        ],
      },
      {
        heading: "What we have implemented",
        list: [
          "A skip-to-content link and a single, logical H1 on every page.",
          "Full keyboard operation of navigation, accordions, forms and the mobile menu.",
          "Visible focus indicators with sufficient contrast.",
          "Colour combinations chosen to meet or exceed 4.5:1 for body text and 3:1 for large text and interface boundaries.",
          "Respect for the operating system's reduced-motion setting: all 3D and scroll motion is disabled.",
          "Form fields with persistent labels, autocomplete hints and programmatically associated error messages.",
          "No time-limited interaction anywhere in the site, including the giving enquiry flow.",
        ],
      },
      {
        heading: "Known limitations",
        paragraphs: [
          "No full manual screen-reader audit has yet been completed by an independent auditor, so this statement does not yet claim verified conformance. Automated checks cannot detect every barrier. A manual audit against WCAG 2.2 AA is scheduled before launch, and its findings will be published here.",
          "Some content is deliberately withheld pending verification. Where a page shows a 'pending' state, that is a content decision, not an accessibility defect.",
        ],
      },
      {
        heading: "Reporting a barrier",
        paragraphs: [
          "If any part of this site prevents you from getting information or completing an action, please use the contact form and select 'Accessibility'. Tell us the page and what happened. We aim to acknowledge accessibility reports within five working days and to provide the information in an alternative format if needed.",
        ],
      },
    ],
  },
  {
    slug: "donations",
    title: "Donation terms",
    summary:
      "How giving works, what is and is not live, refunds, receipts and the promises we will not make.",
    updated: "2026-11-21",
    status: draft,
    sections: [
      {
        heading: "Current giving routes",
        paragraphs: [
          "The giving route currently published is BBVF's campaign profile on Our Jamii, which accepts M-Pesa. Card, bank transfer and recurring giving are not yet live on this website. We do not display bank or paybill details until the account has been verified as belonging to BBVF.",
        ],
      },
      {
        heading: "No tax claims",
        paragraphs: [
          "BBVF does not claim that donations are tax-deductible in Kenya or any other jurisdiction. Any future tax statement will be published only after legal confirmation of BBVF's status.",
        ],
      },
      {
        heading: "Receipts and records",
        paragraphs: [
          "Donations made on a third-party platform are receipted by that platform under its terms. When BBVF processes gifts directly, each completed gift will receive an automated receipt and a server-side reconciliation record. A gift is only marked complete after a verified provider confirmation — never on the basis of a browser redirect.",
        ],
      },
      {
        heading: "Refunds and errors",
        paragraphs: [
          "If you believe you have given in error or been charged twice, contact us with the date, amount and provider reference. We will investigate with the provider. Refunds are made to the original payment method where the provider supports it. Our full refund procedure will be published before direct card giving goes live.",
        ],
      },
      {
        heading: "Designation and use of funds",
        paragraphs: [
          "Where you designate a campaign, BBVF will apply your gift to that campaign. If a campaign closes or is oversubscribed, we will contact donors before applying the gift to a closely related programme, and we will report the change publicly.",
        ],
      },
      {
        heading: "Fraud warning",
        paragraphs: [
          "BBVF will never ask for your M-Pesa PIN, card number, password or a copy of your ID by phone, WhatsApp, email or social media. If someone does, stop and report it through the contact form. Do not send money to any account that is not published on this website or on BBVF's published Our Jamii profile.",
        ],
      },
    ],
  },
  {
    slug: "media-consent",
    title: "Media consent & ethical storytelling",
    summary:
      "How BBVF decides whether a photograph, name or story may be published, and how a person can withdraw consent.",
    updated: "2026-11-21",
    status: draft,
    sections: [
      {
        heading: "Consent is a record, not a conversation",
        paragraphs: [
          "Every photograph, video or written story involving an identifiable beneficiary must carry a recorded consent before publication: who consented, on what date, for which specific uses, and — for anyone under 18 — the consent of a parent or guardian. A named safeguarding reviewer must approve the record.",
        ],
      },
      {
        heading: "What we will not publish",
        list: [
          "Home addresses, precise GPS coordinates or school schedules.",
          "Unredacted medical records, diagnoses or disability details beyond what the person has approved.",
          "Identity document numbers, case files or court records.",
          "Images that frame a person's distress as spectacle, or language that treats poverty as a spectacle.",
          "The name or image of a child without guardian consent and safeguarding approval.",
        ],
      },
      {
        heading: "Anonymisation",
        paragraphs: [
          "Pseudonyms, face-blurring and cropping are first-class options, not last resorts. A person may ask to be described by their situation rather than their name. Where we use a pseudonym, we say so.",
        ],
      },
      {
        heading: "Withdrawal and takedown",
        paragraphs: [
          "A beneficiary, family member or guardian may ask us to remove an image or story at any time. Use the safeguarding or contact route. We will remove the content from public view promptly, record the request, and confirm what was done. Removal does not require the person to explain themselves.",
        ],
      },
    ],
  },
  {
    slug: "data-retention",
    title: "Data retention schedule",
    summary:
      "How long different categories of data are kept, and what happens at the end of the retention period.",
    updated: "2026-11-21",
    status: draft,
    sections: [
      {
        heading: "Schedule",
        list: [
          "General enquiries: 24 months after last contact, then deleted.",
          "Volunteer and partnership enquiries: 24 months after the relationship ends, then deleted.",
          "Donation notifications and pledges: 24 months, or longer if converted into a financial record.",
          "Newsletter subscriptions: until withdrawal, plus a suppression record to honour the withdrawal.",
          "Safeguarding reports: as long as needed for the concern and any legal obligation, reviewed at least annually.",
          "Financial and donation records (once direct giving is live): the period required by Kenyan accounting and tax law.",
          "Server security logs: 90 days, with personal data minimised and access restricted.",
        ],
      },
      {
        heading: "Deletion",
        paragraphs: [
          "At the end of a retention period, records are deleted or irreversibly anonymised. Backups are rotated on a schedule so that deleted records do not persist indefinitely. Where a legal hold applies, the affected records are separated and documented.",
        ],
      },
      {
        heading: "Review",
        paragraphs: [
          "This schedule is reviewed annually by the privacy lead and whenever a new data category is introduced. The review date is recorded on this page.",
        ],
      },
    ],
  },
];

export function getPolicy(slug: string): Policy | undefined {
  return policies.find((p) => p.slug === slug);
}
