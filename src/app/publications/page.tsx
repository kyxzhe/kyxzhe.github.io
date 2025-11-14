"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, BookOpenCheck, Sparkles, ListChecks } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { publications } from "@/lib/constants/publications";
import { cardVariants, containerVariants, iconVariants, projectsVariants, textVariants } from "@/lib/animation/variants";

const metrics = [
  { label: "Preprints & manuscripts", value: "1" },
  { label: "Review assignments (ICLR/ICML/etc.)", value: "10+" },
  { label: "Citations", value: "2" },
];

export default function PublicationsPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6">
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
              Treating noisy supervision as a signal rather than a problem.
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-foreground/80"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              I’m currently focused on one core manuscript exploring how messy annotations can be reinterpreted to build more trustworthy models. Code, data traces, and replication materials are available on request.
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
              <li>Information diffusion, narrative emergence, and network interventions</li>
              <li>Robust learning under noisy, biased, or shifting labels</li>
              <li>Temporal and graph representations for social data</li>
              <li>Evaluation protocols for ranking and moderation systems</li>
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
              <li>Repurposed noisy annotations as useful guidance for downstream models.</li>
              <li>Built feature-space selection routines that control diffusion-induced shift.</li>
              <li>Paired platform audits with quantitative robustness measurements.</li>
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
              <li>Teaching assistant & guest lecturer for COMP5328/4328 and DATA1002/1902.</li>
              <li>Available for collaborations on diffusion, noisy-label learning, and teaching support.</li>
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
              whileHover={{ y: -6, boxShadow: "0 22px 48px rgba(0,0,0,0.14)" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
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
