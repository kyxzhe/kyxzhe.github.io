"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpDown, Filter, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type Publication, publications } from "@/lib/constants/publications";
import {
  cardVariants,
  containerVariants,
  projectsVariants,
  textVariants,
} from "@/lib/animation/variants";

type ViewMode = "list" | "grid";
type SortOption = "newest" | "oldest" | "az" | "za";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Newest → Oldest", value: "newest" },
  { label: "Oldest → Newest", value: "oldest" },
  { label: "Alphabetical (A–Z)", value: "az" },
  { label: "Alphabetical (Z–A)", value: "za" },
];

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const allTopics = Array.from(
  new Set(publications.flatMap((pub) => pub.topics))
).sort();

const metrics = [
  { label: "Manuscripts", value: "1" },
  { label: "Reviews", value: "10+" },
  { label: "Citations", value: "2" },
];

export default function PublicationsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortMode, setSortMode] = useState<SortOption>("newest");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const topicMatch =
        selectedTopics.length === 0 ||
        selectedTopics.every((topic) => pub.topics.includes(topic));
      return topicMatch;
    });
  }, [selectedTopics]);

  const sortedPublications = useMemo(() => {
    const sorted = [...filteredPublications];
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
  }, [filteredPublications, sortMode]);

  const clearFilters = () => setSelectedTopics([]);

  const renderListRow = (pub: Publication) => {
    const row = (
      <div
        className={`flex flex-col gap-3 py-6 border-b border-[rgba(0,0,0,0.08)] transition-colors ${
          pub.link
            ? "hover:border-foreground hover:bg-[rgba(0,0,0,0.02)] cursor-pointer"
            : ""
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {pub.category}
            </p>
            <h3 className="text-xl md:text-2xl font-semibold">{pub.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {dateFormatter.format(new Date(pub.date))}
          </p>
        </div>
        <p className="text-sm text-foreground/80 max-w-3xl">{pub.summary}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>{pub.venue}</span>
          {pub.tags.map((tag) => (
            <span key={tag} className="chip chip-relaxed text-[0.65rem]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
    if (pub.link) {
      return (
        <Link
          key={pub.id}
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {row}
        </Link>
      );
    }
    return (
      <div key={pub.id} className="pointer-events-none">
        {row}
      </div>
    );
  };

  const renderGridCard = (pub: Publication) => {
    const card = (
      <motion.div
        key={pub.id}
        variants={projectsVariants}
        className={`surface-card overflow-hidden flex flex-col transition ${
          pub.link ? "hover:shadow-xl cursor-pointer" : "cursor-not-allowed opacity-80"
        }`}
      >
        <div className="relative w-full pb-[60%]">
          <Image
            src={pub.cover}
            alt={pub.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {pub.category} · {dateFormatter.format(new Date(pub.date))}
          </p>
          <h3 className="text-lg font-semibold">{pub.title}</h3>
          <p className="text-sm text-foreground/80 flex-1">{pub.summary}</p>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>{pub.venue}</span>
            {pub.tags.slice(0, 2).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </motion.div>
    );
    if (pub.link) {
      return (
        <Link
          key={pub.id}
          href={pub.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {card}
        </Link>
      );
    }
    return (
      <div key={pub.id} className="pointer-events-none">
        {card}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-visible">
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
      <motion.main
        className="flex-1 flex flex-col gap-4 px-2 md:px-4 lg:px-6 pb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section
          className="surface-card p-6 flex flex-col gap-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-3">
            <motion.p
              className="uppercase tracking-[0.3em] text-xs text-muted-foreground"
              variants={textVariants}
            >
              Research notebook
            </motion.p>
            <motion.h1
              className="text-3xl md:text-4xl font-semibold leading-tight"
              variants={textVariants}
            >
              A thoughtful, filterable view of papers, briefs, and milestones.
            </motion.h1>
            <motion.p
              className="text-base text-foreground/80 max-w-3xl"
              variants={textVariants}
            >
              Explore manuscripts, safety briefs, and milestones with quick
              filters. Switch between list and gallery views depending on how
              you want to browse.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[18px] border border-border p-4 flex flex-col gap-2 bg-[var(--pill-background)]"
              >
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
                  {metric.label}
                </span>
                <span className="text-xl font-semibold">{metric.value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {sortedPublications.length} publication
              {sortedPublications.length === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="relative flex items-center gap-1">
                <button
                  className="flex items-center gap-1 transition"
                  onClick={() => {
                    setFilterOpen((prev) => !prev);
                    setSortOpen(false);
                  }}
                >
                  <Filter
                    size={16}
                    className={selectedTopics.length > 0 ? "text-foreground" : "text-muted-foreground"}
                  />
                  <span className={selectedTopics.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                    Filter
                  </span>
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-72 z-40 surface-card p-4 flex flex-col gap-3 shadow-xl rounded-2xl border border-border">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Topics</p>
                      <button
                        className="text-xs text-muted-foreground"
                        onClick={clearFilters}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto pr-1 flex flex-col gap-2">
                      {allTopics.map((topic) => (
                        <label
                          key={topic}
                          className="flex items-center gap-2 text-sm text-foreground/80"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => toggleTopic(topic)}
                          />
                          {topic}
                        </label>
                      ))}
                    </div>
                    <button
                      className="btn-primary text-sm justify-center"
                      onClick={() => setFilterOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
              <div className="relative flex items-center gap-1">
                <button
                  className="flex items-center gap-1 text-muted-foreground transition"
                  onClick={() => {
                    setSortOpen((prev) => !prev);
                    setFilterOpen(false);
                  }}
                >
                  <span className="text-muted-foreground">Sort</span>
                  <ArrowUpDown size={16} className="text-muted-foreground" />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-64 z-40 surface-card p-3 flex flex-col gap-2 shadow-xl rounded-2xl border border-border">
                    {sortOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 text-sm text-foreground/80"
                      >
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortMode === option.value}
                          onChange={() => setSortMode(option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                    <button
                      className="chip text-xs tracking-[0.2em] justify-center mt-1"
                      onClick={() => setSortOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center rounded-full border border-border overflow-hidden text-muted-foreground">
                <button
                  className={`p-2 inline-flex items-center justify-center transition ${
                    viewMode === "list"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
                <button
                  className={`p-2 inline-flex items-center justify-center transition ${
                    viewMode === "grid"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="surface-card p-4 md:p-6">
          {sortedPublications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No matches yet</p>
              <p className="text-sm">
                Try removing a topic filter or switching categories.
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div>{sortedPublications.map(renderListRow)}</div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              variants={projectsVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedPublications.map(renderGridCard)}
            </motion.div>
          )}
        </section>
      </motion.main>
      <Footer className="mb-4" />
    </div>
  );
}
