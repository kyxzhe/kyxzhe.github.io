import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import ConsoleProvider from "@/components/Console";
import { Analytics } from "@vercel/analytics/next";
import { siteMetadata } from "@/lib/seo/config";
import { getPersonJsonLd, getWebsiteJsonLd } from "@/lib/seo/schema";

// Initialize OpenAI Sans font
const openAiSans = localFont({
  src: [
    {
      path: '../../public/fonts/OpenAISans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OpenAISans-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/OpenAISans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OpenAISans-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/OpenAISans-Medium.woff2',    
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OpenAISans-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/OpenAISans-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OpenAISans-SemiboldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/fonts/OpenAISans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OpenAISans-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-openai-sans',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.baseUrl),
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: ["Kevin Zheng", "information diffusion", "social data science", "robust machine learning", "misinformation"],
  authors: [{ name: siteMetadata.author.name }],
  creator: siteMetadata.author.name,
  publisher: siteMetadata.author.name,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: siteMetadata.baseUrl,
    title: siteMetadata.title,
    description: "Researching how information travels online and how to keep models trustworthy under messy supervision.",
    siteName: siteMetadata.siteName,
    images: [
      {
        url: siteMetadata.defaultImage,
        width: 1200,
        height: 630,
        alt: "Kevin Zheng — Social Data Science & Robust ML",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: "Information diffusion, social data science, and robust machine learning at UTS.",
  },
  alternates: {
    canonical: "/",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openAiSans.variable} antialiased`}>
        <ConsoleProvider />
        <Script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebsiteJsonLd()) }}
        />
        <Script
          id="ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getPersonJsonLd()) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
