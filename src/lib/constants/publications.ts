export type PublicationCategory = "Research" | "Publication" | "Safety" | "Milestone" | "Release";

export type PublicationResourceType =
  | "preprint"
  | "code"
  | "dataset"
  | "slides"
  | "artifact";

export type PublicationResource = {
  type: PublicationResourceType;
  label: string;
  url: string;
};

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
  authors: string[];
  resources?: PublicationResource[];
  link?: string;
  status?: string;
};

export const publications: Publication[] = [
  {
    id: "echoalign",
    title: "Can We Treat Noisy Labels as Accurate?",
    category: "Research",
    date: "2024-05-21",
    venue: "arXiv",
    summary:
      "EchoAlign reframes noisy-label learning by editing instances rather than relabelling them. Controllable generators repair corrupted regions while feature-space tests keep distribution shifts honest.",
    topics: ["Robust ML", "Noisy Labels", "Generative Models"],
    tags: ["Preprint", "Code Available"],
    cover: "/projects/work-1.jpg",
    authors: [
      "Yuxiang Zheng",
      "Zhongyi Han",
      "Yilong Yin",
      "Xin Gao",
      "Tongliang Liu",
    ],
    resources: [
      {
        type: "preprint",
        label: "arXiv · 2405.12969",
        url: "https://arxiv.org/abs/2405.12969",
      },
      {
        type: "code",
        label: "Code",
        url: "https://github.com/kyxzhe/EchoAlign",
      },
    ],
    link: "https://arxiv.org/abs/2405.12969",
  },
];
