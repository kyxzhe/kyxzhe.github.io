import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Kevin Zheng" },
  description: "The requested page could not be found.",
  robots: { index: false, follow: false },
  alternates: {},
  openGraph: null,
  twitter: null,
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col font-medium">
      <Navbar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-5 px-2 py-16 md:px-4 lg:px-0">
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">404</p>
        <h1 className="text-[42px] leading-tight md:text-[48px]">Page not found</h1>
        <p className="max-w-xl text-[16px] leading-relaxed text-foreground/70">
          The page may have moved, or the address may be incorrect.
        </p>
        <Link href="/" className="btn-primary mt-2 inline-flex w-fit">
          Back to home
        </Link>
      </main>
      <Footer className="mb-4" />
    </div>
  );
}
