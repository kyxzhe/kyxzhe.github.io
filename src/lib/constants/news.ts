export type NewsCategory =
  | "Research"
  | "Milestone"
  | "Certification"
  | "Product"
  | "Interview";

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
    category: "Research",
    date: "2025-09-05",
    summary:
      "Joined Marian-Andrei Rizoiu and the Behavioural Data Science Lab to study information diffusion and robust ML for social platforms.",
    topics: ["Diffusion", "Robust ML"],
    cover: "/projects/work-3.jpg",
  },
  {
    id: "medal",
    title: "Awarded: University Medal · University of Sydney",
    category: "Milestone",
    date: "2025-09-01",
    summary:
      "Honours thesis on noisy-label learning capped off with the University Medal—grateful for every messy dataset that led here.",
    topics: ["Awards", "Noisy Labels"],
    cover: "/projects/work-2.jpg",
  },
  {
    id: "aws-cert",
    title: "Certified: AWS Machine Learning – Specialty",
    category: "Certification",
    date: "2025-01-12",
    summary:
      "Passed the AWS ML Specialty exam to benchmark production-ready practices for future platform-scale experiments.",
    topics: ["MLOps", "Credential"],
    cover: "/projects/work-1.jpg",
    link: "https://www.credly.com/badges/b324db7a-0cb4-41b9-b3a7-a3275dde8f6b/public_url",
    linkLabel: "Show credential",
  },
  {
    id: "chatbot-launch",
    title: "Lab chatbot beta graduates to full release",
    category: "Product",
    date: "2025-03-18",
    summary:
      "Production-ready chatbot now answers lab FAQs with citations to the news log, making collaboration queries faster.",
    topics: ["Product", "Chatbot"],
    cover: "/projects/work-4.jpg",
    link: "https://kevin-bot.kyx-zhe.workers.dev",
    linkLabel: "Try KevinBot",
  },
  {
    id: "diffusion-brief",
    title: "Diffusion Horizons: Mapping cascade interventions",
    category: "Research",
    date: "2024-11-20",
    summary:
      "Shared early diffusion simulations with product partners, highlighting how ranking tweaks reshape outbreak narratives.",
    topics: ["Diffusion", "Simulation"],
    cover: "/projects/work-2.jpg",
  },
];
