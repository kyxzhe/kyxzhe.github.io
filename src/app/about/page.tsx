"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contactInfo } from "@/lib/constants/contact";
import {
  cardVariants,
  containerVariants,
  iconVariants,
  textVariants,
} from "@/lib/animation/variants";

const timeline = [
  {
    title: "PhD — Behavioural Data Science Lab",
    org: "University of Technology Sydney",
    period: "2025 – Present",
    detail:
      "Studying information diffusion, algorithmic interventions, and robust learning with Marian-Andrei Rizoiu.",
  },
  {
    title: "B.Adv. Computing (Honours) + B.Sc.",
    org: "The University of Sydney",
    period: "2021 – 2024",
    detail:
      "Honours thesis on noisy-label and generative models, graduating with a University Medal and a love for messy datasets.",
  },
  {
    title: "Exchange & vision research sprints",
    org: "ETH Zürich · USYD CV labs",
    period: "2022 – 2023",
    detail:
      "Explored video action recognition and temporal representation learning—foundations for multi-modal diffusion work.",
  },
];

const researchFocus = [
  "Information diffusion & narrative evolution",
  "Robust ML under noisy or biased supervision",
  "Temporal + graph representations for social data",
  "Evaluation of ranking and moderation interventions",
];

const contributions = [
  "Designing messy-data assignments for DS + ML courses",
  "Facilitating diffusion + trustworthy ML reading groups",
  "Mentoring honours students on social data pipelines",
  "Collaborating with teams on ranking/red-teaming audits",
];

const aboutIntro =
  "I study social platforms as dynamic systems: how information diffuses, how ranking and moderation shape what people see, and how to keep models trustworthy when supervision is noisy or biased. I enjoy slow, iterative research—reading widely, mapping connections between diffusion, causal inference, and robust learning, then narrowing in on questions that feel both principled and practical.";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-auto lg:overflow-visible">
      <Navbar />
      <motion.main
        className="flex-1 flex flex-col gap-4 px-2 md:px-4 lg:px-6 pb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            className="surface-card p-6 flex flex-col gap-6"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <div>
              <motion.p
                className="uppercase tracking-[0.3em] text-xs text-muted-foreground mb-3"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                About Kevin
              </motion.p>
              <motion.h1
                className="text-3xl md:text-4xl font-semibold mb-4 leading-tight"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                Understanding how information spreads and how to keep our models honest while it does.
              </motion.h1>
              <motion.p
                className="text-base md:text-lg text-foreground/80"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                {aboutIntro}
              </motion.p>
            </div>
            <motion.ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              {researchFocus.map((item) => (
                <li
                  key={item}
                  className="chip"
                >
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            className="surface-card p-6 flex flex-col justify-between"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div>
              <motion.p
                className="text-xs uppercase tracking-[0.3em] text-foreground/50 mb-2"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                Snapshot
              </motion.p>
              <motion.h2
              className="text-2xl font-semibold mb-4"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Researcher · Mentor · Collaborator
            </motion.h2>
              <motion.ul
                className="flex flex-col gap-3 text-sm text-foreground/70"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <li>📍 Based in Sydney, exploring cities via coffee walks</li>
                <li>🏛 Behavioural Data Science Lab (UTS) with Marian-Andrei Rizoiu</li>
                <li>🧑‍🏫 Tutor for DS + ML courses at the University of Sydney</li>
                <li>📰 Researching diffusion, ranking, and robustness</li>
              </motion.ul>
            </div>
            <motion.div
              className="mt-6 grid grid-cols-2 gap-3"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="card-row flex-col text-center justify-center">
                <p className="text-3xl font-semibold">15+</p>
                <p className="text-xs uppercase tracking-[0.3em]">Talks</p>
              </div>
              <div className="card-row flex-col text-center justify-center">
                <p className="text-3xl font-semibold">8</p>
                <p className="text-xs uppercase tracking-[0.3em]">Manuscripts</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            className="surface-card p-6 flex flex-col gap-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              className="text-2xl font-semibold"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Timeline
            </motion.h2>
            <div className="flex flex-col gap-4">
              {timeline.map((item) => (
                <motion.div
                  key={item.title}
                  className="border-b border-background/20 pb-4 last:border-b-0 last:pb-0"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-1">
                    {item.period}
                  </p>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-sm font-light mb-1">{item.org}</p>
                  <p className="text-sm text-foreground/70">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="surface-card p-6 flex flex-col gap-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
              <motion.h2
                className="text-2xl font-semibold"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                Teaching & community
              </motion.h2>
            <motion.ul
              className="flex flex-col gap-3 text-foreground/80"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              {contributions.map((item) => (
                <li
                  key={item}
                  className="card-row text-sm"
                >
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            className="surface-card p-6 flex flex-col justify-between"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <div>
              <motion.p
                className="text-xs uppercase tracking-[0.3em] text-foreground/50 mb-2"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                Collaborate
              </motion.p>
              <motion.h2
                className="text-2xl font-semibold mb-3"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                Interested in teaming up?
              </motion.h2>
              <motion.p
                className="text-sm text-foreground/70"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                I work with researchers and product teams on diffusion modelling,
                moderation strategy, and responsible experimentation with social data.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-2 mt-4"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
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
            </motion.div>
          </motion.div>
        </section>
      </motion.main>
      <Footer className="mb-4" />
    </div>
  );
}
