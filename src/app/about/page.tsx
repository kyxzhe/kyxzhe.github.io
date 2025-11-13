"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { aboutDescription } from "@/lib/constants/siteContent";
import { contactInfo } from "@/lib/constants/contact";
import {
  cardVariants,
  containerVariants,
  iconVariants,
  textVariants,
} from "@/lib/animation/variants";

const timeline = [
  {
    title: "PhD — Trustworthy Machine Learning",
    org: "University of Technology Sydney",
    period: "2025 – Present",
    detail:
      "Researching misinformation detection, robust learning, and generalisation theory with Trustworthy ML Lab.",
  },
  {
    title: "B.Adv. Computing (Honours) & B.Sc.",
    org: "The University of Sydney",
    period: "2021 – 2025",
    detail:
      "Double degree in Computational Data Science & Mathematics. Dalyell Scholar, University Medal.",
  },
  {
    title: "Worldwide Exchange Programme",
    org: "ETH Zürich",
    period: "2023 – 2024",
    detail:
      "Focused on mathematical foundations for machine learning theory during semester abroad.",
  },
];

const researchFocus = [
  "Noisy label learning & reliability audits",
  "Semi/partial-label and continual learning systems",
  "Large-scale misinformation & content integrity",
  "Interpretable optimisation + statistical learning theory",
];

const contributions = [
  "Reviewer: ICLR · ICML · CVPR · AAAI · ACMMM",
  "Lecturer/tutor for COMP5328 Advanced ML",
  "Built PyTorch research pipelines end-to-end",
  "Led NeurIPS-style independent research projects",
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-auto lg:overflow-hidden">
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
                Building trustworthy AI systems grounded in theory and real-world impact.
              </motion.h1>
              <motion.p
                className="text-base md:text-lg text-foreground/80"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                {aboutDescription}
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
            className="glass-panel text-foreground p-6 flex flex-col justify-between"
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
                Researcher · Lecturer · Collaborator
              </motion.h2>
              <motion.ul
                className="flex flex-col gap-3 text-sm text-foreground/70"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <li>📍 Based in Sydney, Australia</li>
                <li>🏛 Trustworthy Machine Learning Lab (UTS)</li>
                <li>🧑‍🏫 COMP5328 Advanced ML teaching team</li>
                <li>📰 Focus on robust learning & misinformation</li>
              </motion.ul>
            </div>
            <motion.div
              className="mt-6 grid grid-cols-2 gap-3"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-background/10 rounded-[16px] p-4 text-center">
                <p className="text-3xl font-semibold">15+</p>
                <p className="text-xs uppercase tracking-[0.3em]">Talks</p>
              </div>
              <div className="bg-background/10 rounded-[16px] p-4 text-center">
                <p className="text-3xl font-semibold">8</p>
                <p className="text-xs uppercase tracking-[0.3em]">Papers</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            className="glass-panel text-foreground p-6 flex flex-col gap-4"
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
              Contributions
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
                  className="bg-background/40 border border-background/10 rounded-[16px] px-4 py-3 text-sm"
                >
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            className="glass-panel text-foreground rounded-[20px] p-6 flex flex-col justify-between"
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
                I work with research labs and product teams on data-centric ML,
                safety reviews, and technical storytelling for advanced AI.
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
