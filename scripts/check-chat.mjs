import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  limitChatMessages,
  MAX_CHAT_MESSAGES,
  MAX_CHAT_MESSAGE_CHARS,
  sendChatRequest,
} from "../src/lib/api/chat.ts";

const messages = Array.from({ length: 24 }, (_, index) => ({
  role: index % 2 === 0 ? "user" : "assistant",
  content: `${index}:${"x".repeat(MAX_CHAT_MESSAGE_CHARS + 1)}`,
}));
const limited = limitChatMessages(messages);
assert.equal(limited.length, MAX_CHAT_MESSAGES);
assert.equal(limited.at(-1).content.length, MAX_CHAT_MESSAGE_CHARS);
assert.match(limited.at(-1).content, /^23:/);

const unicodeHistory = Array.from({ length: MAX_CHAT_MESSAGES }, (_, index) => ({
  role: index % 2 === 0 ? "user" : "assistant",
  content: "问".repeat(MAX_CHAT_MESSAGE_CHARS),
}));
const byteLimited = limitChatMessages(
  unicodeHistory,
  MAX_CHAT_MESSAGES,
  MAX_CHAT_MESSAGE_CHARS,
  80_000
);
assert.ok(
  new TextEncoder().encode(JSON.stringify({ messages: byteLimited })).byteLength <= 80_000
);
assert.equal(byteLimited.at(-1).content, unicodeHistory.at(-1).content);

const originalFetch = globalThis.fetch;
globalThis.fetch = async () =>
  new Response("data: [DONE]\n\n", {
    headers: { "Content-Type": "text/event-stream" },
  });
await assert.rejects(
  sendChatRequest([{ role: "user", content: "Hello" }], { chunkThrottleMs: 0 }),
  /empty response/
);
globalThis.fetch = originalFetch;

const statuses = [];
const originalSetTimeout = globalThis.setTimeout;
let requestTimeouts = 0;
globalThis.setTimeout = (callback, delay, ...args) => {
  if (delay === 45_000) requestTimeouts += 1;
  return originalSetTimeout(callback, delay, ...args);
};
globalThis.fetch = async () =>
  new Response(
    'data: {"response":"","meta":{"stage":"searching"}}\n\ndata: {"response":"Hi"}\n\ndata: [DONE]\n\n',
    { headers: { "Content-Type": "text/event-stream" } }
  );
assert.equal(
  await sendChatRequest([{ role: "user", content: "Hello" }], {
    chunkThrottleMs: 0,
    onStatus: (status) => statuses.push(status),
  }),
  "Hi"
);
assert.deepEqual(statuses, ["searching"]);
assert.ok(requestTimeouts >= 3);
globalThis.fetch = originalFetch;
globalThis.setTimeout = originalSetTimeout;

const homeSource = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
assert.match(homeSource, /shouldFollowStreamRef/);
assert.match(homeSource, /onScroll=\{handleHistoryScroll\}/);
assert.match(homeSource, /Searching Kevin’s knowledge/);

const abortController = new AbortController();
globalThis.fetch = async (_url, init) =>
  new Promise((_resolve, reject) => {
    init.signal.addEventListener(
      "abort",
      () => reject(new DOMException("Aborted", "AbortError")),
      { once: true }
    );
  });
const abortedRequest = sendChatRequest([{ role: "user", content: "Cancel" }], {
  signal: abortController.signal,
});
abortController.abort();
await assert.rejects(abortedRequest, { name: "AbortError" });
globalThis.fetch = originalFetch;

console.log("chat regression checks passed");
