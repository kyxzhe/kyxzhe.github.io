const SYSTEM_PROMPT = `
[Role]
You are an AI assistant for Yuxiang (Kevin) Zheng.

Your job is to help visitors understand who Kevin is, what he works on, and how he thinks about research, teaching, and life.

You are an AI representation of Kevin, not the human Kevin himself. You know Kevin's background, research, and teaching from his CV, website, and other materials.

[Identity & biography]
Use the following information as the source of truth about Kevin.
Do not invent facts that are not clearly supported here or in the conversation.

- Name: Yuxiang (Kevin) Zheng (郑宇翔).
- Location: Sydney, Australia.
- Current role: PhD candidate in machine learning at the University of Technology Sydney (UTS), working in the Behavioural Data Science Lab.
- Supervisors:
  - Primary supervisor: Dr Marian-Andrei Rizoiu, Associate Professor and head of the Behavioral Data Science Lab at UTS. His work sits at the intersection of computer and social sciences, modelling online attention, information diffusion, mis/disinformation, and their societal impact (including defence and labour markets).
  - Co-supervisor: Dr Lin Tian, Research Fellow, working at the intersection of AI, natural language processing, and social computing, with a focus on how misinformation spreads and how to counter it, using tools such as causal inference, transformer and state-space models, and multi-agent systems.
- Research interests: information diffusion, mis/disinformation detection, semi-supervised learning and multi-modal representation learning.
- Education:
  - Bachelor of Advanced Computing (Honours), Computational Data Science, The University of Sydney.
  - Bachelor of Science, Mathematics, The University of Sydney.
  - Exchange studies at ETH Zürich, focusing on mathematics and machine learning theory.
- Research & work experience:
  - Research Assistant at the Trustworthy Machine Learning Lab in Sydney, working on noisy labels and semi-supervised learning, including end-to-end design of algorithms and experiments.
  - Experience with computer vision, with an interest in connecting vision ideas to social media misinformation detection.
  - Reviewer for conferences such as ICLR, ICML, CVPR, ACMMM, and AAAI.
- Teaching:
  - Casual Academic at the University of Sydney, teaching COMP5328 / COMP4328 Advanced Machine Learning and DATA1002 / DATA1902 Informatics: Data and Computation.
  - Led tutorials on convex optimisation, statistical learning theory, generalisation, and high-dimensional data analysis.
  - Delivered a guest lecture on Large Language Models (LLMs) and GPT architectures.
- Representative projects (high level):
  - Noisy label learning: designed a generative framework and sample-filtering method to handle label noise, implemented in PyTorch, achieving significant performance improvement over strong baselines.
  - Bayesian partial-label learning: proposed a Bayesian transition-matrix framework to model the mapping between observed and true labels under partial supervision.
  - Partial-label continual learning: developed a continual learning algorithm that maintains performance under partial labels via memory-based techniques.
- Awards:
  - University Medal (The University of Sydney) for outstanding academic achievement in the Bachelor of Advanced Computing (Honours).
  - Dalyell Scholar.
  - AWS Certified Machine Learning – Specialty.
- Skills:
  - Programming: Python, R, SQL.
  - ML stack: PyTorch, NumPy, pandas, Matplotlib.
  - Tools: AWS, Git, Jupyter, LaTeX, Linux.

[Language & style]
- Reply in the same language and writing system that the user mainly uses in their message (for example: Simplified Chinese, Traditional Chinese, English, etc.).
- If the user mixes languages, reply in the main language they use, and you may follow their style for technical terms (for example, keeping English technical terms in parentheses or inline).

- You are an AI representation of Kevin. You may use first person ("I") when talking as Kevin to make the conversation feel personal, but:
  - Do NOT claim to be the human Kevin.

- All responses must be valid Markdown output. The assistant must not use HTML or other markup languages.
- Plain text is allowed as it is valid Markdown, but any structuring (headings, lists, tables, code blocks, emphasis) must follow standard Markdown syntax.

[Markdown formatting]
- Use Markdown only when it adds structure (for example, emphasis, code, lists, tables).
- Keep formatting markers (for example, *...*, **...**) directly adjacent to the text.
- For Chinese text, also keep markers adjacent (for example, **中文**).
- When emphasis mixes Chinese and English, insert a half-width space between them inside the emphasis (for example, **中文 English**).

[Mathematical notation]
- Inline math: always use $...$ for inline formulas.
- Display math: always use $$...$$ for block formulas, with a blank line above and below each block.
- Use only standard MathJax-compatible LaTeX commands (for example, \\frac, \\sqrt, \\sum, \\int); do not define custom macros or nonstandard environments.
- Use proper LaTeX math symbols (for example, \\times instead of * or x, \\leq instead of <=).
  
Sound like a natural human assistant rather than a formal report:
- Use clear, professional, but relaxed language, as if you are chatting with the user one-on-one.
- It is fine to use contractions in English (e.g. "I’m", "don’t") and natural spoken phrases (e.g. "Honestly," "In my experience,").
- Vary sentence length a bit so that the answer does not feel mechanical.
- When appropriate, you may add light, friendly comments (but avoid sarcasm or jokes that could be misunderstood).

Be concise but not cryptic:
- Most answers should be 3–6 sentences or a few short bullet points, unless the question clearly requires more detail.
- Start with the most relevant point for the user’s question, then add brief context or examples if helpful.

[Scope]
- Prioritise questions that are directly about Kevin:
  - his background, research, teaching, projects, skills, interests, or views on topics he works on.

- For general questions about machine learning, research, studying, or careers, even if they are not explicitly about Kevin:
  - you may give a brief, helpful, and friendly answer from Kevin's perspective,
  - and when possible, connect it back to Kevin's own experience (for example, courses he taught, projects he worked on, or choices he made).

- If the user asks for information clearly outside Kevin's professional expertise or this biography (for example, unrelated news, politics, random trivia, or very personal life advice):
  - give at most a short, very high-level or generic response so that you are still somewhat helpful,
  - then explain that this chatbot is mainly for learning about Kevin and his professional work, and gently invite the user to ask about those topics.

[Reliability]
- Never invent or guess facts about Kevin. If information is not clearly supported by the biography or by what the user has explicitly said in this conversation, treat it as unknown.
- If you are not sure about an answer, clearly say that you do not know or that you are not certain, instead of speculating. You may briefly explain what information would be needed to answer more precisely.
- Do not fabricate publications, awards, employers, collaborators, dates, or numerical results.
- When summarising Kevin's work, prefer high-level ideas over specific numerical claims unless they are clearly mentioned in the biography or in the conversation.

[Interaction behaviour]
- If the user's query is ambiguous and a single short clarification would significantly improve the answer, ask one concise clarifying question.
- If the user seems like:
  - a student: focus on learning paths, intuition, and encouragement.
  - a researcher: feel free to discuss methods, trade-offs, and open problems in more depth.
  - a recruiter or collaborator: highlight Kevin's strengths, independence, and ability to lead projects.

- When questions are only loosely related to Kevin, still try to offer a brief, friendly, and useful response before gently redirecting the conversation back to Kevin and his work.

- Stay professional and kind. Avoid sarcasm or humour that could be misinterpreted.

[Use of documents / retrieval]
- You may have access to internal documents such as Kevin's CV, website, notes, or papers.
- Treat the retrieved content as Kevin's own memory.
- Do NOT mention or expose any internal file names, paths, IDs, or metadata (for example: "KevinZheng_CV_latest.pdf", "doc_1234", "chunk 5").
- Do NOT say that you are using retrieval, RAG, search, tools, or context.
- When you need to refer to a document, use natural phrases like "in my CV", "in my profile", or "in a paper I worked on", instead of any technical or file-level description.
`.trim();

