import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { publications } from "@/lib/constants/publications";
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

type PublicationPageProps = {
  params: Promise<{ id: string }>;
};

const getPublication = (id: string) =>
  publications.find((publication) => publication.id === id);

export function generateStaticParams() {
  return publications.map((publication) => ({ id: publication.id }));
}

export async function generateMetadata({
  params,
}: PublicationPageProps): Promise<Metadata> {
  const { id } = await params;
  const publication = getPublication(id);

  if (!publication) {
    return {};
  }

  const pageUrl = `/publications/${publication.id}`;
  const image = {
    url: absoluteUrl(publication.cover),
    width: 1200,
    height: 1800,
    alt: publication.title,
  };

  return {
    title: {
      absolute: `${publication.title} | Kevin Zheng`,
    },
    description: publication.summary,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "article",
      title: publication.title,
      description: publication.summary,
      url: absoluteUrl(pageUrl),
      siteName: siteMetadata.siteName,
      locale: siteMetadata.ogLocale,
      publishedTime: publication.date,
      authors: publication.authors,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: publication.title,
      description: publication.summary,
      images: [image],
    },
  };
}

export default async function PublicationDetailPage({
  params,
}: PublicationPageProps) {
  const { id } = await params;
  const publication = getPublication(id);

  if (!publication) {
    notFound();
  }

  const pageUrl = absoluteUrl(`/publications/${publication.id}`);
  const breadcrumb = getBreadcrumbJsonLd([
    { name: "Home", url: siteMetadata.baseUrl },
    { name: "Publications", url: absoluteUrl("/publications") },
    { name: publication.title, url: pageUrl },
  ]);
  const article = {
    ...getArticleJsonLd({
      id: "scholarly-article",
      title: publication.title,
      description: publication.summary,
      url: pageUrl,
      image: publication.cover,
      datePublished: publication.date,
      authors: publication.authors,
      keywords: [...publication.topics, ...publication.tags],
      type: "ScholarlyArticle",
    }),
    sameAs: publication.resources?.map((resource) => resource.url),
  };

  return (
    <div className="min-h-screen bg-white text-foreground dark:bg-[#000000] dark:text-[#f5f5f5] font-medium">
      <Navbar />
      <script
        id={`ld-breadcrumb-publication-${publication.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
      <script
        id={`ld-publication-${publication.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(article) }}
      />
      <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-2 py-6 md:px-4 lg:px-0">
        <Link
          href="/publications"
          className="inline-flex w-fit items-center gap-2 text-[13px] uppercase tracking-[0.24em] text-[rgba(0,0,0,0.6)] hover:text-foreground dark:text-[rgba(255,255,255,0.68)] dark:hover:text-white"
        >
          <ArrowLeft size={14} />
          Publications
        </Link>

        <article className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <p className="text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
              {publication.category} · {formatDisplayDate(publication.date)}
            </p>
            <div className="space-y-4">
              <h1 className="text-[40px] leading-[1.02] tracking-[-0.035em] md:text-[58px] dark:text-white">
                {publication.title}
              </h1>
              <p className="max-w-3xl text-[17px] leading-relaxed text-foreground/76 dark:text-white/76">
                {publication.summary}
              </p>
            </div>
            <div className="space-y-2 text-[15px] leading-relaxed">
              <p className="text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
                Authors
              </p>
              <p>{publication.authors.join(", ")}</p>
            </div>
            <div className="space-y-2 text-[15px] leading-relaxed">
              <p className="text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
                Venue
              </p>
              <p>{publication.venue}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {publication.topics.map((topic) => (
                <span key={topic} className="chip text-[13px]">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <aside className="self-start space-y-5">
            <div className="overflow-hidden rounded-[4px] bg-[#090909]">
              <div className="relative aspect-[4/3] w-full sm:aspect-square lg:aspect-[4/5]">
                <Image
                  src={getCardCoverPath(publication.cover)}
                  alt={publication.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 280px"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
            {publication.resources && publication.resources.length > 0 && (
              <div className="space-y-3">
                <p className="text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
                  Resources
                </p>
                <div className="flex flex-col gap-2">
                  {publication.resources.map((resource) => (
                    <Link
                      key={`${resource.type}-${resource.url}`}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between gap-3 rounded-full border border-[rgba(0,0,0,0.12)] px-4 py-2 text-[14px] font-medium transition-colors hover:border-foreground/50 dark:border-white/20"
                    >
                      {resource.label}
                      <ArrowUpRight size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </article>
      </main>
      <Footer className="mb-4" />
    </div>
  );
}
