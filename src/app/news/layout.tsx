import type { Metadata } from "next";
import Script from "next/script";
import { siteMetadata } from "@/lib/seo/config";
import { getBreadcrumbJsonLd } from "@/lib/seo/schema";

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
    title: pageTitle,
    description: pageDescription,
    url: `${siteMetadata.baseUrl}/news`,
    images: [
      {
        url: siteMetadata.defaultImage,
        width: 1200,
        height: 630,
        alt: "News and updates from Kevin Zheng",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
    card: "summary_large_image",
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbJsonLd([
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "News", url: `${siteMetadata.baseUrl}/news` },
  ]);

  return (
    <>
      <Script
        id="ld-breadcrumb-news"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
