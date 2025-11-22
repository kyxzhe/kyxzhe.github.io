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
    "Interested in my research, teaching, or projects? Feel free to ask here.",
    "对我的科研、教学或项目好奇吗？欢迎在这里随时提问。",
    "對我嘅研究、教學或者項目有興趣？喺呢度儘管問啦。",
    "私の研究や教育、プロジェクトについて知りたいことがあれば、ここで気軽に聞いてください。",
    "Si te interesa mi investigación, mi docencia o mis proyectos, puedes preguntar aquí.",
    "Si mes recherches, mon enseignement ou mes projets vous intéressent, n’hésitez pas à poser vos questions ici.",
    "Wenn Sie sich für meine Forschung, meine Lehre oder meine Projekte interessieren, können Sie mir hier gerne Ihre Fragen stellen.",
    "Se ti interessano le mie ricerche, la mia attività didattica o i miei progetti, puoi farmi delle domande qui.",
    "Если вам интересны мои исследования, преподавание или проекты, вы можете смело задавать свои вопросы здесь.",
    "제 연구나 강의, 프로젝트에 대해 궁금한 점이 있으시면 여기에서 편하게 질문해 주세요.",
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
  const showCaretHint = !prompt.trim() && messages.length > 0;

  return (
    <div className="flex flex-col min-h-screen font-sans font-medium">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-16 pb-16 gap-10 md:gap-14">
        <section className="w-full max-w-3xl flex flex-col items-center gap-5 md:gap-6">
          <p className="text-[0.62rem] md:text-[0.72rem] tracking-[0.34em] uppercase text-[rgba(0,0,0,0.6)] dark:text-white/60">
            KEVIN ZHENG · MACHINE LEARNING & DATA
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.4rem)] font-bold text-foreground leading-tight whitespace-nowrap">
            Trustworthy Machine Learning
          </h1>
          <p className="text-base md:text-lg text-[rgba(0,0,0,0.6)] dark:text-white/70 max-w-2xl leading-relaxed">
            PhD researcher in machine learning, working on information diffusion and real-world AI systems.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            <Link
              href="/publications"
              className="px-6 md:px-7 py-3 rounded-full text-sm md:text-base font-medium shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition duration-200 hover:-translate-y-[2px] bg-[#141414] text-white dark:bg-[#f5f5f5] dark:text-[#0b0b0d]"
            >
              View publications
            </Link>
            <Link
              href="/contact"
              className="px-6 md:px-7 py-3 rounded-full border text-sm md:text-base font-medium transition duration-200 hover:-translate-y-[1px] border-[rgba(0,0,0,0.12)] bg-white text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.06)] dark:border-[#666] dark:bg-[#1a1a1d] dark:text-white dark:shadow-[0_10px_24px_rgba(0,0,0,0.3)]"
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
            className="w-full rounded-[26px] bg-white border border-[rgba(0,0,0,0.08)] px-[18px] pt-[18px] pb-[16px] flex flex-col gap-3 overflow-hidden dark:bg-[#1b1b1f] dark:border-[#2f2f35] dark:shadow-[0_18px_38px_rgba(0,0,0,0.55)]"
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
                        <p className="text-sm text-[rgba(0,0,0,0.6)] dark:text-white/60">发送后这里会展开显示完整对话。</p>
                      ) : (
                        messages.map((message, index) => (
                          <div
                            key={`${message.role}-${index}`}
                            className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                            className={`max-w-[85%] text-sm md:text-[15px] leading-relaxed text-left ${
                                message.role === "user"
                                  ? "bg-[#f2f2f4] text-foreground border border-[rgba(0,0,0,0.06)] rounded-2xl px-3 py-[10px] shadow-[0_6px_14px_rgba(0,0,0,0.05)] dark:bg-[#2a2a30] dark:text-white dark:border-[#3a3a42] dark:shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                                  : "text-foreground dark:text-white"
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

            <div className="flex items-end gap-3 relative w-full">
              <div className="flex-1 relative">
                <textarea
                  placeholder=""
                  className="w-full min-h-[72px] resize-none bg-transparent text-[17px] md:text-[17.5px] leading-[1.4] text-foreground focus:outline-none dark:text-white"
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
                      className="pointer-events-none absolute left-0 top-0 text-[17px] md:text-[17.5px] leading-[1.4] text-[rgba(0,0,0,0.6)] dark:text-white/60"
                    >
                      -&gt;
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
              <button
                type="button"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition disabled:opacity-60 disabled:cursor-not-allowed ${prompt.trim() ? "bg-[rgb(229,231,235)] text-foreground dark:bg-white dark:text-[#0b0b0d]" : "bg-[rgb(229,231,235)] text-[rgba(0,0,0,0.6)] dark:bg-white/15 dark:text-white"}`}
                aria-label="Submit question"
                onClick={handleSend}
                disabled={!prompt.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <ArrowUp size={24} strokeWidth={2.4} className="text-[rgba(0,0,0,0.44)] dark:text-white" />
                )}
              </button>
              {showPlaceholderOverlay && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={placeholderIndex}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                      className="pointer-events-none absolute left-0 right-0 top-0 text-center px-4 text-[17px] md:text-[17.5px] leading-[1.4] text-[rgba(0,0,0,0.6)] dark:text-white/60"
                  >
                    {rotatingPlaceholders[placeholderIndex]}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
          <p className="text-xs text-[rgba(0,0,0,0.6)] dark:text-white/70 text-center w-full max-w-4xl">
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
