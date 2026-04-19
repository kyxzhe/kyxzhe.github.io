import type { Metadata } from "next";
import Script from "next/script";
import { siteMetadata } from "@/lib/seo/config";
import { getBreadcrumbJsonLd, getProfilePageJsonLd } from "@/lib/seo/schema";

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
    type: "profile",
    title: pageTitle,
    description: pageDescription,
    url: `${siteMetadata.baseUrl}/about`,
    siteName: siteMetadata.siteName,
    locale: siteMetadata.locale,
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
    card: "summary_large_image",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const pageUrl = `${siteMetadata.baseUrl}/about`;
  const breadcrumb = getBreadcrumbJsonLd([
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "About", url: pageUrl },
  ]);
  const profilePage = getProfilePageJsonLd({
    url: pageUrl,
    description: pageDescription,
  });

  return (
    <>
      <Script
        id="ld-breadcrumb-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="ld-profile-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
      />
      {children}
    </>
  );
}
