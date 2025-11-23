import type { Metadata } from "next";
import Script from "next/script";
import { siteMetadata } from "@/lib/seo/config";
import { getBreadcrumbJsonLd } from "@/lib/seo/schema";

const pageTitle = "About Kevin Zheng";
const pageDescription =
  "Background, research focus, and teaching work of Yuxiang (Kevin) Zheng, a PhD student in information diffusion and robust machine learning.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${siteMetadata.baseUrl}/about`,
    images: [
      {
        url: siteMetadata.defaultImage,
        width: 1200,
        height: 630,
        alt: "Kevin Zheng profile",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
    card: "summary_large_image",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbJsonLd([
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "About", url: `${siteMetadata.baseUrl}/about` },
  ]);

  return (
    <>
      <Script
        id="ld-breadcrumb-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
