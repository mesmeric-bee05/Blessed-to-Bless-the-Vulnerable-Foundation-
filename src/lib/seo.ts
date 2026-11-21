import type { Metadata } from "next";
import { site } from "@/content/site";
import { absoluteUrl, siteUrl } from "@/lib/site-url";
import type { Campaign } from "@/content/campaigns";
import type { Story } from "@/content/stories";
import type { Faq } from "@/content/faqs";

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(input.path);
  const fullTitle =
    input.path === "/" ? input.title : `${input.title} — ${site.shortName}`;

  return {
    title: fullTitle,
    description: input.description,
    alternates: { canonical: url },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: input.type ?? "website",
      url,
      siteName: site.name,
      title: fullTitle,
      description: input.description,
      locale: "en_KE",
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
    },
  };
}

/**
 * NGO/Organization entity. `sameAs`, registration numbers and contact details
 * are only emitted when BBVF has verified them — structured data must never
 * describe an entity more confidently than the visible page does.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${siteUrl()}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: siteUrl(),
    areaServed: {
      "@type": "Place",
      name: site.county,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    knowsAbout: [
      "Children's education support",
      "Elderly care",
      "Disability inclusion",
      "Amputee veteran rehabilitation",
    ],
    ...(site.social.length > 0 ? { sameAs: site.social.map((s) => s.href) } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl()}/#website`,
    url: siteUrl(),
    name: site.name,
    inLanguage: "en-KE",
    publisher: { "@id": `${siteUrl()}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: readonly Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function articleSchema(story: Story) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.excerpt,
    datePublished: story.publishedOn,
    ...(story.updatedOn ? { dateModified: story.updatedOn } : {}),
    author: { "@type": "Organization", name: story.author },
    publisher: { "@id": `${siteUrl()}/#organization` },
    mainEntityOfPage: absoluteUrl(`/stories/${story.slug}`),
    inLanguage: "en-KE",
  };
}

export function donateActionSchema(campaign: Campaign) {
  return {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    name: campaign.title,
    description: campaign.summary,
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(`/campaigns/${campaign.slug}`),
      actionPlatform: "https://schema.org/DesktopWebPlatform",
    },
    recipient: { "@id": `${siteUrl()}/#organization` },
  };
}
