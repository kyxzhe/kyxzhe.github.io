# Kevin Zheng — Personal Site

This repo powers [kyxzhe.github.io](https://kyxzhe.github.io), my public notebook for research, experiments, and side interests. It’s a plain Next.js 15 app deployed through GitHub Pages (static export).

## Local Dev

```bash
corepack enable pnpm
pnpm install
pnpm run dev    # http://localhost:3000
pnpm run build  # generates out/ for Pages
```

## Content Quick Links

- Hero/About copy: `src/lib/constants/siteContent.ts`
- Contact & socials: `src/lib/constants/contact.ts`, `src/lib/constants/socials.ts`
- Publication cards: `src/lib/constants/publications.ts`
- Console easter egg: `src/lib/utils/consoleUtil.ts`

Everything else is standard Next.js plumbing (App Router under `src/app`, components in `src/components`). No fancy CMS—just edit the files and push to `main`. GitHub Actions (`.github/workflows/deploy.yml`) handles the export + Pages deployment.

## Chatbot beta

- The “Chatbot” card on the homepage opens `ChatBotModal`, which calls a Cloudflare Worker via `POST`.
- By default it calls `https://kevin-bot.kyx-zhe.workers.dev/chat`. Override via `NEXT_PUBLIC_CHAT_API_URL=...` in `.env.local` if you redeploy the Worker or use a different route.
- The Worker should accept `{ "messages": [{ "role": "user" | "assistant", "content": string }] }` and respond with `{ "response": "<text>" }`.

## Publications feed

- `src/app/api/publications/route.ts` calls SerpApi’s Google Scholar endpoint with `SERPAPI_KEY` to fetch the latest citations for author `aN71bBIAAAAJ`.
- Add `SERPAPI_KEY=...` to `.env.local` (and to your deployment environment). Without it, the publications page falls back to the static entries in `src/lib/constants/publications.ts`.
- The route caches upstream responses for ~1 hour. The client page simply calls `/api/publications`, so this requires hosting on a platform that can run Next.js route handlers (GitHub Pages’ static export will not execute it).
