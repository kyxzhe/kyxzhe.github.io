import assert from "node:assert/strict";

import worker from "./index.js";

const encoder = new TextEncoder();
let aiCalls = 0;

const env = {
  AI: {
    autorag() {
      return {
        async search() {
          aiCalls += 1;
          return { data: [] };
        },
      };
    },
    async run() {
      aiCalls += 1;
      return new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode('data: {"response":"ok"}\n\ndata: [DONE]\n\n'),
          );
          controller.close();
        },
      });
    },
  },
};

function chatRequest(path = "/chat", origin = "https://kyxzhe.github.io") {
  const headers = { "Content-Type": "application/json" };
  if (origin) headers.Origin = origin;

  return new Request(`https://kevin-bot.example${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      messages: [{ role: "user", content: "Who is Kevin?" }],
    }),
  });
}

const maliciousOrigin = await worker.fetch(
  chatRequest("/chat", "https://attacker.example"),
  env,
);
assert.equal(maliciousOrigin.status, 403);
assert.equal(maliciousOrigin.headers.get("Access-Control-Allow-Origin"), null);
assert.equal(aiCalls, 0);

const missingOrigin = await worker.fetch(chatRequest("/chat", ""), env);
assert.equal(missingOrigin.status, 403);
assert.equal(aiCalls, 0);

const wrongPath = await worker.fetch(chatRequest("/admin"), env);
assert.equal(wrongPath.status, 404);
assert.equal(aiCalls, 0);

const localPreflight = await worker.fetch(
  new Request("https://kevin-bot.example/chat", {
    method: "OPTIONS",
    headers: { Origin: "http://localhost:3000" },
  }),
  env,
);
assert.equal(localPreflight.status, 204);
assert.equal(
  localPreflight.headers.get("Access-Control-Allow-Origin"),
  "http://localhost:3000",
);
assert.equal(aiCalls, 0);

const validRequest = await worker.fetch(chatRequest(), env);
assert.equal(validRequest.status, 200);
assert.match(validRequest.headers.get("Content-Type") || "", /text\/event-stream/);
assert.match(await validRequest.text(), /"response":"ok"/);
assert.equal(aiCalls, 2);

console.log("KevinBot Worker boundary checks passed.");
