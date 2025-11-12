"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { imageVariants } from "@/lib/animation/variants";
import { personImage } from "@/lib/constants/siteContent";

export default function PersonImageSection() {
  return (
    <motion.div 
      className="w-full lg:w-[40%] bg-card rounded-[20px] overflow-hidden h-[40vh] md:h-[50vh] lg:h-auto"
      variants={imageVariants}
      initial="hidden"
      animate="visible"
    >
      <Image
        src={personImage.src}
        alt={personImage.alt}
        width={660}
        height={952}
        priority
        quality={100}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}