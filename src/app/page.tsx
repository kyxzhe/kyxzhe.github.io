"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-16 gap-12 md:gap-16 pb-16">
        <section className="w-full max-w-3xl flex flex-col items-center gap-4 md:gap-5">
          <p className="text-[0.6rem] md:text-[0.7rem] tracking-[0.36em] uppercase text-muted-foreground">
            Kevin Zheng • Social Data Science & Robust ML
          </p>
          <h1 className="text-[2.3rem] md:text-[3.2rem] font-bold text-foreground leading-tight">Trustworthy AI Researcher</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Designing diffusion experiments and robust ML safeguards for social platforms.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Link
              href="/publications"
              className="px-6 md:px-7 py-3 rounded-full bg-[var(--foreground)] text-[#f7f7f7] text-sm md:text-base font-semibold shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition duration-200 hover:-translate-y-[2px]"
            >
              View research
            </Link>
            <Link
              href="/about"
              className="px-6 md:px-7 py-3 rounded-full border border-[rgba(0,0,0,0.08)] bg-white text-sm md:text-base font-semibold text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition duration-200 hover:-translate-y-[1px]"
            >
              About
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Available for research collaborations and talks.
          </div>
        </section>

        <section className="w-full max-w-3xl flex flex-col items-center gap-3">
          <div className="w-full rounded-full bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_20px_40px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-3 md:gap-4">
            <input
              type="text"
              placeholder="Ask about publications, ongoing work, or collaboration ideas"
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
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,0,0,0.1)] bg-white text-foreground transition hover:border-foreground"
            >
              Browse publications
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,0,0,0.1)] bg-white text-foreground transition hover:border-foreground"
            >
              Recent updates
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer className="mb-6" />
    </div>
  );
}
