export type Publication = {
  title: string;
  venue: string;
  year: string;
  summary: string;
  tags: string[];
  link?: string;
  status?: string;
};

export const publications: Publication[] = [
  {
    title: "Can We Treat Noisy Labels as Accurate?",
    venue: "arXiv",
    year: "2024",
    summary:
      "Shows how to reinterpret human and platform-generated noise as useful signal by modifying instances, selecting reliable samples, and controlling shift in feature space.",
    tags: ["Noisy Labels", "Robust Learning", "Social Data"],
    link: "https://arxiv.org/abs/2405.12969",
    status: "Preprint",
  },
];
