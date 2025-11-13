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
      "EchoAlign reframes noisy-label learning by editing instances instead of relabelling them. EchoMod uses controllable generative models to align features with noisy annotations, while EchoSelect keeps distribution shifts in check by retaining trustworthy originals through feature-space similarity tests.",
    tags: ["Noisy Labels", "Instance Editing", "Robust Learning"],
    link: "https://arxiv.org/abs/2405.12969",
    status: "Preprint",
  },
];
