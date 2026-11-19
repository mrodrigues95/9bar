# AGENTS.md

<!-- intent-skills:start -->

## Skill Loading

Before editing files for a substantial task:

- Run `pnpm dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->

## Project Overview

9bar is a specialty espresso recipe and brew logging web app. TypeScript monorepo:

| Package         | Path                | Description                                                           |
| --------------- | ------------------- | --------------------------------------------------------------------- |
| `@9bar/web`     | `apps/web/`         | Full-stack app: TanStack Start, TanStack Router, React 19             |
| `@9bar/toolkit` | `packages/toolkit/` | Design system: React Aria Components, Tailwind Variants, Storybook 10 |

## Tooling

- **pnpm only** — npm and yarn are blocked via `engines`. Always run `pnpm install` from the repo root, never inside a package.
- **Oxlint** for linting (`pnpm lint`, auto-fix with `pnpm lint:fix`) and **Oxfmt** for formatting (`pnpm format`, check with `pnpm format:check`) — not ESLint/Prettier/Biome.
- **react-doctor** for React diagnostics (`pnpm react-doctor` for issues introduced vs `origin/main`, `pnpm react-doctor:full` for a full audit).
- **Conventional Commits** enforced by commitlint in CI.

## Verification

1. `pnpm check` (lint, format, typecheck, structure).
2. `pnpm test`. A logic bug starts with a failing test.
3. `pnpm react-doctor` when React code changed.
4. UI changes are proven in a real browser: the `verify-web` skill for apps/web, the `verify-toolkit` skill for packages/toolkit. Both drive the app through `pnpm control`, which starts and stops its own servers. Attach the screenshots or snapshots as evidence.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/). Scope commits to the affected package: `feat(toolkit): ...`, `fix(web): ...`. Common scopes: `web`, `toolkit`, or both.
