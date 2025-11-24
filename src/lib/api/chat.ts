"use client";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface ChatStreamOptions {
  signal?: AbortSignal;
  onChunk?: (chunk: string) => void;
}

const DEFAULT_CHAT_API_URL = "https://kevin-bot.kyx-zhe.workers.dev/chat";
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL ?? DEFAULT_CHAT_API_URL;

export async function sendChatRequest(
  messages: ChatMessage[],
  options?: ChatStreamOptions
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

  const contentType = (response.headers.get("content-type") ?? "").toLowerCase();
  if (contentType.includes("event-stream") && response.body) {
    return streamSseResponse(response.body, options?.onChunk);
  }

  const fallbackText = await response.text();
  let parsedFallback: Record<string, unknown> | null = null;
  try {
    parsedFallback = JSON.parse(fallbackText);
  } catch {
    // swallow parse errors so we can treat the response as raw text
  }

  const finalText =
    (parsedFallback && extractChunkFromPayload(parsedFallback)) ??
    (typeof fallbackText === "string" ? fallbackText : null);

  if (!finalText || !finalText.trim()) {
    throw new Error("Chat service did not return a valid response.");
  }

  return finalText.trim();
}

async function streamSseResponse(
  body: ReadableStream<Uint8Array>,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";
  let done = false;

  const processLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return false;
    }

    if (!trimmed.startsWith("data:")) {
      return false;
    }

    const payload = trimmed.slice(5).trim();
    if (!payload) {
      return false;
    }

    if (payload === "[DONE]") {
      done = true;
      return true;
    }

    const chunk = extractChunkFromPayload(payload);
    if (chunk) {
      accumulated += chunk;
      onChunk?.(chunk);
    }

    return false;
  };

  try {
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) {
        buffer += decoder.decode(value, { stream: true });
      }
      if (streamDone) {
        break;
      }

      const parts = buffer.split(/\r?\n/);
      buffer = parts.pop() ?? "";
      for (const part of parts) {
        if (processLine(part)) {
          break;
        }
      }
    }

    if (!done && buffer) {
      processLine(buffer);
    }
  } finally {
    reader.releaseLock();
  }

  return accumulated.trim();
}

function extractChunkFromPayload(payload: string | Record<string, unknown>): string | null {
  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      return extractChunkFromPayload(parsed);
    } catch {
      return payload;
    }
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const asString = (value: unknown): string | null =>
    typeof value === "string" && value.length > 0 ? value : null;

  const responseText = asString(payload["response"]);
  if (responseText) {
    return responseText;
  }

  const contentText = asString(payload["content"]);
  if (contentText) {
    return contentText;
  }

  const textValue = asString(payload["text"]);
  if (textValue) {
    return textValue;
  }

  const chunkValue = asString(payload["chunk"]);
  if (chunkValue) {
    return chunkValue;
  }

  const message = payload["message"];
  if (message && typeof message === "object") {
    const messageContent = asString((message as Record<string, unknown>)["content"]);
    if (messageContent) {
      return messageContent;
    }
  }

  const delta = payload["delta"];
  if (delta) {
    if (typeof delta === "string") {
      return delta;
    }
    if (typeof delta === "object" && delta !== null) {
      const deltaContent = asString((delta as Record<string, unknown>)["content"]);
      if (deltaContent) {
        return deltaContent;
      }
      const deltaText = asString((delta as Record<string, unknown>)["text"]);
      if (deltaText) {
        return deltaText;
      }
    }
  }

  const choices = payload["choices"];
  if (Array.isArray(choices)) {
    for (const choice of choices) {
      const chunk = extractChunkFromPayload(choice as Record<string, unknown>);
      if (chunk) {
        return chunk;
      }
    }
  }

  return null;
}
