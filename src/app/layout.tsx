import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import ConsoleProvider from "@/components/Console";
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
      { url: '/favicon.ico?v7', sizes: 'any', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico?v7',
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
};

const themeFaviconScript = `
(() => {
  const version = 'v7';
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const upsertLink = (id, rel, href) => {
    let link = document.getElementById(id);
    if (!(link instanceof HTMLLinkElement)) {
      link = document.createElement('link');
      link.id = id;
      link.rel = rel;
      link.type = 'image/x-icon';
      document.head.appendChild(link);
    }
    link.href = href;
  };

  const applyTheme = (isDark) => {
    const href = isDark ? '/favicon-dark.ico?' + version : '/favicon.ico?' + version;
    upsertLink('theme-favicon-icon', 'icon', href);
    upsertLink('theme-favicon-shortcut', 'shortcut icon', href);
  };

  applyTheme(media.matches);

  const handleChange = (event) => applyTheme(event.matches);
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', handleChange);
  } else if (typeof media.addListener === 'function') {
    media.addListener(handleChange);
  }
})();
`;

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
        <ConsoleProvider />
        <Script id="theme-favicon" strategy="beforeInteractive">
          {themeFaviconScript}
        </Script>
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
      </body>
    </html>
  );
}
