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
    id: 'reading-too-much-into-context',
    title: 'Reading Too Much into Context: Passive Exposure Can Steer LLM Decisions',
    category: 'Research',
    date: '2026-09-27',
    venue: 'arXiv preprint',
    summary:
      'Passive exposure to external content can shift LLM decisions even when it provides no reason to change them, including choices that violate user requirements or accept false claims.',
    topics: ['LLMs', 'Decision-Making', 'AI Safety'],
    tags: ['Preprint'],
    cover: '/projects/work-4.webp',
    authors: ['Yuxiang Zheng', 'Lin Tian', 'Marian-Andrei Rizoiu'],
    resources: [
      {
        type: 'preprint',
        label: 'arXiv · 2609.33065',
        url: 'https://arxiv.org/abs/2609.33065',
      },
    ],
    link: 'https://arxiv.org/abs/2609.33065',
    status: 'Preprint',
  },
  {
    id: "echoalign",
    title: "EchoAlign: Bridging Generative and Discriminative Learning under Noisy Labels",
    category: "Research",
    date: "2026-03-17",
    venue: "Frontiers of Computer Science",
    summary:
      "EchoAlign learns from noisy labels by editing images with controllable generators and selecting clean originals via feature similarity, greatly improving robustness to instance-dependent noise.",
    topics: ["Robust ML", "Noisy Labels", "Generative Models"],
    tags: ["Preprint", "Code Available"],
    cover: "/projects/work-1.webp",
    authors: [
      "Yuxiang Zheng",
      "Zhongyi Han",
      "Yilong Yin",
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
