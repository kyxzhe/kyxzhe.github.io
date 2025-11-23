export type NewsCategory = "RESEARCH" | "AWARD" | "MILESTONE" | "TALK" | "TEACHING";

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
    link: "https://www.behavioral-ds.science/authors/kevin-zheng/",
    linkLabel: "Lab profile",
  },
  {
    id: "medal",
    title: "University Medal · University of Sydney",
    category: "AWARD",
    date: "2025-08-20",
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
  {
    id: "teaching-guest-lecture",
    title: "Guest lecture for COMP5328: Advanced Machine Learning",
    category: "TEACHING",
    date: "2024-10-25",
    summary:
      "Delivered a guest lecture on large language models and the GPT architecture for a postgraduate machine learning course at the University of Sydney.",
    topics: ["Teaching", "LLMs"],
    cover: "/projects/work-4.jpg",
  },
  {
    id: "preprint-noisy-labels",
    title: "Preprint: “Can We Treat Noisy Labels as Accurate?”",
    category: "RESEARCH",
    date: "2024-05-21",
    summary:
      "Posted our EchoAlign preprint on arXiv, proposing to treat noisy labels as accurate by editing inputs instead of relabeling them.",
    topics: ["Noisy Labels", "Preprint"],
    cover: "/projects/work-1.jpg",
    link: "https://arxiv.org/abs/2405.12969",
    linkLabel: "Read preprint",
  },
  {
    id: "graduation",
    title: "Graduated First Class Honours & Dalyell Scholar",
    category: "MILESTONE",
    date: "2024-10-03",
    summary:
      "Completed a combined Bachelor of Advanced Computing (Honours, Computational Data Science) and Bachelor of Science (Mathematics) at the University of Sydney and received the University Medal.",
    topics: ["Milestone", "Honours"],
    cover: "/projects/work-2.jpg",
  },
];
