"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import { modalVariants, backdropVariants, textVariants, iconVariants } from "@/lib/animation/variants";
import { contactInfo } from "@/lib/constants/contact";
import { socials } from "@/lib/constants/socials";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-card rounded-[20px] p-6 md:p-8 lg:p-12 border-3 border-accent w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-6 right-6 p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors z-10"
              onClick={onClose}
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <X size={24} className="text-foreground" />
            </motion.button>

            {/* Header */}
            <motion.div
              className="text-center mb-8 md:mb-12"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-medium mb-4">
                Contact me
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Let&apos;s work together and create something amazing
              </p>
            </motion.div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
              {/* Email */}
              <motion.div
                className="flex items-center gap-4 p-4 rounded-lg bg-background/5 hover:bg-background/10 transition-colors cursor-pointer"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                onClick={() => window.open(`mailto:${contactInfo.email}`)}
              >
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Mail size={24} className="text-brand-accent" />
                </motion.div>
                <div>
                  <h3 className="font-medium text-lg">Email</h3>
                  <p className="text-muted-foreground">{contactInfo.email}</p>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                className="flex items-center gap-4 p-4 rounded-lg bg-background/5 hover:bg-background/10 transition-colors cursor-pointer"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                onClick={() => window.open(`tel:${contactInfo.phoneRaw}`)}
              >
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Phone size={24} className="text-brand-accent" />
                </motion.div>
                <div>
                  <h3 className="font-medium text-lg">Phone</h3>
                  <p className="text-muted-foreground">{contactInfo.phone}</p>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                className="flex items-center gap-4 p-4 rounded-lg bg-background/5"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <MapPin size={24} className="text-brand-accent" />
                </motion.div>
                <div>
                  <h3 className="font-medium text-lg">Location</h3>
                  <p className="text-muted-foreground">{contactInfo.location}</p>
                </div>
              </motion.div>

              {/* Availability */}
              <motion.div
                className="flex items-center gap-4 p-4 rounded-lg bg-background/5"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="w-3 h-3 bg-green-500 rounded-full"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                />
                <div>
                  <h3 className="font-medium text-lg">Availability</h3>
                  <p className="text-muted-foreground">{contactInfo.availability}</p>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <motion.div
              className="border-t border-border pt-6"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xl font-medium mb-4 text-center">Connect with me</h3>
              <div className="flex justify-center gap-4">
                {[
                  { icon: Github, href: socials.github, label: "GitHub" },
                  { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
                  { icon: Twitter, href: socials.twitter, label: "Twitter" },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <Icon size={24} className="text-brand-accent" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}