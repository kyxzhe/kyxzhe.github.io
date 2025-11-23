import type { Metadata } from "next";
import Script from "next/script";
import { siteMetadata } from "@/lib/seo/config";
import { getBreadcrumbJsonLd } from "@/lib/seo/schema";

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
    title: pageTitle,
    description: pageDescription,
    url: `${siteMetadata.baseUrl}/publications`,
    images: [
      {
        url: siteMetadata.defaultImage,
        width: 1200,
        height: 630,
        alt: "Publications by Kevin Zheng",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
    card: "summary_large_image",
  },
};

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbJsonLd([
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "Publications", url: `${siteMetadata.baseUrl}/publications` },
  ]);

  return (
    <>
      <Script
        id="ld-breadcrumb-publications"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
