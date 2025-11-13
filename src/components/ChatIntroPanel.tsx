"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Loader2, Plus, Send } from "lucide-react";
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

  const latestMessages = useMemo(() => messages.slice(-6), [messages]);

  return (
    <motion.div
      className="w-full lg:w-[40%] rounded-[20px] flex flex-col h-[420px] glass-panel overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="bg-[var(--card)] px-6 py-4 border-b border-[var(--card-border)] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
            <Plus size={18} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">New chat</p>
            <p className="text-base font-medium">KevinBot</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </div>
      </div>
      <div className="flex-1 flex flex-col px-6 py-4 gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {latestMessages.map((msg, idx) => (
            <div key={`${msg.role}-${idx}-${msg.content.slice(0, 6)}`}>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
                {msg.role === "assistant" ? "KevinBot" : "You"}
              </p>
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "assistant"
                    ? "bg-[var(--card)] border border-[var(--card-border)]"
                    : "bg-[var(--accent-soft)] text-foreground border border-transparent"
                }`}
              >
                {msg.content}
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
        <div className="border-t border-[var(--card-border)] pt-4 flex gap-3 items-center">
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
            placeholder="Send a message..."
            className="flex-1 rounded-2xl border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground text-sm"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="btn-primary inline-flex items-center gap-2 px-4 py-3 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {isLoading ? "Thinking" : "Send"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Chatbot can make mistakes. Check important info.
        </p>
      </div>
    </motion.div>
  );
}
