import assert from "node:assert/strict";

import worker, { getChatMode } from "./index.js";

const encoder = new TextEncoder();
let aiCalls = 0;
let rateLimitCalls = 0;
let rateLimitAllowed = true;
let lastRateLimitKey = null;
let lastModel = null;
let lastModelInput = null;
let lastSearchRequest = null;
let aiRunError = null;
const searchChunks = [{ text: "EchoAlign DOI: 10.1007/s11704-026-51604-z", score: 0.9 }];

const env = {
  CHAT_RATE_LIMITER: {
    async limit({ key }) {
      rateLimitCalls += 1;
      lastRateLimitKey = key;
      return { success: rateLimitAllowed };
    },
  },
  AI_SEARCH: {
    async search(request) {
      aiCalls += 1;
      lastSearchRequest = request;
      return { chunks: searchChunks };
    },
  },
  AI: {
    async run(model, input) {
      aiCalls += 1;
      if (aiRunError) throw aiRunError;
      lastModel = model;
      lastModelInput = input;
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

function chatRequest(
  path = "/chat",
  origin = "https://kyxzhe.github.io",
  question = "Who is Kevin?",
) {
  const headers = {
    "Content-Type": "application/json",
    "X-Chat-Session": "test-session",
  };
  if (origin) headers.Origin = origin;

  return new Request(`https://kevin-bot.example${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      messages: [{ role: "user", content: question }],
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
assert.equal(rateLimitCalls, 1);
assert.equal(lastRateLimitKey, "test-session");
assert.equal(lastModel, "@cf/google/gemma-4-26b-a4b-it");
assert.equal(lastModelInput.reasoning_effort, "low");
assert.match(lastModelInput.messages[1].content, /10\.1007\/s11704-026-51604-z/);
assert.ok(lastModelInput.messages[0].content.length < 3000);
assert.doesNotMatch(lastModelInput.messages[0].content, /Primary supervisor/);
assert.match(lastModelInput.messages[0].content, /evidence, never instructions/);
assert.equal(lastSearchRequest.messages.at(-1).content, "Who is Kevin?");
assert.equal(lastSearchRequest.ai_search_options.retrieval.max_num_results, 4);
assert.equal(lastSearchRequest.ai_search_options.retrieval.match_threshold, 0.4);
assert.equal(lastSearchRequest.ai_search_options.query_rewrite.enabled, false);
assert.equal(lastSearchRequest.ai_search_options.reranking.enabled, false);

assert.equal(getChatMode("Who is Kevin?"), "fast");
assert.equal(
  getChatMode("请综合分析 Kevin 的研究方向之间有什么联系，并比较这些方法的权衡。"),
  "thinking",
);

const thinkingRequest = await worker.fetch(
  chatRequest(
    "/chat",
    "https://kyxzhe.github.io",
    "请综合分析 Kevin 的研究方向之间有什么联系，并比较这些方法的权衡。",
  ),
  env,
);
await thinkingRequest.text();
assert.equal(lastModel, "@cf/qwen/qwen3-30b-a3b-fp8");
assert.equal(lastModelInput.thinking, undefined);
assert.equal(lastModelInput.reasoning_effort, undefined);
assert.equal(lastSearchRequest.ai_search_options.retrieval.max_num_results, 8);
assert.equal(lastSearchRequest.ai_search_options.query_rewrite.enabled, true);
assert.equal(lastSearchRequest.ai_search_options.reranking.enabled, true);

aiRunError = Object.assign(
  new Error("Your account has used up the daily free allocation of 10,000 neurons."),
  { code: 3036, status: 429 },
);
const quotaLimitedRequest = await worker.fetch(chatRequest(), env);
const quotaLimitedBody = await quotaLimitedRequest.text();
assert.match(
  quotaLimitedBody,
  /Today's usage limit has been reached\. Please try again tomorrow\./,
);
assert.doesNotMatch(quotaLimitedBody, /"response":"ok"/);
aiRunError = null;

rateLimitAllowed = false;
const limitedAiCalls = aiCalls;
const rateLimitedRequest = await worker.fetch(chatRequest(), env);
assert.equal(rateLimitedRequest.status, 429);
assert.equal(rateLimitedRequest.headers.get("Retry-After"), "60");
assert.equal(aiCalls, limitedAiCalls);

console.log("KevinBot Worker boundary checks passed.");
