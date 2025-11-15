"use client";

import Link from "next/link";
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

const contactIntro = `Most collaborations start with a short note that mixes the problem, the people, and the constraints. Email works best so I can digest the context, then we can jump on a call once the questions are clear.`;

const quickFacts = [
  { value: "< 48h", label: "Average reply" },
  { value: "10:00–17:00 AEDT", label: "Office hours" },
];

const contactChannels = [
  {
    label: "Email",
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
    description: "Fastest route for collaborations and speaking invites.",
    icon: Mail,
  },
  {
    label: "Phone / Signal",
    value: contactInfo.phone,
    href: `tel:${contactInfo.phoneRaw}`,
    description: "Send a quick text before calling so I can step out of labs.",
    icon: Phone,
  },
  {
    label: "Location",
    value: contactInfo.location,
    description: "Sydney based, remote friendly across APAC & EU time zones.",
    icon: MapPin,
  },
  {
    label: "Focus",
    value: contactInfo.availability,
    description: "Preview the goals + data realities and I'll tailor the response.",
    icon: Clock,
  },
];

const schedulingNotes = [
  {
    title: "Context first",
    detail: "Share problem framing, stakeholders, and success signals so I can prep useful questions.",
  },
  {
    title: "Async friendly",
    detail: "I recap key points via email/Notion after calls for visibility across teams.",
  },
  {
    title: "Urgent signals",
    detail: "Flag deadlines in the subject line; I triage inboxes daily at 09:00 AEDT.",
  },
];

const collaborationFocus = [
  "Diffusion modelling & intervention strategy",
  "Robust learning under noisy or biased supervision",
  "Designing reading groups, guest lectures, or mentoring",
  "Evaluating ranking + moderation pipelines",
];

const socialLinks = [
  { label: "LinkedIn", href: socials.linkedin, icon: <Linkedin size={18} /> },
  { label: "Google Scholar", href: socials.googleScholar, icon: <GoogleScholarIcon className="w-5 h-5" /> },
  { label: "ORCID", href: socials.orcid, icon: <OrcidIcon className="w-5 h-5" /> },
  { label: "GitHub", href: socials.github, icon: <Github size={18} /> },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-visible">
      <Navbar />
      <motion.main
        className="flex-1 flex flex-col items-center gap-16 px-4 md:px-16 lg:px-24 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section
          className="max-w-4xl w-full flex flex-col gap-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact Kevin</p>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">Let&rsquo;s make research conversational</h1>
            <p className="text-base md:text-lg text-foreground/80 whitespace-pre-line leading-relaxed">{contactIntro}</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-foreground/70">
            <span>📍 {contactInfo.location}</span>
            <span>🕘 AEDT · async updates welcome</span>
            <span>🧠 Social data, ranking systems, people ops</span>
          </div>
          <div className="grid grid-cols-2 sm:max-w-sm gap-6">
            {quickFacts.map((fact) => (
              <div key={fact.label}>
                <p className="text-4xl font-semibold leading-none">{fact.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-3">{fact.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`mailto:${contactInfo.email}`}
              className="btn-primary inline-flex justify-center"
            >
              Email Kevin
            </Link>
            <Link
              href="/"
              className="text-foreground/60 text-center underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Back to work overview
            </Link>
          </div>
        </motion.section>

        <motion.section
          className="w-full max-w-5xl grid gap-10 lg:grid-cols-[2fr_1fr]"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="surface-card p-6 flex flex-col gap-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Reach out</p>
              <h2 className="text-2xl font-semibold">Preferred channels</h2>
              <p className="text-sm text-foreground/70">Pick the lane that fits your project; I&rsquo;ll route you to the right medium if we need deeper dives.</p>
            </div>
            <div className="grid gap-4">
              {contactChannels.map(({ label, value, description, href, icon: Icon }) => (
                href ? (
                  <Link
                    key={label}
                    href={href}
                    className="surface-card border border-border px-4 py-4 rounded-xl flex flex-col gap-2 hover:border-foreground/50 transition"
                  >
                    <div className="flex items-center justify-between gap-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Icon size={16} />
                        <span>{label}</span>
                      </div>
                      <span>↗</span>
                    </div>
                    <p className="text-lg font-medium text-foreground">{value}</p>
                    <p className="text-sm text-foreground/70 leading-relaxed">{description}</p>
                  </Link>
                ) : (
                  <div
                    key={label}
                    className="surface-card border border-border px-4 py-4 rounded-xl flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">
                      <Icon size={16} />
                      <span>{label}</span>
                    </div>
                    <p className="text-lg font-medium text-foreground">{value}</p>
                    <p className="text-sm text-foreground/70 leading-relaxed">{description}</p>
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="surface-card p-6 flex flex-col gap-5">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Scheduling</p>
              <h3 className="text-xl font-semibold">How I plan calls</h3>
            </div>
            <div className="space-y-4 text-sm text-foreground/80">
              {schedulingNotes.map((note) => (
                <div key={note.title} className="space-y-1">
                  <p className="font-medium">{note.title}</p>
                  <p className="text-foreground/70 leading-relaxed">{note.detail}</p>
                </div>
              ))}
            </div>
            <div className="surface-card px-4 py-4 flex gap-3 items-start text-sm text-foreground/80 bg-[var(--accent-soft)]">
              <MessageCircle size={18} className="text-[var(--accent)]" />
              <p>Need a quick sync? Mention the urgency in your subject line and I&rsquo;ll prioritise the reply.</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="w-full max-w-5xl grid gap-12 lg:grid-cols-2"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Project fit</p>
            <h2 className="text-2xl font-semibold">What I&rsquo;m most helpful with</h2>
            <p className="text-sm text-foreground/70 leading-relaxed">
              I collaborate with researchers, civic orgs, and product teams who need rigorous takes on social data problems. Bring messy datasets, moderation decisions, or ranking questions.
            </p>
            <ul className="space-y-3 text-sm text-foreground/80">
              {collaborationFocus.map((focus) => (
                <li key={focus} className="pill border border-border px-4 py-3 bg-[var(--accent-soft)] text-[var(--accent)]">
                  • {focus}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Elsewhere</p>
            <h2 className="text-2xl font-semibold">Connect online</h2>
            <div className="space-y-3">
              {socialLinks.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-row hoverable gap-3"
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              I share drafts, slides, and reading group notes across these channels. Add a quick line about how you&rsquo;d like to collaborate.
            </p>
          </div>
        </motion.section>
      </motion.main>
      <Footer className="mb-4" />
    </div>
  );
}
