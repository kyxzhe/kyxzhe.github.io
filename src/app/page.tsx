"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState, useCallback, useEffect, useMemo, useRef, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sendChatRequest, type ChatMessage } from "@/lib/api/chat";
import { useChatMessages } from "@/hooks/useChatMessages";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useChatMessages({
    storageKey: "chat-home-history",
  });
  const visibleMessages = useMemo(() => messages.filter((msg) => msg.role !== "system"), [messages]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const rotatingPlaceholders = [
    "Interested in my research, teaching, or projects? Feel free to ask here.",
    "对我的科研、教学或项目好奇吗？欢迎在这里随时提问。",
    "對我嘅研究、教學或者項目有興趣？喺呢度儘管問啦。",
    "Ești interesat de cercetarea mea, activitatea mea didactică sau proiectele mele? Nu ezita să întrebi aici.",
    "私の研究や教育、プロジェクトについて知りたいことがあれば、ここで気軽に聞いてください。",
    "제 연구나 강의, 프로젝트에 대해 궁금한 점이 있으시면 여기에서 편하게 질문해 주세요.",
    "Si te interesa mi investigación, mi docencia o mis proyectos, puedes preguntar aquí.",
    "Si mes recherches, mon enseignement ou mes projets vous intéressent, n’hésitez pas à poser vos questions ici.",
    "Wenn Sie sich für meine Forschung, meine Lehre oder meine Projekte interessieren, können Sie mir hier gerne Ihre Fragen stellen.",
    "Se ti interessano le mie ricerche, la mia attività didattica o i miei progetti, puoi farmi delle domande qui.",
    "Если вам интересны мои исследования, преподавание или проекты, вы можете смело задавать свои вопросы здесь.",
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
    setPrompt("");

    const userMessage: ChatMessage = { role: "user", content: nextPrompt };
    const requestMessages: ChatMessage[] = [...messages, userMessage];
    const assistantPlaceholder: ChatMessage = { role: "assistant", content: "" };
    try {
      setMessages([...requestMessages, assistantPlaceholder]);
      setIsExpanded(true);

      const appendChunk = (chunk: string) => {
        if (!chunk) return;
        setMessages((prev) => {
          if (!prev.length) return prev;
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex]?.role !== "assistant") {
            return prev;
          }
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: `${updated[lastIndex].content}${chunk}`,
          };
          return updated;
        });
      };

      const reply = await sendChatRequest(requestMessages, { onChunk: appendChunk });
      setMessages((prev) => {
        if (!prev.length) return prev;
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.role !== "assistant") {
          return prev;
        }
        updated[lastIndex] = { ...updated[lastIndex], content: reply };
        return updated;
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        if (!prev.length) return prev;
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, messages, setMessages]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if ((visibleMessages.length > 0 || isLoading) && !isExpanded) {
      setIsExpanded(true);
    }
  }, [visibleMessages.length, isLoading, isExpanded]);

  const historyEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [visibleMessages, isLoading]);

  const showPlaceholderOverlay = !prompt.trim() && visibleMessages.length === 0;
  const showCaretHint = !prompt.trim() && visibleMessages.length > 0;

  return (
    <div className="flex flex-col min-h-screen font-sans font-medium">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-16 pb-16 gap-10 md:gap-14">
        <section className="w-full max-w-3xl flex flex-col items-center gap-5 md:gap-6">
          <p className="text-[12px] tracking-[0.34em] uppercase text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
            KEVIN ZHENG · MACHINE LEARNING & DATA
          </p>
          <h1 className="text-[48px] md:text-[64px] font-semibold text-foreground leading-tight md:whitespace-nowrap">
            Trustworthy Machine Learning
          </h1>
          <p className="text-[17px] md:text-[17px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)] max-w-2xl leading-relaxed">
            PhD researcher in machine learning, working on information diffusion and real-world AI systems.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            <Link
              href="/publications"
              className="px-6 md:px-7 py-3 rounded-full text-[15px] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition duration-200 hover:-translate-y-[2px] bg-[#141414] text-white dark:bg-[#ffffff] dark:text-[#000000]"
            >
              View publications
            </Link>
            <Link
              href="/contact"
            className="px-6 md:px-7 py-3 rounded-full border text-[15px] font-medium transition duration-200 hover:-translate-y-[1px] border-[rgba(0,0,0,0.12)] bg-white text-foreground shadow-[0_1px_6px_rgba(0,0,0,0.05)] dark:border-[#666] dark:bg-[#000000] dark:text-[rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.24)]"
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
                ? "0 3px 10px rgba(0,0,0,0.07)"
                : "0 2px 8px rgba(0,0,0,0.06)",
            }}
            transition={{ type: "spring", stiffness: 240, damping: 30 }}
            className="w-full rounded-[16px] bg-white border border-[rgba(0,0,0,0.08)] px-[18px] pt-[18px] pb-[16px] flex flex-col gap-3 overflow-hidden dark:bg-[rgba(255,255,255,0.05)] dark:border-none dark:shadow-[0_3px_12px_rgba(0,0,0,0.26)]"
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
                      {visibleMessages.length === 0 && !isLoading ? (
                        <p className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.6)] dark:text-white/60">发送后这里会展开显示完整对话。</p>
                      ) : (
                        visibleMessages.map((message, index) => (
                          <div
                            key={`${message.role}-${index}`}
                            className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                            className={`max-w-[85%] text-[16px] leading-relaxed text-left ${
                              message.role === "user"
                                ? "bg-[rgba(233,233,233,0.5)] text-foreground rounded-full px-4 py-2 dark:bg-[rgba(50,50,50,0.85)] dark:text-white"
                                : "rounded-2xl text-foreground dark:text-white"
                            }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))
                      )}
                      {isLoading && (
                        <div className="flex items-center text-[rgba(0,0,0,0.6)] dark:text-white/60">
                          <Loader2 size={16} className="animate-spin" />
                        </div>
                      )}
                      <div ref={historyEndRef} />
                    </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form
              className="relative w-full"
              onSubmit={(event) => {
                event.preventDefault();
                handleSend();
              }}
            >
              <div className="relative w-full">
                <textarea
                  placeholder=""
                  className="w-full min-h-[72px] resize-none bg-transparent pe-[52px] pr-[52px] text-[16px] md:text-[16px] leading-[1.4] text-foreground focus:outline-none dark:text-white"
                  aria-label="Ask a question"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {showCaretHint && (
                  <AnimatePresence>
                    <motion.div
                      key="caret-hint"
                      initial={{ y: 6, opacity: 0 }}
                      animate={{ y: 0, opacity: 0.8 }}
                      exit={{ y: -6, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="pointer-events-none absolute left-0 top-0 text-[16px] md:text-[16px] leading-[1.4] text-[rgba(0,0,0,0.6)] dark:text-white/60"
                    >
                      -&gt;
                    </motion.div>
                  </AnimatePresence>
                )}
                {showPlaceholderOverlay && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={placeholderIndex}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.32, ease: "easeOut" }}
                      className="pointer-events-none absolute left-0 right-0 top-0 text-center px-4 text-[16px] md:text-[16px] leading-[1.4] text-[rgba(0,0,0,0.6)] dark:text-white/60"
                    >
                      {rotatingPlaceholders[placeholderIndex]}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
              <div className="ie-3 absolute bottom-1 right-[-6px] mt-auto flex justify-end">
                <button
                  type="submit"
                  aria-label="Send prompt to ChatGPT"
                  disabled={!prompt.trim() || isLoading}
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full p-0 transition-colors hover:opacity-70 disabled:hover:opacity-100 bg-[rgba(0,0,0,0.06)] text-[rgba(0,0,0,0.35)] dark:bg-white/15 dark:text-white/60 enabled:bg-black enabled:text-white dark:enabled:bg-white dark:enabled:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 disabled:focus-visible:ring-offset-0"
                >
                  <span className="sr-only">Send prompt to ChatGPT</span>
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M16 22L16 10M16 10L11 15M16 10L21 15"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
          <p className="text-xs text-[rgba(0,0,0,0.6)] dark:text-[rgb(243,243,243)] text-center w-full max-w-4xl">
            ChatBot can make mistakes. Check important info.
          </p>
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
