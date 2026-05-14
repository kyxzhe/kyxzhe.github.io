export const siteMetadata = {
  siteName: "Kevin Zheng",
  alternateSiteName: "Yuxiang (Kevin) Zheng",
  applicationName: "Kevin Zheng",
  title: "Kevin Zheng | Social Data Science & Robust ML",
  titleTemplate: "%s | Kevin Zheng",
  description:
    "PhD student mapping information diffusion, social data science, and robust machine learning in the Behavioural Data Science Lab at UTS.",
  baseUrl: "https://kyxzhe.github.io",
  language: "en-AU",
  ogLocale: "en_AU",
  ogImageAlt: "Kevin Zheng research profile and publications",
  defaultOgImage: "/opengraph-image",
  author: {
    name: "Yuxiang (Kevin) Zheng",
    givenName: "Yuxiang",
    familyName: "Zheng",
    alternateNames: ["Kevin Zheng", "Yuxiang Zheng", "kyxzhe"],
  },
  affiliations: {
    current: "University of Technology Sydney",
    lab: "Behavioural Data Science Lab",
    alumni: "University of Sydney",
    exchange: "ETH Zurich",
  },
  contact: {
    email: "kevin.zheng@student.uts.edu.au",
    location: "Sydney, Australia",
  },
  researchAreas: [
    "Information diffusion",
    "Social data science",
    "Robust machine learning",
    "Misinformation modeling",
    "Temporal graph learning",
    "Multimodal representation learning",
  ],
  social: {
    github: "https://github.com/kyxzhe",
    linkedin: "https://www.linkedin.com/in/kevin-zheng-873686274",
    googleScholar: "https://scholar.google.com/citations?user=aN71bBIAAAAJ&hl=en",
    orcid: "https://orcid.org/0009-0005-6494-8428",
  },
  awards: [
    "University Medal, University of Sydney",
    "Honours Class I, University of Sydney",
    "AWS Certified Machine Learning - Specialty",
  ],
  defaultImage: "/projects/work-1.jpg",
  keywords: [
    "Kevin Zheng",
    "Yuxiang Zheng",
    "Yuxiang Kevin Zheng",
    "kyxzhe",
    "University of Technology Sydney",
    "Behavioural Data Science Lab",
    "information diffusion",
    "social data science",
    "robust machine learning",
    "trustworthy machine learning",
    "noisy labels",
    "EchoAlign",
    "misinformation modeling",
    "temporal graph learning",
    "multimodal representation learning",
  ],
};

export const absoluteUrl = (path = "") => {
  if (/^https?:\/\//.test(path)) return path;
  const baseUrl = siteMetadata.baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

export const defaultSeoImage = {
  url: absoluteUrl(siteMetadata.defaultOgImage),
  width: 1200,
  height: 630,
  alt: siteMetadata.ogImageAlt,
};
