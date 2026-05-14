import type { Metadata } from "next";
import { defaultSeoImage, siteMetadata } from "@/lib/seo/config";
import {
  getBreadcrumbJsonLd,
  getProfilePageJsonLd,
  getWebPageJsonLd,
  serializeJsonLd,
} from "@/lib/seo/schema";

const pageTitle = "About";
const structuredTitle = "About Kevin Zheng";
const pageDescription =
  "Background, research focus, and teaching work of Yuxiang (Kevin) Zheng, a PhD student in information diffusion and robust machine learning.";
const pageModifiedDate = "2026-05-14";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "profile",
    title: structuredTitle,
    description: pageDescription,
    url: `${siteMetadata.baseUrl}/about`,
    siteName: siteMetadata.siteName,
    locale: siteMetadata.ogLocale,
    images: [defaultSeoImage],
  },
  twitter: {
    title: structuredTitle,
    description: pageDescription,
    card: "summary_large_image",
    images: [defaultSeoImage],
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
    dateModified: pageModifiedDate,
  });
  const webPage = getWebPageJsonLd({
    title: structuredTitle,
    description: pageDescription,
    url: pageUrl,
    type: "AboutPage",
    dateModified: pageModifiedDate,
  });

  return (
    <>
      <script
        id="ld-breadcrumb-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
      <script
        id="ld-profile-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(profilePage) }}
      />
      <script
        id="ld-webpage-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webPage) }}
      />
      {children}
    </>
  );
}
