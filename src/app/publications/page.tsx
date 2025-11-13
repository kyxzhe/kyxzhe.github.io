"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, BookOpenCheck, Sparkles, ListChecks } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { publications } from "@/lib/constants/publications";
import { cardVariants, containerVariants, iconVariants, projectsVariants, textVariants } from "@/lib/animation/variants";

const metrics = [
  { label: "Peer-reviewed & workshop papers", value: "8" },
  { label: "Review assignments (ICLR/ICML/etc.)", value: "25+" },
  { label: "Invited talks & lectures", value: "15+" },
];

export default function PublicationsPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-auto lg:overflow-hidden">
      <Navbar />
      <motion.main
        className="flex-1 flex flex-col gap-4 px-2 md:px-4 lg:px-6 pb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            className="surface-card p-6 flex flex-col gap-4 lg:col-span-2"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              className="uppercase tracking-[0.3em] text-xs text-muted-foreground"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Publications
            </motion.p>
            <motion.h1
              className="text-3xl md:text-4xl font-semibold leading-tight"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Researching reliable learning systems from noise-aware data curation to safety evaluations.
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-foreground/80"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Below is a snapshot of recent manuscripts. Detailed versions, artefacts, and code are available on request.
            </motion.p>
          </motion.div>
          <motion.div
            className="surface-card p-6 flex flex-col gap-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            {metrics.map((metric) => (
              <motion.div
                key={metric.label}
                className="card-row flex-col items-start"
                variants={iconVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-3xl font-semibold">{metric.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">
                  {metric.label}
                </p>
              </motion.div>
            ))}
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
              className="text-2xl font-semibold flex items-center gap-2"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <BookOpenCheck size={20} />
              Areas of interest
            </motion.h2>
            <motion.ul
              className="flex flex-col gap-3 text-sm text-foreground/70"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <li>Robust learning under label noise & adversarial shifts</li>
              <li>Probabilistic modelling for weak supervision</li>
              <li>Trust & safety measurements for LLM deployments</li>
              <li>Learning theory & generalisation bounds in practice</li>
            </motion.ul>
          </motion.div>

          <motion.div
            className="surface-card p-6 flex flex-col gap-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              className="text-2xl font-semibold flex items-center gap-2"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <Sparkles size={20} />
              Impact highlights
            </motion.h2>
            <motion.ul
              className="flex flex-col gap-3 text-sm text-foreground/80"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <li>Improved noisy label baselines by 7% on curated benchmarks.</li>
              <li>Designed Bayesian transitions now referenced in partial-label tutorials.</li>
              <li>Developed continual learning prototype used in safety evaluations.</li>
            </motion.ul>
          </motion.div>

          <motion.div
            className="surface-card p-6 flex flex-col gap-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              className="text-2xl font-semibold flex items-center gap-2"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <ListChecks size={20} />
              Services
            </motion.h2>
            <motion.ul
              className="flex flex-col gap-3 text-sm text-foreground/80"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <li>Reviewer: ICLR, ICML, CVPR, AAAI, ACMMM.</li>
              <li>Session chair & organizer for ML theory reading groups.</li>
              <li>Mentor for honours theses on data-centric AI.</li>
            </motion.ul>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          {publications.map((pub) => (
            <motion.div
              key={pub.title}
              className="surface-card p-6 flex flex-col gap-4"
              variants={projectsVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {pub.year} · {pub.venue}
                  </p>
                  <h3 className="text-2xl font-semibold">{pub.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pub.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs uppercase tracking-[0.25em] px-3 py-1 rounded-full border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-foreground/80 text-sm md:text-base">{pub.summary}</p>
              <div className="flex items-center gap-4">
                {pub.link && (
                  <Link
                    href={pub.link}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View artefact <ArrowUpRight size={16} />
                  </Link>
                )}
                {pub.status && (
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {pub.status}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </section>
      </motion.main>
      <Footer className="mb-4" />
    </div>
  );
}
