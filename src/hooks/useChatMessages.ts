"use client";

import { useEffect, useState } from "react";
import { type ChatMessage } from "@/lib/api/chat";

interface UseChatMessagesOptions {
  storageKey: string;
  assistantGreeting?: string;
  maxMessages?: number;
  persistDebounceMs?: number;
}

function createBaseHistory(assistantGreeting?: string): ChatMessage[] {
  return assistantGreeting ? [{ role: "assistant", content: assistantGreeting }] : [];
}

function isChatMessage(item: unknown): item is ChatMessage {
  if (!item || typeof item !== "object") return false;
  const role = (item as Record<string, unknown>).role;
  const content = (item as Record<string, unknown>).content;
  return (
    typeof role === "string" &&
    ["system", "user", "assistant"].includes(role) &&
    typeof content === "string"
  );
}

function trimMessages(messages: ChatMessage[], maxMessages: number) {
  if (messages.length <= maxMessages) {
    return messages;
  }

  const systemMessages = messages.filter((message) => message.role === "system");
  const conversationalMessages = messages.filter((message) => message.role !== "system");
  return [...systemMessages, ...conversationalMessages.slice(-maxMessages)];
}

export function useChatMessages(options: UseChatMessagesOptions) {
  const {
    storageKey,
    assistantGreeting,
    maxMessages = 16,
    persistDebounceMs = 180,
  } = options;

  const getInitialMessages = () => {
    const emptyHistory = createBaseHistory(assistantGreeting);
    if (typeof window === "undefined") {
      return emptyHistory;
    }

    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) {
        return emptyHistory;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return emptyHistory;
      }

      const validChats = parsed.filter(isChatMessage);
      if (validChats.length === 0) {
        return emptyHistory;
      }

      return trimMessages(validChats, maxMessages);
    } catch {
      return emptyHistory;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasHistory = messages.some((msg) => msg.role !== "system");
    const payload = trimMessages(messages, maxMessages);
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      timeoutId = setTimeout(() => {
        try {
          if (hasHistory) {
            sessionStorage.setItem(storageKey, JSON.stringify(payload));
          } else {
            sessionStorage.removeItem(storageKey);
          }
        } catch {
          // ignore storage write failures (e.g., quota limits)
        }
      }, persistDebounceMs);
    } catch {
      // ignore storage write failures (e.g., quota limits)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [maxMessages, messages, persistDebounceMs, storageKey]);

  return [messages, setMessages] as const;
}
