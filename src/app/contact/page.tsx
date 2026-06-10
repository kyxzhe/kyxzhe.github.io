import { Fragment } from "react";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContactBookingControl, ContactPhoneRequest } from "@/components/ContactControls";
import { contactInfo } from "@/lib/constants/contact";
import { socials } from "@/lib/constants/socials";
import { GoogleScholarIcon, OrcidIcon } from "@/components/icons/AcademicIcons";

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

const directLines = [
  {
    label: "Email",
    value: contactInfo.email,
    hint: "Best for research, teaching, and collaboration enquiries.",
    href: `mailto:${contactInfo.email}`,
    icon: Mail,
  },
  {
    label: "Location",
    value: contactInfo.location,
    hint: "Based in Sydney. Happy to meet online across time zones.",
    icon: MapPin,
  },
];

function LinkedInMonoIcon({ className }: { className?: string }) {
  const classes = `${className ?? ""} dark:[&>rect]:stroke-white dark:[&>rect]:fill-white dark:[&>path]:fill-black`;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={classes}
    >
      <rect x="1" y="1" width="22" height="22" rx="4.5" fill="currentColor" stroke="currentColor" />
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
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M12 1.5c-5.8 0-10.5 4.7-10.5 10.5 0 4.6 3 8.5 7.2 9.9.5.1.7-.2.7-.5l-.01-2c-2.94.64-3.56-1.42-3.56-1.42-.45-1.14-1.1-1.44-1.1-1.44-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.37 1.09 2.95.83.09-.65.35-1.09.63-1.34-2.35-.27-4.82-1.17-4.82-5.2 0-1.15.41-2.08 1.03-2.81-.1-.26-.45-1.35.1-2.81 0 0 .88-.28 2.9 1.07a10.1 10.1 0 0 1 5.28 0c2.02-1.35 2.9-1.07 2.9-1.07.55 1.46.2 2.55.1 2.81.64.73 1.03 1.66 1.03 2.81 0 4.05-2.48 4.92-4.85 5.19.36.3.68.9.68 1.82l-.01 2.7c0 .3.2.6.7.5a10.52 10.52 0 0 0 7.16-9.99C22.5 6.2 17.8 1.5 12 1.5Z" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-foreground dark:bg-[#000000] dark:text-[#f5f5f5] font-normal">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 mx-auto w-full max-w-5xl px-2 md:px-4 lg:px-0 py-10 flex flex-col gap-16">
        <section className="mt-2 space-y-5">
          <p className="text-[12px] uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Contact</p>
          <h1 className="text-[42px] font-medium leading-tight text-foreground sm:text-[48px]">
            Get in touch
          </h1>
          <p className="text-[15px] md:text-base text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)] max-w-2xl leading-relaxed">
            For research, teaching, or collaboration enquiries, please email with a brief outline of the topic and any timelines. I will reply with clear next steps.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`mailto:${contactInfo.email}`}
              className="px-6 md:px-7 py-3 rounded-full text-[14px] font-medium bg-[#141414] text-white dark:bg-[#f5f5f5] dark:text-[#000000] transition-colors duration-150 hover:opacity-90"
            >
              Email Kevin
            </Link>
          </div>
        </section>

        <section className="grid gap-14 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="text-[14px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Direct lines</p>
            <div className="border-y border-[rgba(0,0,0,0.08)] dark:border-white/15">
              {directLines.map(({ label, value, hint, href, icon: Icon }, idx) => {
                const Row = (
                  <div
                    className={`flex flex-col gap-1 py-5 border-b border-[rgba(0,0,0,0.08)] dark:border-white/20 transition-colors hover:border-foreground/70 ${
                      idx === directLines.length - 1 ? "border-b-0" : ""
                    } ${href ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.26em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
                      {Icon && <Icon size={14} aria-hidden="true" />}
                      <span>{label}</span>
                    </div>
                    <p className="text-[17px] font-medium text-foreground">{value}</p>
                    <p className="text-[14px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">{hint}</p>
                  </div>
                );

                const directLine = href ? (
                  <Link href={href} className="block hover:text-foreground transition-colors">
                    {Row}
                  </Link>
                ) : (
                  <div>{Row}</div>
                );

                return (
                  <Fragment key={label}>
                    {directLine}
                    {idx === 0 && <ContactPhoneRequest />}
                  </Fragment>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-[14px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Reply & scheduling</p>
            <div className="space-y-5 border border-[rgba(0,0,0,0.08)] dark:border-white/15 rounded-[18px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[17px] text-black dark:text-white">Include who is involved and timelines for a quicker reply.</p>
                  <p className="text-[17px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">Clear context helps me reply quickly.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.22em] bg-[rgba(0,0,0,0.04)] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)] dark:bg-[rgba(255,255,255,0.12)]">
                  <span className="text-foreground">Sydney time</span>
                </span>
              </div>
              <ul className="space-y-3 text-[17px] leading-relaxed">
                {replyNotes.map((note) => (
                  <li key={note} className="flex gap-2 text-black dark:text-white">
                    <span className="text-[var(--accent)]">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
              <ContactBookingControl />
            </div>
          </div>
        </section>

        <section className="grid gap-14 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-[14px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Collaboration fit</p>
            <h2 className="text-[30px] font-medium text-foreground">Ways I can help</h2>
            <ul className="space-y-3 text-[17px] leading-relaxed">
              {collaborationAreas.map((area) => (
                <li key={area} className="flex gap-2 text-black dark:text-white">
                  <span className="text-[var(--accent)]">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-[14px] uppercase tracking-[0.28em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Profiles</p>
            <h2 className="text-[30px] font-medium text-foreground">Find me elsewhere</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-between gap-3 px-4 py-2 border border-[rgba(0,0,0,0.12)] dark:border-white/20 rounded-full text-[17px] font-medium transition-colors duration-150 hover:border-foreground/50"
                >
                  <span className="text-[15px] dark:text-white">{label}</span>
                  <span className="text-[rgba(0,0,0,0.6)] dark:text-white">{icon}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer className="mb-4" />
    </div>
  );
}
