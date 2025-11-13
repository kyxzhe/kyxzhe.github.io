export type NewsItem = {
  title: string;
  date: string;
  summary: string;
  link?: string;
  cover: string;
};

export const newsItems: NewsItem[] = [
  {
    title: "Self-Paced Noisy Label Learning accepted to NeurIPS workshop",
    date: "Dec 2024",
    summary:
      "Wrapping up experiments on generative filtering for noisy labels and preparing the public release of code + write-up.",
    link: "https://github.com/KevinCarpricorn/NeurIPS2024",
    cover: "/projects/work-1.jpg",
  },
  {
    title: "Launching the Trustworthy AI + Misinformation reading group",
    date: "Nov 2024",
    summary:
      "Bi-weekly sessions with Behavioral Data Science Lab and friends—reach out if you’d like to join or present.",
    cover: "/projects/work-2.jpg",
  },
  {
    title: "Guest lecture: COMP5328 Advanced Machine Learning",
    date: "Oct 2024",
    summary:
      "Walked through scaling LLMs and practical tooling for data-centric evaluation with a room full of curious students.",
    cover: "/projects/work-3.jpg",
  },
  {
    title: "Field notes: film photography + coffee crawl in Tokyo",
    date: "Sep 2024",
    summary:
      "Documenting urban motion on Portra 400 and mapping cafe recommendations—will share highlights via the future chatbot.",
    cover: "/projects/work-4.jpg",
  },
];
