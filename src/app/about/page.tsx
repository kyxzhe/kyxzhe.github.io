"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contactInfo } from "@/lib/constants/contact";
import {
  aboutIntro,
  collaborationPitch,
  contributions,
  researchFocus,
  timeline,
} from "@/lib/constants/about";
import {
  cardVariants,
  containerVariants,
} from "@/lib/animation/variants";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans font-normal pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-visible">
      <Navbar />
      <motion.main
        className="flex-1 flex flex-col items-center gap-16 px-4 md:px-16 lg:px-24 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section
          className="max-w-4xl w-full flex flex-col gap-12"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">About Kevin</p>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-medium leading-tight">Research first, people in mind</h1>
              <p className="text-[17px] text-foreground whitespace-pre-line leading-relaxed">{aboutIntro}</p>
            </div>
            <div className="flex flex-col gap-4 text-sm text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <span className="dark:text-[rgba(255,255,255,0.8)]">📍 Sydney based</span>
                <span className="dark:text-[rgba(255,255,255,0.8)]">🏛 Behavioural Data Science Lab @ UTS</span>
                <span className="dark:text-[rgba(255,255,255,0.8)]">🧑‍🏫 Teaching ML + Data Science @ USYD</span>
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Focus areas</p>
              <div className="space-y-4 text-[17px]">
                {researchFocus.map((item) => (
                  <p key={item} className="text-foreground dark:text-white">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">At a glance</p>
              <div className="flex gap-12">
                <div>
                  <p className="text-4xl font-medium leading-none">4</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] mt-3 dark:text-[rgba(255,255,255,0.8)]">Lab talks</p>
                </div>
                <div>
                  <p className="text-4xl font-medium leading-none">2</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] mt-3 dark:text-[rgba(255,255,255,0.8)]">Manuscripts</p>
                </div>
              </div>
              <div className="text-sm text-foreground/70 leading-relaxed" />
            </div>
          </div>
        </motion.section>

        <section className="w-full max-w-4xl mx-auto space-y-20">
          <div className="space-y-10">
            <div className="space-y-2">
              <p className="text-[14px] uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Story so far</p>
              <h2 className="text-[30px] font-medium">Timeline</h2>
            </div>
            <div className="space-y-8">
              {timeline.map((item) => (
                <div key={item.title} className="space-y-2">
                  <p className="text-[14px] uppercase tracking-[0.2em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
                    {item.period}
                  </p>
                  <h3 className="text-[17px] font-medium">{item.title}</h3>
                  <p className="text-[14px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">{item.org}</p>
                  <p className="text-[14px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Community</p>
              <h2 className="text-[30px] font-medium">Teaching & sharing</h2>
              <ul className="space-y-3 text-[17px]">
                {contributions.map((item) => (
                  <li key={item} className="text-black dark:text-white">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Collaborate</p>
              <h2 className="text-[30px] font-medium">Open to thoughtful work</h2>
              <p className="text-[17px] text-black dark:text-white leading-relaxed">
                {collaborationPitch}
              </p>
              <div className="flex flex-col gap-2 text-sm max-w-xs mx-auto items-center">
                <Link
                  href={`mailto:${contactInfo.email}`}
                  className="btn-primary inline-flex justify-center dark:bg-white dark:text-[#0b0b0d] font-medium shadow-[0_1px_6px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.24)]"
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
