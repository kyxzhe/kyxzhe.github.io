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
        className="flex-1 flex flex-col gap-6 px-2 md:px-6 lg:px-10 pb-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section
          className="max-w-4xl w-full mx-auto flex flex-col gap-8 py-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About Kevin</p>
            <h1 className="text-3xl font-semibold">Research first, people centered</h1>
            <p className="text-base md:text-lg text-foreground/80 whitespace-pre-line">{aboutIntro}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm text-foreground/80">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Now</p>
              <ul className="space-y-1">
                <li>📍 Sydney, usually found on coffee walks</li>
                <li>🏛 Behavioural Data Science Lab @ UTS</li>
                <li>🧑‍🏫 Teaching DS + ML at the University of Sydney</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Focus</p>
              <ul className="space-y-1">
                {researchFocus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-4xl font-semibold leading-none">4</p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2">Lab talks</p>
              </div>
              <div>
                <p className="text-4xl font-semibold leading-none">2</p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2">Manuscripts</p>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="max-w-5xl w-full mx-auto grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-12">
            <div className="space-y-4 border-t border-border/40 pt-6">
              <h2 className="text-2xl font-semibold">Timeline</h2>
              <div className="flex flex-col gap-5">
                {timeline.map((item) => (
                  <div key={item.title}>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      {item.period}
                    </p>
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="text-sm text-foreground/70">{item.org}</p>
                    <p className="text-sm text-foreground/70 mt-1">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t border-border/40 pt-6">
              <h2 className="text-2xl font-semibold">Teaching & community</h2>
              <ul className="space-y-2 text-sm text-foreground/80">
                {contributions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 border-t border-border/40 pt-6">
            <h2 className="text-2xl font-semibold">Collaborate</h2>
            <p className="text-sm text-foreground/70">
              I partner with researchers and product teams on diffusion modelling,
              moderation strategy, and responsible experimentation with social data.
            </p>
            <div className="flex flex-col gap-2 text-sm">
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
        </section>
      </motion.main>
      <Footer className="mb-4" />
    </div>
  );
}
