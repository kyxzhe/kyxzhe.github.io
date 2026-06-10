# Kevin Zheng - Research Portfolio

Personal academic website for [Yuxiang (Kevin) Zheng](https://kyxzhe.github.io), a PhD researcher in machine learning at the University of Technology Sydney. The site presents Kevin's work on information diffusion, social data science, trustworthy machine learning, and learning under noisy supervision.

The project is built with Next.js App Router, React, TypeScript, Tailwind CSS, lightweight CSS transitions, and a static export target for GitHub Pages.

## Live Site

- Production: [kyxzhe.github.io](https://kyxzhe.github.io)
- Repository: [github.com/kyxzhe/kyxzhe.github.io](https://github.com/kyxzhe/kyxzhe.github.io)

## Site Experience

- **Home** (`/`): Research landing page for trustworthy machine learning, with primary calls to publications and contact plus an embedded KevinBot prompt.
- **About** (`/about`): Biography, research focus, education timeline, teaching, and collaboration context.
- **Publications** (`/publications`): Filterable and sortable publication index with list/grid modes, detail pages, resources, and scholarly JSON-LD.
- **News** (`/news`): Filterable and sortable research updates, awards, teaching notes, and career milestones with static detail pages.
- **Contact** (`/contact`): Email, profile links, collaboration topics, and a lightweight scheduling request flow.
- **KevinBot**: Visitor-facing chatbot backed by a Cloudflare Worker and Cloudflare Workers AI.

## Tech Stack

- Next.js 15 with static export (`output: "export"`)
- React 19 and TypeScript
- Tailwind CSS 4 with shared utility classes in `src/app/globals.css`
- CSS transitions for lightweight page and card interactions
- Lucide React plus local academic profile icons
- React Markdown, GFM, KaTeX, and syntax highlighting for chatbot responses
- Vercel Analytics
- GitHub Actions deployment to GitHub Pages
- Cloudflare Worker chatbot endpoint in `cloudflare/kevin-bot/index.js`

## Project Map

```text
src/app/                  App Router pages, layouts, metadata, sitemap, robots, manifest
src/components/           Shared UI, navigation, contact modal, markdown renderer
src/assets/fonts/         Local OpenAI Sans font sources for next/font
src/hooks/                Navigation and session-backed chatbot state
src/lib/constants/        Site content, publications, news, contact, socials, availability
src/lib/seo/              Site metadata and JSON-LD builders
src/lib/api/chat.ts       Client-side KevinBot request and SSE handling
public/                   Favicons, project images, human/LLM-readable indexes
cloudflare/kevin-bot/     Cloudflare Worker for KevinBot
.github/workflows/        GitHub Pages build and deploy workflow
```

## Local Development

Use Node 20 and pnpm 9.12.2, matching the deployment workflow and `packageManager` field.

```bash
corepack enable pnpm
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
pnpm dev      # Start the Turbopack development server
pnpm lint     # Run ESLint
pnpm build    # Create the static export in out/
pnpm start    # Serve the exported out/ directory locally
```

Run `pnpm lint` before committing. Run `pnpm build` before deployment-sensitive changes because the site is exported statically for GitHub Pages.

## Updating Content

Most site updates should happen in constants rather than page components.

| Content | File |
| --- | --- |
| Site metadata, SEO keywords, profile links | `src/lib/seo/config.ts` |
| Homepage and console intro copy | `src/lib/constants/siteContent.ts` |
| About page biography, focus areas, timeline, teaching | `src/lib/constants/about.ts` |
| Publications and resource links | `src/lib/constants/publications.ts` |
| News and milestone entries | `src/lib/constants/news.ts` |
| Contact details and availability text | `src/lib/constants/contact.ts` |
| Navigation labels | `src/lib/constants/navItems.ts` |
| Social/profile URLs | `src/lib/constants/socials.ts` |
| Scheduling slot generation | `src/lib/constants/availability.ts` |
| LLM-readable public summary | `public/llms.txt` |
| Human-readable colophon | `public/humans.txt` |

When adding a new publication or news item, include a stable `id`, ISO `date`, `summary`, `topics`, and a valid `cover` path under `public/`. Detail pages are generated statically from those arrays.

## KevinBot

The homepage chatbot calls `sendChatRequest` from `src/lib/api/chat.ts`.

- Default endpoint: `https://kevin-bot.kyx-zhe.workers.dev/chat`
- Override locally with `NEXT_PUBLIC_CHAT_API_URL` in `.env.local`
- Request body: `{ "messages": [{ "role": "user" | "assistant" | "system", "content": "..." }] }`
- Session affinity: the client sends `X-Chat-Session` from `sessionStorage`
- Preferred response: Server-Sent Events (`text/event-stream`) with `data:` payloads that include `{ "response": "<chunk>" }` and end with `[DONE]`
- Compatibility response: JSON payloads with `{ "response": "<text>" }`, `{ "content": "<text>" }`, `{ "text": "<text>" }`, or OpenAI-style `choices`

The Worker source lives in `cloudflare/kevin-bot/index.js`. It allows production and localhost origins, adds Kevin-specific system context, searches the `kevin-rag-index` AutoRAG index, and streams normalized SSE chunks from Cloudflare Workers AI.

## SEO & Static Output

- Root metadata and JSON-LD are defined in `src/app/layout.tsx`.
- Route-specific metadata lives in each route `layout.tsx` or dynamic detail page.
- `src/app/sitemap.ts` emits static, publication, and news routes.
- `src/app/robots.ts` points crawlers to the sitemap.
- `src/app/opengraph-image.tsx` generates the default Open Graph image.
- `src/app/manifest.ts` defines install metadata and shortcuts.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`.

The workflow installs dependencies with pnpm, runs `pnpm run build`, uploads the generated `out/` directory, and deploys it with GitHub Pages. Do not edit `.next/` or `out/` directly.

## License

MIT © Yuxiang (Kevin) Zheng
