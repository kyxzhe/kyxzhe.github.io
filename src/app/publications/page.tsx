"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, ChevronUp, Filter, LayoutGrid, List, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type Publication, type PublicationResource, publications } from "@/lib/constants/publications";
import { absoluteUrl, siteMetadata } from "@/lib/seo/config";
import {
  getArticleJsonLd,
  getBreadcrumbJsonLd,
  getCollectionPageJsonLd,
  getItemListJsonLd,
  serializeJsonLd,
} from "@/lib/seo/schema";
import { formatDisplayDate } from "@/lib/utils/date";
import { getCardCoverPath } from "@/lib/utils/images";

type ViewMode = "list" | "grid";
type SortMode = "newest" | "oldest" | "az" | "za";

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

const publicationPath = (item: Publication) => `/publications/${item.id}`;
const pageUrl = `${siteMetadata.baseUrl}/publications`;
const pageDescription =
  "Research papers, preprints, and safety briefs by Yuxiang (Kevin) Zheng on information diffusion and robust machine learning.";
const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: "Home", url: siteMetadata.baseUrl },
  { name: "Publications", url: pageUrl },
]);
const collectionJsonLd = getCollectionPageJsonLd({
  title: "Publications | Kevin Zheng",
  description: pageDescription,
  url: pageUrl,
  dateModified: "2026-06-11",
});
const itemListJsonLd = getItemListJsonLd({
  id: "publication-list",
  name: "Kevin Zheng publications",
  url: pageUrl,
  items: publications.map((publication) =>
    getArticleJsonLd({
      id: publication.id,
      title: publication.title,
      description: publication.summary,
      url: absoluteUrl(`/publications/${publication.id}`),
      image: publication.cover,
      datePublished: publication.date,
      authors: publication.authors,
      keywords: [...publication.topics, ...publication.tags],
      type: "ScholarlyArticle",
    })
  ),
});

const filterPanelIds = "publications-filter-panel-desktop publications-filter-panel-mobile";
const sortPanelIds = "publications-sort-panel-desktop publications-sort-panel-mobile";

const AuthorLine = ({ authors }: { authors: string[] }) => (
  <p className="text-sm text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
    {authors.map((author, index) => {
      const highlight = author.toLowerCase().includes("yuxiang zheng");
      return (
        <span
          key={`${author}-${index}`}
          className={highlight ? "text-foreground" : ""}
        >
          {author}
          {index < authors.length - 1 && ", "}
        </span>
      );
    })}
  </p>
);

const CardMetaLine = ({ item }: { item: Publication }) => (
  <p className="text-[11px] uppercase tracking-[0.18em] text-[rgba(0,0,0,0.5)] dark:text-white/58">
    {item.category} <span className="mx-1.5">·</span> {formatDisplayDate(item.date)}
  </p>
);

