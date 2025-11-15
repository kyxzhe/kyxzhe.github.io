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
import { cardVariants, containerVariants } from "@/lib/animation/variants";
import { contactInfo } from "@/lib/constants/contact";
import { socials } from "@/lib/constants/socials";
import { GoogleScholarIcon, OrcidIcon } from "@/components/icons/AcademicIcons";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-visible">
      <Navbar />
      <motion.main
        className="flex-1 flex flex-col items-center gap-12 px-4 md:px-10 lg:px-20 py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section
          className="max-w-5xl w-full grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact Kevin</p>
              <h1 className="text-4xl font-semibold leading-tight">
                Let’s connect for research, teaching, or thoughtful products.
              </h1>
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                Email is still the fastest way to reach me. Share a bit of context and I’ll reply within two days—then we can jump onto a call if it helps.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
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
                <a
                  key={label}
                  className="rounded-2xl border border-border/60 px-5 py-4 flex flex-col gap-2 transition hover:border-foreground"
                  href={link}
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    <Icon size={16} />
                    <span>{label}</span>
                  </div>
                  <p className="text-lg font-medium text-foreground/90">{value}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="space-y-6 surface-card rounded-3xl p-6 border border-border/50">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Scheduling</p>
              <h2 className="text-2xl font-semibold">A lightweight policy</h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                I keep a few open windows between 10:00–17:00 AEDT (lunch reset 12:00–13:30). Send two or three time options with context and I’ll confirm within 48 hours.
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] px-4 py-4 flex gap-3 items-center">
              <MessageCircle size={20} />
              <p className="text-sm">Urgent? Flag the topic in your email subject and I’ll prioritise it.</p>
            </div>
          </div>
        </motion.section>

        <section className="max-w-5xl w-full grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            className="space-y-6"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Project enquiries</p>
              <h2 className="text-2xl font-semibold">What to include</h2>
              <p className="text-sm text-foreground/70">
                A concise brief makes collaboration smoother. I’m especially keen on work that touches social data, ranking, and responsible experimentation.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-foreground/80">
              <li className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Diffusion modelling, ranking interventions, or moderation pipelines.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Robust learning setups with noisy, biased, or shifting supervision.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Teaching, mentoring, or reading groups around social data systems.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Anything that needs thoughtful evaluation design.</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="space-y-5"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Elsewhere</p>
              <h3 className="text-xl font-semibold">Social channels</h3>
            </div>
            <div className="flex flex-col gap-3 text-sm">
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
                  className="flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3 transition hover:border-foreground"
                >
                  <span className="flex items-center gap-2">{icon}{label}</span>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Visit</span>
                </a>
              ))}
            </div>
          </motion.div>
        </section>
      </motion.main>
      <Footer className="mb-4" />
    </div>
  );
}
