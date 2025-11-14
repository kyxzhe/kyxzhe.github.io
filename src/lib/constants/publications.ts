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
  {
    id: "diffusion-horizons",
    title: "Diffusion Horizons: Mapping Narrative Cascades on Social Platforms",
    category: "Research",
    date: "2025-02-04",
    venue: "Working Paper",
    summary:
      "A cross-platform study of how health misinformation cascades overlap across X, Reddit, and YouTube, pairing cascade diagnostics with moderation simulations.",
    topics: ["Information Diffusion", "Social Platforms"],
    tags: ["Working Draft"],
    cover: "/projects/work-2.jpg",
  },
  {
    id: "aws-ml-specialty",
    title: "AWS Machine Learning Specialty: Production Notes",
    category: "Milestone",
    date: "2025-01-12",
    venue: "Certification",
    summary:
      "A rapid field guide for AWS ML Specialty covering data ingest, SageMaker pipelines, and guardrails for experimentation with sensitive data.",
    topics: ["MLOps", "Practitioner Notes"],
    tags: ["Credential"],
    cover: "/projects/work-3.jpg",
    link: "https://www.credly.com/badges/b324db7a-0cb4-41b9-b3a7-a3275dde8f6b/public_url",
  },
  {
    id: "evaluation-brief",
    title: "Briefing: Evaluating Political Bias in Ranking Systems",
    category: "Publication",
    date: "2024-11-05",
    venue: "Lab Note",
    summary:
      "Co-devised a lightweight checklist for ranking fairness, combining targeted stress tests with annotator retrospectives to surface policy regressions.",
    topics: ["Evaluation", "Ranking"],
    tags: ["Lab Note"],
    cover: "/projects/work-4.jpg",
  },
  {
    id: "safety-guide",
    title: "Safety Guide: Sensitive Conversations in Student Chatbots",
    category: "Safety",
    date: "2024-08-18",
    venue: "Guide",
    summary:
      "A set of prompts, refusal templates, and escalation paths for responding to mental-health disclosures inside teaching assistants powered by LLMs.",
    topics: ["Safety", "Education"],
    tags: ["Guide"],
    cover: "/projects/work-1.jpg",
  },
];
