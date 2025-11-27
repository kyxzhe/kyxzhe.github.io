"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, MessagesSquare, Sparkles, X } from "lucide-react";
import ChatInputBar from "@/components/ChatInputBar";
import { type ChatMessage, sendChatRequest } from "@/lib/api/chat";
import { useChatMessages } from "@/hooks/useChatMessages";

interface ChatBotModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatBotModal({ open, onClose }: ChatBotModalProps) {
  const [messages, setMessages] = useChatMessages({
    storageKey: "chatbot-modal-history",
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const canSend = input.trim().length > 0 && !isLoading;

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const visibleMessages = useMemo(
    () => messages.filter((message) => message.role !== "system"),
    [messages]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [visibleMessages]);

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

  const latestMessages = useMemo(() => visibleMessages.slice(-12), [visibleMessages]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="surface-card w-full max-w-3xl max-h-[90vh] flex flex-col p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 rounded-full bg-[var(--accent-soft)] p-2 text-[var(--accent)] hover:opacity-80 transition-opacity"
              aria-label="Close chat"
              onClick={onClose}
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="chip inline-flex items-center gap-2">
                <Sparkles size={14} />
                Chatbot
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Beta</span>
            </div>
            <h2 className="text-2xl font-semibold mb-1 flex items-center gap-2">
              KevinBot
              <MessagesSquare size={18} className="text-brand-accent" />
            </h2>
            <p className="text-[16px] leading-[1.5] text-muted-foreground mb-4">
              Powered by Cloudflare Workers AI. Treat responses as friendly context, not formal advice.
            </p>
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
              {latestMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}-${message.content.slice(0, 8)}`}
                  className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] text-[16px] leading-[1.5] ${
                      message.role === "assistant"
                        ? "rounded-2xl px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] text-foreground"
                        : "rounded-full px-5 py-2 bg-[rgba(233,233,233,0.5)] text-foreground dark:bg-[rgba(50,50,50,0.85)] dark:text-white"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase tracking-[0.3em] mb-1 ${
                        message.role === "user"
                          ? "text-right text-white/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.role === "assistant" ? "KevinBot" : "You"}
                    </p>
                    <p
                      className={`whitespace-pre-line ${
                        message.role === "user" ? "text-right text-white" : ""
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {error && (
              <div className="card-row text-[16px] leading-[1.4] text-red-500">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}
            <div className="mt-3">
              <ChatInputBar
                ref={inputRef}
                value={input}
                placeholder="Ask anything"
                onChange={setInput}
                onSubmit={handleSend}
                disabled={!canSend}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
