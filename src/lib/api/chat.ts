"use client";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const DEFAULT_CHAT_API_URL = "https://kevin-bot.kyx-zhe.workers.dev/chat";
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL ?? DEFAULT_CHAT_API_URL;

export async function sendChatRequest(messages: ChatMessage[]): Promise<string> {
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
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Chat service returned ${response.status}. ${
        errorText ? `Details: ${errorText}` : ""
      }`
    );
  }

  const data = (await response.json()) as { response?: string };
  if (!data.response) {
    throw new Error("Chat service did not return a response field.");
  }

  return data.response.trim();
}
