import { siteMetadata } from "./config";

export const getWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: siteMetadata.baseUrl,
  name: siteMetadata.siteName,
  description: siteMetadata.description,
  inLanguage: siteMetadata.locale,
});

export const getPersonJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteMetadata.author.name,
  givenName: siteMetadata.author.givenName,
  familyName: siteMetadata.author.familyName,
  jobTitle: "PhD Student · Behavioural Data Science Lab",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Technology Sydney",
  },
  email: siteMetadata.contact.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sydney",
    addressCountry: "Australia",
  },
  url: siteMetadata.baseUrl,
  sameAs: Object.values(siteMetadata.social),
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
