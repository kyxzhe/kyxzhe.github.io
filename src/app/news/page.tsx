"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { motion } from "motion/react";
import { ArrowUpDown, Filter, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type NewsCategory, type NewsItem, newsItems } from "@/lib/constants/news";
import { getArticleJsonLd } from "@/lib/seo/schema";
import { siteMetadata } from "@/lib/seo/config";

type ViewMode = "list" | "grid";
type SortMode = "newest" | "oldest" | "az" | "za";

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

function formatListDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  const monthLabel = MONTH_ABBREVIATIONS[month - 1];
  if (!monthLabel) return isoDate;
  return `${day} ${monthLabel} ${year}`;
}

const categories = ["All", ...Array.from(new Set(newsItems.map((item) => item.category)))];
const topics = Array.from(new Set(newsItems.flatMap((item) => item.topics))).sort();
const years = Array.from(new Set(newsItems.map((item) => new Date(item.date).getFullYear()))).sort((a, b) => b - a);
const sortOptions: { label: string; value: SortMode }[] = [
  { label: "Newest → Oldest", value: "newest" },
  { label: "Oldest → Newest", value: "oldest" },
  { label: "Alphabetical (A–Z)", value: "az" },
  { label: "Alphabetical (Z–A)", value: "za" },
];

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

const ListRow = ({ item }: { item: NewsItem }) => {
  const row = (
    <article className="group flex flex-col gap-3 py-6 border-b border-[rgba(0,0,0,0.08)] dark:border-white/20 transition-colors hover:border-foreground/70 font-normal">
      <p className="text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.44)]">
        {item.category}
      </p>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[17px] leading-snug text-foreground dark:text-white">{item.title}</h3>
        <p className="text-[14px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.44)] whitespace-nowrap">
          {formatListDate(item.date)}
        </p>
      </div>
      <p className="text-[14px] text-foreground/80 dark:text-white leading-relaxed max-w-3xl">
        {item.summary}
      </p>
    </article>
  );

  if (item.link) {
    return (
      <Link key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="group block">
        {row}
      </Link>
    );
  }

  return (
    <div key={item.id} className="group block cursor-default">
      {row}
    </div>
  );
};