const ResourceRow = ({
  venue,
  resources,
}: {
  venue: string;
  resources?: PublicationResource[];
}) => {
  const visibleResources = resources ?? [];
  const showDot = visibleResources.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
      <span>{venue}</span>
      {showDot && <span>·</span>}
      {visibleResources.map((resource) => (
        <Link
          key={`${resource.type}-${resource.url}`}
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
          className="relative z-20 inline-flex items-center gap-1 text-foreground hover:underline underline-offset-4"
        >
          {resource.label}
          <ArrowUpRight size={12} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
};

const ListRow = ({ item }: { item: Publication }) => {
  return (
    <article className="group relative grid cursor-pointer gap-3 border-b border-[rgba(0,0,0,0.08)] py-6 font-normal transition-colors hover:border-foreground/70 dark:border-white/20 md:grid-cols-[minmax(8rem,12rem)_minmax(0,1fr)] md:gap-8 md:py-7">
      <Link
        href={publicationPath(item)}
        aria-label={`Read ${item.title}`}
        className="absolute inset-0 z-10"
      />
      <div className="space-y-1.5 md:pt-0.5">
        <p className="text-[12px] text-[rgba(0,0,0,0.62)] dark:text-[rgba(255,255,255,0.58)]">
          {item.category}
        </p>
        <p className="text-[13px] text-[rgba(0,0,0,0.48)] dark:text-[rgba(255,255,255,0.58)]">
          {formatDisplayDate(item.date)}
        </p>
      </div>
      <div className="min-w-0 space-y-2">
        <h3 className="text-[17px] leading-snug text-foreground dark:text-white md:text-[18px]">
          {item.title}
        </h3>
        <AuthorLine authors={item.authors} />
        <p className="max-w-3xl text-[14px] leading-relaxed text-foreground/80 dark:text-white/78">
          {item.summary}
        </p>
        <ResourceRow venue={item.venue} resources={item.resources} />
      </div>
    </article>
  );
};

export default function PublicationsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const sortButtonRef = useRef<HTMLButtonElement | null>(null);

  const closeFilterAndRestoreFocus = () => {
    setFilterOpen(false);
    window.setTimeout(() => filterButtonRef.current?.focus(), 0);
  };

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
      const topicsMatch =
        selectedTopics.length === 0 ||
        selectedTopics.every((topic) => item.topics.includes(topic));
      const yearsMatch =
        selectedYears.length === 0 ||
        selectedYears.includes(new Date(item.date).getFullYear());
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
  const hasActiveFilters = selectedTopics.length > 0 || selectedYears.length > 0;

  useEffect(() => {
    if (!filterOpen && !sortOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const filterWasOpen = filterOpen;
        const sortWasOpen = sortOpen;
        setFilterOpen(false);
        setSortOpen(false);
        window.setTimeout(() => {
          if (filterWasOpen) {
            filterButtonRef.current?.focus();
            return;
          }
          if (sortWasOpen) {
            sortButtonRef.current?.focus();
          }
        }, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filterOpen, sortOpen]);

  const renderGrid = () => {
    const leadItem = sortedItems[0];
    const sideRailItems = sortedItems.slice(1, 4);
    const recentItems = sortedItems.slice(4);
    const leftColumnItems = recentItems.filter((_, index) => index % 2 === 0);
    const rightColumnItems = recentItems.filter((_, index) => index % 2 === 1);

    if (!leadItem) return null;

    if (sortedItems.length === 1) {
      return (
        <section className="w-full self-center lg:w-[calc(100vw-84px)] lg:max-w-[1224px]">
          <article
            className="group relative grid cursor-pointer gap-5 transition-transform duration-200 ease-out hover:-translate-y-[3px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center"
          >
            <Link
              href={publicationPath(leadItem)}
              aria-label={`Read ${leadItem.title}`}
              className="absolute inset-0 z-10"
            />
            <div className="min-w-0 overflow-hidden rounded-[4px] bg-[#090909]">
              <div className="relative aspect-[1.36/1] min-h-[280px] w-full sm:aspect-[1.55/1]">
                <img
                  src={leadItem.cover}
                  alt={leadItem.title}
                  width={1200}
                  height={1800}
                  decoding="async"
                  loading="eager"
                  fetchPriority="high"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-col justify-center lg:pl-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[rgba(0,0,0,0.5)] dark:text-white/58">
                Featured publication
              </p>
              <h2 className="pt-3 text-[28px] leading-[1.02] text-foreground dark:text-white md:text-[38px]">
                {leadItem.title}
              </h2>
              <div className="pt-3">
                <CardMetaLine item={leadItem} />
              </div>
              <div className="pt-3">
                <AuthorLine authors={leadItem.authors} />
              </div>
              <p className="pt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/74 dark:text-white/74">
                {leadItem.summary}
              </p>
              <div className="pt-5">
                <ResourceRow venue={leadItem.venue} resources={leadItem.resources} />
              </div>
            </div>
          </article>
        </section>
      );
    }

    return (
      <>
        <section className="w-full self-center grid gap-6 lg:w-[calc(100vw-84px)] lg:max-w-[1224px] lg:grid-cols-[minmax(0,1fr)_272px] items-start">
          <div className="block lg:sticky lg:top-20 lg:self-start">
            <article
              className="group relative cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-[3px]"
            >
              <Link
                href={publicationPath(leadItem)}
                aria-label={`Read ${leadItem.title}`}
                className="absolute inset-0 z-10"
              />
              <div className="overflow-hidden rounded-[4px] bg-[#090909]">
                <div className="relative aspect-[1.68/1] w-full">
                  <img
                    src={leadItem.cover}
                    alt={leadItem.title}
                    width={1200}
                    height={1800}
                    decoding="async"
                    loading="eager"
                    fetchPriority="high"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
              <div className="pt-3">
                <h2 className="max-w-4xl text-[30px] md:text-[clamp(30px,2.95vw,36px)] leading-[1.02] text-foreground dark:text-white">
                  {leadItem.title}
                </h2>
                <div className="pt-2.5">
                  <CardMetaLine item={leadItem} />
                </div>
                <div className="pt-2.5">
                  <AuthorLine authors={leadItem.authors} />
                </div>
                <p className="pt-3 max-w-3xl text-[15px] leading-relaxed text-foreground/74 dark:text-white/74">
                  {leadItem.summary}
                </p>
                <div className="pt-4">
                  <ResourceRow venue={leadItem.venue} resources={leadItem.resources} />
                </div>
              </div>
            </article>
          </div>

          {sideRailItems.length > 0 && (
            <div className="flex flex-col gap-6">
              {sideRailItems.map((item) => (
                <div key={item.id} className="block">
                  <article
                    className="group relative cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-[3px]"
                  >
                    <Link
                      href={publicationPath(item)}
                      aria-label={`Read ${item.title}`}
                      className="absolute inset-0 z-10"
                    />
                    <div className="overflow-hidden rounded-[4px] bg-[#090909]">
                      <div className="relative aspect-square w-full">
                        <img
                          src={getCardCoverPath(item.cover)}
                          alt={item.title}
                          width={560}
                          height={840}
                          decoding="async"
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>
                    <div className="pt-2.5">
                      <h3 className="max-w-[17rem] text-[16px] md:text-[18px] leading-[1.12] text-foreground dark:text-white">
                        {item.title}
                      </h3>
                      <div className="pt-1.5">
                        <CardMetaLine item={item} />
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </section>

        {recentItems.length > 0 && (
          <section className="w-full self-center pt-10 md:pt-16 lg:w-[calc(100vw-84px)] lg:max-w-[1224px]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-[22px] md:text-[28px] text-foreground dark:text-white">Recent publications</h2>
              <p className="text-sm text-[rgba(0,0,0,0.45)] dark:text-white/48">Showing {sortedItems.length} items</p>
            </div>

            <div className="grid gap-x-16 gap-y-8 md:grid-cols-2">
              {[leftColumnItems, rightColumnItems].map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-4">
                  {column.map((item) => (
                    <div key={item.id} className="block">
                      <article
                        className="group relative grid cursor-pointer grid-cols-[96px_minmax(0,1fr)] gap-4 rounded-[6px] border border-transparent p-0 transition-colors hover:border-white/10 md:grid-cols-[104px_minmax(0,1fr)]"
                      >
                        <Link
                          href={publicationPath(item)}
                          aria-label={`Read ${item.title}`}
                          className="absolute inset-0 z-10"
                        />
                        <div className="overflow-hidden rounded-[4px] bg-[#090909]">
                          <div className="relative aspect-square w-full">
                            <img
                              src={getCardCoverPath(item.cover)}
                              alt={item.title}
                              width={560}
                              height={840}
                              decoding="async"
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          </div>
                        </div>
                        <div className="flex min-w-0 flex-col justify-center py-1">
                          <h3 className="text-[18px] md:text-[20px] leading-[1.12] text-foreground dark:text-white">
                            {item.title}
                          </h3>
                          <div className="pt-2">
                            <CardMetaLine item={item} />
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white text-foreground dark:bg-[#000000] dark:text-[#f5f5f5] font-medium">
      <script
        id="ld-breadcrumb-publications"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        id="ld-collection-publications"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionJsonLd) }}
      />
      <script
        id="ld-item-list-publications"
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

      <main id="main-content" tabIndex={-1} className="flex-1 mx-auto w-full max-w-5xl px-2 md:px-4 lg:px-0 py-6 flex flex-col gap-6">
        <section className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Publications</p>
          <h1 className="text-[42px] leading-tight text-foreground md:text-[48px]">Papers &amp; Preprints</h1>
          <p className="text-[15px] md:text-base text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)] max-w-2xl leading-relaxed">
            A curated list of my published and upcoming work, with links to code and materials.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)] pt-1">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-baseline gap-2 border-b border-border pb-1"
              >
                <span className="text-xs uppercase tracking-[0.3em]">{metric.label}</span>
                <span className="text-lg text-foreground">{metric.value}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="relative z-40 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Showing {sortedItems.length} publications</p>

          <div className="relative flex items-center gap-4 text-sm">
            <div className="relative flex items-center gap-1">
              <button
                ref={filterButtonRef}
                type="button"
                className="inline-flex min-h-11 items-center gap-1 rounded-full px-3"
                onClick={() => {
                  setFilterOpen((prev) => !prev);
                  setSortOpen(false);
                }}
                aria-expanded={filterOpen}
                aria-controls={filterPanelIds}
                aria-haspopup="true"
              >
                <span
                  className={
                    hasActiveFilters || filterOpen
                      ? "text-foreground dark:text-white"
                      : "text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]"
                  }
                >
                  Filter
                </span>
                {filterOpen ? (
                  <X size={16} className="text-foreground dark:text-white" aria-hidden="true" />
                ) : (
                  <Filter
                    size={16}
                    aria-hidden="true"
                    className={
                      hasActiveFilters
                        ? "text-foreground dark:text-white"
                        : "text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]"
                    }
                  />
                )}
              </button>
              <div
                id="publications-filter-panel-desktop"
                hidden={!filterOpen}
                className="z-50 hidden max-h-[min(34rem,calc(100vh-2rem))] flex-col overflow-hidden rounded-[8px] border border-[var(--card-border)] bg-[var(--card)]/96 shadow-[0_16px_36px_rgba(0,0,0,0.14)] backdrop-blur-md dark:bg-[#141416]/96 lg:absolute lg:right-0 lg:top-full lg:mt-2 lg:flex lg:w-[min(420px,calc(100vw-2rem))]"
              >
                  <div className="flex shrink-0 items-center justify-between px-4 pb-1 pt-3 text-sm text-foreground dark:text-white">
                    <p className="font-semibold">Filters</p>
                    <button
                      type="button"
                      aria-label="Close filters"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[rgba(0,0,0,0.6)] transition-colors hover:bg-[var(--accent-soft)] dark:text-[rgba(255,255,255,0.8)]"
                      onClick={closeFilterAndRestoreFocus}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_78px] gap-4 overflow-y-auto px-4 py-3 text-sm text-foreground dark:text-white sm:grid-cols-2">
                    <fieldset className="min-w-0 space-y-1.5 border-0 p-0 sm:max-h-60 sm:overflow-y-auto sm:pr-1">
                      <legend className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">Topic</legend>
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
                    </fieldset>
                    <fieldset className="min-w-0 space-y-1.5 border-0 p-0 sm:max-h-60 sm:overflow-y-auto sm:pr-1">
                      <legend className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">Year</legend>
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
                    </fieldset>
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
            </div>

            <div className="relative flex items-center gap-1">
              <button
                ref={sortButtonRef}
                type="button"
                className={`inline-flex min-h-11 items-center gap-1 rounded-full px-3 ${
                  sortOpen ? "text-foreground dark:text-white" : "text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]"
                }`}
                onClick={() => {
                  setSortOpen((prev) => !prev);
                  setFilterOpen(false);
                }}
                aria-expanded={sortOpen}
                aria-controls={sortPanelIds}
                aria-haspopup="true"
              >
                <span>Sort</span>
                {sortOpen ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
              </button>
              <div
                id="publications-sort-panel-desktop"
                role="radiogroup"
                aria-label="Sort publications"
                hidden={!sortOpen}
                className="z-50 hidden flex-col gap-2 overflow-y-auto rounded-[8px] border border-[var(--card-border)] bg-[var(--card)]/96 p-3 text-sm text-foreground shadow-[0_16px_36px_rgba(0,0,0,0.14)] backdrop-blur-md dark:bg-[#141416]/96 dark:text-white lg:absolute lg:right-0 lg:top-full lg:mt-2 lg:flex lg:w-[min(256px,calc(100vw-2rem))]"
              >
                  {sortOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex min-h-11 items-center gap-2 text-foreground/80 dark:text-white/80"
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
            </div>

            <div
              className="flex items-center gap-2 text-[rgba(0,0,0,0.6)] dark:text-foreground/70"
              role="group"
              aria-label="Publication view mode"
            >
              <button
                type="button"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                  viewMode === "list"
                    ? "text-foreground bg-[rgba(0,0,0,0.06)] dark:bg-white/25 dark:text-white"
                    : "hover:text-foreground dark:hover:text-white"
                }`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List size={16} aria-hidden="true" />
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
                aria-pressed={viewMode === "grid"}
              >
                <LayoutGrid size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            id="publications-filter-panel-mobile"
            hidden={!filterOpen}
            className="relative z-50 flex max-h-[min(70dvh,36rem)] w-full flex-col overflow-hidden rounded-[8px] border border-[var(--card-border)] bg-[var(--card)]/96 shadow-[0_16px_36px_rgba(0,0,0,0.14)] backdrop-blur-md dark:bg-[#141416]/96 lg:hidden"
          >
              <div className="flex shrink-0 items-center justify-between px-4 pb-1 pt-3 text-sm text-foreground dark:text-white">
                <p className="font-semibold">Filters</p>
                <button
                  type="button"
                  aria-label="Close filters"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[rgba(0,0,0,0.6)] transition-colors hover:bg-[var(--accent-soft)] dark:text-[rgba(255,255,255,0.8)]"
                  onClick={closeFilterAndRestoreFocus}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_78px] gap-4 overflow-y-auto px-4 py-3 text-sm text-foreground dark:text-white sm:grid-cols-2">
                <fieldset className="min-w-0 space-y-1.5 border-0 p-0 sm:max-h-60 sm:overflow-y-auto sm:pr-1">
                  <legend className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">Topic</legend>
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
                </fieldset>
                <fieldset className="min-w-0 space-y-1.5 border-0 p-0 sm:max-h-60 sm:overflow-y-auto sm:pr-1">
                  <legend className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">Year</legend>
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
                </fieldset>
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

          <div
            id="publications-sort-panel-mobile"
            role="radiogroup"
            aria-label="Sort publications"
            hidden={!sortOpen}
            className="relative z-50 flex w-full flex-col gap-2 overflow-y-auto rounded-[8px] border border-[var(--card-border)] bg-[var(--card)]/96 p-3 text-sm text-foreground shadow-[0_16px_36px_rgba(0,0,0,0.14)] backdrop-blur-md dark:bg-[#141416]/96 dark:text-white lg:hidden"
          >
              {sortOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex min-h-11 items-center gap-2 text-foreground/80 dark:text-white/80"
                >
                  <input
                    type="radio"
                    name="pubs-sort-mobile"
                    value={option.value}
                    checked={sortMode === option.value}
                    onChange={() => setSortMode(option.value)}
                  />
                  {option.label}
                </label>
              ))}
          </div>
        </div>

        {sortedItems.length === 0 ? (
          <section className="border-y border-[rgba(0,0,0,0.08)] py-10 text-sm dark:border-white/20">
            <div className="flex max-w-2xl flex-col items-start gap-3">
              <h2 className="text-[18px] font-medium text-foreground dark:text-white">No publications match these filters</h2>
              <p className="max-w-xl leading-relaxed text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">
                Try clearing the selected topics or years to see the full publications list again.
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
        ) : (
          renderGrid()
        )}
      </main>

      <Footer className="mb-4" />
    </div>
  );
}
