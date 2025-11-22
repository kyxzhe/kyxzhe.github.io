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
        className="flex-1 flex flex-col items-center gap-20 px-4 md:px-12 lg:px-16 xl:px-24 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section
          className="max-w-4xl md:max-w-5xl w-full flex flex-col gap-14 mx-auto"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About Kevin</p>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">Research first, people centered</h1>
              <p className="text-base md:text-lg text-foreground/80 whitespace-pre-line leading-relaxed">{aboutIntro}</p>
            </div>
            <div className="flex flex-col gap-4 text-sm text-foreground/70">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <span>📍 Sydney based</span>
                <span>🏛 Behavioural Data Science Lab @ UTS</span>
                <span>🧑‍🏫 Teaching ML + Informatics at USYD</span>
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Focus areas</p>
              <div className="space-y-4 text-sm text-foreground/80">
                {researchFocus.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">At a glance</p>
              <div className="flex gap-12">
                <div>
                  <p className="text-4xl font-semibold leading-none">4</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-3">Lab talks</p>
                </div>
                <div>
                  <p className="text-4xl font-semibold leading-none">2</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-3">Manuscripts</p>
                </div>
              </div>
              <div className="text-sm text-foreground/70 leading-relaxed">
                <p>Currently tinkering with a pair of manuscripts on diffusion dynamics and evaluation strategy.</p>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="w-full max-w-4xl mx-auto space-y-24 py-12">
          <div className="space-y-10">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Story so far</p>
              <h2 className="text-2xl font-semibold">Timeline</h2>
            </div>
            <div className="space-y-8">
              {timeline.map((item) => (
                <div key={item.title} className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {item.period}
                  </p>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-sm text-foreground/70">{item.org}</p>
                  <p className="text-sm text-foreground/70">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-16 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Community</p>
              <h2 className="text-2xl font-semibold">Teaching & sharing</h2>
              <ul className="space-y-3 text-sm text-foreground/80">
                {contributions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Collaborate</p>
              <h2 className="text-2xl font-semibold">Open to thoughtful work</h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                I partner with researchers and product teams on diffusion modelling,
                moderation strategy, and responsible experimentation with social data.
              </p>
              <div className="flex flex-col gap-2 text-sm max-w-xs mx-auto items-center">
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
                  Back to home
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
