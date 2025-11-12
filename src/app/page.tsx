"use client";

import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PersonImageSection from "@/components/PersonImageSection";
import AboutContactSection from "@/components/AboutContactSection";
import ProjectsSection from "@/components/ProjectsSection";
import { containerVariants } from "@/lib/animation/variants";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans py-4 md:py-6 lg:py-8 px-2 md:px-4 lg:px-6 overflow-auto lg:overflow-hidden gap-4">
      <Navbar />
      <motion.div 
        className="flex flex-col lg:flex-row flex-1 gap-4 pb-4 md:pb-0 lg:h-[calc(100vh-130px)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col w-full lg:w-[70%] gap-4 lg:mb-6">
          <div className="flex flex-col-reverse lg:flex-row gap-4 md:h-[60%]">
            <HeroSection />
            <PersonImageSection />
          </div>
          <AboutContactSection />
        </div>
        <ProjectsSection />
      </motion.div>
    </div>
  );
}
