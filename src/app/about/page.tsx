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
    title: "PhD · University of Technology Sydney",
    org: "Behavioural Data Science Lab",
    period: "2025 – Present",
    detail:
      "Research in information diffusion and trustworthy machine learning.",
  },
  {
    title: "B.Adv. Computing (Honours) and B.Sc., University of Sydney",
    org: "Computational Data Science and Mathematics",
    period: "2021 – 2025",
    detail:
      "Honours Class I, University Medal in Advanced Computing, Dalyell Scholar.",
  },
  {
    title: "Exchange programme, ETH Zürich",
    org: "Computer science and mathematics",
    period: "2023 – 2024",
    detail:
      "One-semester exchange in computer science and mathematics.",
  },
  {
    title: "Foundation studies, University of Melbourne",
    org: "Psychology and mathematics",
    period: "2019 – 2021",
    detail: "Foundation coursework in psychology and mathematics.",
  },
];

const researchFocus = [
  "Information diffusion & online narrative dynamics",
  "Dynamic & temporal graph learning on social platforms",
  "Multimodal representation learning for text, images & video",
  "Misinformation & disinformation modelling",
];

const contributions = [
  "TA · 2024 S2 COMP5328/4328 Advanced Machine Learning",
  "TA · 2025 S2 DATA1002/1902 Informatics: Data and Computation",
  "Guest lecture on ChatGPT, training, and applications",
];

const aboutIntro = `I’m a PhD student at the University of Technology Sydney, working with Marian-Andrei Rizoiu in the Behavioural Data Science Lab. My research looks at how information spreads online and how to keep machine learning models a little more robust when faced with the messiness of the real world.

Before the PhD, I studied at the University of Sydney (and somehow graduated with a University Medal). Teaching data science and ML became a favourite way to understand tough ideas—there’s nothing like explaining a concept to realise where the gaps are.

Outside academia I’m usually carrying a film camera, hunting for the next coffee spot, or sweating it out at the gym. I rotate hobbies like archery, and I’m always down to trade recommendations for diving, skydiving, or the best flat white in Sydney. If you want to chat about research, photography, or travel-fuelled ideas, feel free to reach out.

If you’d like to talk about research, photography, or the eternal debate over the best flat white in Sydney, feel free to reach out!`;

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
            <p className="text-xs uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-white/60">About Kevin</p>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-medium leading-tight">Research first, people in mind</h1>
              <p className="text-[17px] text-foreground whitespace-pre-line leading-relaxed">{aboutIntro}</p>
            </div>
            <div className="flex flex-col gap-4 text-sm text-[rgba(0,0,0,0.6)] dark:text-foreground/70">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <span>📍 Sydney based</span>
                <span>🏛 Behavioural Data Science Lab @ UTS</span>
                <span>🧑‍🏫 Teaching ML + Data Science @ USYD</span>
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-muted-foreground">Focus areas</p>
          <div className="space-y-4 text-[17px]">
            {researchFocus.map((item) => (
              <p key={item} className="text-foreground dark:text-foreground/90">
                {item}
              </p>
            ))}
          </div>
            </div>
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-muted-foreground">At a glance</p>
              <div className="flex gap-12">
                <div>
                  <p className="text-4xl font-medium leading-none">4</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-3">Lab talks</p>
                </div>
                <div>
                  <p className="text-4xl font-medium leading-none">2</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-3">Manuscripts</p>
                </div>
              </div>
            <div className="text-sm text-foreground/70 leading-relaxed">
            </div>
          </div>
          </div>
        </motion.section>

        <section className="w-full max-w-4xl mx-auto space-y-20">
          <div className="space-y-10">
            <div className="space-y-2">
              <p className="text-[14px] uppercase tracking-[0.3em] text-muted-foreground">Story so far</p>
              <h2 className="text-[30px] font-medium">Timeline</h2>
            </div>
            <div className="space-y-8">
              {timeline.map((item) => (
                <div key={item.title} className="space-y-2">
                  <p className="text-[14px] uppercase tracking-[0.2em] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">
                    {item.period}
                  </p>
                  <h3 className="text-[17px] font-medium">{item.title}</h3>
                  <p className="text-[14px] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">{item.org}</p>
                  <p className="text-[14px] text-[rgba(0,0,0,0.6)] dark:text-foreground/70">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-muted-foreground">Community</p>
            <h2 className="text-[30px] font-medium">Teaching & sharing</h2>
              <ul className="space-y-3 text-[17px]">
                {contributions.map((item) => (
                  <li key={item} className="text-black dark:text-foreground/90">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-muted-foreground">Collaborate</p>
            <h2 className="text-[30px] font-medium">Open to thoughtful work</h2>
              <p className="text-[17px] text-black dark:text-foreground leading-relaxed">
                Open to research collaborations, talks, and teaching ideas.
                If you think I could be a good fit, feel free to get in touch.
              </p>
              <div className="flex flex-col gap-2 text-sm max-w-xs mx-auto items-center">
                <Link
                  href={`mailto:${contactInfo.email}`}
                  className="btn-primary inline-flex justify-center dark:bg-white dark:text-[#0b0b0d] font-medium"
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
