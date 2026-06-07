"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpDown, ArrowUpRight, Filter, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type NewsCategory, type NewsItem, newsItems } from "@/lib/constants/news";
import { absoluteUrl, siteMetadata } from "@/lib/seo/config";
import {
  getArticleJsonLd,
  getBreadcrumbJsonLd,
  getCollectionPageJsonLd,
  getItemListJsonLd,
  serializeJsonLd,
} from "@/lib/seo/schema";
import { formatDisplayDate } from "@/lib/utils/date";

type ViewMode = "list" | "grid";
type SortMode = "newest" | "oldest" | "az" | "za";

const categories = ["All", ...Array.from(new Set(newsItems.map((item) => item.category)))];
const topics = Array.from(new Set(newsItems.flatMap((item) => item.topics))).sort();
const years = Array.from(new Set(newsItems.map((item) => new Date(item.date).getFullYear()))).sort((a, b) => b - a);
const sortOptions: { label: string; value: SortMode }[] = [
  { label: "Newest → Oldest", value: "newest" },
  { label: "Oldest → Newest", value: "oldest" },
  { label: "Alphabetical (A–Z)", value: "az" },
  { label: "Alphabetical (Z–A)", value: "za" },
];

const newsPath = (item: NewsItem) => `/news/${item.id}`;
const pageUrl = `${siteMetadata.baseUrl}/news`;
const pageDescription =
  "Latest research updates, awards, talks, and milestones from Yuxiang (Kevin) Zheng on information diffusion and robust machine learning.";
const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: "Home", url: siteMetadata.baseUrl },
  { name: "News", url: pageUrl },
]);
const collectionJsonLd = getCollectionPageJsonLd({
  title: "News & Updates | Kevin Zheng",
  description: pageDescription,
  url: pageUrl,
  dateModified: "2026-05-14",
});
const itemListJsonLd = getItemListJsonLd({
  id: "news-list",
  name: "Kevin Zheng news and updates",
  url: pageUrl,
  items: newsItems.map((item) =>
    getArticleJsonLd({
      id: item.id,
      title: item.title,
      description: item.summary,
      url: absoluteUrl(`/news/${item.id}`),
      image: item.cover,
      datePublished: item.date,
      keywords: item.topics,
      type: "Article",
    })
  ),
});

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
  return (
    <article className="group relative flex cursor-pointer flex-col gap-3 border-b border-[rgba(0,0,0,0.08)] py-6 font-normal transition-colors hover:border-foreground/70 dark:border-white/20">
      <Link
        href={newsPath(item)}
        aria-label={`Read ${item.title}`}
        className="absolute inset-0 z-10"
      />
      <p className="text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.44)]">
        {item.category}
      </p>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[17px] leading-snug text-foreground dark:text-white">
          {item.title}
        </h3>
        <p className="text-[14px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.44)] whitespace-nowrap">
          {formatDisplayDate(item.date)}
        </p>
      </div>
      <p className="text-[14px] text-foreground/80 dark:text-white leading-relaxed max-w-3xl">
        {item.summary}
      </p>
      {item.link && (
        <Link
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-20 inline-flex w-fit items-center gap-1 text-[12px] uppercase tracking-[0.28em] text-foreground hover:underline underline-offset-4"
        >
          {item.linkLabel ?? "Related link"}
          <ArrowUpRight size={12} />
        </Link>
      )}
    </article>
  );
};

