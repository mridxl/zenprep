# ZenPrep

A study timer with burnout guardrails for Indian exam prep. Track Pomodoro sessions, log mood, get a short AI wellness coach reply, and finish with guided 4-7-8 breathing.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [tRPC](https://trpc.io) + [TanStack Query](https://tanstack.com/query)
- [Prisma](https://prisma.io) (SQLite)
- [Clerk](https://clerk.com) auth
- [Google Gemini](https://ai.google.dev) wellness coach
- [Tailwind CSS](https://tailwindcss.com) + shadcn/ui

## Getting started

1. Copy `.env.example` to `.env` and fill in Clerk, database, and Gemini keys.
2. Install dependencies:

```bash
pnpm install
```

3. Push the database schema:

```bash
pnpm db:push
```

4. Run the dev server:

```bash
pnpm dev
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start Next.js in development |
| `pnpm build` | Production build |
| `pnpm check` | Lint + typecheck |
| `pnpm test` | Run unit tests |
| `pnpm db:studio` | Open Prisma Studio |

## Tests

Vitest covers pure helpers (timer presets, session stats, Gemini prompt builder) and the session tRPC router with mocked auth/db/AI.

```bash
pnpm test
```
