import type { Metadata } from "next";
import Script from "next/script";
import { siteMetadata } from "@/lib/seo/config";
import { getBreadcrumbJsonLd, getCollectionPageJsonLd } from "@/lib/seo/schema";

const pageTitle = "News & Updates | Kevin Zheng";
const pageDescription =
  "Latest research updates, awards, talks, and milestones from Yuxiang (Kevin) Zheng on information diffusion and robust machine learning.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    url: `${siteMetadata.baseUrl}/news`,
    siteName: siteMetadata.siteName,
    locale: siteMetadata.locale,
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
    card: "summary_large_image",
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  const pageUrl = `${siteMetadata.baseUrl}/news`;
  const breadcrumb = getBreadcrumbJsonLd([
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "News", url: pageUrl },
  ]);
  const collectionPage = getCollectionPageJsonLd({
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
  });

  return (
    <>
      <Script
        id="ld-breadcrumb-news"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="ld-collection-news"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPage) }}
      />
      {children}
    </>
  );
}
