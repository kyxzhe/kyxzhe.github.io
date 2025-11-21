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
const sortOptions: { label: string; value: SortMode }[] = [
  { label: "Newest → Oldest", value: "newest" },
  { label: "Oldest → Newest", value: "oldest" },
  { label: "Alphabetical (A–Z)", value: "az" },
  { label: "Alphabetical (Z–A)", value: "za" },
];

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
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "text-foreground bg-[rgba(0,0,0,0.06)]"
                    : "hover:text-foreground"
                }`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List size={16} />
              </button>
              <button
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "text-foreground bg-[rgba(0,0,0,0.06)]"
                    : "hover:text-foreground"
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
