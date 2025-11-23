import type { Metadata } from "next";
import Script from "next/script";
import { siteMetadata } from "@/lib/seo/config";
import { getBreadcrumbJsonLd } from "@/lib/seo/schema";

const pageTitle = "Contact | Kevin Zheng";
const pageDescription =
  "Contact details for Yuxiang (Kevin) Zheng — email, scheduling preferences, and collaboration topics for information diffusion and robust ML.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${siteMetadata.baseUrl}/contact`,
    images: [
      {
        url: siteMetadata.defaultImage,
        width: 1200,
        height: 630,
        alt: "Contact Kevin Zheng",
      },
    ],
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
    card: "summary_large_image",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = getBreadcrumbJsonLd([
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "Contact", url: `${siteMetadata.baseUrl}/contact` },
  ]);

  return (
    <>
      <Script
        id="ld-breadcrumb-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
