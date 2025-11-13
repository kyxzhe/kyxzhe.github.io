export type NewsItem = {
  title: string;
  date: string;
  summary: string;
  link?: string;
  cover: string;
};

export const newsItems: NewsItem[] = [
  {
    title: "Certified: AWS Machine Learning – Specialty",
    date: "Jan 2025",
    summary:
      "Passed the AWS ML Specialty exam to benchmark production-ready practices for future platform-scale experiments.",
    link: "https://www.credly.com/badges/b324db7a-0cb4-41b9-b3a7-a3275dde8f6b/public_url",
    cover: "/projects/work-1.jpg",
  },
  {
    title: "Awarded: University Medal · University of Sydney",
    date: "Sep 2024",
    summary:
      "Honours thesis on noisy-label learning capped off with the University Medal—grateful for every messy dataset that led here.",
    cover: "/projects/work-2.jpg",
  },
  {
    title: "Started PhD at UTS Behavioural Data Science Lab",
    date: "Sep 2024",
    summary:
      "Joined Marian-Andrei Rizoiu and the Behavioural Data Science Lab to study information diffusion and robust ML for social platforms.",
    cover: "/projects/work-3.jpg",
  },
  {
    title: "Field notes: film cameras, cafes, and archery resets",
    date: "Aug 2024",
    summary:
      "Documenting how slowing down with photography, coffee walks, and occasional archery practice feeds back into long-horizon research thinking.",
    cover: "/projects/work-4.jpg",
  },
];
