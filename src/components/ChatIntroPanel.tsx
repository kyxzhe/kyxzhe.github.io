"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Loader2, Send, Sparkles } from "lucide-react";
import { cardVariants } from "@/lib/animation/variants";
import { type ChatMessage, sendChatRequest } from "@/lib/api/chat";

export default function ChatIntroPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m KevinBot. Ask me about research, teaching, certifications, or where to find a good flat white.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canSend = input.trim().length > 0 && !isLoading;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!canSend) return;
    const nextInput = input.trim();
    setInput("");
    setError(null);

    const nextHistory: ChatMessage[] = [
      ...messages,
      { role: "user" as const, content: nextInput },
    ];
    setMessages(nextHistory);
    setIsLoading(true);

    try {
      const reply = await sendChatRequest(nextHistory);
      setMessages((prev) => [...prev, { role: "assistant" as const, content: reply }]);
    } catch (err) {
      console.error(err);
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
  }, [messages]);

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
      <div className="relative flex flex-col gap-4 min-h-[320px]">
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
        <div
          ref={scrollRef}
          className="space-y-3 text-sm overflow-y-auto pr-2 pb-2 max-h-[260px]"
        >
          {messages.map((msg, idx) => (
            <div
              key={`${msg.role}-${idx}-${msg.content.slice(0, 8)}`}
              className={`flex ${msg.role === "assistant" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  msg.role === "assistant"
                    ? "bg-[var(--accent)] text-white"
                    : "bubble-muted"
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
        <div className="mt-auto pt-4 border-t border-[var(--card-border)]">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask KevinBot..."
              className="flex-1 rounded-2xl border border-border px-3 py-2 bg-transparent focus:outline-none focus:border-foreground text-sm"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {isLoading ? "Thinking" : "Send"}
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Chatbot can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