const ALLOWED_ORIGINS = [
  "https://kyxzhe.github.io",
];
const ALLOWED_METHODS = "POST, OPTIONS";
const FAST_MODEL_ID = "@cf/google/gemma-4-26b-a4b-it";
const THINKING_MODEL_ID = "@cf/qwen/qwen3-30b-a3b-fp8";
const MAX_RETRIEVAL_MESSAGES = 6;
const MAX_CHAT_MESSAGES = 16;
const MAX_MESSAGE_CHARS = 4000;
const MAX_BODY_BYTES = 100000;
const MAX_CONTEXT_CHARS = 12000;
const CONTEXT_SEPARATOR = "\n\n---\n\n";
const MAX_SESSION_ID_CHARS = 128;
const RATE_LIMIT_RETRY_SECONDS = 60;
const DAILY_LIMIT_MESSAGE = "Today's usage limit has been reached. Please try again tomorrow.";
const CHAT_ROLES = new Set(["user", "assistant"]);
const COMPLEX_QUESTION_PATTERN = /\b(analy[sz]e|compare|contrast|evaluate|explain why|reason|derive|synthesi[sz]e|trade-?offs?|step by step)\b|分析|比较|对比|评价|评估|为什么|推导|综合|联系|权衡|逐步|深入/u;

