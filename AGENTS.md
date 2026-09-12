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

## Code Style

- Use ES6 arrow functions over `function` declarations. Always use curly braces for function bodies; avoid inline returns.
- Rely on TypeScript's return-type inference; annotate return types only when needed to narrow a type or resolve a type error.
- Prefer shorthand falsy checks (`!value.length`, `!items`) over explicit comparisons. Exception: in JSX, use `value.length > 0 &&` instead of `value.length &&` to avoid rendering `0`.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/). Scope commits to the affected package: `feat(toolkit): ...`, `fix(web): ...`. Common scopes: `web`, `toolkit`, or both.
