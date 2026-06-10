import Link from "next/link";
import { Building2, GraduationCap, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contactInfo } from "@/lib/constants/contact";
import {
  aboutIntro,
  collaborationPitch,
  contributions,
  researchFocus,
  timeline,
} from "@/lib/constants/about";

const quickFacts = [
  { label: "Sydney based", icon: MapPin },
  { label: "Behavioural Data Science Lab @ UTS", icon: Building2 },
  { label: "Teaching ML + Data Science @ USYD", icon: GraduationCap },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans font-normal pt-2 md:pt-0 lg:py-6 xl:py-0 xl:pb-6 overflow-visible">
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 flex flex-col items-center gap-16 px-4 md:px-16 lg:px-24 py-12"
      >
        <section
          className="max-w-4xl w-full flex flex-col gap-12"
        >
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">About Kevin</p>
            <div className="space-y-4">
              <h1 className="text-balance text-4xl md:text-5xl font-medium leading-tight">Research first, people in mind</h1>
              <p className="text-[17px] text-foreground whitespace-pre-line leading-relaxed">{aboutIntro}</p>
            </div>
            <div className="flex flex-col gap-4 text-sm text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {quickFacts.map(({ label, icon: Icon }) => (
                  <span key={label} className="inline-flex items-center gap-2 dark:text-[rgba(255,255,255,0.8)]">
                    <Icon size={15} aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Focus areas</p>
              <div className="space-y-4 text-[17px]">
                {researchFocus.map((item) => (
                  <p key={item} className="text-foreground dark:text-white">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">At a glance</p>
              <div className="flex gap-12">
                <div>
                  <p className="text-4xl font-medium leading-none">4</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] mt-3 dark:text-[rgba(255,255,255,0.8)]">Lab talks</p>
                </div>
                <div>
                  <p className="text-4xl font-medium leading-none">2</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] mt-3 dark:text-[rgba(255,255,255,0.8)]">Manuscripts</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-4xl mx-auto space-y-20">
          <div className="space-y-10">
            <div className="space-y-2">
              <p className="text-[14px] uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Story so far</p>
              <h2 className="text-[30px] font-medium">Timeline</h2>
            </div>
            <div className="space-y-8">
              {timeline.map((item) => (
                <div key={item.title} className="space-y-2">
                  <p className="text-[14px] uppercase tracking-[0.2em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
                    {item.period}
                  </p>
                  <h3 className="text-[17px] font-medium">{item.title}</h3>
                  <p className="text-[14px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">{item.org}</p>
                  <p className="text-[14px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Community</p>
              <h2 className="text-[30px] font-medium">Teaching & sharing</h2>
              <ul className="space-y-3 text-[17px]">
                {contributions.map((item) => (
                  <li key={item} className="text-black dark:text-white">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <p className="text-[14px] uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">Collaborate</p>
              <h2 className="text-[30px] font-medium">Open to thoughtful work</h2>
              <p className="text-[17px] text-black dark:text-white leading-relaxed">
                {collaborationPitch}
              </p>
              <div className="flex flex-col gap-2 text-sm max-w-xs mx-auto items-center">
                <Link
                  href={`mailto:${contactInfo.email}`}
                  className="btn-primary inline-flex justify-center dark:bg-white dark:text-[#0b0b0d] font-medium shadow-[0_1px_6px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.24)]"
                >
                  Email Kevin
                </Link>
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center justify-center text-center text-foreground/60 underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer className="mb-4" />
    </div>
  );
}