function MetaLine({ item }: { item: NewsItem }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.18em] text-white/58">
      {formatCategoryLabel(item.category)} <span className="mx-1.5">·</span> {formatListDate(item.date)}
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
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const toggleYear = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const filteredItems = useMemo(() => {
    return newsItems.filter((item) => {
      const categoryMatch = activeCategory === "All" || item.category === activeCategory;
      const topicsMatch =
        selectedTopics.length === 0 || selectedTopics.every((topic) => item.topics.includes(topic));
      const yearsMatch =
        selectedYears.length === 0 || selectedYears.includes(new Date(item.date).getFullYear());
      return categoryMatch && topicsMatch && yearsMatch;
    });
  }, [activeCategory, selectedTopics, selectedYears]);

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];
    sorted.sort((a, b) => {
      switch (sortMode) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
    return sorted;
  }, [filteredItems, sortMode]);

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
    <div className="min-h-screen bg-white text-foreground dark:bg-[#000000] dark:text-[#f5f5f5] font-medium">
      <Script
        id="ld-news-articles"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />
      {(filterOpen || sortOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setFilterOpen(false);
            setSortOpen(false);
          }}
        />
      )}
      <main className="flex-1 mx-auto w-full max-w-5xl px-2 md:px-4 lg:px-0 py-6 flex flex-col gap-6">
        <section className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">NEWS</p>
          <h1 className="text-[48px] font-medium leading-tight text-foreground">News &amp; updates</h1>
          <p className="text-[15px] md:text-base text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)] max-w-2xl leading-relaxed">
            Updates on new papers, awards, talks, and milestones.
          </p>
        </section>

        <div className="flex flex-wrap gap-2 text-sm text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === category
                  ? "bg-[rgba(0,0,0,0.12)] border-transparent text-foreground dark:bg-[rgba(255,255,255,0.4)] dark:text-white"
                  : "bg-[rgba(0,0,0,0.04)] border-transparent text-[rgba(0,0,0,0.6)] dark:bg-[rgba(255,255,255,0.12)] dark:text-[rgba(255,255,255,0.8)] hover:border-[rgba(0,0,0,0.08)]"
              }`}
            >
              {formatCategoryLabel(category)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium">
          <p className="text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Showing {sortedItems.length} updates</p>

          <div className="relative flex items-center gap-4 text-sm font-medium">
            <div className="relative flex items-center gap-1">
              <button
                className="flex items-center gap-1"
                onClick={() => {
                  setFilterOpen((prev) => !prev);
                  setSortOpen(false);
                }}
              >
                <span
                  className={
                    selectedTopics.length > 0 || selectedYears.length > 0 || filterOpen
                      ? "text-foreground dark:text-white"
                      : "text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]"
                  }
                >
                  Filter
                </span>
                <Filter
                  size={16}
                  className={
                    selectedTopics.length > 0 || selectedYears.length > 0 || filterOpen
                      ? "text-foreground dark:text-white"
                      : "text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]"
                  }
                />
              </button>
              {filterOpen && (
                <div className="absolute top-full mt-2 w-[min(420px,calc(100vw-2rem))] left-1 right-auto sm:left-auto sm:right-0 z-40 surface-card p-4 flex flex-col gap-4 shadow-xl rounded-2xl border border-border text-sm">
                  <div className="flex items-center justify-between text-sm text-foreground dark:text-white">
                    <p className="font-semibold">Filters</p>
                    <button
                      type="button"
                      className="text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]"
                      onClick={() => {
                        setFilterOpen(false);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-foreground dark:text-white">
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">Topic</p>
                      {topics.map((topic) => (
                        <label key={topic} className="flex items-center gap-2 text-[13px] text-foreground dark:text-white">
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => toggleTopic(topic)}
                          />
                          {topic}
                        </label>
                      ))}
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">Year</p>
                      {years.map((year) => (
                        <label key={year} className="flex items-center gap-2 text-[13px] text-foreground dark:text-white">
                          <input
                            type="checkbox"
                            checked={selectedYears.includes(year)}
                            onChange={() => toggleYear(year)}
                          />
                          {year}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end pt-2 text-xs text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">
                    <button
                      type="button"
                      className="underline-offset-2 hover:text-foreground dark:hover:text-white"
                      onClick={() => {
                        setSelectedTopics([]);
                        setSelectedYears([]);
                      }}
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex items-center gap-1">
              <button
                className={`flex items-center gap-1 ${
                  sortOpen ? "text-foreground dark:text-white" : "text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]"
                }`}
                onClick={() => {
                  setSortOpen((prev) => !prev);
                  setFilterOpen(false);
                }}
              >
                <span>Sort</span>
                <ArrowUpDown size={16} />
              </button>
              {sortOpen && (
                <div className="absolute top-full mt-2 w-[min(256px,calc(100vw-2rem))] left-1 sm:left-auto sm:right-0 z-40 surface-card p-3 flex flex-col gap-2 shadow-xl rounded-2xl border border-border text-sm text-foreground dark:text-white">
                  {sortOptions.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-foreground/80 dark:text-white/80">
                      <input
                        type="radio"
                        name="news-sort"
                        value={option.value}
                        checked={sortMode === option.value}
                        onChange={() => setSortMode(option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">
              <button
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "text-foreground bg-[rgba(0,0,0,0.06)] dark:bg-white/25 dark:text-white"
                    : "hover:text-foreground dark:hover:text-white"
                }`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List size={16} />
              </button>
              <button
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "text-foreground bg-[rgba(0,0,0,0.06)] dark:bg-white/25 dark:text-white"
                    : "hover:text-foreground dark:hover:text-white"
                }`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <section className="bg-transparent">
            {sortedItems.map((item) => (
              <ListRow key={item.id} item={item} />
            ))}
          </section>
        ) : leadItem ? (
          <section className="w-full max-w-[1360px] self-center grid gap-4 lg:grid-cols-[minmax(0,1fr)_288px] xl:grid-cols-[minmax(0,1fr)_312px] items-start pb-4 md:pb-6">
            <ClickableCard item={leadItem} className="block lg:self-start lg:sticky lg:top-0">
              <motion.article
                whileHover={{ y: -3 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <div className="overflow-hidden rounded-[4px] bg-[#090909]">
                  <div className="relative aspect-[1.68/1] w-full">
                    <Image
                      src={leadItem.cover}
                      alt={leadItem.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 72vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
                <div className="pt-3">
                  <h2 className="max-w-4xl text-[30px] md:text-[44px] leading-[0.98] tracking-[-0.04em] text-white">
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
                    <div className="pt-2.5">
                      <h3 className="max-w-[17rem] text-[16px] md:text-[18px] leading-[1.12] tracking-[-0.02em] text-white">
                        {item.title}
                      </h3>
                      <div className="pt-1.5">
                        <MetaLine item={item} />
                      </div>
                    </div>
                  </motion.article>
                </ClickableCard>
              ))}
            </div>
          </section>
        ) : null}

        {viewMode === "grid" && recentItems.length > 0 && (
          <section className="w-full max-w-[1360px] self-center pt-10 md:pt-16">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-[22px] md:text-[28px] tracking-[-0.03em] text-white">Recent updates</h2>
              <p className="text-sm text-white/48">Showing {sortedItems.length} items</p>
            </div>

            <div className="grid gap-x-16 gap-y-8 md:grid-cols-2">
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
                        className="group grid grid-cols-[96px_minmax(0,1fr)] md:grid-cols-[104px_minmax(0,1fr)] gap-4 rounded-[6px] border border-transparent p-0 transition-colors hover:border-white/10"
                      >
                        <div className="overflow-hidden rounded-[4px] bg-[#090909]">
                          <div className="relative aspect-square w-full">
                            <Image
                              src={item.cover}
                              alt={item.title}
                              fill
                              sizes="104px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          </div>
                        </div>
                        <div className="flex min-w-0 flex-col justify-center py-1">
                          <h3 className="text-[18px] md:text-[20px] leading-[1.12] tracking-[-0.025em] text-white">
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
