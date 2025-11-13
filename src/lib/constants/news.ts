export type NewsItem = {
  title: string;
  date: string;
  summary: string;
  link?: string;
  cover: string;
};

export const newsItems: NewsItem[] = [
  {
    title: "Tracing election misinformation cascades on X",
    date: "Jan 2025",
    summary:
      "Probing how ranking tweaks reshape the reach of rumours during the recent election cycle, complete with diffusion stats and intervention simulations.",
    link: "https://github.com/kyxzhe/misinfo-diffusion-notes",
    cover: "/projects/work-1.jpg",
  },
  {
    title: "Releasing multimodal traces across Reddit, YouTube, and X",
    date: "Nov 2024",
    summary:
      "Cleaning and aligning text, video, and network signals so students can study cross-platform narratives without reinventing the pipeline each time.",
    cover: "/projects/work-2.jpg",
  },
  {
    title: "Teaching messier ML labs at the University of Sydney",
    date: "Oct 2024",
    summary:
      "Piloted new assignments that bridge diffusion modelling, causal reasoning, and responsible deployment for COMP5328 and data science cohorts.",
    cover: "/projects/work-3.jpg",
  },
  {
    title: "Field notes: film cameras, cafes, and archery resets",
    date: "Sep 2024",
    summary:
      "Documenting how slowing down with photography, coffee walks, and occasional archery practice feeds back into long-horizon research thinking.",
    cover: "/projects/work-4.jpg",
  },
];
