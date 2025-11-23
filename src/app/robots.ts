import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/seo/config";

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
