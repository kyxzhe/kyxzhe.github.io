"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { cardVariants } from "@/lib/animation/variants";
import { type ChatMessage, sendChatRequest } from "@/lib/api/chat";
import ChatInputBar from "@/components/ChatInputBar";

export default function ChatIntroPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi there! Ask me about research, teaching, certifications, or where to find a good flat white.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const streamBufferRef = useRef("");
  const streamTimerRef = useRef<number | null>(null);
  const streamedOnceRef = useRef(false);
  const canSend = input.trim().length > 0 && !isLoading;

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
    streamBufferRef.current = "";
    streamedOnceRef.current = false;
    if (streamTimerRef.current) {
      clearTimeout(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setIsLoading(true);

    const flushBuffer = () => {
      setMessages((prev) => {
        if (!prev.length || !streamBufferRef.current) return prev;
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.role !== "assistant") return prev;
        updated[lastIndex] = {
          ...updated[lastIndex],
          content: `${updated[lastIndex].content}${streamBufferRef.current}`,
        };
        streamBufferRef.current = "";
        return updated;
      });
      if (streamBufferRef.current.length > 0) {
        streamTimerRef.current = window.setTimeout(flushBuffer, 28);
      } else {
        streamTimerRef.current = null;
      }
    };

    const appendChunk = (chunk: string) => {
      if (!chunk) return;
      streamedOnceRef.current = true;
      streamBufferRef.current += chunk;
      if (!streamTimerRef.current) {
        streamTimerRef.current = window.setTimeout(flushBuffer, 18);
      }
    };

    try {
      const reply = await sendChatRequest(nextHistory, { onChunk: appendChunk });
      if (!streamedOnceRef.current) {
        setMessages((prev) => {
          if (!prev.length) return prev;
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex]?.role !== "assistant") return prev;
          updated[lastIndex] = { ...updated[lastIndex], content: reply };
          return updated;
        });
      } else if (reply && reply.length > 0) {
        streamBufferRef.current += reply;
        if (!streamTimerRef.current) {
          streamTimerRef.current = window.setTimeout(flushBuffer, 18);
        }
      }
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
            {messages.map((msg, idx) => (
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