function isAllowedOrigin(origin) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  try {
    const url = new URL(origin);
    return (
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

function getCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": "Content-Type, X-Chat-Session",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  };
}

function sanitizeClientMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message) =>
        message &&
        typeof message === "object" &&
        CHAT_ROLES.has(message.role) &&
        typeof message.content === "string",
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_CHARS),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-MAX_CHAT_MESSAGES);
}

function buildRetrievedContext(docs) {
  if (!Array.isArray(docs)) {
    return "";
  }

  const chunks = [];
  let remainingChars = MAX_CONTEXT_CHARS;

  for (const doc of docs) {
    const content = typeof doc?.content === "string" ? doc.content.trim() : "";
    if (!content) continue;

    const separatorChars = chunks.length > 0 ? CONTEXT_SEPARATOR.length : 0;
    const availableChars = remainingChars - separatorChars;
    if (availableChars <= 0) break;

    if (content.length <= availableChars) {
      chunks.push(content);
      remainingChars -= separatorChars + content.length;
    } else {
      chunks.push(content.slice(0, availableChars).trimEnd());
      remainingChars = 0;
    }

    if (remainingChars <= 0) break;
  }

  return chunks.join(CONTEXT_SEPARATOR);
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
            const parts = buffer.split(/\r?\n\r?\n/);
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

export function getChatMode(question) {
  const parts = question.split(/\n|[?？]/u).filter((part) => part.trim()).length;
  return question.length >= 220 || parts >= 3 || COMPLEX_QUESTION_PATTERN.test(question)
    ? "thinking"
    : "fast";
}

function isDailyLimitError(error) {
  const details = [
    error?.code,
    error?.status,
    error?.message,
    error?.cause?.code,
    error?.cause?.status,
    error?.cause?.message,
  ]
    .filter((value) => value !== undefined && value !== null)
    .join(" ")
    .toLowerCase();

  return (
    /(^|\s)3036(\s|$)/u.test(details) ||
    (/(^|\s)429(\s|$)/u.test(details) &&
      /daily|allocation|neuron|account limited/u.test(details)) ||
    /daily free allocation|10,?000 neurons|account limited/u.test(details)
  );
}

function createChatStream({ env, clientMessages, retrievalMessages, userQuestion, aiOptions }) {
  const encoder = new TextEncoder();
  const mode = getChatMode(userQuestion);
  const encodeSse = (payload) => encoder.encode(`data: ${payload}\n\n`);

  return new ReadableStream({
    async start(controller) {
      controller.enqueue(encodeSse(JSON.stringify({ response: "", meta: { stage: "searching", mode } })));

      try {
        const searchResult = await env.AI_SEARCH.search({
          messages: retrievalMessages.length > 0
            ? retrievalMessages
            : [{ role: "user", content: userQuestion }],
          ai_search_options: {
            retrieval: {
              max_num_results: mode === "thinking" ? 8 : 4,
              match_threshold: 0.4,
            },
            query_rewrite: { enabled: mode === "thinking" },
            reranking: {
              enabled: mode === "thinking",
              model: "@cf/baai/bge-reranker-base",
            },
          },
        });
        console.log("AI Search result", {
          mode,
          chunks: searchResult.chunks.length,
          topScore: searchResult.chunks[0]?.score ?? null,
        });

        const context = buildRetrievedContext(
          searchResult.chunks.map((chunk) => ({ content: chunk.text })),
        );
        const systemWithContext = context
          ? `${SYSTEM_PROMPT}\n\n[Additional context about Kevin]\n${context}`
          : SYSTEM_PROMPT;

        controller.enqueue(encodeSse(JSON.stringify({
          response: "",
          meta: { stage: mode === "thinking" ? "thinking" : "answering", mode },
        })));

        const aiStream = await env.AI.run(
          mode === "thinking" ? THINKING_MODEL_ID : FAST_MODEL_ID,
          {
            messages: [
              { role: "system", content: systemWithContext },
              ...clientMessages,
            ],
            stream: true,
            temperature: 0.2,
            ...(mode === "fast" ? { reasoning_effort: "low" } : {}),
          },
          aiOptions,
        );
        const reader = normalizeAiStream(aiStream).getReader();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      } catch (error) {
        console.error("AI error", error);
        controller.enqueue(encodeSse(JSON.stringify({
          error: isDailyLimitError(error) ? DAILY_LIMIT_MESSAGE : "AI call failed",
        })));
        controller.enqueue(encodeSse("[DONE]"));
        controller.close();
      }
    },
  });
}

function getSessionAffinity(request) {
  const sessionId = request.headers.get("X-Chat-Session")?.trim();
  if (!sessionId || sessionId.length > MAX_SESSION_ID_CHARS) {
    return null;
  }

  return /^[A-Za-z0-9_-]+$/.test(sessionId) ? sessionId : null;
}

async function readJsonBody(request) {
  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return { error: "too_large" };
  }

  try {
    return { body: JSON.parse(rawBody) };
  } catch {
    return { error: "invalid_json" };
  }
}

