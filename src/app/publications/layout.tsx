import type { Metadata } from "next";
import { defaultSeoImage, siteMetadata } from "@/lib/seo/config";

const pageTitle = "Publications";
const structuredTitle = "Publications | Kevin Zheng";
const pageDescription =
  "Research papers and preprints by Yuxiang (Kevin) Zheng on information diffusion and robust machine learning.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/publications/",
  },
  openGraph: {
    type: "website",
    title: structuredTitle,
    description: pageDescription,
    url: `${siteMetadata.baseUrl}/publications/`,
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

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
