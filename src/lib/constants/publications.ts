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
  {
    id: "placeholder-diffusion",
    title: "[Placeholder] Diffusion Horizons Layout Test",
    category: "Research",
    date: "2025-02-01",
    venue: "Internal Draft",
    summary:
      "Placeholder entry used purely for layout testing—real diffusion manuscript coming soon.",
    topics: ["Information Diffusion"],
    tags: ["Placeholder"],
    cover: "/projects/work-2.jpg",
    authors: ["Internal Research Team"],
  },
  {
    id: "placeholder-safety",
    title: "[Placeholder] Safety Brief Card",
    category: "Safety",
    date: "2024-11-15",
    venue: "Draft",
    summary:
      "Placeholder safety brief to validate hover and grid interactions on the publications page.",
    topics: ["Safety"],
    tags: ["Placeholder"],
    cover: "/projects/work-3.jpg",
    authors: ["Safety Review Group"],
  },
  {
    id: "placeholder-milestone",
    title: "[Placeholder] Milestone Note",
    category: "Milestone",
    date: "2024-09-20",
    venue: "Note",
    summary:
      "Temporary milestone card acting as filler content so the new UI can be tested.",
    topics: ["Milestone"],
    tags: ["Placeholder"],
    cover: "/projects/work-4.jpg",
    authors: ["Product Milestones Board"],
  },
];
