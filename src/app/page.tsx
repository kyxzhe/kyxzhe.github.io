"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center justify-center text-center px-4 md:px-10 lg:px-16 gap-10 md:gap-14 pb-12">
        <section className="w-full max-w-4xl flex flex-col items-center gap-4 md:gap-5">
          <p className="text-[0.62rem] md:text-[0.7rem] tracking-[0.34em] uppercase text-muted-foreground">
            Kevin Zheng • Social Data Science & Robust ML
          </p>
          <h1 className="text-[2.1rem] md:text-[3.1rem] font-bold text-foreground">Trustworthy AI Researcher</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Designing diffusion experiments, robust learning pipelines, and humane safeguards for social platforms.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Link
              href="/publications"
              className="px-6 md:px-7 py-3 rounded-full bg-[var(--foreground)] text-[#f7f7f7] text-sm md:text-base font-semibold shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition duration-200 hover:-translate-y-[2px]"
            >
              View research
            </Link>
            <Link
              href="/contact"
              className="px-6 md:px-7 py-3 rounded-full border border-[rgba(0,0,0,0.08)] bg-white text-sm md:text-base font-semibold text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition duration-200 hover:-translate-y-[1px]"
            >
              Contact
            </Link>
          </div>
        </section>

        <section className="w-full max-w-4xl flex flex-col items-center gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-foreground">What can I help with?</h2>
          <div className="w-full rounded-full bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_22px_42px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-3 md:gap-4">
            <input
              type="text"
              placeholder="Ask a question about research, teaching, or credentials"
              className="flex-1 bg-transparent text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              aria-label="Ask a question"
            />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(0,0,0,0.06)] text-foreground transition hover:bg-foreground hover:text-white"
              aria-label="Submit question"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mt-1">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Online
            </span>
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,0,0,0.1)] bg-white text-foreground transition hover:border-foreground"
            >
              Show latest publications
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,0,0,0.1)] bg-white text-foreground transition hover:border-foreground"
            >
              Summarize recent news
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            Ask me about research, teaching, credentials, or side projects.
          </p>
        </section>

        <section className="w-full max-w-5xl border-t border-[rgba(0,0,0,0.06)] pt-8 md:pt-12 grid md:grid-cols-[1.05fr_1fr] gap-10 md:gap-14 text-left">
          <div className="flex flex-col gap-3">
            <p className="text-[0.68rem] tracking-[0.22em] uppercase text-muted-foreground">Contact</p>
            <p className="text-sm md:text-base text-foreground">Email-first; scheduling for deeper dives.</p>
            <p className="text-sm md:text-base text-foreground">Email · kevin.zheng@student.uts.edu.au</p>
            <p className="text-sm md:text-base text-foreground">Location · Sydney, Australia</p>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <div className="flex items-center gap-2 md:justify-end">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,0,0,0.1)] bg-white text-sm font-semibold text-foreground transition hover:border-foreground"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                About
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--foreground)] text-white text-sm font-semibold shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition hover:-translate-y-[1px]"
              >
                Book a meeting
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm md:text-base text-foreground">Signal/Phone · +61 416 276 898</p>
            <p className="text-sm md:text-base text-muted-foreground md:text-right">
              Focus: Best via email – open to info diffusion & robust ML collaborations.
            </p>
          </div>
        </section>
      </main>
      <Footer className="mb-6" />
    </div>
  );
}
