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

const aboutIntro = `I’m a PhD student at the University of Technology Sydney, working with Marian-Andrei Rizoiu in the Behavioural Data Science Lab. My research looks at how information spreads online and how to keep machine learning models a little more robust when faced with the messiness of the real world.

Before the PhD, I studied at the University of Sydney (and somehow graduated with a University Medal). Teaching data science and ML became a favourite way to understand tough ideas—there’s nothing like explaining a concept to realise where the gaps are.

Outside academia I’m usually carrying a film camera, hunting for the next coffee spot, or sweating it out at the gym. I rotate hobbies like archery, and I’m always down to trade recommendations for diving, skydiving, or the best flat white in Sydney. If you want to chat about research, photography, or travel-fuelled ideas, feel free to reach out.`;

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-visible">
      <Navbar />
      <motion.main
        className="flex-1 flex flex-col gap-4 px-2 md:px-4 lg:px-6 pb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section
          className="surface-card p-6 lg:p-8 flex flex-col gap-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About Kevin</p>
            <h1 className="text-3xl font-semibold">Research first, people centered</h1>
            <p className="text-base md:text-lg text-foreground/80 whitespace-pre-line">{aboutIntro}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ul className="flex flex-col gap-3 text-sm text-foreground/80">
              <li className="card-row">📍 Based in Sydney, always mapping coffee routes</li>
              <li className="card-row">🏛 Behavioural Data Science Lab (UTS) with Marian-Andrei Rizoiu</li>
              <li className="card-row">🧑‍🏫 Teaching DS + ML at the University of Sydney</li>
              <li className="card-row">🧪 Studying diffusion, ranking, and robustness</li>
            </ul>
            <div className="grid grid-cols-2 gap-3">
              <div className="card-row flex-col text-center justify-center">
                <p className="text-3xl font-semibold">4</p>
                <p className="text-xs uppercase tracking-[0.3em]">Lab talks</p>
              </div>
              <div className="card-row flex-col text-center justify-center">
                <p className="text-3xl font-semibold">2</p>
                <p className="text-xs uppercase tracking-[0.3em]">Manuscripts</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="surface-card p-6 flex flex-col gap-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-semibold">Current focus</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {researchFocus.map((item) => (
              <li
                key={item}
                className="chip chip-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            className="surface-card p-6 flex flex-col gap-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-semibold">Timeline</h2>
            <div className="flex flex-col gap-4">
              {timeline.map((item) => (
                <div
                  key={item.title}
                  className="border-b border-background/20 pb-4 last:border-b-0 last:pb-0"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-1">
                    {item.period}
                  </p>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-sm font-light mb-1">{item.org}</p>
                  <p className="text-sm text-foreground/70">{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="surface-card p-6 flex flex-col gap-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-semibold">Teaching & community</h2>
            <ul className="flex flex-col gap-3 text-foreground/80">
              {contributions.map((item) => (
                <li
                  key={item}
                  className="card-row text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="surface-card p-6 flex flex-col gap-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-semibold">Collaborate</h2>
            <p className="text-sm text-foreground/70">
              I partner with researchers and product teams on diffusion modelling,
              moderation strategy, and responsible experimentation with social data.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href={`mailto:${contactInfo.email}`}
                className="btn-primary inline-flex justify-center"
              >
                Email Kevin
              </Link>
              <Link
                href="/"
                className="text-foreground/60 text-center text-sm underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Back to work overview
              </Link>
            </div>
          </motion.div>
        </section>
      </motion.main>
      <Footer className="mb-4" />
    </div>
  );
}
