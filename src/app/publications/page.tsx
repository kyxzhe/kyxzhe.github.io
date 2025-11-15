"use client";

import { Fragment, useMemo, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpDown, ArrowUpRight, Filter, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type Publication, type PublicationResource, publications } from "@/lib/constants/publications";
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
  const monthLabel = MONTH_ABBREVIATIONS[month - 1] ?? "";
  return `${day} ${monthLabel} ${year}`;
}

const allTopics = Array.from(
  new Set(publications.flatMap((pub) => pub.topics))
).sort();

const metrics = [
  { label: "Manuscripts", value: "1" },
  { label: "Reviews", value: "10+" },
  { label: "Citations", value: "2" },
];

const PRIMARY_AUTHOR = "Yuxiang Zheng";

const ResourceLinks = ({
  resources,
}: {
  resources?: PublicationResource[];
}) => {
  const codeLinks = resources?.filter((resource) => resource.type === "code");
  if (!codeLinks?.length) return null;

  return (
    <>
      {" · "}
      {codeLinks.map((resource, index) => (
        <Fragment key={`${resource.type}-${resource.url}`}>
          {index > 0 && ", "}
          <Link
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] font-semibold text-foreground hover:underline underline-offset-4"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            {resource.label}
            <ArrowUpRight size={12} className="text-foreground" />
          </Link>
        </Fragment>
      ))}
    </>
  );
};

const AuthorLine = ({ authors }: { authors: string[] }) => (
  <p className="text-sm text-muted-foreground">
    {authors.map((author, index) => (
      <Fragment key={`${author}-${index}`}>
        {index > 0 && ", "}
        <span
          className={
            author === PRIMARY_AUTHOR
              ? "font-semibold text-foreground"
              : undefined
          }
        >
          {author}
        </span>
      </Fragment>
    ))}
  </p>
);

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

  const openPublication = (href?: string) => {
    if (!href || typeof window === "undefined") return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const renderListRow = (pub: Publication) => {
    const handleCardActivate = (
      event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
    ) => {
      if (!pub.link) return;
      if (event.type === "keydown") {
        const keyboardEvent = event as KeyboardEvent<HTMLElement>;
        if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ") return;
        keyboardEvent.preventDefault();
      }
      openPublication(pub.link);
    };

    return (
      <article
        key={pub.id}
        role={pub.link ? "link" : undefined}
        tabIndex={pub.link ? 0 : -1}
        aria-label={pub.link ? `Open ${pub.title}` : undefined}
        onClick={pub.link ? handleCardActivate : undefined}
        onKeyDown={pub.link ? handleCardActivate : undefined}
        className={`flex flex-col gap-3 py-6 border-b border-[rgba(0,0,0,0.08)] dark:border-white/20 ${
          pub.link ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {pub.category}
            </p>
            <h3 className="text-xl md:text-2xl font-semibold leading-snug">
              {pub.title}
            </h3>
            <AuthorLine authors={pub.authors} />
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(pub.date)}
          </p>
        </div>
        <p className="text-sm text-foreground/80 max-w-3xl">{pub.summary}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {pub.venue}
          <ResourceLinks resources={pub.resources} />
        </p>
      </article>
    );
  };

  const renderGridCard = (pub: Publication) => {
    const handleCardActivate = (
      event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
    ) => {
      if (!pub.link) return;
      if (event.type === "keydown") {
        const keyboardEvent = event as KeyboardEvent<HTMLElement>;
        if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ") return;
        keyboardEvent.preventDefault();
      }
      openPublication(pub.link);
    };

    return (
      <motion.article
        key={pub.id}
        variants={projectsVariants}
        whileHover={{
          y: pub.link ? -10 : 0,
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        role={pub.link ? "link" : undefined}
        tabIndex={pub.link ? 0 : -1}
        aria-label={pub.link ? `Open ${pub.title}` : undefined}
        onClick={pub.link ? handleCardActivate : undefined}
        onKeyDown={pub.link ? handleCardActivate : undefined}
        className={`surface-card overflow-hidden flex flex-col ${
          pub.link ? "cursor-pointer" : "opacity-80 cursor-default"
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
        <div className="p-4 flex flex-col gap-3 flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {pub.category} · {formatDate(pub.date)}
          </p>
          <h3 className="text-lg font-semibold leading-snug">{pub.title}</h3>
          <AuthorLine authors={pub.authors} />
          <p className="text-sm text-foreground/80 flex-1">{pub.summary}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {pub.venue}
            <ResourceLinks resources={pub.resources} />
          </p>
        </div>
      </motion.article>
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
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-baseline gap-2 border-b border-border pb-1"
              >
                <span className="text-xs uppercase tracking-[0.3em]">
                  {metric.label}
                </span>
                <span className="text-lg text-foreground font-semibold">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium">
          <p className="text-muted-foreground">
            Showing {sortedPublications.length} publications
          </p>
          <div className="relative flex items-center gap-4">
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
                    selectedTopics.length > 0 || filterOpen
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  Filter
                </span>
                <Filter
                  size={16}
                  className={
                    selectedTopics.length > 0 || filterOpen
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                />
              </button>
              {filterOpen && (
                <div className="absolute top-full mt-2 right-0 w-80 z-40 surface-card p-4 flex flex-col gap-4 shadow-xl rounded-2xl border border-border">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-semibold">
                      {selectedTopics.length > 0
                        ? selectedTopics.join(", ")
                        : "Topics"}
                    </p>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setFilterOpen(false);
                        setSelectedTopics([]);
                      }}
                      className="cursor-pointer"
                    >
                      ×
                    </span>
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
                    className="self-start text-xs text-muted-foreground"
                    onClick={clearFilters}
                  >
                    Clear all
                  </button>
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
                <div className="absolute top-full mt-2 right-0 w-64 z-40 surface-card p-3 flex flex-col gap-2 shadow-xl rounded-2xl border border-border">
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
