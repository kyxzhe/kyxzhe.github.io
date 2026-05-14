import { absoluteUrl, siteMetadata } from "./config";

export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export const getWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteMetadata.baseUrl}#website`,
  url: siteMetadata.baseUrl,
  name: siteMetadata.siteName,
  alternateName: siteMetadata.alternateSiteName,
  description: siteMetadata.description,
  inLanguage: siteMetadata.language,
  publisher: {
    "@id": `${siteMetadata.baseUrl}#person`,
  },
});

export const getPersonJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteMetadata.baseUrl}#person`,
  name: siteMetadata.author.name,
  alternateName: siteMetadata.author.alternateNames,
  givenName: siteMetadata.author.givenName,
  familyName: siteMetadata.author.familyName,
  description: siteMetadata.description,
  jobTitle: "PhD Student, Behavioural Data Science Lab",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: siteMetadata.affiliations.current,
    url: "https://www.uts.edu.au/",
  },
  memberOf: {
    "@type": "Organization",
    name: siteMetadata.affiliations.lab,
    url: "https://www.behavioral-ds.science/",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: siteMetadata.affiliations.alumni,
    url: "https://www.sydney.edu.au/",
  },
  email: siteMetadata.contact.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sydney",
    addressCountry: "Australia",
  },
  identifier: {
    "@type": "PropertyValue",
    propertyID: "ORCID",
    value: siteMetadata.social.orcid.replace("https://orcid.org/", ""),
    url: siteMetadata.social.orcid,
  },
  award: siteMetadata.awards,
  knowsAbout: siteMetadata.researchAreas,
  url: siteMetadata.baseUrl,
  sameAs: Object.values(siteMetadata.social),
});

type ProfilePageInput = {
  url: string;
  description: string;
  dateModified?: string;
};

export const getProfilePageJsonLd = ({
  url,
  description,
  dateModified,
}: ProfilePageInput) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${url}#profile-page`,
  url,
  name: "About Kevin Zheng",
  description,
  ...(dateModified ? { dateModified } : {}),
  inLanguage: siteMetadata.language,
  isPartOf: {
    "@id": `${siteMetadata.baseUrl}#website`,
  },
  mainEntity: {
    "@id": `${siteMetadata.baseUrl}#person`,
  },
});

export const getBreadcrumbJsonLd = (crumbs: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});

type CollectionPageInput = {
  title: string;
  description: string;
  url: string;
  dateModified?: string;
};

export const getCollectionPageJsonLd = ({
  title,
  description,
  url,
  dateModified,
}: CollectionPageInput) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${url}#collection-page`,
  url,
  name: title,
  description,
  ...(dateModified ? { dateModified } : {}),
  inLanguage: siteMetadata.language,
  isPartOf: {
    "@id": `${siteMetadata.baseUrl}#website`,
  },
  about: {
    "@id": `${siteMetadata.baseUrl}#person`,
  },
});

type ArticleInput = {
  id?: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authors?: string[];
  keywords?: string[];
  type?: "Article" | "ScholarlyArticle" | "CreativeWork";
};

export const getArticleJsonLd = ({
  id,
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authors = [siteMetadata.author.name],
  keywords,
  type = "Article",
}: ArticleInput) => ({
  "@context": "https://schema.org",
  "@type": type,
  "@id": id ? `${url}#${id}` : url,
  headline: title,
  name: title,
  description,
  url,
  mainEntityOfPage: url,
  image: absoluteUrl(image ?? siteMetadata.defaultImage),
  datePublished,
  dateModified: dateModified ?? datePublished,
  ...(keywords?.length ? { keywords } : {}),
  author: authors.map((name) =>
    name === siteMetadata.author.name || name.includes("Yuxiang Zheng")
      ? { "@id": `${siteMetadata.baseUrl}#person` }
      : { "@type": "Person", name }
  ),
  about: {
    "@id": `${siteMetadata.baseUrl}#person`,
  },
  publisher: {
    "@id": `${siteMetadata.baseUrl}#person`,
  },
});

type WebPageInput = {
  title: string;
  description: string;
  url: string;
  type?: "WebPage" | "AboutPage" | "ContactPage";
  dateModified?: string;
};

export const getWebPageJsonLd = ({
  title,
  description,
  url,
  type = "WebPage",
  dateModified,
}: WebPageInput) => ({
  "@context": "https://schema.org",
  "@type": type,
  "@id": `${url}#webpage`,
  url,
  name: title,
  description,
  ...(dateModified ? { dateModified } : {}),
  inLanguage: siteMetadata.language,
  isPartOf: {
    "@id": `${siteMetadata.baseUrl}#website`,
  },
  about: {
    "@id": `${siteMetadata.baseUrl}#person`,
  },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: absoluteUrl(siteMetadata.defaultOgImage),
    width: 1200,
    height: 630,
  },
});

type ItemListInput = {
  id: string;
  name: string;
  url: string;
  items: unknown[];
};

const withoutContext = (item: unknown) => {
  if (!item || typeof item !== "object" || Array.isArray(item)) return item;
  const record = { ...(item as Record<string, unknown>) };
  delete record["@context"];
  return record;
};

export const getItemListJsonLd = ({ id, name, url, items }: ItemListInput) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${url}#${id}`,
  name,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: withoutContext(item),
  })),
});
