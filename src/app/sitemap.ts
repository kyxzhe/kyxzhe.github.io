import type { MetadataRoute } from "next";
import { newsItems } from "@/lib/constants/news";
import { publications } from "@/lib/constants/publications";
import { absoluteUrl, siteMetadata } from "@/lib/seo/config";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

const baseUrl = siteMetadata.baseUrl.replace(/\/$/, "");
const siteUpdatedAt = "2026-05-14";
const newsUpdatedAt = newsItems.reduce(
  (latest, item) => (item.date > latest ? item.date : latest),
  "2024-01-01"
);
const publicationsUpdatedAt = publications.reduce(
  (latest, item) => (item.date > latest ? item.date : latest),
  "2024-01-01"
);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly",
      priority: 1,
      images: [absoluteUrl(siteMetadata.defaultOgImage)],
    },
    {
      url: `${baseUrl}/about`,
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [absoluteUrl(siteMetadata.defaultOgImage)],
    },
    {
      url: `${baseUrl}/news`,
      lastModified: newsUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [absoluteUrl(siteMetadata.defaultOgImage)],
    },
    {
      url: `${baseUrl}/publications`,
      lastModified: publicationsUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [absoluteUrl(siteMetadata.defaultOgImage)],
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: siteUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [absoluteUrl(siteMetadata.defaultOgImage)],
    },
  ];

  const publicationRoutes: MetadataRoute.Sitemap = publications.map((publication) => ({
    url: `${baseUrl}/publications/${publication.id}`,
    lastModified: publication.date,
    changeFrequency: "monthly",
    priority: 0.7,
    images: [absoluteUrl(publication.cover)],
  }));

  const newsRoutes: MetadataRoute.Sitemap = newsItems.map((item) => ({
    url: `${baseUrl}/news/${item.id}`,
    lastModified: item.date,
    changeFrequency: "yearly",
    priority: 0.6,
    images: [absoluteUrl(item.cover)],
  }));

  return [...staticRoutes, ...publicationRoutes, ...newsRoutes];
}
