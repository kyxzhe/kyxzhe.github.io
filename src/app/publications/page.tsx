"use client";

import { useMemo, useState } from "react";
import type { MouseEvent, KeyboardEvent } from "react";
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

const topics = Array.from(new Set(publications.flatMap((item) => item.topics))).sort();
const years = Array.from(
  new Set(publications.map((item) => new Date(item.date).getFullYear()))
).sort((a, b) => b - a);

const metrics = [
  { label: "Manuscripts", value: "1" },
  { label: "Reviews", value: "10+" },
  { label: "Citations", value: "2" },
];

const sortOptions: { label: string; value: SortMode }[] = [
  { label: "Newest → Oldest", value: "newest" },
  { label: "Oldest → Newest", value: "oldest" },
  { label: "Alphabetical (A–Z)", value: "az" },
  { label: "Alphabetical (Z–A)", value: "za" },
];

const AuthorLine = ({ authors }: { authors: string[] }) => (
  <p className="text-sm text-muted-foreground">{authors.join(", ")}</p>
);

const ResourceRow = ({
  venue,
  resources,
}: {
  venue: string;
  resources?: PublicationResource[];
}) => {
  const code = resources?.find((res) => res.type === "code");
  const showDot = Boolean(code);

  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
      <span>{venue}</span>
      {showDot && <span>·</span>}
      {code && (
        <Link
          href={code.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-foreground font-semibold hover:underline underline-offset-4"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          {code.label}
          <ArrowUpRight size={12} />
        </Link>
      )}
    </div>
  );
};

const ListRow = ({ item }: { item: Publication }) => {
  const handleActivate = (
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
  ) => {
    if (!item.link) return;
    if (event.type === "keydown") {
      const keyboardEvent = event as KeyboardEvent<HTMLElement>;
      if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ") return;
      keyboardEvent.preventDefault();
    }
    window.open(item.link, "_blank", "noopener,noreferrer");
  };

  const row = (
    <article
      className={`group flex flex-col gap-3 py-6 border-b border-[rgba(0,0,0,0.08)] dark:border-white/20 transition-colors hover:border-foreground/70 ${
        item.link ? "cursor-pointer" : "cursor-default"
      }`}
      role={item.link ? "link" : undefined}
      tabIndex={item.link ? 0 : -1}
      aria-label={item.link ? `Open ${item.title}` : undefined}
      onClick={item.link ? handleActivate : undefined}
      onKeyDown={item.link ? handleActivate : undefined}
    >
      <p className="text-[10.2px] uppercase tracking-[0.28em] text-muted-foreground">{item.category}</p>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold leading-snug text-foreground">{item.title}</h3>
          <AuthorLine authors={item.authors} />
          <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">{item.summary}</p>
          <ResourceRow venue={item.venue} resources={item.resources} />
        </div>
        <p className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(item.date)}</p>
      </div>
    </article>
  );

  return (
    <div key={item.id} className="group block">
      {row}
    </div>
  );
};

export default function PublicationsPage() {
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
      const topicsMatch = selectedTopics.length === 0 || selectedTopics.every((topic) => item.topics.includes(topic));
      const yearsMatch = selectedYears.length === 0 || selectedYears.includes(new Date(item.date).getFullYear());
      return topicsMatch && yearsMatch;
    });
  }, [selectedTopics, selectedYears]);

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

  const renderGridCard = (item: Publication) => {
    const handleActivate = (
      event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
    ) => {
      if (!item.link) return;
      if (event.type === "keydown") {
        const keyboardEvent = event as KeyboardEvent<HTMLElement>;
        if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ") return;
        keyboardEvent.preventDefault();
      }
      window.open(item.link, "_blank", "noopener,noreferrer");
    };

    const card = (
      <motion.article
        key={item.id}
        variants={projectsVariants}
        whileHover={{ y: -10, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={`surface-card overflow-hidden flex flex-col h-full ${
          item.link ? "cursor-pointer" : "opacity-80 cursor-default"
        }`}
        role={item.link ? "link" : undefined}
        tabIndex={item.link ? 0 : -1}
        aria-label={item.link ? `Open ${item.title}` : undefined}
        onClick={item.link ? handleActivate : undefined}
        onKeyDown={item.link ? handleActivate : undefined}
      >
        <div className="relative w-full pb-[60%]">
          <Image
            src={item.cover}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-4 flex flex-col gap-3 flex-1">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
            {item.category} · {formatDate(item.date)}
          </p>
          <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
          <AuthorLine authors={item.authors} />
          <p className="text-sm text-foreground/80 flex-1 line-clamp-3">{item.summary}</p>
          <ResourceRow venue={item.venue} resources={item.resources} />
        </div>
      </motion.article>
    );

    return <div key={item.id} className="h-full">{card}</div>;
  };

  const renderGrid = () => (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-[1fr]"
      variants={projectsVariants}
      initial="hidden"
      animate="visible"
    >
      {sortedItems.map(renderGridCard)}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white text-[#141414] dark:bg-[#0b0b0d] dark:text-[#f5f5f5]">
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
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Publications</p>
          <h1 className="text-[2.4rem] md:text-[2.6rem] font-semibold leading-tight text-foreground">Papers &amp; Preprints</h1>
          <p className="text-[15px] md:text-base text-muted-foreground max-w-2xl leading-relaxed">
            A curated list of my published and upcoming work, with links to code and materials when available.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-baseline gap-2 border-b border-border pb-1"
              >
                <span className="text-xs uppercase tracking-[0.3em]">{metric.label}</span>
                <span className="text-lg text-foreground font-semibold">{metric.value}</span>
              </div>
            ))}
          </div>
        </section>

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
