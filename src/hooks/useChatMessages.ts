"use client";

import { useCallback, useEffect, useState, type SetStateAction } from "react";
import {
  limitChatMessages,
  MAX_CHAT_MESSAGES,
  MAX_CHAT_MESSAGE_CHARS,
  type ChatMessage,
} from "@/lib/api/chat";

interface UseChatMessagesOptions {
  storageKey: string;
  assistantGreeting?: string;
  maxMessages?: number;
  maxMessageChars?: number;
  persistDebounceMs?: number;
}

function createBaseHistory(
  assistantGreeting: string | undefined,
  maxMessageChars: number
): ChatMessage[] {
  return assistantGreeting
    ? [{ role: "assistant", content: assistantGreeting.slice(0, maxMessageChars) }]
    : [];
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

export function useChatMessages(options: UseChatMessagesOptions) {
  const {
    storageKey,
    assistantGreeting,
    maxMessages = MAX_CHAT_MESSAGES,
    maxMessageChars = MAX_CHAT_MESSAGE_CHARS,
    persistDebounceMs = 180,
  } = options;

  const getInitialMessages = () => {
    const emptyHistory = createBaseHistory(assistantGreeting, maxMessageChars);
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

      return limitChatMessages(validChats, maxMessages, maxMessageChars);
    } catch {
      return emptyHistory;
    }
  };

  const [messages, setStoredMessages] = useState<ChatMessage[]>(getInitialMessages);
  const setMessages = useCallback(
    (action: SetStateAction<ChatMessage[]>) => {
      setStoredMessages((previous) => {
        const next = typeof action === "function" ? action(previous) : action;
        return limitChatMessages(next, maxMessages, maxMessageChars);
      });
    },
    [maxMessageChars, maxMessages]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasHistory = messages.some((msg) => msg.role !== "system");
    const payload = limitChatMessages(messages, maxMessages, maxMessageChars);
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
  }, [maxMessageChars, maxMessages, messages, persistDebounceMs, storageKey]);

  return [messages, setMessages] as const;
}
