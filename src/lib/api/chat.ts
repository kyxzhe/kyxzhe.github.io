"use client";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const DEFAULT_CHAT_API_URL = "https://kevin-bot.kyx-zhe.workers.dev/chat";
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL ?? DEFAULT_CHAT_API_URL;

export interface ChatRequestOptions {
  signal?: AbortSignal;
  onChunk?: (chunk: string) => void;
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

  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

  // 优先走 SSE 流
  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("text/event-stream") && response.body) {
    return readSseStream(response.body, options?.onChunk);
  }

  // 兼容旧的 JSON 一次性返回
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

  return (
    val("response") ??
    val("content") ??
    val("text") ??
    (payload as { delta?: { content?: string; text?: string } }).delta?.content ??
    (payload as { delta?: { content?: string; text?: string } }).delta?.text ??
    null
  );
}

async function readSseStream(
  stream: ReadableStream<Uint8Array>,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";
  let done = false;

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
        onChunk?.(chunk);
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
        // flush remaining buffer
        buffer += decoder.decode();
        if (buffer.trim()) {
          handleEvent(buffer);
        }
        break;
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullText.trim();
}
