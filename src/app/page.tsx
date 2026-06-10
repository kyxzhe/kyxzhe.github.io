"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUp, Loader2 } from "lucide-react";
import { useState, useCallback, useEffect, useMemo, useRef, KeyboardEvent } from "react";
import { sendChatRequest, type ChatMessage } from "@/lib/api/chat";
import { useChatMessages } from "@/hooks/useChatMessages";
import { siteMetadata } from "@/lib/seo/config";
import { getWebPageJsonLd, serializeJsonLd } from "@/lib/seo/schema";

const MarkdownMessage = dynamic(() => import("@/components/MarkdownMessage"), {
  ssr: false,
});

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const mobileRotatingPlaceholders = [
  "Ask about research or projects.",
  "想了解科研、教学或项目？直接问。",
  "想問研究、教學或項目？喺度問。",
  "Întreabă despre cercetare sau proiecte.",
  "研究・教育・プロジェクトについて質問できます。",
  "연구, 강의, 프로젝트를 물어보세요.",
  "Pregunta sobre investigación o proyectos.",
  "Posez une question sur mes recherches.",
  "Fragen zu Forschung oder Projekten.",
  "Chiedi di ricerche o progetti.",
  "Спросите об исследованиях или проектах.",
];

const MAX_PROMPT_CHARS = 4000;
const serializedHomePageJsonLd = serializeJsonLd(
  getWebPageJsonLd({
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.baseUrl,
    dateModified: "2026-06-11",
  })
);

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useChatMessages({
    storageKey: "chat-home-history",
  });
  const visibleMessages = useMemo(() => messages.filter((msg) => msg.role !== "system"), [messages]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const activeRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const rotate = () => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length);
    };
    const id = setInterval(rotate, 6000);
    return () => clearInterval(id);
  }, []);

  const handleSend = useCallback(async () => {
    const nextPrompt = prompt.trim().slice(0, MAX_PROMPT_CHARS);
    if (!nextPrompt || isLoading) return;
    setIsLoading(true);
    setError(null);
    setPrompt("");
    activeRequestRef.current?.abort();

    const controller = new AbortController();
    activeRequestRef.current = controller;

    const userMessage: ChatMessage = { role: "user", content: nextPrompt };
    const requestMessages: ChatMessage[] = [...messages, userMessage];
    const assistantPlaceholder: ChatMessage = { role: "assistant", content: "" };
    try {
      setMessages([...requestMessages, assistantPlaceholder]);
      setIsExpanded(true);

      const appendChunk = (chunk: string) => {
        if (!chunk || controller.signal.aborted) return;
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

      const reply = await sendChatRequest(requestMessages, {
        onChunk: appendChunk,
        signal: controller.signal,
      });
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
      if (controller.signal.aborted) {
        return;
      }
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
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
      }

      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    return () => {
      activeRequestRef.current?.abort();
    };
  }, []);

  const historyEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "end",
    });
  }, [visibleMessages, isLoading]);

  const showPlaceholderOverlay = isHydrated && !prompt.trim() && visibleMessages.length === 0;
  const showCaretHint = isHydrated && !prompt.trim() && visibleMessages.length > 0;

  return (
    <div className="flex flex-col min-h-screen font-sans font-medium">
      <script
        id="ld-homepage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedHomePageJsonLd }}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 w-full flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-16 pb-16 gap-10 md:gap-14">
        <section className="w-full max-w-3xl flex flex-col items-center gap-5 md:gap-6">
          <p className="text-[12px] tracking-[0.34em] uppercase text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
            KEVIN ZHENG · MACHINE LEARNING & DATA
          </p>
          <h1 className="text-balance text-[42px] font-semibold leading-tight text-foreground sm:text-[48px] md:text-[64px]">
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
          <div
            className={`w-full overflow-hidden rounded-[24px] border-0 bg-white px-4 py-4 font-normal transition-[box-shadow] duration-200 ease-out dark:border-none dark:bg-[rgba(255,255,255,0.05)] dark:shadow-[0_3px_12px_rgba(0,0,0,0.26)] ${
              isExpanded ? "flex flex-col gap-3" : "flex h-[104px] flex-col gap-3"
            }`}
            style={{
              boxShadow:
                "0 3px 6px rgba(0,0,0,0.04), 0 4px 80px 8px rgba(0,0,0,0.04), 0 0 1px rgba(0,0,0,0.62)",
            }}
          >
            {isExpanded && (
              <div className="w-full flex-1">
                <div
                  className="max-h-[320px] md:max-h-[360px] overflow-y-auto space-y-3 pr-[6px] pt-1"
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions text"
                >
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
                          <MarkdownMessage content={message.content} />
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div
                      className="flex items-center text-[rgba(0,0,0,0.6)] dark:text-white/60"
                      role="status"
                    >
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      <span className="sr-only">KevinBot is responding</span>
                    </div>
                  )}
                  <div ref={historyEndRef} />
                </div>
              </div>
            )}

            <form
              className="relative w-full"
              aria-busy={isLoading}
              onSubmit={(event) => {
                event.preventDefault();
                handleSend();
              }}
            >
              <div className="relative w-full">
                <textarea
                  placeholder=""
                  className="w-full min-h-[64px] resize-none bg-transparent pr-[58px] text-[16px] leading-[1.4] text-foreground focus:outline-none dark:text-white md:min-h-[72px] md:pr-[52px]"
                  aria-label="Ask a question"
                  aria-describedby="chatbot-disclaimer"
                  required
                  maxLength={MAX_PROMPT_CHARS}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {showCaretHint && (
                  <div
                    className="pointer-events-none absolute left-0 top-0 text-[16px] md:text-[16px] leading-[1.4] text-[rgba(0,0,0,0.6)] opacity-80 dark:text-white/60"
                    aria-hidden="true"
                  >
                    -&gt;
                  </div>
                )}
                {showPlaceholderOverlay && (
                  <div
                    className="pointer-events-none absolute left-0 right-[58px] top-0 px-1 text-left text-[14px] leading-[1.45] text-[rgba(0,0,0,0.6)] transition-opacity duration-200 dark:text-white/60 sm:right-0 sm:px-4 sm:text-center sm:text-[15px] md:text-[16px]"
                    aria-hidden="true"
                    style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  >
                    <span className="hidden sm:block">
                      {rotatingPlaceholders[placeholderIndex]}
                    </span>
                    <span className="block sm:hidden">
                      {mobileRotatingPlaceholders[placeholderIndex]}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 mt-auto flex justify-end">
                <button
                  type="submit"
                  aria-label="Send message to KevinBot"
                  disabled={!prompt.trim() || isLoading}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full p-0 transition-colors hover:opacity-70 disabled:hover:opacity-100 bg-[rgba(0,0,0,0.04)] text-[rgba(0,0,0,0.44)] dark:bg-white/15 dark:text-white/60 enabled:bg-black enabled:text-white dark:enabled:bg-white dark:enabled:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 disabled:focus-visible:ring-offset-0"
                >
                  <span className="sr-only">Send message to KevinBot</span>
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowUp size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
            </form>
          </div>
          <p
            id="chatbot-disclaimer"
            className="text-xs text-[rgba(0,0,0,0.6)] dark:text-[rgb(243,243,243)] text-center w-full max-w-4xl"
          >
            ChatBot can make mistakes. Check important info.
          </p>
          {error && (
            <p role="alert" className="text-sm text-red-600 text-left w-full max-w-4xl dark:text-red-400">
              {error}
            </p>
          )}
        </section>
      </main>
      <Footer className="mb-6" />
    </div>
  );
}
