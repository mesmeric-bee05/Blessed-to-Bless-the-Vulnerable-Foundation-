export const impact = {
  posture:
    "BBVF is at the beginning of a formal impact-reporting practice. This page therefore publishes the one campaign figure that was visible in the public record, states clearly what has not yet been reconciled, and explains how future figures will be produced. It does not present estimates as results.",
  reported: [
    {
      label: "Campaigns published",
      value: "4",
      note: "Four active fundraising campaigns on BBVF's public profile.",
      period: "As at 21 November 2026",
    },
    {
      label: "Combined campaign target",
      value: "KES 205,000,000",
      note: "Sum of the four published campaign targets. This is a target, not money raised.",
      period: "As at 21 November 2026",
    },
    {
      label: "Supporters recorded",
      value: "2",
      note: "Supporters displayed against the elderly care campaign. Other campaigns showed none at review.",
      period: "As at 21 November 2026",
    },
    {
      label: "Reported received",
      value: "KES 1,500",
      note: "The only received amount displayed in the public record. Pending BBVF reconciliation.",
      period: "As at 21 November 2026",
    },
  ],
  pending: [
    {
      item: "Beneficiaries reached, by programme",
      reason:
        "BBVF has not yet supplied reconciled delivery records with a reporting period and definition. Publishing an unreconciled total would overstate the organisation's work.",
    },
    {
      item: "Assistive devices delivered",
      reason:
        "Devices are supplied through partners and individual assessments. Each unit must be traced to a delivery record before it is counted.",
    },
    {
      item: "School retention outcomes",
      reason:
        "Retention requires a follow-up period. BBVF will publish a baseline and a follow-up date rather than a single unverifiable percentage.",
    },
    {
      item: "Funds disbursed by campaign",
      reason:
        "Campaign totals on the public platform are not a bank ledger. A reconciled disbursement figure requires BBVF's finance records.",
    },
  ],
  method: [
    "Every published number will state its reporting period, its definition and the internal owner who approved it.",
    "Delivery is counted from signed delivery notes or partner confirmations, not from photographs or verbal reports.",
    "Money received is counted from the payment provider's reconciled settlement report, not from a browser redirect or a pledge.",
    "Where a figure is an estimate, it will be labelled as an estimate and shown separately from verified results.",
    "A correction to a published figure will be visible in the page history and noted on the page itself.",
  ],
  firstReport:
    "BBVF's first annual impact report is in preparation. It will be published here as an accessible HTML summary with a downloadable PDF, and will cover the reporting period, methodology, programme outputs, financial summary and safeguarding summary.",
} as const;
