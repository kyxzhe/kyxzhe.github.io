import type { MetadataRoute } from "next";
import { newsItems } from "@/lib/constants/news";
import { publications } from "@/lib/constants/publications";
import { siteMetadata } from "@/lib/seo/config";

const baseUrl = siteMetadata.baseUrl.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/news",
    "/publications",
    "/contact",
  ].map((path, index) => ({
    url: `${baseUrl}${path || "/"}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "monthly",
    priority: index === 0 ? 1 : 0.8,
  }));

  const newsRoutes: MetadataRoute.Sitemap = newsItems.map((item) => ({
    url: `${baseUrl}/news#${item.id}`,
    lastModified: item.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const publicationRoutes: MetadataRoute.Sitemap = publications.map((pub) => ({
    url: `${baseUrl}/publications#${pub.id}`,
    lastModified: pub.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...newsRoutes, ...publicationRoutes];
}
