"use client";

import { useEffect, useState } from "react";
import { type ChatMessage } from "@/lib/api/chat";

interface UseChatMessagesOptions {
  storageKey: string;
  systemMessage: string;
  assistantGreeting?: string;
}

function createBaseHistory(systemMessage?: string, assistantGreeting?: string): ChatMessage[] {
  const base: ChatMessage[] = [];
  if (systemMessage) {
    base.push({ role: "system", content: systemMessage });
  }
  if (assistantGreeting) {
    base.push({ role: "assistant", content: assistantGreeting });
  }
  return base;
}

function normalizeStoredMessages(
  parsed: unknown[],
  systemMessage?: string
): ChatMessage[] {
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

  if (!systemMessage) {
    return validChats;
  }

  const systemIndex = validChats.findIndex((entry) => entry.role === "system");
  if (systemIndex === -1) {
    return [{ role: "system", content: systemMessage }, ...validChats];
  }
  if (systemIndex === 0) {
    return validChats;
  }

  const rest = [...validChats];
  const [systemEntry] = rest.splice(systemIndex, 1);
  return [systemEntry, ...rest];
}

export function useChatMessages(options: UseChatMessagesOptions) {
  const { storageKey, systemMessage, assistantGreeting } = options;

  const getInitialMessages = () => {
    const emptyHistory = createBaseHistory(systemMessage, assistantGreeting);
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

      const normalized = normalizeStoredMessages(parsed, systemMessage);
      return normalized.length > 0 ? normalized : emptyHistory;
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
