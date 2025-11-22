"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, CalendarDays, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contactInfo } from "@/lib/constants/contact";
import { socials } from "@/lib/constants/socials";
import { GoogleScholarIcon, OrcidIcon } from "@/components/icons/AcademicIcons";
import ContactModal from "@/components/ContactModal";

const replyNotes = [
  "What is the topic and who is involved?",
  "Are there any deadlines or time zones I should know about?",
  "If it is urgent, please say so in the subject line.",
];

const collaborationAreas = [
  "Academic collaborations and joint papers",
  "Research talks, workshops, and guest teaching",
  "Sharing materials or datasets related to my work",
];

const socialLinks = [
  { label: "LinkedIn", href: socials.linkedin, icon: <LinkedInMonoIcon className="w-4 h-4" /> },
  { label: "Google Scholar", href: socials.googleScholar, icon: <GoogleScholarIcon className="w-4 h-4" /> },
  { label: "ORCID", href: socials.orcid, icon: <OrcidIcon className="w-4 h-4" /> },
  { label: "GitHub", href: socials.github, icon: <GitHubMonoIcon className="w-4 h-4" /> },
];

function LinkedInMonoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="LinkedIn"
      className={className}
    >
      <rect x="1" y="1" width="22" height="22" rx="4.5" fill="currentColor" />
      <path
        fill="#fff"
        d="M6.4 9.2h2.2V18H6.4V9.2Zm1.1-4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Zm3.4 4h2.1v1.2c.3-.6 1.1-1.3 2.4-1.3 1.9 0 2.8 1.1 2.8 3.2V18h-2.2v-4.8c0-1-.4-1.6-1.2-1.6-.9 0-1.5.6-1.5 1.7V18h-2.4V9.2Z"
      />
    </svg>
  );
}

function GitHubMonoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="GitHub"
      className={className}
      fill="currentColor"
    >
      <path d="M12 1.5c-5.8 0-10.5 4.7-10.5 10.5 0 4.6 3 8.5 7.2 9.9.5.1.7-.2.7-.5l-.01-2c-2.94.64-3.56-1.42-3.56-1.42-.45-1.14-1.1-1.44-1.1-1.44-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.37 1.09 2.95.83.09-.65.35-1.09.63-1.34-2.35-.27-4.82-1.17-4.82-5.2 0-1.15.41-2.08 1.03-2.81-.1-.26-.45-1.35.1-2.81 0 0 .88-.28 2.9 1.07a10.1 10.1 0 0 1 5.28 0c2.02-1.35 2.9-1.07 2.9-1.07.55 1.46.2 2.55.1 2.81.64.73 1.03 1.66 1.03 2.81 0 4.05-2.48 4.92-4.85 5.19.36.3.68.9.68 1.82l-.01 2.7c0 .3.2.6.7.5a10.52 10.52 0 0 0 7.16-9.99C22.5 6.2 17.8 1.5 12 1.5Z" />
    </svg>
  );
}

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCallInfo, setShowCallInfo] = useState(false);
  const directLines = [
    {
      label: "Email",
      value: contactInfo.email,
      hint: "Best for research, teaching, and collaboration enquiries.",
      href: `mailto:${contactInfo.email}`,
      icon: Mail,
    },
    {
      label: "Phone",
      value: "Request a call",
      hint: "I rarely answer calls. Please request and I will text first.",
      onClick: () => setShowCallInfo(true),
      icon: Phone,
    },
    {
      label: "Location",
      value: contactInfo.location,
      hint: "Based in Sydney. Happy to meet online across time zones.",
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-foreground dark:bg-[#0b0b0d] dark:text-[#f5f5f5] font-normal">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-5xl px-2 md:px-4 lg:px-0 py-10 flex flex-col gap-16">
        <section className="mt-2 space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-black">Contact</p>
          <h1 className="text-[2.4rem] md:text-[2.6rem] font-semibold leading-tight text-foreground">
            Get in touch
          </h1>
          <p className="text-[15px] md:text-base text-[rgba(0,0,0,0.6)] dark:text-black max-w-2xl leading-relaxed">
            For research, teaching, or collaboration enquiries, please email with a brief outline of the topic and any timelines. I will reply with clear next steps.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`mailto:${contactInfo.email}`}
              className="px-6 md:px-7 py-3 rounded-full text-sm md:text-base font-medium bg-[#141414] text-white dark:bg-[#f5f5f5] dark:text-[#0b0b0d] transition-colors duration-150 hover:opacity-90"
            >
              Email Kevin
            </Link>
          </div>
        </section>

        <section className="grid gap-14 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-black">Direct lines</p>
            <div className="border-y border-[rgba(0,0,0,0.08)] dark:border-white/15">
              {directLines.map(({ label, value, hint, href, onClick, icon: Icon }, idx) => {
                const clickable = Boolean(href || onClick);
                const Row = (
                  <div
                    className={`flex flex-col gap-1 py-5 border-b border-[rgba(0,0,0,0.08)] dark:border-white/20 transition-colors hover:border-foreground/70 ${
                      idx === directLines.length - 1 ? "border-b-0" : ""
                    } ${clickable ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-[rgba(0,0,0,0.6)] dark:text-black">
                      {Icon && <Icon size={14} />}
                      <span>{label}</span>
                    </div>
                    <p className="text-lg font-medium text-foreground">{value}</p>
                    <p className="text-sm text-[rgba(0,0,0,0.6)] dark:text-black">{hint}</p>
                  </div>
                );

                if (href) {
                  return (
                    <Link key={label} href={href} className="block hover:text-foreground transition-colors">
                      {Row}
                    </Link>
                  );
                }
                if (onClick) {
                  return (
                  <button
                    key={label}
                    type="button"
                    onClick={onClick}
                    className="w-full text-left font-medium hover:text-foreground transition-colors"
                  >
                      {Row}
                    </button>
                  );
                }
                return <div key={label}>{Row}</div>;
              })}
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-black">Reply & scheduling</p>
            <div className="space-y-5 border border-[rgba(0,0,0,0.08)] dark:border-white/15 rounded-[18px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-black dark:text-black">Include who is involved and timelines for a quicker reply.</p>
                  <p className="text-sm text-[rgba(0,0,0,0.6)] dark:text-black">Clear context helps me reply quickly.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.22em] bg-[rgba(0,0,0,0.04)] text-[rgba(0,0,0,0.6)] dark:text-black">
                  <span className="text-foreground">AEDT</span>
                </span>
              </div>
              <ul className="space-y-3 text-sm leading-relaxed">
                {replyNotes.map((note) => (
                  <li key={note} className="flex gap-2 text-black dark:text-black">
                    <span className="text-[var(--accent)]">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border text-sm md:text-base font-medium border-[rgba(0,0,0,0.12)] bg-white text-foreground dark:border-[#666] dark:bg-[#1a1a1d] dark:text-white py-3 transition-colors duration-150 hover:border-foreground/50"
              >
                <CalendarDays size={16} />
                Book a time
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-14 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-black">Collaboration fit</p>
            <h2 className="text-xl font-medium text-foreground">Ways I can help</h2>
            <ul className="space-y-3 text-sm leading-relaxed">
              {collaborationAreas.map((area) => (
                <li key={area} className="flex gap-2 text-black dark:text-black">
                  <span className="text-[var(--accent)]">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-black">Profiles</p>
            <h2 className="text-xl font-medium text-foreground">Find me elsewhere</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-2 border border-[rgba(0,0,0,0.12)] dark:border-white/20 rounded-full text-sm font-medium transition-colors duration-150 hover:border-foreground/50"
                >
                  <span>{label}</span>
                  <span className="text-[rgba(0,0,0,0.6)] dark:text-black">{icon}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer className="mb-4" />
      {showCallInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowCallInfo(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Call request info"
        >
          <div
            className="surface-card max-w-md w-full p-6 rounded-2xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Request a call</h3>
              <button
                type="button"
                className="p-2 rounded-full font-medium hover:bg-[var(--accent-soft)]"
                onClick={() => setShowCallInfo(false)}
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-[rgba(0,0,0,0.6)] dark:text-black leading-relaxed">
              Share your number and preferred time in the booking note. I will text first and call if it helps.
            </p>
          </div>
        </div>
      )}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startInSchedule
      />
    </div>
  );
}
