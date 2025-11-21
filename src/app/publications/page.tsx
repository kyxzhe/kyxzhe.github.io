"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpDown, ArrowUpRight, Filter, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type Publication, type PublicationResource, publications } from "@/lib/constants/publications";
import { projectsVariants } from "@/lib/animation/variants";

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

const categories = ["All", ...Array.from(new Set(publications.map((item) => item.category)))];
const topics = Array.from(new Set(publications.flatMap((item) => item.topics))).sort();
const years = Array.from(
  new Set(publications.map((item) => new Date(item.date).getFullYear()))
).sort((a, b) => b - a);

const sortOptions: { label: string; value: SortMode }[] = [
  { label: "Newest → Oldest", value: "newest" },
  { label: "Oldest → Newest", value: "oldest" },
  { label: "Alphabetical (A–Z)", value: "az" },
  { label: "Alphabetical (Z–A)", value: "za" },
];

const TagChips = ({ tags }: { tags?: string[] }) => {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
      {tags.map((tag) => (
        <span key={tag} className="chip px-2 py-[2px] leading-none">
          {tag}
        </span>
      ))}
    </div>
  );
};

const AuthorLine = ({ authors }: { authors: string[] }) => (
  <p className="text-sm text-muted-foreground">{authors.join(", ")}</p>
);

const ResourceBadges = ({
  resources,
  interactive = true,
}: {
  resources?: PublicationResource[];
  interactive?: boolean;
}) => {
  if (!resources?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {resources.map((resource) => {
        const content = (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-[var(--pill-background)] px-2 py-1 text-[10px] uppercase tracking-[0.26em] text-foreground">
            {resource.label}
            <ArrowUpRight size={12} />
          </span>
        );

        if (!interactive) {
          return (
            <span key={`${resource.type}-${resource.url}`} className="inline-flex">
              {content}
            </span>
          );
        }

        return (
          <Link
            key={`${resource.type}-${resource.url}`}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
};

const ListRow = ({ item }: { item: Publication }) => {
  const row = (
    <article className="group flex flex-col gap-3 py-6 border-b border-[rgba(0,0,0,0.08)] dark:border-white/20 transition-colors hover:border-foreground/70">
      <p className="text-[10.2px] uppercase tracking-[0.28em] text-muted-foreground">{item.category}</p>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold leading-snug text-foreground">{item.title}</h3>
          <AuthorLine authors={item.authors} />
          <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">{item.summary}</p>
          <TagChips tags={item.tags} />
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            <span>{item.venue}</span>
            {item.resources && item.resources.length > 0 && <span>·</span>}
            <ResourceBadges resources={item.resources} interactive={!item.link} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(item.date)}</p>
      </div>
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

export default function PublicationsPage() {
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
    return publications.filter((item) => {
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

  const renderGrid = () => {
    const columnItems = secondaryItems.slice(0, 3);
    const remainingItems = secondaryItems.slice(3);

    return (
      <div className="flex flex-col gap-10 w-full max-w-[95vw] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-1 md:px-2">
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {heroItem && (
            <motion.article
              className="surface-card relative overflow-hidden rounded-[24px] lg:col-span-8 lg:sticky lg:top-12"
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
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {heroItem.category} · {formatDate(heroItem.date)}
                </p>
                <h2 className="text-[2rem] lg:text-[2.4rem] font-semibold leading-tight text-foreground">
                  {heroItem.title}
                </h2>
                <AuthorLine authors={heroItem.authors} />
                <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl">{heroItem.summary}</p>
                <TagChips tags={heroItem.tags} />
                <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                  <span>{heroItem.venue}</span>
                  {heroItem.resources && heroItem.resources.length > 0 && <span>·</span>}
                  <ResourceBadges resources={heroItem.resources} />
                </div>
                {heroItem.link && (
                  <Link
                    href={heroItem.link}
                    className="text-sm text-brand-accent"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View publication
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
                  className={`surface-card relative overflow-hidden aspect-square ${item.link ? "" : "opacity-80"}`}
                >
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-background/95 dark:bg-background/90 px-4 pb-4 pt-3 flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {item.category} · {formatDate(item.date)}
                    </p>
                    <h3 className="text-lg font-semibold leading-tight text-foreground">{item.title}</h3>
                    <AuthorLine authors={item.authors} />
                    <p className="text-sm text-foreground/80 line-clamp-3">{item.summary}</p>
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
                  className={`surface-card relative overflow-hidden aspect-square ${item.link ? "" : "opacity-80"}`}
                >
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-background/95 dark:bg-background/90 px-4 pb-4 pt-3 flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {item.category} · {formatDate(item.date)}
                    </p>
                    <h3 className="text-lg font-semibold leading-tight text-foreground">{item.title}</h3>
                    <AuthorLine authors={item.authors} />
                    <p className="text-sm text-foreground/80 line-clamp-3">{item.summary}</p>
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
    <div className="min-h-screen bg-[#f7f7f8] text-[#141414] dark:bg-[#0b0b0d] dark:text-[#f5f5f5]">
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
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Research notebook</p>
          <h1 className="text-[2.4rem] md:text-[2.6rem] font-semibold leading-tight text-foreground">Papers, briefs &amp; releases</h1>
          <p className="text-[15px] md:text-base text-muted-foreground max-w-2xl leading-relaxed">
            整合所有论文、技术报告与关键里程碑，支持按主题和年份快速筛选。默认列表阅读，随时切换到图集模式。
          </p>
        </section>

        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === category
                  ? "bg-[var(--accent-soft)] text-foreground border-[var(--card-border)]"
                  : "bg-[var(--pill-background)] text-muted-foreground border-[var(--card-border)] hover:border-foreground/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium">
          <p className="text-muted-foreground">Showing {sortedItems.length} publications</p>

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
                      : "text-muted-foreground"
                  }
                >
                  Filter
                </span>
                <Filter
                  size={16}
                  className={
                    selectedTopics.length > 0 || selectedYears.length > 0 || filterOpen
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                />
              </button>
              {filterOpen && (
                <div className="absolute top-full mt-2 right-0 w-[420px] z-40 surface-card p-4 flex flex-col gap-4 shadow-xl rounded-2xl border border-border">
                  <div className="flex items-center justify-between text-sm text-foreground">
                    <p className="font-semibold">Filters</p>
                    <button
                      type="button"
                      className="text-muted-foreground"
                      onClick={() => {
                        setFilterOpen(false);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-foreground">
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Topic</p>
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
                      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Year</p>
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
                  <div className="flex justify-end pt-2 text-xs text-muted-foreground">
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
                  sortOpen ? "text-foreground" : "text-muted-foreground"
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
                <div className="absolute top-full mt-2 right-0 w-64 z-40 surface-card p-3 flex flex-col gap-2 shadow-xl rounded-2xl border border-border text-sm text-foreground">
                  {sortOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 text-foreground/80"
                    >
                      <input
                        type="radio"
                        name="pubs-sort"
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

            <div className="flex items-center gap-2 text-muted-foreground">
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
