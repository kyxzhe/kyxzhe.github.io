"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { heroVariants, textVariants, iconVariants } from "@/lib/animation/variants";
import { heroContent } from "@/lib/constants/siteContent";

export default function HeroSection() {
  return (
    <motion.div 
      className="w-full lg:w-[65%] bg-card rounded-[20px] flex flex-col items-start justify-between p-6 min-h-[250px] lg:min-h-0"
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <Image
          src="/svgs/Vector2.svg"
          alt="Lavanya Yasmeen"
          width={150}
          height={150}
          className="w-12 lg:w-auto self-end"
        />
      </motion.div>
      <motion.div 
        className="flex flex-col"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-[1]">{heroContent.line1}</h1>
        <h1 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-[1]">{heroContent.line2Prefix} <span className="italic font-light">{heroContent.line2Emphasis}</span>{heroContent.line2Suffix}</h1>
        <h1 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-[1]">{heroContent.line3}</h1>
      </motion.div>
    </motion.div>
  );
}