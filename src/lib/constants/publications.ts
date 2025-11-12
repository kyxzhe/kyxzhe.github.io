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
    title: "Self-Paced Noisy Label Learning via Generative Filtering",
    venue: "NeurIPS (Under Review)",
    year: "2024",
    summary:
      "Introduces a generative filtering pipeline that isolates reliable subsets of noisy, web-scale datasets and boosts downstream model robustness by 7% over SOTA.",
    tags: ["Noisy Labels", "Generative AI", "Robust Learning"],
    link: "https://github.com/KevinCarpricorn/NeurIPS2024",
    status: "Preprint",
  },
  {
    title: "Bayesian Transition Models for Partial-Label Learning",
    venue: "ICML Workshop on Reliable ML",
    year: "2023",
    summary:
      "Models uncertainty between observed and latent labels using Bayesian transitions, improving partial supervision reliability in limited-data regimes.",
    tags: ["Bayesian", "Partial Labels", "Reliability"],
    link: "https://github.com/KevinCarpricorn/Transition_Matrix_PLL",
  },
  {
    title: "Memory-Aware Partial-Label Continual Learning",
    venue: "ACM Multimedia",
    year: "2022",
    summary:
      "Combines memory replay with adaptive label disambiguation to minimise forgetting when adapting to streaming, partially annotated tasks.",
    tags: ["Continual Learning", "Partial Labels", "Optimization"],
    link: "https://github.com/KevinCarpricorn/PLCL",
  },
];
