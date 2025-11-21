"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowUp, Loader2 } from "lucide-react";
import { useState, useCallback, useEffect, useRef, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sendChatRequest, type ChatMessage } from "@/lib/api/chat";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const rotatingPlaceholders = [
    "Ask anything",
    "提问任何问题",
    "質問は何でもどうぞ",
    "Pregunte lo que quiera",
    "Posez n'importe quelle question",
    "Was möchtest du wissen?",
    "Chiedi qualsiasi cosa",
    "Спросите что угодно",
    "¿Qué quieres saber?",
    "Que souhaitez-vous savoir ?",
    "어떤 것이든 물어보세요",
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

    const requestMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: nextPrompt },
    ];
    try {
      setMessages(requestMessages);
      setIsExpanded(true);
      const reply = await sendChatRequest(requestMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setPrompt("");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, messages]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if ((messages.length > 0 || isLoading) && !isExpanded) {
      setIsExpanded(true);
    }
  }, [messages.length, isLoading, isExpanded]);

  const historyEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isLoading]);

  const showPlaceholderOverlay = !prompt.trim() && messages.length === 0;

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
          <motion.div
            layout
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 106,
              boxShadow: isExpanded
                ? "0 22px 40px rgba(0,0,0,0.12)"
                : "0 18px 36px rgba(0,0,0,0.08)",
            }}
            transition={{ type: "spring", stiffness: 240, damping: 30 }}
            className="w-full rounded-[26px] bg-white border border-[rgba(0,0,0,0.08)] px-[18px] pt-[18px] pb-[16px] flex flex-col gap-3 overflow-hidden"
          >
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  key="history"
                  initial={{ height: 0, opacity: 0, y: -6 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -6 }}
                  transition={{ duration: 0.32, ease: "easeInOut" }}
                  className="w-full flex-1"
                >
                  <div className="max-h-[320px] md:max-h-[360px] overflow-y-auto space-y-3 pr-[6px] pt-1">
                    {messages.length === 0 && !isLoading ? (
                      <p className="text-sm text-muted-foreground">发送后这里会展开显示完整对话。</p>
                    ) : (
                      messages.map((message, index) => (
                        <div
                          key={`${message.role}-${index}`}
                          className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] text-sm md:text-[15px] leading-relaxed text-left ${
                              message.role === "user"
                                ? "bg-[#f2f2f4] text-foreground border border-[rgba(0,0,0,0.06)] rounded-2xl px-3 py-[10px] shadow-[0_6px_14px_rgba(0,0,0,0.05)]"
                                : "text-foreground"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))
                    )}
                    {isLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 size={16} className="animate-spin" />
                        <span>正在生成回复…</span>
                      </div>
                    )}
                    <div ref={historyEndRef} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  placeholder=""
                  className="w-full min-h-[72px] resize-none bg-transparent text-[17px] md:text-[17.5px] leading-[1.4] text-foreground focus:outline-none"
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
                      className="pointer-events-none absolute left-0 top-0 right-0 text-[17px] md:text-[17.5px] leading-[1.4] text-muted-foreground"
                    >
                      {rotatingPlaceholders[placeholderIndex]}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
              <button
                type="button"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition disabled:opacity-60 disabled:cursor-not-allowed ${prompt.trim() ? "bg-foreground text-white" : "bg-[rgba(0,0,0,0.05)] text-muted-foreground"}`}
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
          </motion.div>
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
