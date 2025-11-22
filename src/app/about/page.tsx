"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contactInfo } from "@/lib/constants/contact";
import {
  cardVariants,
  containerVariants,
} from "@/lib/animation/variants";

const timeline = [
  {
    title: "PhD · Behavioural Data Science Lab",
    org: "University of Technology Sydney",
    period: "2025 – Present",
    detail:
      "Working with Dr. Marian-Andrei Rizoiu on information diffusion, social data science, and robust machine learning.",
  },
  {
    title: "Guest lecturer & tutor",
    org: "University of Sydney",
    period: "2024 – Present",
    detail:
      "Lead tutorials for Advanced ML and Informatics courses, plus a guest lecture on data-centric evaluation.",
  },
  {
    title: "B.Adv. Computing (Honours) + B.Sc.",
    org: "University of Sydney",
    period: "2021 – 2024",
    detail:
      "Studied noisy-label learning and generative models, somehow graduated with a University Medal.",
  },
];

const researchFocus = [
  "Information diffusion & online narrative dynamics",
  "Robust ML under noisy, biased, or shifting supervision",
  "Temporal + graph representations for multimodal social data",
  "Evaluation of ranking and moderation interventions",
];

const contributions = [
  "TA · 2024 S2 COMP5328/4328 Advanced Machine Learning",
  "TA · 2025 S2 DATA1002/1902 Informatics: Data and Computation",
  "Guest lecture: COMP5328 on data-centric ML evaluation",
  "4 internal talks across lab meetings & reading groups",
];

const snapshotStats = [
  { value: "4", label: "Lab talks", helper: "Methods, ablations, hard lessons" },
  { value: "2", label: "Manuscripts", helper: "Diffusion dynamics & evaluation" },
  { value: "2", label: "Courses taught", helper: "Advanced ML + Informatics" },
];

const aboutIntro = `I’m a PhD student at the University of Technology Sydney, working with Marian-Andrei Rizoiu in the Behavioural Data Science Lab. My research looks at how information spreads online and how to keep machine learning models a little more robust when faced with the messiness of the real world.

Before the PhD, I studied at the University of Sydney (and somehow graduated with a University Medal). Teaching data science and ML became a favourite way to understand tough ideas—there’s nothing like explaining a concept to realise where the gaps are.

Outside academia I’m usually carrying a film camera, hunting for the next coffee spot, or sweating it out at the gym. I rotate hobbies like archery, and I’m always down to trade recommendations for diving, skydiving, or the best flat white in Sydney. If you want to chat about research, photography, or travel-fuelled ideas, feel free to reach out.`;

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-visible">
      <Navbar />
      <motion.main
        className="flex-1 flex flex-col items-center gap-16 px-4 md:px-16 lg:px-24 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section
          className="max-w-5xl w-full grid gap-6 lg:grid-cols-[1.35fr_1fr]"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="surface-card relative overflow-hidden p-7 md:p-9 flex flex-col gap-6">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(15,15,17,0.05),transparent_45%),radial-gradient(circle_at_80%_0,rgba(15,15,17,0.08),transparent_40%)]" />
            <div className="flex items-center gap-3">
              <span className="badge-soft">About Kevin</span>
              <span className="chip chip-relaxed text-xs md:text-sm">Research first, people centered</span>
            </div>
            <div className="space-y-4 relative z-10">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">Long-form work, human-scale impact</h1>
              <p className="text-base md:text-lg text-foreground/80 whitespace-pre-line leading-relaxed">{aboutIntro}</p>
            </div>
            <div className="flex flex-wrap gap-2 relative z-10">
              {[
                "📍 Sydney based",
                "🏛 Behavioural Data Science Lab @ UTS",
                "🧑‍🏫 Teaching ML + Informatics at USYD",
              ].map((tag) => (
                <span key={tag} className="chip chip-relaxed bg-white/60 dark:bg-white/5">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-foreground/70 relative z-10 max-w-2xl">
              I like projects where social data, ranking systems, and human decisions meet. When in doubt, I choose conversations over dashboards.
            </p>
          </div>

          <div className="surface-card p-6 md:p-8 flex flex-col gap-6 justify-between relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(15,15,17,0.05),transparent_55%)]" />
            <div className="flex items-center justify-between relative z-10">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Snapshot</p>
              <Link
                href={`mailto:${contactInfo.email}`}
                className="text-sm underline underline-offset-4 text-foreground/70 hover:text-foreground transition-colors"
              >
                Say hello
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {snapshotStats.map((item) => (
                <div key={item.label} className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-[var(--card-border)]">
                  <p className="text-3xl font-semibold leading-none">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-3">{item.label}</p>
                  <p className="text-xs text-foreground/60 mt-2 leading-relaxed">{item.helper}</p>
                </div>
              ))}
            </div>
            <div className="text-sm text-foreground/70 relative z-10 leading-relaxed">
              <p>Currently tinkering with a pair of manuscripts on diffusion dynamics and evaluation strategy, while keeping teaching grounded in the same methods.</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="max-w-5xl w-full grid gap-6 lg:grid-cols-2"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="surface-card p-7 space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Focus areas</p>
            <div className="grid gap-3">
              {researchFocus.map((item) => (
                <div key={item} className="card-row">
                  <span className="h-2 w-2 rounded-full bg-foreground" aria-hidden />
                  <p className="text-sm text-foreground/80">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-7 space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Operating cadence</p>
            <div className="space-y-3 text-sm text-foreground/80 leading-relaxed">
              <p>Pairing qualitative intuition with evaluation rigor—prototypes first, then stress-tests against messy data.</p>
              <p>Most collaborations sit at the intersection of diffusion modelling, ranking systems, and responsible experimentation with social data.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                "Diffusion modelling",
                "Ranking interventions",
                "Human-in-the-loop",
                "Evaluation design",
              ].map((chip) => (
                <span key={chip} className="chip chip-relaxed">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="w-full max-w-5xl space-y-14">
          <div className="space-y-10">
            <div className="surface-card p-7 md:p-8 space-y-8">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Story so far</p>
                <h2 className="text-2xl font-semibold">Timeline</h2>
              </div>
              <div className="space-y-6 relative">
                {timeline.map((item, index) => (
                  <div key={item.title} className="relative pl-10">
                    <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-foreground" />
                    {index !== timeline.length - 1 && (
                      <span className="absolute left-[5px] top-5 bottom-[-18px] w-px bg-[var(--card-border)]" aria-hidden />
                    )}
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.period}</p>
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="text-sm text-foreground/70">{item.org}</p>
                    <p className="text-sm text-foreground/70 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="surface-card p-7 space-y-5">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Community</p>
              <h2 className="text-2xl font-semibold">Teaching & sharing</h2>
              <ul className="space-y-3 text-sm text-foreground/80">
                {contributions.map((item) => (
                  <li key={item} className="card-row hoverable">
                    <span className="h-2 w-2 rounded-full bg-foreground" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card p-7 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Collaborate</p>
                <h2 className="text-2xl font-semibold">Open to thoughtful work</h2>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  I partner with researchers and product teams on diffusion modelling,
                  moderation strategy, and responsible experimentation with social data.
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm max-w-xs">
                <Link
                  href={`mailto:${contactInfo.email}`}
                  className="btn-primary inline-flex justify-center"
                >
                  Email Kevin
                </Link>
                <Link
                  href="/"
                  className="text-foreground/60 text-center underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Back to work overview
                </Link>
              </div>
            </div>
          </div>
        </section>
      </motion.main>
      <Footer className="mb-4" />
    </div>
  );
}
