import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConsoleProvider from "@/components/Console";
import { Analytics } from "@vercel/analytics/next";
import { defaultSeoImage, siteMetadata } from "@/lib/seo/config";
import {
  getPersonJsonLd,
  getWebsiteJsonLd,
  serializeJsonLd,
} from "@/lib/seo/schema";

// Initialize OpenAI Sans font
const openAiSans = localFont({
  src: [
    {
      path: '../assets/fonts/OpenAISans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/OpenAISans-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../assets/fonts/OpenAISans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/OpenAISans-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../assets/fonts/OpenAISans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/OpenAISans-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/OpenAISans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-openai-sans',
  display: 'swap',
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.baseUrl),
  applicationName: siteMetadata.applicationName,
  title: {
    default: siteMetadata.title,
    template: siteMetadata.titleTemplate,
  },
  description: siteMetadata.description,
  icons: {
    icon: [
      { url: '/favicon.ico?v7', sizes: 'any', type: 'image/x-icon', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.ico?v7', sizes: 'any', type: 'image/x-icon', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: [
      { url: '/favicon.ico?v7', sizes: 'any', type: 'image/x-icon', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.ico?v7', sizes: 'any', type: 'image/x-icon', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
  authors: [{ name: siteMetadata.author.name }],
  creator: siteMetadata.author.name,
  publisher: siteMetadata.author.name,
  category: "research",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteMetadata.baseUrl,
    title: siteMetadata.title,
    description: "Researching how information travels online and how to keep models trustworthy under messy supervision.",
    siteName: siteMetadata.siteName,
    locale: siteMetadata.ogLocale,
    images: [defaultSeoImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: "Information diffusion, social data science, and robust machine learning at UTS.",
    images: [defaultSeoImage],
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "google7695f4aad3ebd2e9.html",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = getWebsiteJsonLd();
  const personJsonLd = getPersonJsonLd();

  return (
    <html lang={siteMetadata.language}>
      <body className={`${openAiSans.variable} antialiased`}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <ConsoleProvider />
        <script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
        />
        <script
          id="ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
