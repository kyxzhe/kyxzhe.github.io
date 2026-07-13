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
const CHAT_REQUEST_TIMEOUT_MS = 45_000;
const MAX_CHAT_BODY_BYTES = 80_000;
export const MAX_CHAT_MESSAGES = 16;
export const MAX_CHAT_MESSAGE_CHARS = 4000;
let cachedChatSessionId: string | null = null;

export interface ChatRequestOptions {
  signal?: AbortSignal;
  onChunk?: (chunk: string) => void;
  onStatus?: (status: string) => void;
  chunkThrottleMs?: number;
}

function createRequestAbortSignal(callerSignal?: AbortSignal) {
  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort();
  let timeoutId: ReturnType<typeof setTimeout>;
  const keepAlive = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, CHAT_REQUEST_TIMEOUT_MS);
  };
  keepAlive();

  if (callerSignal?.aborted) {
    abortFromCaller();
  } else {
    callerSignal?.addEventListener("abort", abortFromCaller, { once: true });
  }

  return {
    signal: controller.signal,
    didTimeOut: () => timedOut,
    keepAlive,
    cleanup: () => {
      clearTimeout(timeoutId);
      callerSignal?.removeEventListener("abort", abortFromCaller);
    },
  };
}

export function limitChatMessages(
  messages: ChatMessage[],
  maxMessages = MAX_CHAT_MESSAGES,
  maxMessageChars = MAX_CHAT_MESSAGE_CHARS,
  maxBodyBytes = Number.POSITIVE_INFINITY
) {
  const limited = messages.slice(-Math.max(1, maxMessages)).map((message) => ({
    ...message,
    content: message.content.slice(0, maxMessageChars),
  }));

  if (Number.isFinite(maxBodyBytes)) {
    const encoder = new TextEncoder();
    while (
      limited.length > 1 &&
      encoder.encode(JSON.stringify({ messages: limited })).byteLength > maxBodyBytes
    ) {
      limited.shift();
    }
  }

  return limited;
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
  const requestMessages = limitChatMessages(
    messages,
    MAX_CHAT_MESSAGES,
    MAX_CHAT_MESSAGE_CHARS,
    MAX_CHAT_BODY_BYTES
  );
  const requestAbort = createRequestAbortSignal(options?.signal);

  try {
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      referrerPolicy: "no-referrer",
      headers: {
        "Content-Type": "application/json",
        ...(sessionId ? { "X-Chat-Session": sessionId } : {}),
      },
      body: JSON.stringify({ messages: requestMessages }),
      signal: requestAbort.signal,
    });
    requestAbort.keepAlive();

    if (!response.ok) {
      const errorText = await readErrorText(response);
      throw new Error(
        `Chat service returned ${response.status}.${errorText ? ` ${errorText}` : ""}`
      );
    }

    // Prefer streaming SSE responses.
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("text/event-stream") && response.body) {
      const reply = await readSseStream(
        response.body,
        options?.onChunk,
        options?.onStatus,
        options?.chunkThrottleMs,
        requestAbort.keepAlive
      );
      if (reply) return reply;
      throw new Error("Chat service returned an empty response. Please try again.");
    }

    // Support the older one-shot JSON response shape.
    const data = await response.json().catch(() => null);
    const reply = extractText(data);
    if (reply) {
      return reply.trim();
    }

    throw new Error("Chat service did not return a valid response.");
  } catch (error) {
    if (requestAbort.didTimeOut() && !options?.signal?.aborted) {
      throw new Error("KevinBot took too long to respond. Please try again.");
    }
    throw error;
  } finally {
    requestAbort.cleanup();
  }
}

async function readErrorText(response: Response) {
  const text = await response.text().catch(() => "");
  if (!text) return "";

  try {
    const payload = JSON.parse(text) as unknown;
    if (!payload || typeof payload !== "object") return text;
    const record = payload as Record<string, unknown>;
    const message = record.error ?? record.message ?? record.detail;
    return typeof message === "string" ? message : text;
  } catch {
    return text;
  }
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
  onStatus?: (status: string) => void,
  chunkThrottleMs = 48,
  keepAlive?: () => void
): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";
  let pendingChunk = "";
  let done = false;
  let streamError = "";
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
      try {
        const payload = JSON.parse(data) as {
          error?: string;
          meta?: { stage?: string };
        };
        if (payload.error) streamError = payload.error;
        if (payload.meta?.stage) onStatus?.(payload.meta.stage);
      } catch {
        // Non-JSON SSE data can still contain a text chunk.
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
        keepAlive?.();
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split(/\r?\n\r?\n/);
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

  if (streamError) throw new Error(streamError);

  return fullText.trim();
}
