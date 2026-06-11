"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { motion } from "motion/react";
import { cardVariants, projectsVariants, projectItemVariants, socialVariants, textVariants, iconVariants } from "@/lib/animation/variants";
import { newsItems } from "@/lib/constants/news";
import { socials } from "@/lib/constants/socials";
import { GoogleScholarWordmarkIcon, OrcidIcon } from "@/components/icons/AcademicIcons";

export default function ProjectsSection() {
  const router = useRouter();
  const [headline, ...others] = newsItems;
  return (
    <div id="projects" className="flex flex-col w-full lg:w-[30%] gap-4 md:justify-between lg:mb-6 overflow-visible">
      {/* === CARD 3: Projects List === */}
      <motion.div 
        className="surface-card text-foreground p-4 md:p-6 flex-grow md:flex-wrap flex flex-col min-h-[420px] md:min-h-0"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        role="link"
        tabIndex={0}
        aria-label="Explore Lab News"
        onClick={() => router.push("/news")}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            router.push("/news");
          }
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.div 
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">Lab News</p>
            <h2 className="text-xl md:text-2xl font-medium">{headline.title}</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{headline.date}</p>
          </motion.div>
          <motion.div
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <ArrowUpRight className="text-brand-accent" size={24} />
          </motion.div>
        </div>
        <motion.div 
          className="h-[200px] md:h-[50%] rounded-[20px] overflow-hidden mb-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Image
            src={headline.cover}
            alt={`${headline.title} visual`}
            width={300}
            height={170}
            priority
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.p 
          className="text-sm text-muted-foreground mb-4"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {headline.summary}
        </motion.p>
        <motion.div 
          className="flex items-center justify-between text-sm mb-4"
          variants={iconVariants}
          initial="hidden"
          animate="visible"
        >
          <a
            href={headline.link ?? "/news"}
            className="inline-flex items-center gap-2 text-brand-accent hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            Read more <ArrowUpRight size={16} />
          </a>
          <span className="text-foreground/60 uppercase tracking-[0.2em] text-xs">Latest</span>
        </motion.div>
        <motion.div
          className="flex-1 min-h-0 overflow-y-auto overscroll-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          variants={projectsVariants}
          initial="hidden"
          animate="visible"
          style={{ WebkitOverflowScrolling: "touch", overscrollBehaviorY: "auto" }}
        >
          {others.map((item) => (
            <motion.div key={item.title} variants={projectItemVariants} whileHover="hover">
              <hr className="border-0 h-[1px] bg-accent" />
              <div className="flex justify-between items-start group cursor-pointer p-3 md:p-4">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-[0.3em] text-foreground/40">{item.date}</span>
                  <span className="text-lg md:text-xl">{item.title}</span>
                  <p className="text-sm text-foreground/60 max-w-[220px]">{item.summary}</p>
                </div>
                <div className="flex items-center">
                  <Image src={item.cover} alt={item.title} width={60} height={36} loading="lazy" quality={80} className="md:w-[100px] md:h-[68px] lg:w-[80px] lg:h-[48px] rounded-lg object-cover" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <motion.div 
        className="flex-none surface-card p-6 md:p-9 flex justify-evenly items-center"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.a 
          href={socials.linkedin} 
          className="text-light hover:text-accent transition-colors"
          variants={socialVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Linkedin size={20} />
        </motion.a>
        <motion.a 
          href={socials.googleScholar} 
          className="text-light hover:text-accent transition-colors"
          variants={socialVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <GoogleScholarWordmarkIcon className="w-5 h-5" />
        </motion.a>
        <motion.a 
          href={socials.orcid} 
          className="text-light hover:text-accent transition-colors"
          variants={socialVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <OrcidIcon className="w-5 h-5" />
        </motion.a>
        <motion.a 
          href={socials.github} 
          className="text-light hover:text-accent transition-colors"
          variants={socialVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Github size={20} />
        </motion.a>
      </motion.div>
    </div>
  );
}
