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
    category: "RESEARCH",
    date: "2025-09-05",
    summary:
      "Joined Marian-Andrei Rizoiu and the Behavioural Data Science Lab to study information diffusion and robust ML for social platforms.",
    topics: ["Diffusion", "Robust ML"],
    cover: "/projects/work-3.jpg",
  },
  {
    id: "medal",
    title: "Awarded: University Medal · University of Sydney",
    category: "AWARD",
    date: "2025-09-01",
    summary:
      "Honours thesis on noisy-label learning capped off with the University Medal—grateful for every messy dataset that led here.",
    topics: ["Awards", "Noisy Labels"],
    cover: "/projects/work-2.jpg",
  },
  {
    id: "aws-cert",
    title: "Certified: AWS Machine Learning – Specialty",
    category: "AWARD",
    date: "2025-01-12",
    summary:
      "Passed the AWS ML Specialty exam to benchmark production-ready practices for future platform-scale experiments.",
    topics: ["MLOps", "Credential"],
    cover: "/projects/work-1.jpg",
    link: "https://www.credly.com/badges/b324db7a-0cb4-41b9-b3a7-a3275dde8f6b/public_url",
    linkLabel: "Show credential",
  },
  {
    id: "placeholder-diffusion",
    title: "[Placeholder] Diffusion Horizons update",
    category: "RESEARCH",
    date: "2024-11-20",
    summary:
      "Placeholder entry for layout testing—swap with the next real diffusion brief when ready.",
    topics: ["Diffusion"],
    cover: "/projects/work-2.jpg",
  },
  {
    id: "placeholder-lab-demo",
    title: "[Placeholder] Lab demo tour",
    category: "MILESTONE",
    date: "2024-08-05",
    summary: "Placeholder slot for future demo recaps.",
    topics: ["Demo"],
    cover: "/projects/work-3.jpg",
  },
  {
    id: "placeholder-interview",
    title: "[Placeholder] Interview on noisy supervision",
    category: "TALK",
    date: "2024-06-12",
    summary: "Reserved for upcoming interview summary.",
    topics: ["Interview"],
    cover: "/projects/work-4.jpg",
  },
  {
    id: "placeholder-panel",
    title: "[Placeholder] Panel on responsible ML",
    category: "MILESTONE",
    date: "2024-04-22",
    summary: "Holding space for an upcoming panel recap.",
    topics: ["Panel"],
    cover: "/projects/work-1.jpg",
  },
  {
    id: "placeholder-field-note",
    title: "[Placeholder] Field note on cascade mapping",
    category: "RESEARCH",
    date: "2024-02-10",
    summary: "Placeholder entry to exercise the news grid.",
    topics: ["Field Note"],
    cover: "/projects/work-2.jpg",
  },
];
