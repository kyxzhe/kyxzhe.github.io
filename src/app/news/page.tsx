"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Filter, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type NewsItem, newsItems } from "@/lib/constants/news";

type ViewMode = "list" | "grid";
type SortMode = "newest" | "oldest";

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

  const filteredItems = useMemo(() => {
    return newsItems.filter((item) => activeCategory === "All" || item.category === activeCategory);
  }, [activeCategory]);

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];
    sorted.sort((a, b) => {
      if (sortMode === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
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

          <div className="flex items-center gap-2 md:gap-3 text-muted-foreground">
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:text-foreground"
              title="Filter"
            >
              <span>Filter</span>
              <Filter size={14} />
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:text-foreground"
              title="Sort"
              onClick={() => setSortMode((prev) => (prev === "newest" ? "oldest" : "newest"))}
            >
              <span>Sort</span>
              <ArrowUpDown size={14} />
            </button>
            <div className="flex items-center gap-[1px] rounded-md border border-[#d8d8dd] bg-white overflow-hidden">
              <button
                type="button"
                aria-label="List view"
                className={`px-2 py-1 ${viewMode === "list" ? "text-foreground" : "text-muted-foreground"}`}
                onClick={() => setViewMode("list")}
              >
                <List size={15} />
              </button>
              <button
                type="button"
                aria-label="Grid view"
                className={`px-2 py-1 ${viewMode === "grid" ? "text-foreground" : "text-muted-foreground"}`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid size={15} />
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
