"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, CalendarDays, Linkedin, Github } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contactInfo } from "@/lib/constants/contact";
import { socials } from "@/lib/constants/socials";
import { GoogleScholarIcon, OrcidIcon } from "@/components/icons/AcademicIcons";
import ContactModal from "@/components/ContactModal";

const directLines = [
  {
    label: "Email",
    value: contactInfo.email,
    hint: "Fastest for research and speaking invites.",
    href: `mailto:${contactInfo.email}`,
    icon: Mail,
  },
  {
    label: "Phone / Signal",
    value: contactInfo.phone,
    hint: "Text first if possible; I reply within Sydney daytime.",
    href: `tel:${contactInfo.phoneRaw}`,
    icon: Phone,
  },
  {
    label: "Location",
    value: contactInfo.location,
    hint: "Sydney based; async friendly across APAC & EU.",
    icon: MapPin,
  },
];

const replyNotes = [
  "Who is deciding and by when?",
  "Flag urgency in the subject; I triage at 09:00 & 16:00 AEDT.",
];

const collaborationAreas = [
  "Diffusion experiments & intervention design",
  "Robust learning with noisy or biased supervision",
  "Ranking / moderation evaluation support",
];

const socialLinks = [
  { label: "LinkedIn", href: socials.linkedin, icon: <Linkedin size={16} /> },
  { label: "Google Scholar", href: socials.googleScholar, icon: <GoogleScholarIcon className="w-4 h-4" /> },
  { label: "ORCID", href: socials.orcid, icon: <OrcidIcon className="w-4 h-4" /> },
  { label: "GitHub", href: socials.github, icon: <Github size={16} /> },
];

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#141414] dark:bg-[#0b0b0d] dark:text-[#f5f5f5]">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-5xl px-2 md:px-4 lg:px-0 py-10 flex flex-col gap-16">
        <section className="mt-2 space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact</p>
          <h1 className="text-[2.4rem] md:text-[2.6rem] font-semibold leading-tight text-foreground">
            Let&apos;s talk about social data and robust ML
          </h1>
          <p className="text-[15px] md:text-base text-muted-foreground max-w-2xl leading-relaxed">
            A quick note with the problem, constraints, and people involved helps me respond with next steps. Email is the clearest channel; we can schedule a call after the context is set.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`mailto:${contactInfo.email}`}
              className="px-6 md:px-7 py-3 rounded-full text-sm md:text-base font-semibold shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition duration-200 hover:-translate-y-[2px] bg-[#141414] text-white dark:bg-[#f5f5f5] dark:text-[#0b0b0d]"
            >
              Email Kevin
            </Link>
          </div>
        </section>

        <section className="grid gap-14 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Direct lines</p>
            <div className="border-y border-[rgba(0,0,0,0.08)] dark:border-white/15 divide-y divide-[rgba(0,0,0,0.08)] dark:divide-white/15">
              {directLines.map(({ label, value, hint, href, icon: Icon }) => {
                const Row = (
                  <div className="flex flex-col gap-1 py-5">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                      {Icon && <Icon size={14} />}
                      <span>{label}</span>
                    </div>
                    <p className="text-lg font-medium text-foreground">{value}</p>
                    <p className="text-sm text-muted-foreground">{hint}</p>
                  </div>
                );

                return href ? (
                  <Link key={label} href={href} className="block hover:text-foreground transition-colors">
                    {Row}
                  </Link>
                ) : (
                  <div key={label}>{Row}</div>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Reply & scheduling</p>
            <div className="space-y-5 border border-[rgba(0,0,0,0.08)] dark:border-white/15 rounded-[18px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-foreground">Include stakeholders + timeline for a faster reply.</p>
                  <p className="text-sm text-muted-foreground">Inbox checks at 09:00 & 16:00 AEDT.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.22em] bg-[var(--pill-background)] text-muted-foreground">
                  <span className="text-foreground">AEDT</span>
                </span>
              </div>
              <ul className="space-y-3 text-sm text-foreground/80 leading-relaxed">
                {replyNotes.map((note) => (
                  <li key={note} className="flex gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border text-sm md:text-base font-semibold transition duration-200 hover:-translate-y-[1px] border-[rgba(0,0,0,0.12)] bg-white text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.06)] dark:border-[#666] dark:bg-[#1a1a1d] dark:text-white dark:shadow-[0_10px_24px_rgba(0,0,0,0.3)] py-3"
              >
                <CalendarDays size={16} />
                Schedule a slot
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-14 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Collaboration fit</p>
            <h2 className="text-xl font-semibold text-foreground">Where I add value</h2>
            <ul className="space-y-3 text-sm text-foreground/80 leading-relaxed">
              {collaborationAreas.map((area) => (
                <li key={area} className="flex gap-2">
                  <span className="text-[var(--accent)]">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Profiles</p>
            <h2 className="text-xl font-semibold text-foreground">Find me elsewhere</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-[rgba(0,0,0,0.12)] dark:border-white/20 rounded-full text-sm font-medium hover:-translate-y-[1px] transition"
                >
                  <span>{label}</span>
                  {icon}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer className="mb-4" />
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startInSchedule
      />
    </div>
  );
}
