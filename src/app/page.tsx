"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-16 pb-16 gap-10 md:gap-14">
        <section className="w-full max-w-3xl flex flex-col items-center gap-5 md:gap-6">
          <p className="text-[0.62rem] md:text-[0.72rem] tracking-[0.34em] uppercase text-muted-foreground">
            Kevin Zheng • Social Data Science & Robust ML
          </p>
          <h1 className="text-[2.6rem] md:text-[3.4rem] font-bold text-foreground leading-tight">
            Trustworthy AI Researcher
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Designing diffusion experiments and robust ML safeguards for social platforms.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            <Link
              href="/publications"
              className="px-6 md:px-7 py-3 rounded-full bg-[var(--foreground)] text-[#f7f7f7] text-sm md:text-base font-semibold shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition duration-200 hover:-translate-y-[2px]"
            >
              View publications
            </Link>
            <Link
              href="/contact"
              className="px-6 md:px-7 py-3 rounded-full border border-[rgba(0,0,0,0.08)] bg-white text-sm md:text-base font-semibold text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition duration-200 hover:-translate-y-[1px]"
            >
              Contact
            </Link>
          </div>
        </section>

        <section className="w-full max-w-4xl flex flex-col items-center gap-4 mt-2">
          <div className="w-full rounded-[26px] bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_18px_36px_rgba(0,0,0,0.08)] px-5 md:px-7 py-4 md:py-5 flex items-center gap-3 md:gap-4">
            <input
              type="text"
              placeholder="Ask about research, teaching, or collaborations"
              className="flex-1 bg-transparent text-base md:text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
              aria-label="Ask a question"
            />
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(0,0,0,0.06)] text-foreground transition hover:bg-foreground hover:text-white"
              aria-label="Submit question"
            >
              <ArrowUpRight size={18} />
            </button>
          </div>
        </section>
      </main>
      <Footer className="mb-6" />
    </div>
  );
}
