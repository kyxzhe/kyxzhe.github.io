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

const snapshotFacts = [
  { label: "Location", value: "Sydney, Australia" },
  { label: "Lab", value: "Behavioural Data Science Lab @ UTS" },
  { label: "Teaching", value: "Advanced ML + Informatics @ USYD" },
];

const quickStats = [
  { label: "Lab talks", value: "4" },
  { label: "Manuscripts", value: "2" },
  { label: "Courses", value: "2" },
  { label: "Topics", value: "Diffusion · Robust ML" },
];

const aboutIntro = `I’m a PhD student at the University of Technology Sydney, working with Marian-Andrei Rizoiu in the Behavioural Data Science Lab. My research looks at how information spreads online and how to keep machine learning models a little more robust when faced with the messiness of the real world.

Before the PhD, I studied at the University of Sydney (and somehow graduated with a University Medal). Teaching data science and ML became a favourite way to understand tough ideas—there’s nothing like explaining a concept to realise where the gaps are.

Outside academia I’m usually carrying a film camera, hunting for the next coffee spot, or sweating it out at the gym. I rotate hobbies like archery, and I’m always down to trade recommendations for diving, skydiving, or the best flat white in Sydney. If you want to chat about research, photography, or travel-fuelled ideas, feel free to reach out.`;

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans overflow-visible">
      <Navbar />
      <motion.main
        className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 lg:px-6 xl:px-4 py-12 md:py-14 flex flex-col gap-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section
          className="grid gap-10 lg:grid-cols-12 items-start"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About Kevin</p>
              <h1 className="text-[2.45rem] md:text-[2.8rem] font-semibold leading-tight">
                Research first, people centered
              </h1>
              <p className="text-base md:text-lg text-foreground/80 whitespace-pre-line leading-relaxed">
                {aboutIntro}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              {["📍 Sydney based", "🏛 Behavioural Data Science Lab @ UTS", "🧑‍🏫 Teaching ML + Informatics at USYD"].map((item) => (
                <span key={item} className="chip chip-relaxed bg-[var(--pill-background)] border border-[var(--card-border)]">
                  {item}
                </span>
              ))}
            </div>
            <p className="text-sm md:text-base text-foreground/70 max-w-3xl leading-relaxed">
              I like projects where social data, ranking systems, and human decisions meet. When in doubt, I’ll choose conversations over dashboards.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <motion.div
              variants={cardVariants}
              className="surface-card p-6 md:p-7 space-y-5"
            >
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Snapshot</p>
                <h2 className="text-xl font-semibold text-foreground">Where to find me</h2>
              </div>
              <div className="space-y-4">
                {snapshotFacts.map((fact) => (
                  <div key={fact.label} className="grid grid-cols-[110px_1fr] items-start gap-3 text-sm">
                    <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">{fact.label}</p>
                    <p className="text-foreground/80">{fact.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-[rgba(0,0,0,0.08)] dark:border-white/15">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-3xl font-semibold leading-none">{stat.value}</p>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="surface-card p-5 md:p-6 space-y-3"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Currently</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Tinkering with two manuscripts on diffusion dynamics and evaluation strategy while designing teaching material that makes ML less opaque.
              </p>
              <Link
                href={`mailto:${contactInfo.email}`}
                className="inline-flex justify-center w-full btn-primary text-sm"
              >
                Email Kevin
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <section className="grid gap-10 lg:grid-cols-12">
          <motion.div
            variants={cardVariants}
            className="surface-card p-6 md:p-7 space-y-4 lg:col-span-5"
            initial="hidden"
            animate="visible"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Research threads</p>
            <h2 className="text-xl font-semibold">Focus areas</h2>
            <div className="flex flex-wrap gap-3 pt-1">
              {researchFocus.map((item) => (
                <span
                  key={item}
                  className="chip chip-relaxed border border-[var(--card-border)] bg-[var(--pill-background)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="surface-card p-6 md:p-7 space-y-5 lg:col-span-7"
            initial="hidden"
            animate="visible"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Community</p>
            <h2 className="text-xl font-semibold">Teaching & sharing</h2>
            <ul className="divide-y divide-[rgba(0,0,0,0.08)] dark:divide-white/12">
              {contributions.map((item) => (
                <li key={item} className="py-3 flex items-start gap-3 text-sm text-foreground/80">
                  <span className="text-[var(--accent)]">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        <motion.section
          variants={cardVariants}
          className="surface-card p-6 md:p-8 space-y-8"
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Story so far</p>
              <h2 className="text-2xl font-semibold">Timeline</h2>
            </div>
            <Link
              href="/"
              className="text-sm text-foreground/70 underline underline-offset-6 hover:text-foreground transition-colors"
            >
              Back to work overview
            </Link>
          </div>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex flex-col items-center pt-1">
                  <span className="w-3 h-3 rounded-full bg-foreground" />
                  {index !== timeline.length - 1 && (
                    <span className="flex-1 w-px bg-[rgba(0,0,0,0.12)] dark:bg-white/25 mt-2" />
                  )}
                </div>
                <div
                  className={`flex-1 pb-6 space-y-2 ${
                    index !== timeline.length - 1 ? "border-b border-[rgba(0,0,0,0.08)] dark:border-white/15" : ""
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                    {item.period}
                  </p>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-foreground/75">{item.org}</p>
                  <p className="text-sm text-foreground/70 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={cardVariants}
          className="surface-card p-6 md:p-8 grid gap-8 lg:grid-cols-2 items-start"
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Collaborate</p>
            <h2 className="text-xl font-semibold">Open to thoughtful work</h2>
            <p className="text-sm text-foreground/75 leading-relaxed">
              I partner with researchers and product teams on diffusion modelling, moderation strategy, and responsible experimentation with social data.
              If your project needs careful measurement and collaborative storytelling, let&apos;s talk.
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href={`mailto:${contactInfo.email}`}
              className="btn-primary inline-flex justify-center w-full text-sm"
            >
              Email Kevin
            </Link>
            <Link
              href="/news"
              className="text-sm text-foreground/70 underline underline-offset-6 hover:text-foreground transition-colors text-center block"
            >
              See what I am sharing lately
            </Link>
          </div>
        </motion.section>
      </motion.main>
      <Footer className="mt-4" />
    </div>
  );
}
