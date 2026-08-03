# AGENTS.md

## Project Overview

9bar is a specialty espresso recipe and brew logging web application. The name refers to the standard 9 bars of pressure used in espresso extraction. Users can create and manage espresso recipes, log individual brews, and track their brewing parameters over time.

The codebase is a TypeScript monorepo with two packages:

| Package | Path | Description |
|---------|------|-------------|
| `@9bar/web` | `apps/web/` | Full-stack web application built with TanStack Start, TanStack Router, and React 19 |
| `@9bar/toolkit` | `packages/toolkit/` | Primitive design system built with React Aria Components, Tailwind Variants, and Storybook 10 |

Each package has its own `AGENTS.md` with package-specific architecture details, conventions, and commands.

## Tooling

- **Runtime:** Node.js 22+ (pinned via `.nvmrc`)
- **Package manager:** pnpm 10+ (npm and yarn are blocked)
- **Build:** Vite 8 + TypeScript 7 native (`tsc -b && vite build`). A TS 6 compatibility alias (`@typescript/typescript6`) provides the programmatic API for Storybook's `react-docgen-typescript` and `typescript-eslint`.
- **Linting/Formatting:** Biome (not ESLint/Prettier)
- **Commit conventions:** Conventional Commits enforced by commitlint
- **CI:** GitHub Actions (`.github/workflows/ci.yml`)

## Commands

### Setup

```bash
pnpm install
```

### Code Quality

```bash
# Check formatting and linting (read-only)
pnpm check

# Auto-fix formatting and linting issues
pnpm check:fix

# CI-mode lint (used in GitHub Actions, fails on any issue)
pnpm lint:ci

# Typecheck all packages recursively
pnpm typecheck
```

The `pnpm web` and `pnpm toolkit` shorthands are aliases for `pnpm --filter @9bar/web` and `pnpm --filter @9bar/toolkit` respectively. You can use them to run any script within a specific package (e.g. `pnpm web typecheck`).

## Development Guidelines

### Code Style

- Use ES6 arrow functions over `function` declarations. Always use curly braces for function bodies; avoid inline returns.
- Rely on TypeScript's return-type inference; annotate return types only when needed to narrow a type or resolve a type error.
- Prefer shorthand falsy checks (`!value.length`, `!items`) over explicit comparisons. Exception: in JSX, use `value.length > 0 &&` instead of `value.length &&` to avoid rendering `0`.

For accessibility guidelines when building UI, see [.agents/a11y.md](.agents/a11y.md).

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/). Scope commits to the affected package:

```
feat(toolkit): add new date picker component
fix(web): resolve recipe form validation error
chore(web, toolkit): update shared dependencies
```

Common scopes: `web`, `toolkit`, or both `web, toolkit`.

## Monorepo Structure

```
9bar/
├── apps/
│   └── web/                    # @9bar/web
│       ├── src/
│       │   ├── routes/         # File-based routes (TanStack Router)
│       │   ├── styles/         # globals.css (imports the toolkit theme)
│       │   └── ...
│       ├── components.json     # shadcn config (ui → @9bar/toolkit/components)
│       └── biome.json          # Extends root, adds a11y + React rules
├── packages/
│   └── toolkit/                # @9bar/toolkit
│       ├── src/
│       │   ├── components/     # Component dirs (shadcn React Aria base) + index.ts barrel
│       │   ├── styles/         # globals.css — single source of truth for the theme
│       │   ├── utils/          # utils barrel (cn, composeTailwindRenderProps)
│       │   └── index.ts        # re-exports the component + utils barrels
│       ├── components.json     # shadcn config (aria-mira, zinc, lucide)
│       ├── .storybook/         # Storybook 10 config
│       └── ...
├── biome.json                  # Root Biome config
├── tsconfig.base.json          # Shared strict TS config (no exactOptionalPropertyTypes)
├── pnpm-workspace.yaml
└── package.json
```

## shadcn/ui Monorepo Setup

- `@9bar/toolkit` is the shadcn `ui` package: the CLI installs components there via `apps/web/components.json` aliases (`ui` → `@9bar/toolkit/components`)
- Add components with `pnpm dlx shadcn@latest add <name>` from `apps/web`, then follow the toolkit's "Adding a New Component" workflow (move into a dir, index.ts, JSDoc, barrel)
- Theming is centralized in `packages/toolkit/src/styles/globals.css`; `apps/web/src/styles/globals.css` imports it and adds a `@source` for toolkit source scanning
- The `shadcn/ui` agent skill lives in `.agents/skills/shadcn` -- use it for CLI/composition guidance
- Preset `bdvw9IJc`: style `aria-mira`, baseColor `zinc`, icon library `lucide`, font Geist

## Adding a New Package

1. Create the package directory under `packages/` (or `apps/` for applications)
2. Add a `package.json` with `"name": "@9bar/<name>"` and `"type": "module"`
3. Extend the shared TypeScript config: `"extends": "../../tsconfig.base.json"` (adjust path as needed)
4. If the package has a Vite config, create a `tsconfig.node.json` extending the root one
5. Run `pnpm install` from the root to link the new package

## Common Pitfalls

- **Always run `pnpm install` from the root** -- do not run it inside individual packages
- **Use Biome, not ESLint/Prettier** -- the project uses Biome for both formatting and linting. Run `pnpm check:fix` to auto-fix issues.
- **The toolkit exports source TypeScript** -- there is no build step needed during development. The web app compiles toolkit source directly.
