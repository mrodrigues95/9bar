---
name: toolkit
description: Conventions for @9bar/toolkit, the React Aria + shadcn (aria-mira, zinc) design system package. Use when adding, editing, reviewing, or styling toolkit components, writing Storybook stories, using the shadcn CLI in this monorepo, working with the form system (createFormHook, field components), or updating the Overview canvas. Covers choosing between the primitive and composed tiers, reusing primitives' styles, the add-a-component workflow, and package facts. Structure, imports, aliases, class string length, and JSDoc are enforced by `pnpm check`.
---

# @9bar/toolkit

Two-tier design system built on React Aria Components, styled with shadcn/ui (React Aria base, `aria-mira` style, zinc theme). `pnpm toolkit storybook` serves it on :6006. Prove changes with the `verify-toolkit` skill.

## Primitive vs Composed

- A **primitive** is a styled accessibility unit with no opinions about data or state (Button, Menu, Field). It wraps React Aria semantics and theme tokens, nothing more. `src/components/primitive/<name>/`, story title `Primitives/<Name>`. Primitives mark each part with `data-slot`.
- A **composed** component is an opinionated assembly of primitives that owns a data or state contract and may depend on a deliberate third-party library (form → TanStack Form, FilterBar → filter definitions + selection state). `src/components/composed/<name>/`, story title `Composed/<Name>`. Its parts are styled through a `*Variants` slot object (`filterBarVariants`), not `data-slot`.
- **Decision test:** does it need a state library or a shaped data model to work? Yes → composed. Is it specific to one app's domain? Yes → it belongs in that app, not the toolkit.
- **Neither tier holds business logic or domain data.** The package stays portable; app flavor appears only in story and overview sample data.
- Every styling slot is overridable through `className`. Multi-file components split by role (`<name>.tsx`, `<name>-types.ts`, `styles.ts`, `utils.ts`; see `filter-bar/`).

## Styling components

- Reuse what a sibling primitive already owns: import the primitive or its exported variant (`buttonVariants`, `popoverVariants`, `listboxItemVariants`, `inputVariants`, `Separator`, `Popover`, …) and override through `className`. Extract a new shared `cva` variant only when no primitive provides the styles. For example, `select` and `menu` reuse `popoverVariants` and `Separator` instead of repeating overlay and separator classes.
- Where `className` forwards to a React Aria part, keep React Aria's type and merge with `composeTailwindRenderProps(className, base)` (or `composeRenderProps` when the base depends on render props). `cn` rejects a render-prop `className` at the type level. Composed form fields keep `className?: string` for the field root.
- Classes use theme tokens from `src/styles/globals.css`; group long class arrays by variant prefix (base, `hover:`, `focus-visible:`, `aria-*`, `data-*`, `dark:`) as in `button/styles.ts`.

## Adding a new component

Decide the tier first. Follow the `shadcn` skill for the CLI add; it writes a flat `src/components/<name>.tsx` (and may recreate flat copies of its registry dependencies). Then:

1. Move it to `src/components/<tier>/<name>/<name>.tsx`, add `index.ts` (`export * from "./<name>";`), export it from `src/components/<tier>/index.ts`, and delete every flat file.
2. Add JSDoc to each export; it feeds Storybook's prop tables. Name props `<Name>Props`.
3. Write `<name>.stories.tsx` with a story per state and a `play` function for each interaction (form fields nest as `Composed/Form/<Name>`).
4. Place it on the overview canvas in the fitting `src/overview/sections/` module.

`pnpm check` fails on anything in steps 1–2 that is missing, on a component directory without stories, and on a directory absent from the overview.

## Overview canvas

`src/overview/overview.stories.tsx` (**Overview / Preview**) shows every public component in realistic 9bar UI and is the theme-alignment check. When you change a component's variants, sizes, or styling, update its canvas section so the overview stays truthful.

## Package facts

- Consumers import primitives from `@9bar/toolkit/components` (or `/components/primitive`), composed from `@9bar/toolkit/components/composed`, utilities from `@9bar/toolkit/utils`.
- `package.json` `imports`: `#components/*` → primitives, `#composed/*` → composed, `#lib/*` → `src/utils/*.ts`. `exports` also expose `./hooks/*` and `./globals.css`.
- shadcn CLI: `components.json` (`aria-mira`, `zinc`, `lucide`). It installs into this package through `apps/web/components.json`; run `pnpm dlx shadcn@latest add <name>` from `apps/web` or with `-c packages/toolkit`.
- Form system (composed, `src/components/composed/form/`): `createFormHook` with pre-registered Input, Textarea, Select, Checkbox, CheckboxGroup, InputGroupSelect fields and a SubmitButton; error formatters for Zod, HTML validation, and generic errors; fields compose `Field` / `FieldLabel` / `FieldDescription` / `FieldError` (`errors={field.state.meta.errors}`).
- Tailwind v4 with one source of truth, `src/styles/globals.css` (zinc theme, Geist, `shadcn/tailwind.css`, `tw-animate-css`). The web app and `.storybook/styles.css` import it. `tailwindcss-react-aria-components` stays for legacy `pressed:`/`selected:`/`current:` variants.
- Storybook 10 with docs, a11y, themes, vitest, and MCP addons; `react-docgen-typescript` builds prop tables (aria-* props filtered). See the `a11y` skill for accessibility conventions.
