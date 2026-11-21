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

| Package         | Path                | Description                                                             |
| --------------- | ------------------- | ----------------------------------------------------------------------- |
| `@9bar/web`     | `apps/web/`         | Full-stack app: TanStack Start, TanStack Router, React 19               |
| `@9bar/toolkit` | `packages/toolkit/` | Design system: React Aria Components, Tailwind Variants, Storybook 10   |
| `@9bar/tools`   | `tools/`            | Repo tooling: custom oxlint rules, `check:structure`, the `control` CLI |

## Tooling

- **pnpm only** — npm and yarn are blocked via `engines`. Always run `pnpm install` from the repo root, never inside a package.
- **Oxlint** for linting (`pnpm lint`, auto-fix with `pnpm lint:fix`) and **Oxfmt** for formatting (`pnpm format`, check with `pnpm format:check`) — not ESLint/Prettier/Biome.
- **react-doctor** for React diagnostics (`pnpm react-doctor` for issues introduced vs `origin/main`, `pnpm react-doctor:full` for a full audit).
- **Conventional Commits** enforced by commitlint in CI.
- **Vitest** for tests (`pnpm test`): fast-check property tests in apps/web, every toolkit story as a browser test with axe.
- **`pnpm control`** drives the web app or Storybook in headless Chromium; see the `verify-web` and `verify-toolkit` skills.

## Verification

1. `pnpm check` (lint, format, typecheck, structure).
2. `pnpm test`. A logic bug starts with a failing test.
3. `pnpm react-doctor` when React code changed.
4. UI changes are proven in a real browser: the `verify-web` skill for apps/web, the `verify-toolkit` skill for packages/toolkit. Both drive the app through `pnpm control`, which starts and stops its own servers. Attach the screenshots or snapshots as evidence.

## Checks are owner-approved

Never edit `.oxlintrc.json`, `tools/oxlint/`, `tools/checks/`, or `.github/` to make a change pass. Propose the change instead. A PR touching those paths fails the Protected paths check until the owner applies the `approved:checks` label. Agents never apply that label.

## Deferred work

Write it in `docs/todo.md`, never as a code comment. Delete the entry in the commit that finishes it.

## Rules and their enforcers

When the user corrects you, run `/correct`. Before a PR that adds `SAFETY:`, `EXTERNAL(<url>):`, directive, or toolkit JSDoc comments, run `/no-comments`. A rule with no enforcer is the next candidate for `/correct`.

| Rule                                                                                                                  | Enforcer                                                                                      |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| No `useEffect`, `useLayoutEffect`, `useInsertionEffect`                                                               | `anti-slop/no-effect`                                                                         |
| No `useMemo`, `useCallback`, `memo` (React Compiler is on)                                                            | `anti-slop/no-manual-memo`                                                                    |
| Comments only as `SAFETY:`, `EXTERNAL(<url>):`, directives with reasons, toolkit export JSDoc                         | `anti-slop/no-comments`; whether they are true: `/no-comments`                                |
| No return type annotations                                                                                            | `landmines-types/no-explicit-return-types`                                                    |
| Arrow functions with expression bodies where possible                                                                 | `eslint/func-style`, `eslint/arrow-body-style`                                                |
| Explicit boolean and length checks                                                                                    | `typescript/strict-boolean-expressions`, `unicorn/explicit-length-check`                      |
| Every promise awaited or `void`ed; exhaustive switches                                                                | `typescript/no-floating-promises`, `no-misused-promises`, `switch-exhaustiveness-check`       |
| Prefer a guard or schema to an assertion; an assertion carries a `SAFETY:` reason                                     | `typescript/no-unsafe-type-assertion`, `anti-slop/require-safety-comment-for-type-assertion`  |
| Parse input at the boundary instead of passing `unknown` or narrowing with `typeof`                                   | `anti-slop/no-unknown-*`, `no-runtime-typeof`, `no-unsafe-dictionary-type`                    |
| No `T` prefix on concrete types; props named `<Component>Props`                                                       | `anti-slop/type-naming`                                                                       |
| No import cycles                                                                                                      | `import/no-cycle`                                                                             |
| Web `components/` and `utils/` never import routes                                                                    | `no-restricted-imports` override                                                              |
| Toolkit primitives never import composed; composed siblings import relatively                                         | `no-restricted-imports` overrides                                                             |
| Shared web modules have two or more route consumers; no barrels under `routes/`                                       | `check:structure` placement                                                                   |
| Toolkit `index.ts` per directory, tier barrels, stories, overview coverage, no flat files, no `data-slot` in composed | `check:structure` toolkit                                                                     |
| Toolkit `react-aria-components` imports aliased `Aria<Name>`                                                          | `anti-slop/react-aria-import-alias`                                                           |
| Toolkit class strings at most 90 characters                                                                           | `anti-slop/max-class-string-length`                                                           |
| Toolkit exports carry JSDoc                                                                                           | `anti-slop/require-export-jsdoc`                                                              |
| React Aria render-prop `className` merges through `composeTailwindRenderProps`                                        | `cn`'s `StaticClassValue` type                                                                |
| Tests drive real code: no mocks, fixed sleeps, retries                                                                | `landmines-testing/*`                                                                         |
| Tests colocated and named `*.test.ts`                                                                                 | `landmines-structure/*`                                                                       |
| Stories render, pass their `play` functions and axe                                                                   | `pnpm test` (storybook project), CI Test job                                                  |
| Pure web logic keeps its properties                                                                                   | `pnpm test` (web project), CI Test job                                                        |
| Forked skills carry a `Forked from` header                                                                            | `check:structure` skills                                                                      |
| Lint, check, and CI changes are owner-approved                                                                        | Protected paths workflow + `approved:checks` label                                            |
| Add dependencies at a version older than pnpm's `minimumReleaseAge`, not with an exclusion                            | none: `pnpm add` writes `minimumReleaseAgeExclude` itself; review `pnpm-workspace.yaml` diffs |
| UI changes are proven in a browser                                                                                    | none: the `verify-web` and `verify-toolkit` skills                                            |

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/). Scope commits to the affected package: `feat(toolkit): ...`, `fix(web): ...`. Common scopes: `web`, `toolkit`, or both.
