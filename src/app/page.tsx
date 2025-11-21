"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowUp, Loader2 } from "lucide-react";
import { useState, useCallback, useEffect, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sendChatRequest, type ChatMessage } from "@/lib/api/chat";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rotatingPlaceholders = [
    "Ask anything",
    "提问任何问题",
    "質問は何でもどうぞ",
    "Pregunte lo que quiera",
    "Posez n'importe quelle question",
    "Was möchtest du wissen?",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const rotate = () => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length);
    };
    const id = setInterval(rotate, 6000);
    return () => clearInterval(id);
  }, [rotatingPlaceholders.length]);

  const handleSend = useCallback(async () => {
    const nextPrompt = prompt.trim();
    if (!nextPrompt || isLoading) return;
    setIsLoading(true);
    setError(null);

    const messages: ChatMessage[] = [{ role: "user", content: nextPrompt }];
    try {
      const reply = await sendChatRequest(messages);
      setAnswer(reply);
      setPrompt("");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const showPlaceholderOverlay = !prompt.trim();

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

        <section className="w-full max-w-[48rem] flex flex-col items-center gap-4 mt-2">
          <div className="w-full h-[106px] rounded-[26px] bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_18px_36px_rgba(0,0,0,0.08)] px-[18px] pt-[18px] pb-[16px] flex items-start relative overflow-hidden">
            <textarea
              placeholder=""
              className="flex-1 h-[72px] resize-none bg-transparent text-[17px] md:text-[17.5px] leading-[1.4] text-foreground focus:outline-none pr-24"
              aria-label="Ask a question"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {showPlaceholderOverlay && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={placeholderIndex}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className="pointer-events-none absolute left-[18px] top-[18px] right-24 text-[17px] md:text-[17.5px] leading-[1.4] text-muted-foreground"
                >
                  {rotatingPlaceholders[placeholderIndex]}
                </motion.div>
              </AnimatePresence>
            )}
            <button
              type="button"
              className={`absolute right-[18px] bottom-[16px] inline-flex h-9 w-9 items-center justify-center rounded-full transition disabled:opacity-60 disabled:cursor-not-allowed ${prompt.trim() ? "bg-foreground text-white" : "bg-[rgba(0,0,0,0.05)] text-muted-foreground"}`}
              aria-label="Submit question"
              onClick={handleSend}
              disabled={!prompt.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <ArrowUp size={20} />
              )}
            </button>
          </div>
          {answer && (
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed text-left w-full max-w-4xl">
              {answer}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500 text-left w-full max-w-4xl">
              {error}
            </p>
          )}
        </section>
      </main>
      <Footer className="mb-6" />
    </div>
  );
}
