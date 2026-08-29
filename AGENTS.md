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

| Package | Path | Description |
|---------|------|-------------|
| `@9bar/web` | `apps/web/` | Full-stack app: TanStack Start, TanStack Router, React 19 |
| `@9bar/toolkit` | `packages/toolkit/` | Design system: React Aria Components, Tailwind Variants, Storybook 10 |

## Tooling

- **pnpm only** — npm and yarn are blocked via `engines`. Always run `pnpm install` from the repo root, never inside a package.
- **Biome** for linting/formatting — not ESLint/Prettier. Use `pnpm check:fix` to auto-fix.
- **Conventional Commits** enforced by commitlint in CI.

## Commands

`pnpm web` and `pnpm toolkit` are aliases for `pnpm --filter @9bar/web` and `pnpm --filter @9bar/toolkit`. Use them to run any script in a package (e.g. `pnpm web typecheck`).

## Code Style

- Use ES6 arrow functions over `function` declarations. Always use curly braces for function bodies; avoid inline returns.
- Rely on TypeScript's return-type inference; annotate return types only when needed to narrow a type or resolve a type error.
- Prefer shorthand falsy checks (`!value.length`, `!items`) over explicit comparisons. Exception: in JSX, use `value.length > 0 &&` instead of `value.length &&` to avoid rendering `0`.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/). Scope commits to the affected package: `feat(toolkit): ...`, `fix(web): ...`. Common scopes: `web`, `toolkit`, or both. Keep body lines to 100 characters or fewer — commitlint enforces this in CI (`body-max-line-length`).

## Adding a New Package

1. Create the package directory under `packages/` (or `apps/` for applications)
2. Add a `package.json` with `"name": "@9bar/<name>"` and `"type": "module"`
3. Extend the shared TypeScript config: `"extends": "../../tsconfig.base.json"` (adjust path as needed)
4. If the package has a Vite config, create a `tsconfig.node.json` extending the root one
5. Run `pnpm install` from the root to link the new package

## Skills

Concern and package-specific guidance lives in `.agents/skills/`. Load the matching skill when the task is in scope:
- `toolkit` — toolkit components, class-string formatting, form system, Storybook, shadcn workflow
- `web` — web-app conventions not covered by TanStack skills
- `a11y` — accessibility guidelines for UI work
