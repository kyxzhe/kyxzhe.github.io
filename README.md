# Kevin Zheng — Personal Site

A static Next.js 15 notebook for sharing research notes, experiments, and side projects at [kyxzhe.github.io](https://kyxzhe.github.io). The site is exported via `pnpm build` and hosted on GitHub Pages.

## Quick Start

1. Install dependencies:
   ```bash
   corepack enable pnpm
   pnpm install
   ```
2. Run the dev server:
   ```bash
   pnpm dev
   # visit http://localhost:3000
   ```
3. Export a static build for GitHub Pages:
   ```bash
   pnpm build
   # output appears in out/
   ```

## Site Structure

- `src/app`: App Router entry points for landing, news, publications, etc.; edit the corresponding `page.tsx`/`layout.tsx` files to adjust content.
- `src/components`, `src/hooks`, `src/lib`: Shared UI, hooks, and constants (look at `src/lib/constants/*` for curated copy such as publications, socials, and general site text).
- `public`: Static assets like cover images and icons—replace files here when updating graphics.
- Configuration: `.github/workflows/deploy.yml` handles the static export and Pages deployment; change it only if you want to modify the CI/CD behavior.

## Content Hooks

- Hero/about text: `src/lib/constants/siteContent.ts`
- Contact panel: `src/lib/constants/contact.ts`
- Social links: `src/lib/constants/socials.ts`
- Publication cards: `src/lib/constants/publications.ts`
- Console easter egg: `src/lib/utils/consoleUtil.ts`

## Chatbot Beta

- The homepage chatbot card opens `ChatBotModal`, which POSTs to `https://kevin-bot.kyx-zhe.workers.dev/chat` by default.
- Override the endpoint via `NEXT_PUBLIC_CHAT_API_URL` in `.env.local` if you host a different Worker.
- Worker payload: `{ "messages": [{ "role": "user" | "assistant", "content": string }] }`
- Worker response: `{ "response": "<text>" }`

## Contributing & Deploying

- Feel free to tweak content, add experiments, or polish the layout. Run `pnpm lint` before committing.
- Push to `main` to trigger the GitHub Actions workflow; it exports the site and publishes to GitHub Pages automatically.
- If you want to collaborate: open an issue or PR, describe the change, and include any screenshots if UI is affected.

## License

MIT © Kevin Zheng
