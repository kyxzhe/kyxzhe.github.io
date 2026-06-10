"use client";

export type ChatRole = "system" | "user" | "assistant";
export type ChatMessage = {
  role: ChatRole;
  content: string;
};
type ChatChoice = {
  delta?: { content?: string; text?: string };
  text?: string;
};

const DEFAULT_CHAT_API_URL = "https://kevin-bot.kyx-zhe.workers.dev/chat";
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL ?? DEFAULT_CHAT_API_URL;
const CHAT_SESSION_KEY = "kevin-bot-session-id";
let cachedChatSessionId: string | null = null;

export interface ChatRequestOptions {
  signal?: AbortSignal;
  onChunk?: (chunk: string) => void;
  chunkThrottleMs?: number;
}

function getChatSessionId() {
  if (cachedChatSessionId) {
    return cachedChatSessionId;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    const existing = sessionStorage.getItem(CHAT_SESSION_KEY);
    if (existing) {
      cachedChatSessionId = existing;
      return existing;
    }

    const nextId = crypto.randomUUID();
    sessionStorage.setItem(CHAT_SESSION_KEY, nextId);
    cachedChatSessionId = nextId;
    return nextId;
  } catch {
    return null;
  }
}

export async function sendChatRequest(
  messages: ChatMessage[],
  options?: ChatRequestOptions
): Promise<string> {
  if (!CHAT_API_URL) {
    throw new Error(
      "Chat API URL is not configured. Set NEXT_PUBLIC_CHAT_API_URL to your Cloudflare Worker endpoint."
    );
  }

  const sessionId = getChatSessionId();
  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionId ? { "X-Chat-Session": sessionId } : {}),
    },
    body: JSON.stringify({ messages }),
    signal: options?.signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Chat service returned ${response.status}. ${
        errorText ? `Details: ${errorText}` : ""
      }`
    );
  }

  // Prefer streaming SSE responses.
  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("text/event-stream") && response.body) {
    return readSseStream(response.body, options?.onChunk, options?.chunkThrottleMs);
  }

  // Support the older one-shot JSON response shape.
  const data = (await response.json().catch(() => null)) as { response?: string } | null;
  if (data?.response) {
    return data.response.trim();
  }

  throw new Error("Chat service did not return a valid response.");
}

function extractText(payload: unknown): string | null {
  if (!payload) return null;
  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      return extractText(parsed);
    } catch {
      return payload;
    }
  }
  if (typeof payload !== "object") return null;

  const val = (key: string) => {
    const v = (payload as Record<string, unknown>)[key];
    return typeof v === "string" ? v : null;
  };
  const choice = (payload as { choices?: ChatChoice[] }).choices?.find(
    (item) =>
      typeof item?.delta?.content === "string" ||
      typeof item?.delta?.text === "string" ||
      typeof item?.text === "string"
  );

  return (
    val("response") ??
    val("content") ??
    val("text") ??
    choice?.delta?.content ??
    choice?.delta?.text ??
    choice?.text ??
    (payload as { delta?: { content?: string; text?: string } }).delta?.content ??
    (payload as { delta?: { content?: string; text?: string } }).delta?.text ??
    null
  );
}

async function readSseStream(
  stream: ReadableStream<Uint8Array>,
  onChunk?: (chunk: string) => void,
  chunkThrottleMs = 48
): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";
  let pendingChunk = "";
  let done = false;
  let flushTimer: ReturnType<typeof setTimeout> | null = null;

  const flushPendingChunk = () => {
    if (!pendingChunk) return;
    onChunk?.(pendingChunk);
    pendingChunk = "";
  };

  const enqueueChunk = (chunk: string) => {
    if (!onChunk) return;
    if (chunkThrottleMs <= 0) {
      onChunk(chunk);
      return;
    }

    pendingChunk += chunk;
    if (flushTimer) return;
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flushPendingChunk();
    }, chunkThrottleMs);
  };

  const handleEvent = (eventBlock: string) => {
    const lines = eventBlock.split(/\r?\n/);
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data) continue;
      if (data === "[DONE]") {
        done = true;
        return;
      }
      const chunk = extractText(data);
      if (chunk) {
        fullText += chunk;
        enqueueChunk(chunk);
      }
    }
  };

  try {
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          handleEvent(part);
          if (done) break;
        }
      }
      if (streamDone) {
        // Flush the remaining buffer.
        buffer += decoder.decode();
        if (buffer.trim()) {
          handleEvent(buffer);
        }
        break;
      }
    }
  } finally {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    flushPendingChunk();
    reader.releaseLock();
  }

  return fullText.trim();
}
