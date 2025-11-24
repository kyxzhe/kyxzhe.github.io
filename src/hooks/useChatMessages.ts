"use client";

import { useEffect, useState } from "react";
import { type ChatMessage } from "@/lib/api/chat";

interface UseChatMessagesOptions {
  storageKey: string;
  assistantGreeting?: string;
}

function createBaseHistory(assistantGreeting?: string): ChatMessage[] {
  return assistantGreeting ? [{ role: "assistant", content: assistantGreeting }] : [];
}

export function useChatMessages(options: UseChatMessagesOptions) {
  const { storageKey, assistantGreeting } = options;

  const getInitialMessages = () => {
    const emptyHistory = createBaseHistory(assistantGreeting);
    if (typeof window === "undefined") {
      return emptyHistory;
    }

    const raw = sessionStorage.getItem(storageKey);
    if (!raw) {
      return emptyHistory;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return emptyHistory;
      }

      const validChats = parsed.filter((item): item is ChatMessage => {
        if (!item || typeof item !== "object") return false;
        const role = (item as Record<string, unknown>).role;
        const content = (item as Record<string, unknown>).content;
        return (
          typeof role === "string" &&
          ["system", "user", "assistant"].includes(role) &&
          typeof content === "string"
        );
      });
      return validChats.length > 0 ? validChats : emptyHistory;
    } catch {
      return emptyHistory;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasHistory = messages.some((msg) => msg.role !== "system");
    try {
      if (hasHistory) {
        sessionStorage.setItem(storageKey, JSON.stringify(messages));
      } else {
        sessionStorage.removeItem(storageKey);
      }
    } catch {
      // ignore storage write failures (e.g., quota limits)
    }
  }, [messages, storageKey]);

  return [messages, setMessages] as const;
}
