import type { Metadata } from "next";
import Script from "next/script";
import { siteMetadata } from "@/lib/seo/config";
import { getBreadcrumbJsonLd, getCollectionPageJsonLd } from "@/lib/seo/schema";

const pageTitle = "Publications | Kevin Zheng";
const pageDescription =
  "Research papers, preprints, and safety briefs by Yuxiang (Kevin) Zheng on information diffusion and robust machine learning.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/publications",
  },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    url: `${siteMetadata.baseUrl}/publications`,
    siteName: siteMetadata.siteName,
    locale: siteMetadata.locale,
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
    card: "summary_large_image",
  },
};

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  const pageUrl = `${siteMetadata.baseUrl}/publications`;
  const breadcrumb = getBreadcrumbJsonLd([
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "Publications", url: pageUrl },
  ]);
  const collectionPage = getCollectionPageJsonLd({
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
  });

  return (
    <>
      <Script
        id="ld-breadcrumb-publications"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="ld-collection-publications"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPage) }}
      />
      {children}
    </>
  );
}
