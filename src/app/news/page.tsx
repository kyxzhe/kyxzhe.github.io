"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Filter, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type NewsItem, newsItems } from "@/lib/constants/news";

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

const ListRow = ({ item }: { item: NewsItem }) => {
  const row = (
    <div className="group flex flex-col gap-2 px-6 py-5 transition-colors hover:bg-white">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{item.category}</p>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug text-foreground">{item.title}</h3>
        <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(item.date)}</p>
      </div>
      <p className="text-sm text-foreground/75 leading-relaxed max-w-3xl">{item.summary}</p>
    </div>
  );

  if (item.link) {
    return (
      <Link
        key={item.id}
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40"
      >
        {row}
      </Link>
    );
  }

  return <div key={item.id}>{row}</div>;
};

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

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-foreground">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-5xl px-2 md:px-4 lg:px-0 py-6 flex flex-col gap-6">
        <section className="mt-4 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Newsroom</p>
          <h1 className="text-3xl md:text-[2.1rem] font-semibold leading-tight text-foreground">Latest news &amp; updates</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Browse research, milestones, and interviews. Default list view; filter when needed.
          </p>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full border transition-colors ${
                  activeCategory === category
                    ? "bg-[#e7e7eb] text-foreground border-[#cfcfd4]"
                    : "bg-white text-muted-foreground border-[#dedee3] hover:border-[#cfcfd4]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

            <div className="relative flex items-center gap-2 md:gap-3 text-muted-foreground">
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:text-foreground"
                title="Filter"
                onClick={() => {
                  setFilterOpen((prev) => !prev);
                  setSortOpen(false);
                }}
              >
                <span>Filter</span>
                <Filter size={14} />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full mt-2 w-[420px] rounded-2xl border border-[#dedee3] bg-white shadow-[0_14px_55px_rgba(0,0,0,0.08)] p-4 z-20">
                  <div className="grid grid-cols-2 gap-4 text-sm text-foreground">
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Topic</p>
                      {topics.map((topic) => (
                        <label key={topic} className="flex items-center gap-2 text-[13px] text-foreground">
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => toggleTopic(topic)}
                            className="accent-black"
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
                            className="accent-black"
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

            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:text-foreground"
                title="Sort"
                onClick={() => {
                  setSortOpen((prev) => !prev);
                  setFilterOpen(false);
                }}
              >
                <span>Sort</span>
                <ArrowUpDown size={14} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[#dedee3] bg-white shadow-[0_14px_55px_rgba(0,0,0,0.08)] p-3 z-20 text-sm text-foreground space-y-2">
                  {["newest", "oldest", "az", "za"].map((option) => {
                    const labelMap: Record<SortMode, string> = {
                      newest: "Newest → Oldest",
                      oldest: "Oldest → Newest",
                      az: "Alphabetical (A–Z)",
                      za: "Alphabetical (Z–A)",
                    };
                    const value = option as SortMode;
                    return (
                      <label key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="news-sort"
                          value={value}
                          checked={sortMode === value}
                          onChange={() => setSortMode(value)}
                          className="accent-black"
                        />
                        {labelMap[value]}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              aria-label="List view"
              className={`flex h-[28px] w-[28px] items-center justify-center rounded-[6px] text-muted-foreground hover:text-foreground transition-colors ${
                viewMode === "list" ? "text-foreground bg-[#e7e7eb]" : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={15} />
            </button>
            <button
              type="button"
              aria-label="Grid view"
              className={`flex h-[28px] w-[28px] items-center justify-center rounded-[6px] text-muted-foreground hover:text-foreground transition-colors ${
                viewMode === "grid" ? "text-foreground bg-[#e7e7eb]" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {viewMode === "list" ? (
          <section className="rounded-[18px] border border-[rgba(0,0,0,0.06)] bg-white/70 shadow-[0_16px_40px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[rgba(0,0,0,0.06)]">
            {sortedItems.map((item) => (
              <ListRow key={item.id} item={item} />
            ))}
          </section>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2">
            {sortedItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white px-5 py-4 shadow-[0_12px_26px_rgba(0,0,0,0.05)]"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground mb-2">{item.category}</p>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-snug text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(item.date)}</p>
                </div>
                <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{item.summary}</p>
              </article>
            ))}
          </section>
        )}
      </main>
      <Footer className="mb-4" />
    </div>
  );
}
