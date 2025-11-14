export type PublicationCategory = "Research" | "Publication" | "Safety" | "Milestone" | "Release";

export type Publication = {
  id: string;
  title: string;
  category: PublicationCategory;
  date: string; // ISO date
  venue: string;
  summary: string;
  topics: string[];
  tags: string[];
  cover: string;
  link?: string;
};

export const publications: Publication[] = [
  {
    id: "echoalign",
    title: "EchoAlign: Can We Treat Noisy Labels as Accurate?",
    category: "Research",
    date: "2024-05-20",
    venue: "arXiv",
    summary:
      "EchoAlign reframes noisy-label learning by editing instances rather than relabelling them. Controllable generators repair corrupted regions while feature-space tests keep distribution shifts honest.",
    topics: ["Robust ML", "Noisy Labels", "Generative Models"],
    tags: ["Preprint", "Code Available"],
    cover: "/projects/work-1.jpg",
    link: "https://arxiv.org/abs/2405.12969",
  },
];
