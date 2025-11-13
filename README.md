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
