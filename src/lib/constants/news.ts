export type NewsCategory = "RESEARCH" | "AWARD" | "MILESTONE" | "TALK";

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  date: string; // ISO date
  category: NewsCategory;
  topics: string[];
  cover: string;
  link?: string;
  linkLabel?: string;
};

export const newsItems: NewsItem[] = [
  {
    id: "phd-start",
    title: "Started PhD at UTS Behavioural Data Science Lab",
    category: "MILESTONE",
    date: "2025-09-01",
    summary:
      "Joined Marian-Andrei Rizoiu’s Behavioural Data Science Lab at UTS to study information diffusion and robust ML on social platforms.",
    topics: ["Diffusion", "Robust ML"],
    cover: "/projects/work-3.jpg",
  },
  {
    id: "medal",
    title: "University Medal · University of Sydney",
    category: "AWARD",
    date: "2025-10-03",
    summary:
      "Received the University Medal from the University of Sydney for my honours thesis on learning with noisy labels.",
    topics: ["Awards", "Noisy Labels"],
    cover: "/projects/work-2.jpg",
  },
  {
    id: "aws-cert",
    title: "AWS Certified Machine Learning – Specialty",
    category: "AWARD",
    date: "2025-01-05",
    summary:
      "Passed the AWS Certified Machine Learning – Specialty exam, validating production-ready ML practice for large-scale systems.",
    topics: ["MLOps", "Credential"],
    cover: "/projects/work-1.jpg",
    link: "https://www.credly.com/badges/b324db7a-0cb4-41b9-b3a7-a3275dde8f6b/public_url",
    linkLabel: "Show credential",
  },
];
