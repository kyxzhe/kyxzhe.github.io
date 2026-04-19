const BASE_SYSTEM_PROMPT = `
You are KevinBot, the website assistant for Yuxiang (Kevin) Zheng.

Your job is to help visitors understand Kevin's research, teaching, publications, projects, background, and contact details.

Rules:
- Reply in the same language and writing system the user mainly uses.
- You are an AI representation of Kevin, not the human Kevin himself.
- You may use first person ("I") for a natural tone, but never claim to be the human Kevin.
- Be concise, accurate, warm, and professional.
- Prefer short answers unless the user asks for more detail.
- Use Markdown only when it improves readability.
- For Kevin-specific facts, rely on the profile and retrieved context. If something is unclear, say you are not sure instead of guessing.
- For questions slightly outside Kevin's profile, give a brief helpful answer and gently steer back to Kevin's work when appropriate.
`.trim();

const STABLE_PROFILE_CONTEXT = `
Kevin profile:
- Name: Yuxiang (Kevin) Zheng (郑宇翔)
- Location: Sydney, Australia
- Current role: PhD candidate in machine learning at the University of Technology Sydney (UTS), Behavioural Data Science Lab
- Research areas: information diffusion, misinformation and disinformation, robust learning, noisy labels, semi-supervised learning, multimodal and real-world AI systems
- Education: University of Sydney (Advanced Computing Honours and Mathematics), exchange studies at ETH Zürich
- Teaching: COMP5328/COMP4328 Advanced Machine Learning, DATA1002/DATA1902 Informatics: Data and Computation, plus a guest lecture on LLMs and GPT-style models
- Experience: research assistant work on noisy labels and semi-supervised learning; reviewer for major ML and CV venues
- Awards: University Medal, Dalyell Scholar, AWS Certified Machine Learning - Specialty
- Contact: best reached by email; open to research collaborations in information diffusion and robust ML
`.trim();

const MODEL_ID = "@cf/meta/llama-3.1-8b-instruct-fast";
const MAX_HISTORY_MESSAGES = 8;
const MAX_MESSAGE_CHARS = 1200;
const MAX_CONTEXT_RESULTS = 4;
const MAX_CONTEXT_CHARS = 3600;
const ALLOWED_ORIGINS = [
  "https://kyxzhe.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Chat-Session",
  };
}

