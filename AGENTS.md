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
- **Build:** Vite 7 + TypeScript (`tsc -b && vite build`)
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

- For general coding guidelines, see [.agents/general.md](.agents/general.md)
- For accessibility guidelines, see [.agents/a11y.md](.agents/a11y.md)
- For TypeScript guidelines, see [.agents/typescript.md](.agents/typescript.md)

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
│       │   ├── styles/         # Global CSS
│       │   └── ...
│       ├── biome.json          # Extends root, adds a11y + React rules
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   └── toolkit/                # @9bar/toolkit
│       ├── src/
│       │   ├── <component>/    # Component directories
│       │   ├── form/           # Form system
│       │   └── index.ts        # Barrel export
│       ├── .storybook/         # Storybook 10 config
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── package.json
├── biome.json                  # Root Biome config
├── tsconfig.base.json          # Shared strict TS config
├── tsconfig.node.json          # Shared Node TS config (for vite.config.ts)
├── commitlint.config.js
├── pnpm-workspace.yaml
└── package.json
```

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
