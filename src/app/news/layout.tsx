import type { Metadata } from "next";
import { defaultSeoImage, siteMetadata } from "@/lib/seo/config";

const pageTitle = "News & Updates";
const structuredTitle = "News & Updates | Kevin Zheng";
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
    title: structuredTitle,
    description: pageDescription,
    url: `${siteMetadata.baseUrl}/news`,
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

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
