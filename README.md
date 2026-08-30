# 9bar

Specialty espresso recipe and brew logging web app.

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@9bar/web` | `apps/web/` | Full-stack app: TanStack Start, TanStack Router, React 19 |
| `@9bar/toolkit` | `packages/toolkit/` | Design system: React Aria Components, Tailwind Variants, Storybook 10 |

## Development

```sh
pnpm install        # from the repo root, never inside a package
pnpm web dev        # run the web app
pnpm toolkit storybook  # run Storybook
```

`pnpm web` and `pnpm toolkit` alias `pnpm --filter @9bar/<name>`; use them to run any script in a package (e.g. `pnpm web build`, `pnpm toolkit typecheck`).

## License

GPL-3.0-or-later