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
import { projectsVariants } from "@/lib/animation/variants";
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

function formatDate(isoDate: string) {
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

const ListRow = ({ item }: { item: NewsItem }) => {
  const row = (
      <article className="group flex flex-col gap-3 py-6 border-b border-[rgba(0,0,0,0.08)] dark:border-white/20 transition-colors hover:border-foreground/70 font-normal">
        <p className="text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.44)]">{item.category}</p>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[17px] leading-snug text-foreground">{item.title}</h3>
        <p className="text-[14px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.44)] whitespace-nowrap">{formatDate(item.date)}</p>
      </div>
      <p className="text-[14px] text-foreground/80 dark:text-white leading-relaxed max-w-3xl">{item.summary}</p>
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

const categoryLabelMap: Record<NewsCategory, string> = {
  RESEARCH: "Research",
  AWARD: "Award",
  MILESTONE: "Milestone",
  TALK: "Talk",
};

function formatCategoryLabel(category: string) {
  return category === "All" ? "All" : categoryLabelMap[category as NewsCategory] ?? category;
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
      const topicsMatch = selectedTopics.length === 0 || selectedTopics.every((topic) => item.topics.includes(topic));
      const yearsMatch = selectedYears.length === 0 || selectedYears.includes(new Date(item.date).getFullYear());
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

  const heroItem = sortedItems[0];
  const secondaryItems = sortedItems.slice(1);

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

  const renderGrid = () => {
    const columnItems = secondaryItems.slice(0, 3);
    const remainingItems = secondaryItems.slice(3);
    return (
      <div className="flex flex-col gap-10 w-full max-w-[95vw] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-1 md:px-2">
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {heroItem && (
            <motion.article
              className="surface-card relative overflow-hidden rounded-[24px] lg:col-span-8 lg:sticky lg:top-12 font-normal"
              whileHover={{ y: -6, boxShadow: "0 28px 55px rgba(0,0,0,0.18)" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="relative w-full aspect-[5/3] sm:aspect-[8/5] lg:aspect-[16/9] min-h-[360px] md:min-h-[480px] lg:min-h-[600px]">
                <Image
                  src={heroItem.cover}
                  alt={heroItem.title}
                  fill
                  sizes="(max-width:1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-background/95 dark:bg-background/80 backdrop-blur-sm px-6 pb-6 pt-6 flex flex-col gap-3 border-t border-white/10 rounded-t-none">
                <p className="text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.44)]">
                  {heroItem.category} · {formatDate(heroItem.date)}
                </p>
                <h2 className="text-[48px] leading-tight text-foreground">
                  {heroItem.title}
                </h2>
                <p className="text-[14px] text-foreground/80 dark:text-white leading-relaxed max-w-2xl">{heroItem.summary}</p>
                {heroItem.link && (
                  <Link href={heroItem.link} className="text-sm text-brand-accent" target="_blank" rel="noopener noreferrer">
                    Read update
                  </Link>
                )}
              </div>
            </motion.article>
          )}
          <div className="flex flex-col gap-4 lg:col-span-4">
            {columnItems.map((item) => {
              const card = (
              <motion.div
                variants={projectsVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -6, boxShadow: "0 18px 35px rgba(0,0,0,0.14)" }}
                className={`surface-card relative overflow-hidden aspect-square font-normal ${
                    item.link ? "" : "opacity-80"
                  }`}
                >
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-background/95 dark:bg-background/90 px-4 pb-4 pt-3 flex flex-col gap-2">
                    <p className="text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.44)]">
                      {item.category} · {formatDate(item.date)}
                    </p>
                    <h3 className="text-[17px] leading-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-foreground/80 dark:text-white line-clamp-3">{item.summary}</p>
                  </div>
                </motion.div>
              );
              if (item.link) {
                return (
                  <Link
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {card}
                  </Link>
                );
              }
              return (
                <div key={item.id} className="block cursor-default">
                  {card}
                </div>
              );
            })}
          </div>
        </div>
        {remainingItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4">
            {remainingItems.map((item) => {
              const card = (
              <motion.div
                variants={projectsVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -6, boxShadow: "0 20px 45px rgba(0,0,0,0.12)" }}
                className={`surface-card relative overflow-hidden aspect-square font-normal ${
                    item.link ? "" : "opacity-80"
                  }`}
                >
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-background/95 dark:bg-background/90 px-4 pb-4 pt-3 flex flex-col gap-2">
                    <p className="text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.44)]">
                      {item.category} · {formatDate(item.date)}
                    </p>
                    <h3 className="text-[17px] leading-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-foreground/80 dark:text-white line-clamp-3">{item.summary}</p>
                  </div>
                </motion.div>
              );
              if (item.link) {
                return (
                  <Link
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block lg:col-span-4"
                  >
                    {card}
                  </Link>
                );
              }
              return (
                <div key={item.id} className="block cursor-default lg:col-span-4">
                  {card}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

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
                    ? "bg-[rgba(0,0,0,0.12)] border-transparent text-foreground dark:bg-[rgba(255,255,255,0.4)]"
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
                        ? "text-foreground"
                        : "text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]"
                    }
                  >
                  Filter
                </span>
                <Filter
                  size={16}
                    className={
                      selectedTopics.length > 0 || selectedYears.length > 0 || filterOpen
                        ? "text-foreground"
                        : "text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]"
                    }
                />
              </button>
              {filterOpen && (
                <div className="absolute top-full mt-2 w-[min(420px,calc(100vw-2rem))] left-1 right-auto sm:left-auto sm:right-0 z-40 surface-card p-4 flex flex-col gap-4 shadow-xl rounded-2xl border border-border">
                  <div className="flex items-center justify-between text-sm text-foreground">
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
                  <div className="grid grid-cols-2 gap-4 text-sm text-foreground">
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">Topic</p>
                      {topics.map((topic) => (
                        <label key={topic} className="flex items-center gap-2 text-[13px] text-foreground">
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
                        <label key={year} className="flex items-center gap-2 text-[13px] text-foreground">
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
                      className="underline-offset-2 hover:text-foreground"
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
                  sortOpen ? "text-foreground" : "text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]"
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
                <div className="absolute top-full mt-2 w-[min(256px,calc(100vw-2rem))] left-1 sm:left-auto sm:right-0 z-40 surface-card p-3 flex flex-col gap-2 shadow-xl rounded-2xl border border-border text-sm text-foreground">
                  {sortOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 text-foreground/80"
                    >
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
        ) : (
          renderGrid()
        )}
      </main>
      <Footer className="mb-4" />
    </div>
  );
}