function truncateText(text, maxChars) {
  if (typeof text !== "string") return "";
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars)}…`;
}

function isChatMessage(message) {
  if (!message || typeof message !== "object") return false;
  if (typeof message.content !== "string") return false;
  return message.role === "user" || message.role === "assistant";
}

function sanitizeHistory(messages) {
  return messages
    .filter(isChatMessage)
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: truncateText(message.content, MAX_MESSAGE_CHARS),
    }));
}

function shouldSearch(userQuestion) {
  const normalized = userQuestion.trim().toLowerCase();
  if (!normalized) return false;

  return ![
    "hi",
    "hello",
    "hey",
    "thanks",
    "thank you",
    "ok",
    "cool",
    "你好",
    "您好",
    "嗨",
    "哈喽",
    "谢谢",
    "好的",
  ].includes(normalized);
}

function buildSearchQuery(userQuestion, history) {
  const recentUserTurns = history
    .filter((message) => message.role === "user")
    .slice(-3)
    .map((message) => message.content.trim())
    .filter(Boolean);

  const query = recentUserTurns.join("\n");
  return truncateText(query || userQuestion, 600);
}

function buildRetrievalContext(docs) {
  const chunks = [];
  let totalChars = 0;

  for (const doc of docs) {
    const content = truncateText(doc?.content || "", 1200);
    if (!content) continue;

    const nextLength = totalChars + content.length;
    if (nextLength > MAX_CONTEXT_CHARS) break;

    chunks.push(content);
    totalChars = nextLength;
  }

  return chunks.join("\n\n---\n\n");
}

function extractChunkText(payload) {
  if (!payload || typeof payload !== "object") return null;

  const value = (key) => {
    const candidate = payload[key];
    return typeof candidate === "string" ? candidate : null;
  };

  if (value("response") !== null) return value("response");
  if (value("content") !== null) return value("content");
  if (value("text") !== null) return value("text");

  const delta = payload.delta;
  if (delta && typeof delta === "object") {
    if (typeof delta.content === "string") return delta.content;
    if (typeof delta.text === "string") return delta.text;
  }

  const choices = Array.isArray(payload.choices) ? payload.choices : [];
  for (const choice of choices) {
    if (!choice || typeof choice !== "object") continue;
    const choiceDelta = choice.delta;
    if (choiceDelta && typeof choiceDelta === "object") {
      if (typeof choiceDelta.content === "string") return choiceDelta.content;
      if (typeof choiceDelta.text === "string") return choiceDelta.text;
    }
    if (typeof choice.text === "string") return choice.text;
  }

  return null;
}

function normalizeAiStream(stream) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let sawDone = false;

  const encodeSse = (payload) => encoder.encode(`data: ${payload}\n\n`);

  return new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encodeSse(
          JSON.stringify({ response: "", meta: { stage: "processing" } }),
        ),
      );

      const reader = stream.getReader();

      const handleEventBlock = (eventBlock) => {
        const lines = eventBlock.split(/\r?\n/);
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data) continue;
          if (data === "[DONE]") {
            sawDone = true;
            controller.enqueue(encodeSse("[DONE]"));
            return true;
          }

          let parsed = null;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = null;
          }

          const chunk = parsed ? extractChunkText(parsed) : data;
          if (chunk !== null) {
            controller.enqueue(encodeSse(JSON.stringify({ response: chunk })));
          }

          if (parsed && parsed.usage) {
            controller.enqueue(
              encodeSse(JSON.stringify({ response: "", usage: parsed.usage })),
            );
          }
        }
        return false;
      };

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (value) {
            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split("\n\n");
            buffer = parts.pop() ?? "";
            for (const part of parts) {
              if (handleEventBlock(part)) {
                controller.close();
                return;
              }
            }
          }

          if (done) {
            buffer += decoder.decode();
            if (buffer.trim()) {
              handleEventBlock(buffer);
            }
            if (!sawDone) {
              controller.enqueue(encodeSse("[DONE]"));
            }
            controller.close();
            return;
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });
}

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST is allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const clientMessages = Array.isArray(body.messages) ? body.messages : [];
    const history = sanitizeHistory(clientMessages);
    const lastUserMessage = [...history]
      .reverse()
      .find((message) => message.role === "user" && message.content);
    const userQuestion = lastUserMessage?.content?.trim() || "";

    if (!userQuestion) {
      return new Response(
        JSON.stringify({ error: "Missing user question" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    try {
      let retrievalContext = "";
      if (shouldSearch(userQuestion)) {
        const searchResult = await env.AI
          .autorag("kevin-rag-index")
          .search({
            query: buildSearchQuery(userQuestion, history),
            max_num_results: MAX_CONTEXT_RESULTS,
            ranking_options: { score_threshold: 0.5 },
            rewrite_query: true,
          });

        const docs = Array.isArray(searchResult?.data) ? searchResult.data : [];
        retrievalContext = buildRetrievalContext(docs);
      }

      const messages = [
        { role: "system", content: BASE_SYSTEM_PROMPT },
        { role: "system", content: STABLE_PROFILE_CONTEXT },
        ...(retrievalContext
          ? [
              {
                role: "system",
                content: `Relevant context about Kevin:\n${retrievalContext}`,
              },
            ]
          : []),
        ...history,
      ];

      const sessionAffinity = request.headers.get("X-Chat-Session")?.trim();
      const aiOptions = sessionAffinity
        ? { headers: { "x-session-affinity": sessionAffinity } }
        : undefined;

      const stream = await env.AI.run(
        MODEL_ID,
        {
          messages,
          stream: true,
          temperature: 0.2,
          max_tokens: 320,
        },
        aiOptions,
      );

      return new Response(normalizeAiStream(stream), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    } catch (error) {
      console.error("AI error", error);

      return new Response(
        JSON.stringify({ error: "AI call failed" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }
  },
};
