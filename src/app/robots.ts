import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const prelaunch = site.status !== "live";

  return {
    rules: prelaunch
      ? [{ userAgent: "*", disallow: "/" }]
      : [
          {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/investors", "/admin"],
          },
        ],
    sitemap: prelaunch ? undefined : `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
