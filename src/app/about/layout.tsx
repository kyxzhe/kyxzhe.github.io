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
const pageModifiedDate = "2026-07-10";
const pageUrl = `${siteMetadata.baseUrl}/about/`;
const serializedBreadcrumbJsonLd = serializeJsonLd(
  getBreadcrumbJsonLd([
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "About", url: pageUrl },
  ])
);
const serializedProfilePageJsonLd = serializeJsonLd(
  getProfilePageJsonLd({
    url: pageUrl,
    description: pageDescription,
    dateModified: pageModifiedDate,
  })
);
const serializedWebPageJsonLd = serializeJsonLd(
  getWebPageJsonLd({
    title: structuredTitle,
    description: pageDescription,
    url: pageUrl,
    type: "AboutPage",
    dateModified: pageModifiedDate,
  })
);

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/about/",
  },
  openGraph: {
    type: "profile",
    title: structuredTitle,
    description: pageDescription,
    url: pageUrl,
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
  return (
    <>
      <script
        id="ld-breadcrumb-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedBreadcrumbJsonLd }}
      />
      <script
        id="ld-profile-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedProfilePageJsonLd }}
      />
      <script
        id="ld-webpage-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedWebPageJsonLd }}
      />
      {children}
    </>
  );
}
