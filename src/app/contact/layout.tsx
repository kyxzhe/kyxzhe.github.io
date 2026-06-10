import type { Metadata } from "next";
import { defaultSeoImage, siteMetadata } from "@/lib/seo/config";
import {
  getBreadcrumbJsonLd,
  getWebPageJsonLd,
  serializeJsonLd,
} from "@/lib/seo/schema";

const pageTitle = "Contact";
const structuredTitle = "Contact | Kevin Zheng";
const pageDescription =
  "Contact details for Yuxiang (Kevin) Zheng — email, scheduling preferences, and collaboration topics for information diffusion and robust ML.";
const pageModifiedDate = "2026-06-11";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    title: structuredTitle,
    description: pageDescription,
    url: `${siteMetadata.baseUrl}/contact`,
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

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const pageUrl = `${siteMetadata.baseUrl}/contact`;
  const breadcrumb = getBreadcrumbJsonLd([
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "Contact", url: pageUrl },
  ]);
  const contactPage = getWebPageJsonLd({
    title: structuredTitle,
    description: pageDescription,
    url: pageUrl,
    type: "ContactPage",
    dateModified: pageModifiedDate,
  });

  return (
    <>
      <script
        id="ld-breadcrumb-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
      <script
        id="ld-contact-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(contactPage) }}
      />
      {children}
    </>
  );
}
