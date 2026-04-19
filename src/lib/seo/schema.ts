import { siteMetadata } from "./config";

export const getWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteMetadata.baseUrl}#website`,
  url: siteMetadata.baseUrl,
  name: siteMetadata.siteName,
  alternateName: siteMetadata.alternateSiteName,
  description: siteMetadata.description,
  inLanguage: siteMetadata.locale,
  publisher: {
    "@id": `${siteMetadata.baseUrl}#person`,
  },
});

export const getPersonJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteMetadata.baseUrl}#person`,
  name: siteMetadata.author.name,
  givenName: siteMetadata.author.givenName,
  familyName: siteMetadata.author.familyName,
  description: siteMetadata.description,
  jobTitle: "PhD Student · Behavioural Data Science Lab",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: siteMetadata.affiliations.current,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: siteMetadata.affiliations.alumni,
  },
  email: siteMetadata.contact.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sydney",
    addressCountry: "Australia",
  },
  image: `${siteMetadata.baseUrl}/opengraph-image`,
  knowsAbout: siteMetadata.researchAreas,
  url: siteMetadata.baseUrl,
  sameAs: Object.values(siteMetadata.social),
});

type ProfilePageInput = {
  url: string;
  description: string;
};

export const getProfilePageJsonLd = ({ url, description }: ProfilePageInput) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${url}#profile-page`,
  url,
  name: "About Kevin Zheng",
  description,
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
};

export const getCollectionPageJsonLd = ({
  title,
  description,
  url,
}: CollectionPageInput) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${url}#collection-page`,
  url,
  name: title,
  description,
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
}: ArticleInput) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": id ? `${url}#${id}` : url,
  headline: title,
  description,
  url,
  mainEntityOfPage: url,
  image: image ?? siteMetadata.defaultImage,
  datePublished,
  dateModified: dateModified ?? datePublished,
  author: authors.map((name) => ({ "@type": "Person", name })),
  about: {
    "@id": `${siteMetadata.baseUrl}#person`,
  },
  publisher: {
    "@type": "Person",
    name: siteMetadata.author.name,
  },
});
