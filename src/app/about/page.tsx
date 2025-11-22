"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contactInfo } from "@/lib/constants/contact";
import { cardVariants, containerVariants } from "@/lib/animation/variants";

const highlights = [
  { label: "Base", value: "Sydney, AU" },
  { label: "Lab", value: "Behavioural Data Science Lab · UTS" },
  { label: "Teaching", value: "Guest lecturer · USYD" },
  { label: "Interests", value: "Diffusion · Robust ML · Evaluation" },
];

const stats = [
  { label: "Manuscripts in flight", value: "2" },
  { label: "Talks & lectures", value: "9" },
  { label: "Teaching terms", value: "4" },
];

const focus = [
  "Information diffusion & narrative shifts",
  "Robust ML for noisy, biased, shifting data",
  "Temporal + graph representations of social activity",
  "Evaluation of ranking and moderation interventions",
];

const currentWork = [
  "Tracing how stories move across platforms and time",
  "Testing ranking interventions under imperfect feedback",
  "Building reproducible pipelines for social data experiments",
];

const timeline = [
  {
    period: "2025 – now",
    title: "PhD · Behavioural Data Science Lab",
    org: "University of Technology Sydney",
    note: "Advised by Marian-Andrei Rizoiu; focusing on diffusion and robustness.",
  },
  {
    period: "2024 – now",
    title: "Guest lecturer & tutor",
    org: "University of Sydney",
    note: "Advanced ML and Informatics; one-off lecture on data-centric evaluation.",
  },
  {
    period: "2021 – 2024",
    title: "B.Adv. Computing (Hons) + B.Sc.",
    org: "University of Sydney",
    note: "University Medal; research in noisy-label learning and generative models.",
  },
];

const teaching = [
  "COMP5328/4328 Advanced ML · Tutorials",
  "DATA1002/1902 Informatics · Tutorials",
  "COMP5328 guest lecture · Data-centric evaluation",
  "Lab and reading-group talks on diffusion, robustness, and evaluation",
];

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
          className="max-w-4xl w-full flex flex-col gap-10"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-5">
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">
              About Kevin
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-[2.75rem] font-semibold leading-tight">
                Social data science, minimal noise
              </h1>
              <p className="text-base md:text-lg text-foreground/75 leading-relaxed">
                I study how information spreads and how to keep machine learning reliable when data is messy. The work sits between diffusion modelling, ranking systems, and human judgement—always with an eye on clear evaluation.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-foreground/80">
              {highlights.map((item) => (
                <span
                  key={item.label}
                  className="px-3 py-[7px] rounded-full border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_10px_22px_rgba(0,0,0,0.06)] dark:bg-[#1b1b1f] dark:border-[#2f2f35] dark:text-white"
                >
                  {item.value}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr]">
            <div className="space-y-5">
              <p className="text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">Focus areas</p>
              <div className="space-y-3 text-sm md:text-[15px] text-foreground/80">
                {focus.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <p className="text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">At a glance</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {stats.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <p className="text-3xl font-semibold leading-tight">{item.value}</p>
                    <p className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm text-foreground/70 leading-relaxed">
                {currentWork.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <section className="w-full max-w-5xl space-y-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">Timeline</p>
              <h2 className="text-2xl font-semibold">Story, kept short</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {timeline.map((item) => (
                <div
                  key={item.title}
                  className="space-y-2 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.06)] dark:bg-[#1b1b1f] dark:border-[#2f2f35] dark:shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
                    {item.period}
                  </p>
                  <h3 className="text-lg font-medium leading-snug">{item.title}</h3>
                  <p className="text-sm text-foreground/75">{item.org}</p>
                  <p className="text-sm text-foreground/65 leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">Community</p>
              <h2 className="text-2xl font-semibold">Teaching & sharing</h2>
              <ul className="space-y-2 text-sm text-foreground/80">
                {teaching.map((item) => (
                  <li key={item} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">Collaborate</p>
              <h2 className="text-2xl font-semibold">Open to thoughtful work</h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                I partner with researchers and product teams on diffusion modelling, evaluation strategy, and responsible experimentation with social data.
              </p>
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
