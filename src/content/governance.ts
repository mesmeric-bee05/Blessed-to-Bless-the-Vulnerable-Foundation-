export const governance = {
  statement:
    "BBVF is building the governance record that institutional funders, partner homes and the people it serves are entitled to see. Until each item is verified, this page states plainly what is confirmed and what is still in progress — it does not substitute a template for a fact.",
  commitments: [
    {
      title: "Named accountability",
      body: "Every public claim, campaign figure and media asset will carry an internal approval owner and a review date. The public site will show the date on which content was last reviewed.",
    },
    {
      title: "Separated duties",
      body: "Finance approval, content publishing and safeguarding review are separate responsibilities. No single person should be able to publish a beneficiary story and approve its consent record.",
    },
    {
      title: "Consent before publication",
      body: "No image, name or story of an identifiable beneficiary is published without a recorded consent, guardian consent where the person is a minor, and a named safeguarding reviewer's approval.",
    },
    {
      title: "Documented decisions",
      body: "Payment providers, data processors and material changes to how donor money is handled are recorded as written decisions with an owner, a date and the reason.",
    },
    {
      title: "Honest reporting",
      body: "Where a figure is not yet reconciled, the site says so. We do not display an unsourced statistic, an invented testimonial or a progress bar that cannot be traced to a record.",
    },
  ],
  register: [
    {
      item: "Legal entity type and registration",
      status: "In progress",
      detail:
        "BBVF's exact legal form, registration number and registering authority are being confirmed with counsel under Kenya's Public Benefit Organizations framework. Not published until verified.",
    },
    {
      item: "ODPC data-controller registration",
      status: "In progress",
      detail:
        "Charities in Kenya must register with the Office of the Data Protection Commissioner. The certificate number will be published here once issued and verified.",
    },
    {
      item: "Board and leadership profiles",
      status: "Consent pending",
      detail:
        "Names, titles, biographies and photographs will be published only with each person's written consent. No profile is invented to fill the page.",
    },
    {
      item: "Audited or reviewed financial statements",
      status: "Not yet available",
      detail:
        "No audited statements have been supplied. When available they will be published as accessible documents alongside a plain-language summary.",
    },
    {
      item: "Safeguarding policies",
      status: "Draft",
      detail:
        "Child and vulnerable-adult safeguarding policies are being finalised. The public safeguarding route is live now and concerns are logged and escalated.",
    },
    {
      item: "Annual impact report",
      status: "First report pending",
      detail:
        "BBVF's first annual report will be published with dated, reconciled outputs and a methodology note. Until then, campaign snapshots are labelled with their source and date.",
    },
  ],
  documents: [
    {
      title: "Privacy notice",
      href: "/policies/privacy",
      note: "Draft for legal review",
    },
    {
      title: "Safeguarding policy summary",
      href: "/safeguarding",
      note: "Public summary",
    },
    {
      title: "Accessibility statement",
      href: "/policies/accessibility",
      note: "WCAG 2.2 AA target",
    },
    {
      title: "Donation terms",
      href: "/policies/donations",
      note: "Draft for legal review",
    },
    {
      title: "Media consent policy",
      href: "/policies/media-consent",
      note: "Draft for legal review",
    },
    {
      title: "Data retention schedule",
      href: "/policies/data-retention",
      note: "Draft for legal review",
    },
  ],
} as const;
