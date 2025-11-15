"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, CalendarRange, Newspaper, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cardVariants, containerVariants, textVariants, projectsVariants } from "@/lib/animation/variants";
import { newsItems } from "@/lib/constants/news";

export default function NewsPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-visible">
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
              Lab logbook
            </motion.p>
            <motion.h1
              className="text-3xl md:text-4xl font-semibold leading-tight"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Milestones, credentials, and the side quests that keep research grounded.
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-foreground/80"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              From certifications and honours to field notes and new chapters, this logbook keeps the personal and professional timeline honest.
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-foreground/80">
              <div className="surface-card px-4 py-3 flex items-center gap-3">
                <CalendarRange size={18} />
                Quarterly refresh
              </div>
              <div className="surface-card px-4 py-3 flex items-center gap-3">
                <Newspaper size={18} />
                Research + life updates
              </div>
            </div>
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
              <Sparkles size={18} />
              Coming soon
            </motion.h2>
            <motion.p
              className="text-sm text-foreground/70"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              The chatbot module is learning to cite these entries so you can ask “How are the cascades behaving?” and get a grounded reply.
            </motion.p>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2 justify-center">
              Subscribe for updates <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          {newsItems.map((item) => (
            <motion.div
              key={item.title}
              className="surface-card p-6 flex flex-col gap-3"
              variants={projectsVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -6, boxShadow: "0 20px 45px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{item.date}</p>
                {item.link && (
                  <Link href={item.link} className="inline-flex items-center gap-2 text-sm text-brand-accent hover:underline">
                    {item.linkLabel ?? "Read more"} <ArrowUpRight size={14} />
                  </Link>
                )}
              </div>
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="text-foreground/80 text-sm md:text-base">{item.summary}</p>
            </motion.div>
          ))}
        </section>
      </motion.main>
      <Footer className="mb-4" />
    </div>
  );
}
