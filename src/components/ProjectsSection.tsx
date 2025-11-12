"use client";

import Image from "next/image";
import { ArrowUpRight, Instagram, Twitter, Linkedin } from "lucide-react";
import { motion } from "motion/react";
import { cardVariants, projectsVariants, projectItemVariants, socialVariants, textVariants, iconVariants } from "@/lib/animation/variants";
import { projects } from "@/lib/constants/projects";
import { socials } from "@/lib/constants/socials";

export default function ProjectsSection() {
  return (
    <div className="flex flex-col w-full lg:w-[30%] gap-4 md:justify-between lg:mb-6 overflow-x-hidden">
      {/* === CARD 3: Projects List === */}
      <motion.div 
        className="bg-foreground text-background p-4 md:p-6 rounded-[20px] flex-grow md:flex-wrap flex flex-col min-h-[400px] md:min-h-0"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <div className="flex justify-between items-center mb-4">
          <motion.h2 
            className="text-xl md:text-2xl font-medium"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            {projects[0].name}
          </motion.h2>
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
            src={projects[0].imgSrc}
            alt={`${projects[0].name} Project Showcase`}
            width={300}
            height={170}
            priority
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div 
          className="overflow-y-auto lg:flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          variants={projectsVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.slice(1).map((project) => (
            <motion.div 
              key={project.name}
              variants={projectItemVariants}
              whileHover="hover"
            >
              <hr className="border-0 h-[1px] bg-accent" />
              <div className="flex justify-between items-center group cursor-pointer p-2 md:p-4">
                <span className="text-lg md:text-xl">{project.name}</span>
                <div className="flex items-center">
                  <Image src={project.imgSrc} alt={project.name} width={60} height={36} loading="lazy" quality={80} className="md:w-[100px] md:h-[68px] lg:w-[80px] lg:h-[48px] rounded-lg object-cover" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <motion.div 
        className="flex-none bg-card p-6 md:p-9 rounded-[20px] flex justify-evenly items-center"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.a 
          href={socials.instagram} 
          className="text-light hover:text-accent transition-colors"
          variants={socialVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Instagram size={20} />
        </motion.a>
        <motion.a 
          href={socials.twitter} 
          className="text-light hover:text-accent transition-colors"
          variants={socialVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Twitter size={20} />
        </motion.a>
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
      </motion.div>
    </div>
  );
}