const worker = {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (!isAllowedOrigin(origin)) {
      return new Response(
        JSON.stringify({ error: "Origin is not allowed" }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "Vary": "Origin",
            "X-Content-Type-Options": "nosniff",
          },
        },
      );
    }

    const corsHeaders = getCorsHeaders(origin);

    if (new URL(request.url).pathname !== "/chat") {
      return new Response(
        JSON.stringify({ error: "Not found" }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

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
            Allow: ALLOWED_METHODS,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return new Response(
        JSON.stringify({ error: "Content-Type must be application/json" }),
        {
          status: 415,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const contentLength = Number(request.headers.get("Content-Length") || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({ error: "Request body is too large" }),
        {
          status: 413,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const parsedBody = await readJsonBody(request);
    if (parsedBody.error === "too_large") {
      return new Response(
        JSON.stringify({ error: "Request body is too large" }),
        {
          status: 413,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (parsedBody.error === "invalid_json") {
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

    const body = parsedBody.body;
    const clientMessages = sanitizeClientMessages(body?.messages);
    const retrievalMessages = clientMessages.slice(-MAX_RETRIEVAL_MESSAGES);

    const lastUserMessage = [...clientMessages].reverse()
      .find(
        (message) =>
          message &&
          message.role === "user" &&
          typeof message.content === "string",
      );

    const userQuestion = lastUserMessage ? lastUserMessage.content.trim() : "";

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

    // ponytail: IP limits can group shared networks; use verified users or Turnstile if traffic grows.
    const rateLimitKey =
      request.headers.get("CF-Connecting-IP") ||
      getSessionAffinity(request) ||
      "anonymous";
    const { success: withinRateLimit } = await env.CHAT_RATE_LIMITER.limit({
      key: rateLimitKey,
    });

    if (!withinRateLimit) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again shortly." }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": String(RATE_LIMIT_RETRY_SECONDS),
          },
        },
      );
    }

    const sessionAffinity = getSessionAffinity(request);
    const stream = createChatStream({
      env,
      clientMessages,
      retrievalMessages,
      userQuestion,
      aiOptions: sessionAffinity
        ? { headers: { "x-session-affinity": sessionAffinity } }
        : undefined,
    });

    return new Response(stream, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  },
};

export default worker;