function MetaLine({ item }: { item: NewsItem }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.18em] text-[rgba(0,0,0,0.5)] dark:text-white/58">
      {formatCategoryLabel(item.category)} <span className="mx-1.5">·</span> {formatDisplayDate(item.date)}
    </p>
  );
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [gridScrollSpacer, setGridScrollSpacer] = useState(0);
  const gridSectionRef = useRef<HTMLElement | null>(null);
  const gridLeadArticleRef = useRef<HTMLElement | null>(null);
  const gridScrollSpacerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (viewMode !== "grid" || !leadItem || sideRailItems.length === 0) {
      setGridScrollSpacer(0);
      return;
    }

    let frame = 0;
    const measureSpacer = () => {
      const gridSection = gridSectionRef.current;
      const leadArticle = gridLeadArticleRef.current;
      if (!gridSection || !leadArticle || window.innerWidth < 1024) {
        setGridScrollSpacer(0);
        return;
      }

      const stickyParent = leadArticle.parentElement;
      const stickyTop = stickyParent ? parseFloat(getComputedStyle(stickyParent).top) || 0 : 0;
      const currentSpacer = gridScrollSpacerRef.current?.getBoundingClientRect().height ?? 0;
      const baseScrollHeight = document.documentElement.scrollHeight - currentSpacer;
      const gridRect = gridSection.getBoundingClientRect();
      const leadRect = leadArticle.getBoundingClientRect();
      const gridTop = gridRect.top + window.scrollY;
      const requiredMaxScroll = gridTop - stickyTop + gridRect.height - leadRect.height;
      const nextSpacer = Math.max(0, Math.ceil(window.innerHeight + requiredMaxScroll - baseScrollHeight + 2));

      setGridScrollSpacer((previous) => (Math.abs(previous - nextSpacer) > 1 ? nextSpacer : previous));
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measureSpacer);
    };

    scheduleMeasure();
    window.addEventListener("resize", scheduleMeasure);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleMeasure);
    if (gridSectionRef.current) observer?.observe(gridSectionRef.current);
    if (gridLeadArticleRef.current) observer?.observe(gridLeadArticleRef.current);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleMeasure);
      observer?.disconnect();
    };
  }, [leadItem, sideRailItems.length, sortedItems.length, viewMode]);

  return (
    <div className="min-h-screen bg-white text-foreground dark:bg-[#000000] dark:text-[#f5f5f5] font-medium">
      <script
        id="ld-breadcrumb-news"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        id="ld-collection-news"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionJsonLd) }}
      />
      <script
        id="ld-item-list-news"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemListJsonLd) }}
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
              className={`min-h-11 px-4 py-2 rounded-full border transition-colors ${
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
                type="button"
                className="inline-flex min-h-11 items-center gap-1 rounded-full px-3"
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
                <div className="fixed bottom-3 left-3 right-3 z-40 flex max-h-[min(56vh,28rem)] flex-col overflow-hidden rounded-[18px] bg-[var(--card)]/96 text-sm shadow-[0_18px_45px_rgba(0,0,0,0.16)] backdrop-blur-md dark:bg-[#141416]/96 sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-[min(34rem,calc(100vh-2rem))] sm:w-[min(420px,calc(100vw-2rem))]">
                  <div className="flex shrink-0 items-center justify-between px-4 pb-1 pt-3 text-sm text-foreground dark:text-white">
                    <p className="font-semibold">Filters</p>
                    <button
                      type="button"
                      aria-label="Close filters"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[rgba(0,0,0,0.6)] transition-colors hover:bg-[var(--accent-soft)] dark:text-[rgba(255,255,255,0.8)]"
                      onClick={() => {
                        setFilterOpen(false);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_78px] gap-4 overflow-y-auto px-4 py-3 text-sm text-foreground dark:text-white sm:grid-cols-2">
                    <div className="space-y-1.5 sm:max-h-60 sm:overflow-y-auto sm:pr-1">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">Topic</p>
                      {topics.map((topic) => (
                        <label key={topic} className="flex min-h-9 items-center gap-2 text-[13px] leading-snug text-foreground dark:text-white">
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => toggleTopic(topic)}
                          />
                          {topic}
                        </label>
                      ))}
                    </div>
                    <div className="space-y-1.5 sm:max-h-60 sm:overflow-y-auto sm:pr-1">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">Year</p>
                      {years.map((year) => (
                        <label key={year} className="flex min-h-9 items-center gap-2 text-[13px] leading-snug text-foreground dark:text-white">
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
                  <div className="flex shrink-0 justify-end px-4 pb-3 pt-1 text-xs text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">
                    <button
                      type="button"
                      className="min-h-11 px-2 underline-offset-2 hover:text-foreground dark:hover:text-white"
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
                type="button"
                className={`inline-flex min-h-11 items-center gap-1 rounded-full px-3 ${
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
                <div className="fixed bottom-4 left-4 right-4 z-40 flex max-h-[calc(100vh-2rem)] flex-col gap-2 overflow-y-auto rounded-[18px] bg-[var(--card)]/96 p-3 text-sm text-foreground shadow-[0_18px_45px_rgba(0,0,0,0.16)] backdrop-blur-md dark:bg-[#141416]/96 dark:text-white sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[min(256px,calc(100vw-2rem))]">
                  {sortOptions.map((option) => (
                    <label key={option.value} className="flex min-h-11 items-center gap-2 text-foreground/80 dark:text-white/80">
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
                type="button"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
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
                type="button"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
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

        {sortedItems.length === 0 ? (
          <section className="border-y border-[rgba(0,0,0,0.08)] py-10 text-sm dark:border-white/20">
            <div className="flex max-w-2xl flex-col items-start gap-3">
              <h2 className="text-[18px] font-medium text-foreground dark:text-white">No updates match these filters</h2>
              <p className="max-w-xl leading-relaxed text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">
                Try clearing the selected topics or years to see the full news list again.
              </p>
              <button
                type="button"
                className="inline-flex min-h-11 items-center text-[12px] uppercase tracking-[0.28em] text-foreground underline-offset-4 hover:underline dark:text-white"
                onClick={() => {
                  setSelectedTopics([]);
                  setSelectedYears([]);
                }}
              >
                Clear filters
              </button>
            </div>
          </section>
        ) : viewMode === "list" ? (
          <section className="bg-transparent">
            {sortedItems.map((item) => (
              <ListRow key={item.id} item={item} />
            ))}
          </section>
        ) : leadItem ? (
          <section
            ref={gridSectionRef}
            className="w-full self-center grid gap-6 lg:w-[calc(100vw-84px)] lg:max-w-[1224px] lg:grid-cols-[minmax(0,1fr)_272px] items-start"
          >
            <div className="block lg:sticky lg:top-20 lg:self-start">
              <motion.article
                ref={gridLeadArticleRef}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="group relative cursor-pointer"
              >
                <Link
                  href={newsPath(leadItem)}
                  aria-label={`Read ${leadItem.title}`}
                  className="absolute inset-0 z-10"
                />
                <div className="overflow-hidden rounded-[4px] bg-[#090909]">
                  <div className="relative aspect-[1.68/1] w-full">
                    <Image
                      src={leadItem.cover}
                      alt={leadItem.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 844px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      priority
                    />
                  </div>
                </div>
                <div className="pt-3">
                  <h2 className="max-w-4xl text-[30px] md:text-[clamp(30px,2.95vw,36px)] leading-[1.02] tracking-[-0.035em] text-foreground dark:text-white">
                    {leadItem.title}
                  </h2>
                  <div className="pt-2.5">
                    <MetaLine item={leadItem} />
                  </div>
                </div>
              </motion.article>
            </div>

            <div className="flex flex-col gap-6">
              {sideRailItems.map((item) => (
                <div key={item.id} className="block">
                  <motion.article
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative cursor-pointer"
                  >
                    <Link
                      href={newsPath(item)}
                      aria-label={`Read ${item.title}`}
                      className="absolute inset-0 z-10"
                    />
                    <div className="overflow-hidden rounded-[4px] bg-[#090909]">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={item.cover}
                          alt={item.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 272px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>
                    <div className="pt-2.5">
                      <h3 className="max-w-[17rem] text-[16px] md:text-[18px] leading-[1.12] tracking-[-0.02em] text-foreground dark:text-white">
                        {item.title}
                      </h3>
                      <div className="pt-1.5">
                        <MetaLine item={item} />
                      </div>
                    </div>
                  </motion.article>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {viewMode === "grid" && recentItems.length > 0 && (
          <section className="w-full self-center pt-10 md:pt-16 lg:w-[calc(100vw-84px)] lg:max-w-[1224px]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-[22px] md:text-[28px] tracking-[-0.03em] text-foreground dark:text-white">Recent updates</h2>
              <p className="text-sm text-[rgba(0,0,0,0.45)] dark:text-white/48">Showing {sortedItems.length} items</p>
            </div>

            <div className="grid gap-x-16 gap-y-8 md:grid-cols-2">
              {[leftColumnItems, rightColumnItems].map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-4">
                  {column.map((item, index) => (
                    <div key={item.id} className="block">
                      <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                          duration: 0.45,
                          delay: index * 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="group relative grid cursor-pointer grid-cols-[96px_minmax(0,1fr)] gap-4 rounded-[6px] border border-transparent p-0 transition-colors hover:border-white/10 md:grid-cols-[104px_minmax(0,1fr)]"
                      >
                        <Link
                          href={newsPath(item)}
                          aria-label={`Read ${item.title}`}
                          className="absolute inset-0 z-10"
                        />
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
                          <h3 className="text-[18px] md:text-[20px] leading-[1.12] tracking-[-0.025em] text-foreground dark:text-white">
                            {item.title}
                          </h3>
                          <div className="pt-2">
                            <MetaLine item={item} />
                          </div>
                        </div>
                      </motion.article>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {gridScrollSpacer > 0 && (
              <div
                ref={gridScrollSpacerRef}
                aria-hidden="true"
                className="hidden lg:block"
                style={{ height: gridScrollSpacer }}
              />
            )}
          </section>
        )}
      </main>
      <Footer className="mb-4" />
    </div>
  );
}
