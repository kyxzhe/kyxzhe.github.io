"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpDown, Filter, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type NewsItem, newsItems } from "@/lib/constants/news";
import { cardVariants, containerVariants, projectsVariants } from "@/lib/animation/variants";

type ViewMode = "list" | "grid";
type SortOption = "newest" | "oldest" | "az" | "za";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Newest → Oldest", value: "newest" },
  { label: "Oldest → Newest", value: "oldest" },
  { label: "Alphabetical (A–Z)", value: "az" },
  { label: "Alphabetical (Z–A)", value: "za" },
];

const MONTH_ABBREVIATIONS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return `${day} ${MONTH_ABBREVIATIONS[month - 1]} ${year}`;
}

const categories = ["All", ...Array.from(new Set(newsItems.map((item) => item.category)))];
const topics = Array.from(new Set(newsItems.flatMap((item) => item.topics))).sort();
const years = Array.from(new Set(newsItems.map((item) => new Date(item.date).getFullYear()))).sort((a, b) => b - a);

export default function NewsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [sortMode, setSortMode] = useState<SortOption>("newest");
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

  const clearFilters = () => {
    setSelectedTopics([]);
    setSelectedYears([]);
  };

  const filteredItems = useMemo(() => {
    return newsItems.filter((item) => {
      const categoryMatch = activeCategory === "All" || item.category === activeCategory;
      const topicsMatch = selectedTopics.length === 0 || selectedTopics.every((topic) => item.topics.includes(topic));
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

  const heroItem = sortedItems[0];
  const secondaryItems = sortedItems.slice(1);

const renderListRow = (item: NewsItem) => {
  const row = (
    <div className="flex flex-col gap-2 py-5 border-b border-[rgba(0,0,0,0.08)] dark:border-white/20 transition-colors group-hover:border-foreground group-hover:bg-[rgba(0,0,0,0.03)]">
      <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{item.category}</div>
      <h3 className="text-xl font-semibold">{item.title}</h3>
      <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
      <p className="text-sm text-foreground/80 max-w-3xl">{item.summary}</p>
    </div>
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

  const renderGrid = () => {
    const columnItems = secondaryItems.slice(0, 3);
    const remainingItems = secondaryItems.slice(3);
    return (
      <div className="flex flex-col gap-10 w-full max-w-[min(90vw,1200px)] mx-auto px-6">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {heroItem && (
          <article className="surface-card flex flex-col gap-4 lg:col-span-8 lg:sticky lg:top-12">
            <div className="relative w-full aspect-[5/3] min-h-[240px] rounded-[24px] overflow-hidden">
              <Image src={heroItem.cover} alt={heroItem.title} fill sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
            </div>
            <div className="px-5 pb-5 flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {heroItem.category} · {formatDate(heroItem.date)}
              </p>
              <h2 className="text-[2rem] lg:text-[2.4rem] font-semibold leading-tight">{heroItem.title}</h2>
              <p className="text-sm text-foreground/80 leading-relaxed">{heroItem.summary}</p>
              {heroItem.link && (
                <Link href={heroItem.link} className="text-sm text-brand-accent" target="_blank" rel="noopener noreferrer">
                  Read update
                </Link>
              )}
            </div>
          </article>
        )}
        <div className="flex flex-col gap-4 lg:col-span-4">
          {columnItems.map((item) => (
            <Link
              key={item.id}
              href={item.link ?? "#"}
              target={item.link ? "_blank" : undefined}
              rel={item.link ? "noopener noreferrer" : undefined}
              className={item.link ? "block" : "pointer-events-none"}
            >
              <motion.div
                variants={projectsVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -6, boxShadow: "0 18px 35px rgba(0,0,0,0.14)" }}
                className={"surface-card overflow-hidden" + (item.link ? "" : " opacity-80")}
              >
                <div className="relative w-full pb-[100%]">
                  <Image src={item.cover} alt={item.title} fill sizes="(max-width:1024px) 100vw, 320px" className="object-cover" />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 text-white">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/75">
                      {item.category} · {formatDate(item.date)}
                    </p>
                    <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
                    <p className="text-sm text-white/80 line-clamp-2">{item.summary}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      {remainingItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4">
          {remainingItems.map((item) => (
            <motion.div
              key={item.id}
              variants={projectsVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -6, boxShadow: "0 20px 45px rgba(0,0,0,0.12)" }}
              className="surface-card overflow-hidden lg:col-span-4"
            >
              <div className="relative w-full pb-[100%]">
                <Image src={item.cover} alt={item.title} fill sizes="(max-width:1024px) 100vw, 320px" className="object-cover" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/75">
                    {item.category} · {formatDate(item.date)}
                  </p>
                  <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
                  <p className="text-sm text-white/80 line-clamp-2">{item.summary}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-visible">
      <Navbar />
      <motion.main
        className="flex-1 flex flex-col gap-4 px-2 md:px-4 lg:px-6 pb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section className="surface-card p-6 flex flex-col gap-4" variants={cardVariants}>
          <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Newsroom</p>
          <h1 className="text-3xl md:text-4xl font-semibold">Grounded updates on research, milestones, and lab tools.</h1>
          <p className="text-base text-foreground/80">
            The chatbot is now live, citing everything here. Browse updates in list or gallery mode, or filter down to the topics and years you care about.
          </p>
        </motion.section>

        <div className="flex flex-wrap gap-3 text-sm">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-full border ${
                activeCategory === category ? "border-foreground text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium">
          <p className="text-muted-foreground">Showing {sortedItems.length} updates</p>
            <div className="relative flex items-center gap-4">
            <div className="relative flex items-center gap-1">
              <button
                className="flex items-center gap-1"
                onClick={() => {
                  setFilterOpen((prev) => !prev);
                  setSortOpen(false);
                }}
              >
                <span className={selectedTopics.length > 0 || selectedYears.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                  Filter
                </span>
                <Filter size={16} className={selectedTopics.length > 0 || selectedYears.length > 0 ? "text-foreground" : "text-muted-foreground"} />
              </button>
              {filterOpen && (
                <div className="absolute top-full mt-2 right-0 w-[420px] z-40 surface-card p-4 flex flex-col gap-4 shadow-xl rounded-2xl border border-border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-2">Topic</p>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {topics.map((topic) => (
                          <label key={topic} className="flex items-center gap-2">
                            <input type="checkbox" checked={selectedTopics.includes(topic)} onChange={() => toggleTopic(topic)} />
                            {topic}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Year</p>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {years.map((year) => (
                          <label key={year} className="flex items-center gap-2">
                            <input type="checkbox" checked={selectedYears.includes(year)} onChange={() => toggleYear(year)} />
                            {year}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <button onClick={clearFilters}>Clear all</button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex items-center gap-1">
              <button
                className={`flex items-center gap-1 ${sortOpen ? "text-foreground" : "text-muted-foreground"}`}
                onClick={() => {
                  setSortOpen((prev) => !prev);
                  setFilterOpen(false);
                }}
              >
                <span>Sort</span>
                <ArrowUpDown size={16} />
              </button>
              {sortOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 z-40 surface-card p-3 flex flex-col gap-2 shadow-xl rounded-2xl border border-border">
                  {sortOptions.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-sm">
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

            <div className="flex items-center gap-2 text-muted-foreground">
              <button
                className={`p-2 rounded ${viewMode === "list" ? "text-foreground bg-[rgba(0,0,0,0.06)]" : "hover:text-foreground"}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List size={16} />
              </button>
              <button
                className={`p-2 rounded ${viewMode === "grid" ? "text-foreground bg-[rgba(0,0,0,0.06)]" : "hover:text-foreground"}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {sortedItems.length === 0 ? (
          <div className="surface-card p-10 text-center text-muted-foreground">No news yet—try adjusting the filters.</div>
        ) : viewMode === "list" ? (
          <section className="surface-card p-4 md:p-6">
            {sortedItems.map((item) => renderListRow(item))}
          </section>
        ) : (
          renderGrid()
        )}
      </motion.main>
      <Footer className="mb-4" />
    </div>
  );
}
