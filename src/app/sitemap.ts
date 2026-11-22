import type { MetadataRoute } from "next";
import {
  getPublicPrograms,
  getPublicCampaigns,
  getPublicStories,
  getPublicPolicies,
} from "@/lib/cms-content";
import { absoluteUrl } from "@/lib/site-url";

/**
 * Segmented by content type. Draft, gated and noindex routes are excluded:
 * a sitemap should list pages that are meant to be indexed. Content comes from
 * the same CMS-backed readers the pages use, so a newly published slug is
 * listed without a code change.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date("2026-11-21T00:00:00Z");
  const [programs, campaigns, stories, policies] = await Promise.all([
    getPublicPrograms(),
    getPublicCampaigns(),
    getPublicStories(),
    getPublicPolicies(),
  ]);

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about/governance", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about/leadership", priority: 0.7, changeFrequency: "monthly" },
    { path: "/where-we-work", priority: 0.6, changeFrequency: "yearly" },
    { path: "/programs", priority: 0.9, changeFrequency: "monthly" },
    { path: "/campaigns", priority: 0.9, changeFrequency: "weekly" },
    { path: "/impact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/impact/reports", priority: 0.6, changeFrequency: "monthly" },
    { path: "/stories", priority: 0.7, changeFrequency: "weekly" },
    { path: "/events", priority: 0.5, changeFrequency: "weekly" },
    { path: "/gallery", priority: 0.5, changeFrequency: "monthly" },
    { path: "/get-involved", priority: 0.8, changeFrequency: "monthly" },
    { path: "/donate", priority: 0.9, changeFrequency: "monthly" },
    { path: "/donate/local", priority: 0.8, changeFrequency: "monthly" },
    { path: "/donate/international", priority: 0.7, changeFrequency: "monthly" },
    { path: "/transparency", priority: 0.7, changeFrequency: "monthly" },
    { path: "/safeguarding", priority: 0.7, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/policies", priority: 0.5, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...programs.map((program) => ({
      url: absoluteUrl(`/programs/${program.slug}`),
      lastModified: new Date(`${program.lastReviewed}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...campaigns.map((campaign) => ({
      url: absoluteUrl(`/campaigns/${campaign.slug}`),
      lastModified: new Date(`${campaign.reportedOn}T00:00:00Z`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...stories.map((story) => ({
      url: absoluteUrl(`/stories/${story.slug}`),
      lastModified: new Date(`${story.updatedOn ?? story.publishedOn}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...policies
      .filter((policy) => policy.status === "published")
      .map((policy) => ({
        url: absoluteUrl(`/policies/${policy.slug}`),
        lastModified: new Date(`${policy.updated}T00:00:00Z`),
        changeFrequency: "yearly" as const,
        priority: 0.4,
      })),
  ];
}
