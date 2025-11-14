"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { cardVariants, textVariants, iconVariants, contactCardVariants } from "@/lib/animation/variants";
import ContactModal from "./ContactModal";
import { aboutDescription } from "@/lib/constants/siteContent";

export default function AboutContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div id="contact" className="flex flex-col lg:flex-row gap-4 min-h-[200px]">
      <Link href="/about" className="w-full lg:w-[50%]" aria-label="Learn more about Kevin">
        <motion.div 
          className="surface-card text-foreground flex flex-col items-start justify-between p-3 md:p-6 gap-4 h-full"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <motion.div
            variants={iconVariants}
            initial="hidden"
            animate="visible"
          >
            <Image
              src="/svgs/Vector.svg"
              alt="Monogram icon"
              width={120}
              height={120}
              className="w-10 md:w-16 lg:w-20"
              priority
            />
          </motion.div>
          <motion.p 
            className="text-sm md:text-xl lg:text-lg xl:text-xl 2xl:text-2xl"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            {aboutDescription}
          </motion.p>
        </motion.div>
      </Link>
      <motion.div 
        className="w-full lg:w-[50%] surface-card p-3 md:p-6 flex flex-col h-full justify-between cursor-pointer"
        variants={contactCardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="clicked"
        onClick={handleContactClick}
      >
        <div className="flex justify-between items-center mb-2 md:mb-4">
          <motion.div 
            className="flex flex-col"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-sm md:text-lg lg:text-xl font-light">Have some</h2>
            <h2 className="text-sm md:text-lg lg:text-xl font-light">questions?</h2>
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
        <motion.h1 
          className="text-xl md:text-3xl lg:text-4xl xl:text-6xl font-medium"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Contact me
        </motion.h1>
      </motion.div>
      
      <ContactModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
