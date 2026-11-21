export type Faq = {
  question: string;
  answer: string;
  category: "Giving" | "Programs" | "Trust" | "Privacy" | "Volunteering";
};

export const faqs: Faq[] = [
  {
    category: "Giving",
    question: "How can I donate to BBVF today?",
    answer:
      "The giving route currently published is BBVF's public Our Jamii campaign profile, which accepts M-Pesa. We link to it directly from the donate page. Card, bank transfer and recurring giving are being set up with providers; until those rails are live and tested by BBVF, we will not display account details or take card payments on this site. If you would like to be told when a rail goes live, use the notify form on the donate page.",
  },
  {
    category: "Giving",
    question: "Can I donate from outside Kenya?",
    answer:
      "Not yet through this website. International card and wallet giving requires a verified merchant account, settlement currency and refund process, and we will only publish a method once it has been tested end to end. Institutional funders and foundations can use the institutional inquiry form now, and we will respond with due-diligence information and wire instructions through a verified channel.",
  },
  {
    category: "Giving",
    question: "Are donations tax-deductible?",
    answer:
      "We do not claim tax-deductibility in any jurisdiction. BBVF's registration and charitable status are being confirmed, and an incorrect tax claim would be a serious misrepresentation. Please do not rely on this website for a tax deduction. If and when a verified status exists, we will publish the exact wording approved by counsel.",
  },
  {
    category: "Giving",
    question: "Will I get a receipt?",
    answer:
      "Donations made through Our Jamii are receipted by that platform. When BBVF's own payment rails go live, every completed gift will trigger an automated receipt from a domain-based address. We will publish the receipt and refund terms before accepting gifts directly.",
  },
  {
    category: "Giving",
    question: "How do I know my money reaches the campaign I chose?",
    answer:
      "Every campaign page states its target, the amount reported as received, the date of that snapshot and where the figure came from. We do not show a progress bar that updates from a browser. Once payments run through BBVF's own rails, campaign totals will be computed server-side from reconciled records, and the transparency hub will publish the reconciliation basis.",
  },
  {
    category: "Trust",
    question: "Is BBVF a registered organisation?",
    answer:
      "BBVF is a Nairobi-based community foundation. Its exact legal form, registration number and registering authority are being confirmed with counsel under Kenya's evolving Public Benefit Organizations framework, and we do not publish an unverified registration number. The governance page records the current status and will be updated with the verified details.",
  },
  {
    category: "Trust",
    question: "Who runs BBVF and who is accountable?",
    answer:
      "BBVF's leadership and board profiles are being prepared with each person's written consent to be named and photographed. We will not invent names or biographies to fill the page. Accountability contacts for safeguarding, privacy and finance will be published with the governance documents.",
  },
  {
    category: "Trust",
    question: "Why do some pages say 'report pending'?",
    answer:
      "Because the alternative is to publish a number we cannot explain. A young organisation that shows a dated 'not yet reported' state is more trustworthy than one that shows an impressive figure nobody can trace. Each pending item has an internal owner and a review date.",
  },
  {
    category: "Programs",
    question: "Who can receive support from BBVF?",
    answer:
      "BBVF works with vulnerable children and school-age learners, older persons in care homes and community settings, children and adults with disabilities, and amputee veterans. Support is identified case by case with families, care homes and rehabilitation partners. BBVF is not an emergency service and cannot guarantee support to every request.",
  },
  {
    category: "Programs",
    question: "Does BBVF help widows and sick individuals?",
    answer:
      "BBVF's supplied material refers to widows, orphans and sick individuals, but these are not yet documented as standalone programmes with published delivery criteria. We have therefore not created programme pages that imply they are operational. If BBVF confirms them, they will be added with the same evidence standard as the four current programmes.",
  },
  {
    category: "Programs",
    question: "Can I visit a children's home with BBVF?",
    answer:
      "Only through an arranged, safeguarding-approved visit. Please do not arrive unannounced at a partner home: unannounced visitors disrupt routines and can put children at risk. Use the volunteer form and we will explain the vetting and supervision process.",
  },
  {
    category: "Volunteering",
    question: "What kind of volunteers do you need?",
    answer:
      "Practical, reliable people: drivers and sorters for supply drives, supervised reading and homework supporters, professional services such as physiotherapy, counselling, accounting and legal review, and photography or translation offered under our media-consent rules. Every role involving contact with vulnerable people is subject to vetting and supervision.",
  },
  {
    category: "Volunteering",
    question: "Can my company partner with BBVF?",
    answer:
      "Yes. Corporate partnerships can be in kind (supplies, transport, venues), in skills (pro bono professional support) or in funding tied to a specific, agreed campaign. Use the partnership form and describe what you can offer; we will respond with a short scope and a named contact.",
  },
  {
    category: "Privacy",
    question: "What personal data do you collect and why?",
    answer:
      "For general enquiries we collect your name, email address, the subject and your message. For donation notifications we collect your name, email, amount band and preferred method. We keep marketing consent separate from any transaction. We never ask for M-Pesa PINs, card numbers, passwords or ID documents through this website. Full detail is in the privacy notice.",
  },
  {
    category: "Privacy",
    question: "How do I report a safeguarding concern?",
    answer:
      "Use the safeguarding page to reach the safeguarding route, which is separate from general enquiries. If someone is in immediate danger, contact the Kenyan emergency services first. This website is not an emergency-response channel and we cannot guarantee immediate response.",
  },
  {
    category: "Privacy",
    question: "How do I ask for my data to be corrected or deleted?",
    answer:
      "Write to the privacy contact once it is published, or use the contact form and select 'Privacy request'. We will verify your identity before acting. Some donation and financial records must be retained to meet legal and accounting obligations; we will explain what is retained and why.",
  },
];
