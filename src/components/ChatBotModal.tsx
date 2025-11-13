"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, ArrowUp, Loader2, MessagesSquare, Sparkles, X } from "lucide-react";
import { type ChatMessage, sendChatRequest } from "@/lib/api/chat";

interface ChatBotModalProps {
  open: boolean;
  onClose: () => void;
}

const assistantGreeting =
  "Hi there! Ask me about research, teaching, certifications, or the best flat white in Sydney.";

export default function ChatBotModal({ open, onClose }: ChatBotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: assistantGreeting },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const canSend = input.trim().length > 0 && !isLoading;

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

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

  const latestMessages = useMemo(() => messages.slice(-12), [messages]);

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
            <p className="text-sm text-muted-foreground mb-4">
              Powered by Cloudflare Workers AI. Treat responses as friendly context, not formal advice.
            </p>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
              {latestMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}-${message.content.slice(0, 8)}`}
                  className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      message.role === "assistant"
                        ? "bg-[var(--card)] border border-[var(--card-border)] text-foreground"
                        : "bg-[var(--accent)] text-white"
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
              <div className="card-row text-sm text-red-500">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about research, teaching, or side quests..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 rounded-2xl border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground text-sm"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                className="btn-primary w-11 h-11 rounded-full flex items-center justify-center disabled:opacity-50"
                aria-label="Send message"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={16} />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
