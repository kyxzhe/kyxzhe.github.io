import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  alternates: {
    canonical: "/404",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-foreground dark:bg-[#000000] dark:text-[#f5f5f5]">
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 items-center justify-center px-4 py-16"
      >
        <section className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)]">
            404
          </p>
          <div className="space-y-4">
            <h1 className="text-[42px] font-medium leading-tight text-foreground md:text-[56px]">
              Page not found
            </h1>
            <p className="max-w-2xl text-[17px] leading-relaxed text-[rgba(0,0,0,0.62)] dark:text-[rgba(255,255,255,0.78)]">
              This page may have moved, or the address may be incomplete.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              Back to home
            </Link>
            <Link
              href="/publications"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] px-5 text-sm font-medium transition-colors hover:border-foreground/50 dark:border-white/20"
            >
              View publications
            </Link>
          </div>
        </section>
      </main>
      <Footer className="mb-4" />
    </div>
  );
}
