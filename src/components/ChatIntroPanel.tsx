"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { cardVariants } from "@/lib/animation/variants";
import { type ChatMessage, sendChatRequest } from "@/lib/api/chat";
import ChatInputBar from "@/components/ChatInputBar";
import { KEVIN_SYSTEM_PROMPT } from "@/lib/constants/chat";
import { useChatMessages } from "@/hooks/useChatMessages";

const assistantGreeting =
  "Hi there! Ask me about research, teaching, certifications, or where to find a good flat white.";

export default function ChatIntroPanel() {
  const [messages, setMessages] = useChatMessages({
    storageKey: "chat-intro-history",
    systemMessage: KEVIN_SYSTEM_PROMPT,
    assistantGreeting,
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canSend = input.trim().length > 0 && !isLoading;
  const visibleMessages = useMemo(() => messages.filter((msg) => msg.role !== "system"), [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!canSend) return;
    const nextInput = input.trim();
    setInput("");
    setError(null);

    const userMessage: ChatMessage = { role: "user", content: nextInput };
    const nextHistory: ChatMessage[] = [...messages, userMessage];
    setMessages([...nextHistory, { role: "assistant", content: "" }]);
    setIsLoading(true);

    const appendChunk = (chunk: string) => {
      if (!chunk) return;
      setMessages((prev) => {
        if (!prev.length) return prev;
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.role !== "assistant") return prev;
        updated[lastIndex] = {
          ...updated[lastIndex],
          content: `${updated[lastIndex].content}${chunk}`,
        };
        return updated;
      });
    };

    try {
      const reply = await sendChatRequest(nextHistory, { onChunk: appendChunk });
      setMessages((prev) => {
        if (!prev.length) return prev;
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.role !== "assistant") return prev;
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
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [visibleMessages]);

  return (
    <motion.div
      className="w-full lg:w-[40%] rounded-[20px] p-6 flex flex-col glass-panel relative overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{
        background: "radial-gradient(circle at 20% 20%, rgba(232,206,194,0.25), transparent 50%), radial-gradient(circle at 80% 0%, rgba(102,156,70,0.25), transparent 45%)"
      }} />
      <div className="relative flex flex-col gap-4 min-h-[360px] h-full">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <span className="chip inline-flex items-center gap-2">
              <Sparkles size={12} />
              Chatbot
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </div>
        </motion.div>
        <div className="flex-1 flex flex-col min-h-0 gap-3">
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 space-y-3 text-sm overflow-y-auto pr-2"
          >
            {visibleMessages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}-${msg.content.slice(0, 8)}`}
                className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    msg.role === "assistant"
                      ? "bubble-muted text-left"
                      : "bg-[var(--accent)] text-white text-right"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {error && (
              <div className="card-row text-xs text-red-500">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-[var(--card-border)]">
            <ChatInputBar
              ref={inputRef}
              value={input}
              placeholder="Ask anything"
              onChange={setInput}
              onSubmit={handleSend}
              disabled={!canSend}
              isLoading={isLoading}
            />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Chatbot can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
