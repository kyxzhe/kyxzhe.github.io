import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/seo/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const host = new URL(siteMetadata.baseUrl).host;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteMetadata.baseUrl}/sitemap.xml`,
    host,
  };
}
