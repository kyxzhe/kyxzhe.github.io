import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/seo/config";

export const dynamic = "force-static";
export const revalidate = 60 * 60; // 1 hour

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteMetadata.baseUrl}/sitemap.xml`,
    host: siteMetadata.baseUrl,
  };
}
