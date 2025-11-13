import { NextResponse } from "next/server";
import type { Publication } from "@/lib/constants/publications";

const SERP_API_URL = "https://serpapi.com/search.json";
const SCHOLAR_AUTHOR_ID = "aN71bBIAAAAJ";
const CACHE_SECONDS = 60 * 60; // 1 hour

type ScholarArticle = {
  title?: string;
  link?: string;
  citation_id?: string;
  citation_count?: number;
  year?: string | number;
  authors?: string;
  publication?: string;
  summary?: string;
  description?: string;
  cited_by?: { value?: number };
  snippet?: string;
};

type ScholarResponse = {
  articles?: ScholarArticle[];
  profile?: {
    stats?: {
      citations?: {
        all?: number;
        since_2019?: number;
        since_2018?: number;
        [key: string]: number | undefined;
      };
    };
  };
};

const buildScholarLink = (citationId?: string) => {
  if (!citationId) return undefined;
  const params = new URLSearchParams({
    hl: "en",
    user: SCHOLAR_AUTHOR_ID,
    citation_for_view: `${SCHOLAR_AUTHOR_ID}:${citationId}`,
  });
  return `https://scholar.google.com/citations?${params.toString()}`;
};

const mapArticleToPublication = (article: ScholarArticle): Publication | null => {
  if (!article.title) return null;

  return {
    title: article.title,
    venue: article.publication || "Google Scholar",
    year: article.year ? String(article.year) : "—",
    summary:
      article.description ||
      article.snippet ||
      article.publication ||
      "Auto-imported from Google Scholar.",
    tags: [],
    link: article.link || buildScholarLink(article.citation_id),
    authors: article.authors,
    citationCount:
      typeof article.cited_by?.value === "number"
        ? article.cited_by.value
        : article.citation_count,
    source: "Google Scholar",
  };
};

const extractCitationMetric = (payload: ScholarResponse) => {
  return (
    payload.profile?.stats?.citations?.all ??
    payload.profile?.stats?.citations?.since_2019 ??
    null
  );
};

export async function GET() {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "SERPAPI_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const requestUrl = new URL(SERP_API_URL);
  requestUrl.searchParams.set("engine", "google_scholar_profile");
  requestUrl.searchParams.set("author_id", SCHOLAR_AUTHOR_ID);
  requestUrl.searchParams.set("hl", "en");
  requestUrl.searchParams.set("api_key", apiKey);

  try {
    const response = await fetch(requestUrl, {
      // Cache upstream responses for an hour to avoid blowing the quota.
      next: { revalidate: CACHE_SECONDS },
    });

    if (!response.ok) {
      throw new Error(`SerpApi request failed with status ${response.status}`);
    }

    const data = (await response.json()) as ScholarResponse;
    const publications =
      data.articles
        ?.map(mapArticleToPublication)
        .filter((publication): publication is Publication => Boolean(publication)) ?? [];

    return NextResponse.json(
      {
        publications,
        metrics: {
          citations: extractCitationMetric(data),
          source: "Google Scholar (SerpApi)",
          refreshedAt: new Date().toISOString(),
        },
      },
      {
        headers: {
          "Cache-Control": `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${
            CACHE_SECONDS * 4
          }`,
        },
      }
    );
  } catch (error) {
    console.error("[publications] Failed to fetch Scholar data", error);
    return NextResponse.json(
      { error: "Unable to load publications from Google Scholar." },
      { status: 502 }
    );
  }
}
