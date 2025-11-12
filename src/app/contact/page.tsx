"use client";

import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Github,
  Linkedin,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cardVariants, containerVariants, iconVariants, textVariants } from "@/lib/animation/variants";
import { contactInfo } from "@/lib/constants/contact";
import { socials } from "@/lib/constants/socials";
import { GoogleScholarIcon, OrcidIcon } from "@/components/icons/AcademicIcons";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-auto lg:overflow-hidden">
      <Navbar />
      <motion.main
        className="flex-1 flex flex-col gap-4 px-2 md:px-4 lg:px-6 pb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            className="bg-card rounded-[20px] p-6 flex flex-col gap-6"
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
              Contact
            </motion.p>
            <motion.h1
              className="text-3xl md:text-4xl font-semibold leading-tight"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Let&apos;s collaborate on trustworthy machine learning.
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-foreground/80"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Whether you&apos;re exploring misinformation detection, data-centric
              pipelines, or looking for a speaker, feel free to reach out.
            </motion.p>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: contactInfo.email,
                  link: `mailto:${contactInfo.email}`,
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: contactInfo.phone,
                  link: `tel:${contactInfo.phoneRaw}`,
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: contactInfo.location,
                },
                {
                  icon: Clock,
                  label: "Availability",
                  value: contactInfo.availability,
                },
              ].map(({ icon: Icon, label, value, link }) => (
                <motion.a
                  key={label}
                  className="rounded-[16px] border border-border bg-background/40 px-4 py-4 flex flex-col gap-1"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: link ? 1.02 : 1 }}
                  href={link}
                >
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">
                    <Icon size={16} />
                    <span>{label}</span>
                  </div>
                  <p className="text-lg font-medium text-foreground/90">{value}</p>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-foreground text-background rounded-[20px] p-6 flex flex-col gap-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              className="text-2xl font-semibold"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Scheduling policy
            </motion.h2>
            <motion.p
              className="text-sm text-background/80"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Meetings are available Monday to Friday between 10:00–17:00 AEDT (with a lunch
              break between 12:00–13:30). Use the “Contact me” button to pick a real-time slot—
              the modal includes all upcoming availability, so this section stays clutter-free.
            </motion.p>
            <motion.div
              className="rounded-[16px] border border-background/30 px-4 py-4 flex gap-3 items-center"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              <MessageCircle size={20} />
              <p className="text-sm">
                Need an urgent chat? Mention the topic in your email subject for a quicker response.
              </p>
            </motion.div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            className="bg-card rounded-[20px] p-6 flex flex-col gap-4 lg:col-span-2"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              className="text-2xl font-semibold"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Project & research enquiries
            </motion.h2>
            <motion.p
              className="text-foreground/80 text-sm"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Provide a short brief covering goals, timeline, collaborators, and
              technical constraints. I typically respond within 48 hours.
            </motion.p>
            <motion.ul
              className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-foreground/80"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <li className="rounded-[16px] border border-border px-4 py-3 bg-background/40">
                • Data integrity audits & noisy-label pipelines
              </li>
              <li className="rounded-[16px] border border-border px-4 py-3 bg-background/40">
                • Trust & safety assessments for LLM deployments
              </li>
              <li className="rounded-[16px] border border-border px-4 py-3 bg-background/40">
                • Research mentorship & reading groups
              </li>
              <li className="rounded-[16px] border border-border px-4 py-3 bg-background/40">
                • Talks/workshops on data-centric AI
              </li>
            </motion.ul>
          </motion.div>

          <motion.div
            className="bg-foreground text-background rounded-[20px] p-6 flex flex-col gap-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h3
              className="text-xl font-semibold"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Social channels
            </motion.h3>
            <motion.div
              className="flex flex-col gap-3"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { label: "LinkedIn", href: socials.linkedin, icon: <Linkedin size={18} /> },
                { label: "Google Scholar", href: socials.googleScholar, icon: <GoogleScholarIcon className="w-5 h-5" /> },
                { label: "ORCID", href: socials.orcid, icon: <OrcidIcon className="w-5 h-5" /> },
                { label: "GitHub", href: socials.github, icon: <Github size={18} /> },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-background/30 rounded-[16px] px-4 py-3 hover:bg-background/10 transition-colors"
                >
                  {icon}
                  <span>{label}</span>
                </a>
              ))}
            </motion.div>
          </motion.div>
        </section>
      </motion.main>
      <Footer className="mb-4" />
    </div>
  );
}
