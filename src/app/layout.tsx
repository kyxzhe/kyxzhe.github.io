import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConsoleProvider from "@/components/Console";
import { Analytics } from "@vercel/analytics/next"

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
  title: "Kevin Zheng | Social Data Science & Robust ML",
  description: "PhD student mapping information diffusion, social data science, and robust machine learning in the Behavioural Data Science Lab at UTS.",
  keywords: ["Kevin Zheng", "information diffusion", "social data science", "robust machine learning", "misinformation"],
  authors: [{ name: "Yuxiang (Kevin) Zheng" }],
  creator: "Yuxiang (Kevin) Zheng",
  publisher: "Yuxiang (Kevin) Zheng",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "Kevin Zheng | Social Data Science & Robust ML",
    description: "Researching how information travels online and how to keep models trustworthy under messy supervision.",
    siteName: "Kevin Zheng",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Zheng | Social Data Science & Robust ML",
    description: "Information diffusion, social data science, and robust machine learning at UTS.",
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
