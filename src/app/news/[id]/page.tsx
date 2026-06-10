import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { newsItems } from "@/lib/constants/news";
import { absoluteUrl, siteMetadata } from "@/lib/seo/config";
import {
  getArticleJsonLd,
  getBreadcrumbJsonLd,
  serializeJsonLd,
} from "@/lib/seo/schema";
import { formatDisplayDate } from "@/lib/utils/date";
import { getCardCoverPath } from "@/lib/utils/images";

export const dynamic = "force-static";
export const dynamicParams = false;

type NewsPageProps = {
  params: Promise<{ id: string }>;
};

const getNewsItem = (id: string) => newsItems.find((item) => item.id === id);

export function generateStaticParams() {
  return newsItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getNewsItem(id);

  if (!item) {
    return {};
  }

  const pageUrl = `/news/${item.id}`;
  const image = {
    url: absoluteUrl(item.cover),
    width: 1200,
    height: 1800,
    alt: item.title,
  };

  return {
    title: {
      absolute: `${item.title} | Kevin Zheng`,
    },
    description: item.summary,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.summary,
      url: absoluteUrl(pageUrl),
      siteName: siteMetadata.siteName,
      locale: siteMetadata.ogLocale,
      publishedTime: item.date,
      authors: [siteMetadata.author.name],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.summary,
      images: [image],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { id } = await params;
  const item = getNewsItem(id);

  if (!item) {
    notFound();
  }

  const pageUrl = absoluteUrl(`/news/${item.id}`);
  const breadcrumb = getBreadcrumbJsonLd([
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "News", url: absoluteUrl("/news") },
    { name: item.title, url: pageUrl },
  ]);
  const article = {
    ...getArticleJsonLd({
      id: "article",
      title: item.title,
      description: item.summary,
      url: pageUrl,
      image: item.cover,
      datePublished: item.date,
      keywords: item.topics,
      type: "Article",
    }),
    ...(item.link ? { sameAs: [item.link] } : {}),
  };

  return (
    <div className="min-h-screen bg-white text-foreground dark:bg-[#000000] dark:text-[#f5f5f5] font-medium">
      <Navbar />
      <script
        id={`ld-breadcrumb-news-${item.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
      <script
        id={`ld-news-${item.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(article) }}
      />
      <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-2 py-6 md:px-4 lg:px-0">
        <Link
          href="/news"
          className="inline-flex w-fit items-center gap-2 text-[13px] uppercase tracking-[0.24em] text-[rgba(0,0,0,0.6)] hover:text-foreground dark:text-[rgba(255,255,255,0.68)] dark:hover:text-white"
        >
          <ArrowLeft size={14} />
          News
        </Link>

        <article className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <p className="text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
              {item.category} · {formatDisplayDate(item.date)}
            </p>
            <div className="space-y-4">
              <h1 className="text-[40px] leading-[1.02] tracking-[-0.035em] md:text-[58px] dark:text-white">
                {item.title}
              </h1>
              <p className="max-w-3xl text-[17px] leading-relaxed text-foreground/76 dark:text-white/76">
                {item.summary}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {item.topics.map((topic) => (
                <span key={topic} className="chip text-[13px]">
                  {topic}
                </span>
              ))}
            </div>
            {item.link && (
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.12)] px-5 py-2.5 text-[14px] font-medium transition-colors hover:border-foreground/50 dark:border-white/20"
              >
                {item.linkLabel ?? "Related link"}
                <ArrowUpRight size={14} />
              </Link>
            )}
          </div>

          <aside className="self-start overflow-hidden rounded-[4px] bg-[#090909]">
            <div className="relative aspect-[4/3] w-full sm:aspect-square lg:aspect-[4/5]">
              <Image
                src={getCardCoverPath(item.cover)}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 280px"
                className="object-cover object-center"
                priority
              />
            </div>
          </aside>
        </article>
      </main>
      <Footer className="mb-4" />
    </div>
  );
}
