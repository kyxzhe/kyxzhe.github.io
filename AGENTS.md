# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js route handlers for landing, news, publications, etc.
- `src/components`, `src/hooks`, `src/lib`: Shared UI primitives, hooks, and config constants (e.g., `lib/constants/publications.ts`).
- `public`: Static favicons and imagery; keep `cover` paths in sync.
- Build outputs appear in `.next/` (dev) and `out/` (export); never edit generated files.

## Build, Test, and Development Commands
- `pnpm dev`: Next.js dev server with Turbopack at `http://localhost:3000`.
- `pnpm build`: Production bundle; run before deploys for type safety.
- `pnpm start`: Serves the bundle locally for smoke tests.
- `pnpm lint`: ESLint via `eslint.config.mjs`; mandatory before commits.

## Coding Style & Naming Conventions
- TypeScript + React 19 with functional components only; prefer hooks over class components.
- Follow Tailwind utility ordering already present in files; prefer semantic helper classes from `globals.css` (e.g., `surface-card`, `chip`).
- Use PascalCase for components (`PublicationsPage`), camelCase for helpers (`formatDate`), and SCREAMING_SNAKE_CASE only for constants exported across modules.
- Keep strings and props single-quoted in constants, double-quoted in TSX to match current linting rules.

## Testing Guidelines
- Lint-only enforcement—run `pnpm lint` before every PR.
- Validate UI changes visually; if you add Jest/RTL later, colocate tests near the component folder.

## Commit & Pull Request Guidelines
- Use concise, imperative commit messages (`feat: add resource cards`, `fix: align news hero`). Group related changes into a single commit when feasible.
- PRs should include: summary of user-facing changes, screenshots or GIFs for UI updates (list + grid views), and references to issues/tasks.
- Rebase onto `main` before requesting review; CI expects a clean, linted tree and no changes under `out/` or `.next`.

## Security & Configuration Tips
- Secrets are not stored in this repo; rely on environment variables via `.env.local`, which must never be committed.
- When adding external embeds or scripts, ensure they comply with Next.js CSP defaults and document any required headers in the PR.

## Agent-Specific Workflow & Communication
- At the beginning of every new session, read through the entire repository (source, configs, docs) so you can reference any feature without guesswork.
- Converse with the user exclusively in Chinese, but keep internal reasoning, comments, and code in English to match the codebase style.
- After completing any modification, immediately run `git add -A` followed by a concise `git commit -m "<summary>"`; leave pushing to the user unless they explicitly request a `git push`.
