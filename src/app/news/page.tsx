"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type NewsCategory, type NewsItem, newsItems } from "@/lib/constants/news";
import { getArticleJsonLd } from "@/lib/seo/schema";
import { siteMetadata } from "@/lib/seo/config";

const MONTH_ABBREVIATIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  const monthLabel = MONTH_ABBREVIATIONS[month - 1];
  if (!monthLabel) return isoDate;
  return `${monthLabel} ${day}, ${year}`;
}

const categories = ["All", ...Array.from(new Set(newsItems.map((item) => item.category)))];

const categoryLabelMap: Record<NewsCategory, string> = {
  RESEARCH: "Research",
  AWARD: "Award",
  MILESTONE: "Milestone",
  TALK: "Talk",
  TEACHING: "Teaching",
};

function formatCategoryLabel(category: string) {
  return category === "All" ? "All" : categoryLabelMap[category as NewsCategory] ?? category;
}

function MetaLine({ item }: { item: NewsItem }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.18em] text-white/58">
      {formatCategoryLabel(item.category)} <span className="mx-1.5">·</span> {formatDate(item.date)}
    </p>
  );
}

function ClickableCard({
  item,
  className,
  children,
}: {
  item: NewsItem;
  className?: string;
  children: React.ReactNode;
}) {
  if (item.link) {
    return (
      <Link
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredItems = useMemo(() => {
    return newsItems.filter((item) => activeCategory === "All" || item.category === activeCategory);
  }, [activeCategory]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredItems]);

  const leadItem = sortedItems[0];
  const sideRailItems = sortedItems.slice(1, 4);
  const recentItems = sortedItems.slice(4);
  const leftColumnItems = recentItems.filter((_, index) => index % 2 === 0);
  const rightColumnItems = recentItems.filter((_, index) => index % 2 === 1);

  const articleJsonLd = useMemo(() => {
    const topItems = sortedItems.slice(0, 5);
    return topItems.map((item) =>
      getArticleJsonLd({
        id: item.id,
        title: item.title,
        description: item.summary,
        url: `${siteMetadata.baseUrl}/news#${item.id}`,
        image: item.cover,
        datePublished: item.date,
        dateModified: item.date,
        authors: [siteMetadata.author.name],
      })
    );
  }, [sortedItems]);

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f5] font-medium">
      <Script
        id="ld-news-articles"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />
      <main className="mx-auto w-full max-w-[1360px] px-3 md:px-5 lg:px-6 pt-6 pb-14 flex flex-col gap-10">
        <section className="space-y-4">
          <p className="text-[12px] uppercase tracking-[0.32em] text-white/62">News</p>
          <h1 className="max-w-4xl text-[44px] md:text-[72px] leading-[0.94] tracking-[-0.04em] text-white">
            Research notes, awards, and milestones.
          </h1>
          <p className="max-w-2xl text-[16px] md:text-[18px] leading-relaxed text-white/62">
            A curated stream of papers, talks, awards, and milestones from my research and teaching work.
          </p>
        </section>

        <div className="flex flex-wrap gap-2.5 text-sm">
          {categories.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2.5 transition-colors ${
                  active
                    ? "border-white/22 bg-white/12 text-white"
                    : "border-white/12 bg-transparent text-white/62 hover:border-white/22 hover:text-white"
                }`}
              >
                {formatCategoryLabel(category)}
              </button>
            );
          })}
        </div>

        {leadItem && (
          <section className="grid gap-3 lg:grid-cols-[minmax(0,1.42fr)_360px] xl:grid-cols-[minmax(0,1.64fr)_392px] items-start pb-4 md:pb-6">
            <ClickableCard item={leadItem} className="block lg:self-start lg:sticky lg:top-0">
              <motion.article
                whileHover={{ y: -3 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <div className="overflow-hidden rounded-[4px] bg-[#090909]">
                  <div className="relative aspect-[1.58/1] w-full">
                    <Image
                      src={leadItem.cover}
                      alt={leadItem.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
                <div className="pt-3">
                  <h2 className="max-w-4xl text-[30px] md:text-[40px] leading-[0.98] tracking-[-0.04em] text-white">
                    {leadItem.title}
                  </h2>
                  <div className="pt-2.5">
                    <MetaLine item={leadItem} />
                  </div>
                </div>
              </motion.article>
            </ClickableCard>

            <div className="flex flex-col gap-6">
              {sideRailItems.map((item) => (
                <ClickableCard key={item.id} item={item} className="block">
                  <motion.article
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="group"
                  >
                    <div className="overflow-hidden rounded-[4px] bg-[#090909]">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={item.cover}
                          alt={item.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 392px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>
                    <div className="pt-3">
                      <h3 className="max-w-[24rem] text-[22px] leading-[1.08] tracking-[-0.03em] text-white">
                        {item.title}
                      </h3>
                      <div className="pt-2">
                        <MetaLine item={item} />
                      </div>
                    </div>
                  </motion.article>
                </ClickableCard>
              ))}
            </div>
          </section>
        )}

        {recentItems.length > 0 && (
          <section className="pt-8 md:pt-14">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-[26px] md:text-[30px] tracking-[-0.03em] text-white">Recent updates</h2>
              <p className="text-sm text-white/48">Showing {sortedItems.length} items</p>
            </div>

            <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              {[leftColumnItems, rightColumnItems].map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-4">
                  {column.map((item, index) => (
                    <ClickableCard key={item.id} item={item} className="block">
                      <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                          duration: 0.45,
                          delay: index * 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="group grid grid-cols-[102px_minmax(0,1fr)] gap-4 rounded-[6px] border border-transparent p-0 transition-colors hover:border-white/10"
                      >
                        <div className="overflow-hidden rounded-[4px] bg-[#090909]">
                          <div className="relative aspect-square w-full">
                            <Image
                              src={item.cover}
                              alt={item.title}
                              fill
                              sizes="102px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          </div>
                        </div>
                        <div className="flex min-w-0 flex-col justify-center py-1">
                          <h3 className="text-[22px] leading-[1.1] tracking-[-0.03em] text-white">
                            {item.title}
                          </h3>
                          <div className="pt-2">
                            <MetaLine item={item} />
                          </div>
                        </div>
                      </motion.article>
                    </ClickableCard>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer className="mb-4" />
    </div>
  );
}
