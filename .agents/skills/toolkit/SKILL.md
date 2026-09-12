---
name: toolkit
description: Conventions for @9bar/toolkit, the React Aria + shadcn (aria-mira, zinc) design system package. Use when adding, editing, reviewing, or styling toolkit components, writing Storybook stories, using the shadcn CLI in this monorepo, working with the form system (createFormHook, field components), or updating the Overview canvas. Covers the primitive vs composed tiers and how to choose between them, component directory/barrel structure, cva/cn class string formatting, JSDoc requirements, the add-a-component workflow, the overview coverage rule, and package pitfalls.
---

# @9bar/toolkit

Two-tier design system built on React Aria Components, styled with shadcn/ui (React Aria base, `aria-mira` style, zinc theme). See "Primitive vs Composed" for which tier a component belongs in.

## Commands

```bash
# Start Storybook dev server (port 6006)
pnpm toolkit storybook

# Build Storybook as a static site
pnpm toolkit build-storybook

# Typecheck only
pnpm toolkit typecheck
```

## Primitive vs Composed

- A **primitive** is a styled accessibility unit with no opinions about data or state management (Button, Menu, Field). It wraps React Aria semantics and theme tokens, nothing more. Lives in `src/components/primitive/<component>/`, story title `Primitives/<Name>`.
- A **composed** component is an opinionated assembly of primitives that owns a data/state contract and may depend on a deliberate third-party library (form → TanStack Form, FilterBar → filter definitions + selection state). Lives in `src/components/composed/<component>/`, story title `Composed/<Name>`, consumed from `@9bar/toolkit/components/composed`.
- **Decision test for new components:** *"does it need a state library or a shaped data model to function?"* — yes → composed. *"Is it specific to one app's domain?"* — yes → it doesn't belong in toolkit at all; single-use compositions belong in the consuming app.
- **Neither tier may contain business logic or domain-specific data.** The package must stay portable enough to extract for use across apps: sample data in stories and overview sections is the only place app flavor appears.
- **Both tiers follow the same principles:** every styling slot is overridable via `className` (composed components expose a `*Variants` slot object like `filterBarVariants`, mirroring primitive `*Variants`), `data-slot` attributes identify each part, and multi-file components split by role (`<name>.tsx` root, `<name>-types.ts`, `styles.ts`, `utils.ts`, context/actions/chip submodules — see `filter-bar/`).
- **Dependency direction is one-way:** composed may import primitives (via the `#components/*` alias); primitives must never import composed. Within a composed component, cross-file imports are relative.

## Component Conventions

- Each component lives in its own directory: `src/components/primitive/<component>/<component>.tsx` for primitives, `src/components/composed/<component>/<component>.tsx` for composed
- Each component directory has an `index.ts` barrel (`export * from "./<component>"`) so the `#components/*` / `#composed/*` import aliases and `@9bar/toolkit/components/*` deep exports resolve
- Public barrels: `src/components/primitive/index.ts` (primitives), `src/components/composed/index.ts` (composed), `src/components/index.ts` (re-exports both tiers), and `src/utils/index.ts` (utilities). Consumers import primitives from `@9bar/toolkit/components` or `@9bar/toolkit/components/primitive`, composed from `@9bar/toolkit/components/composed`, utilities from `@9bar/toolkit/utils`
- Components use `data-slot` attributes for identification
- Components are styled with shadcn class strings (`cn()` / `cva()`) using the theme tokens defined in `src/styles/globals.css`
- Component props extend React Aria props where applicable
- **Alias react-aria-components imports with the `Aria*` prefix** when a name would collide with the toolkit's own export: `Button as AriaButton`, `type ButtonProps as AriaButtonProps`, `ListBoxItem as AriaListBoxItem`. Do not use `*Primitive` aliases (legacy convention, being phased out). Leave imports unaliased when there is no collision (e.g. `Group`, `composeRenderProps`).
- **Reuse existing primitives instead of duplicating styling.** When a component needs styles that a sibling primitive already owns, import that primitive or its exported variant (`buttonVariants`, `badgeVariants`, `listboxItemVariants`, `listboxSectionHeaderVariants`, `popoverVariants`, `inputVariants`, `Separator`, `Popover`, …) and override via `className`/`data-slot`, rather than repeating the same class strings. Only extract a new shared `cva` variant when no primitive already provides the styles.

## Class String Formatting

Long class strings in `cva()`/`cn()` calls are broken into arrays of shorter strings, grouped by selector (base layout, then `hover:`/`focus-visible:`/`active:`/`disabled:`/`aria-*`/`data-*`/`dark:*`/`group-*`/`has-*`/arbitrary `[&_...]` variants). Each array entry stays under ~90 chars. See `src/components/primitive/button/button.tsx` for the reference pattern. Never combine multiple selectors into a single unreadable line.

## shadcn / CLI

- `components.json` at the package root configures the CLI: `style: "aria-mira"`, baseColor `zinc`, icon library `lucide`, aliases `#components` / `#lib` / `#hooks`
- `imports` in `package.json` map `#components/*` → `./src/components/primitive/*/index.ts`, `#composed/*` → `./src/components/composed/*/index.ts`, and `#lib/*` → `./src/utils/*.ts`
- `exports` expose `./components` (both tiers), `./components/primitive`, `./components/composed` (+ `/*` deep-export variants), `./utils`, `./hooks/*`, `./globals.css`
- Monorepo routing: the CLI installs into this package via `apps/web/components.json` (`ui` → `@9bar/toolkit/components`) — run `pnpm dlx shadcn@latest add <name>` from `apps/web`, or with `-c packages/toolkit`. Follow the `shadcn` skill for CLI usage, then the post-install steps below

## Form System

- The form system is a **composed** component set: `src/components/composed/form/`, consumed from `@9bar/toolkit/components/composed`
- A custom form hook is created via `@tanstack/react-form`'s `createFormHook`
- Pre-registered field components: Input, Textarea, Select, Checkbox, CheckboxGroup, InputGroupSelect
- Pre-registered form components: SubmitButton
- Error formatters handle Zod errors, HTML validation errors, and generic errors
- Form fields compose shadcn `Field` / `FieldLabel` / `FieldDescription` / `FieldError` (the latter accepts `errors={field.state.meta.errors}` directly)

## Styling

- Tailwind CSS v4, single source of truth: `src/styles/globals.css` (zinc theme, Geist font via `@fontsource-variable/geist`, `shadcn/tailwind.css` + `tw-animate-css` imports)
- The web app imports this file from its own `globals.css`; Storybook imports it from `.storybook/styles.css`
- `tailwindcss-react-aria-components` plugin is retained for the legacy custom components that use `pressed:`/`selected:`/`current:` variants

## Overview Canvas

- `src/overview/overview.stories.tsx` renders **Overview / Preview** — a shadcn-create-style canvas showing every public component applied in realistic 9bar UI. It is pinned first in the sidebar and is the design system's front door, regression-spotting page, and theme-alignment check (use the theme toolbar global for dark mode)
- **Coverage rule: every public component must appear on the canvas at least once.** Components live in section modules under `src/overview/sections/` (hero, recipe form, brew log, feedback, navigation, overlays, typography, variant strips)
- When **adding** a component, add it to the section that fits its role (or create a new section module) — see the last step of "Adding a New Component"
- When **editing** a component's variants, sizes, or styling, update the matching canvas section/strip so the overview stays truthful
- Sections use 9bar-flavored sample data (recipes, shots, beans) and compose via the `src/components` barrel; keep each section a small focused file

## Storybook

- Storybook 10 with addons for Chromatic, docs, a11y, and MCP
- Uses `react-docgen-typescript` for prop tables (aria-* props are filtered out)
- Autodocs enabled with centered layout

When the `toolkit-sb-mcp` MCP server is available, use its tools to verify component props before use:

- Query `get-documentation` for a component to see all available properties and examples — never assume undocumented props
- Use `get-storybook-story-instructions` before writing stories
- Check your work with `run-story-tests`

## Accessibility

Components are built on React Aria Components for WAI-ARIA-compliant semantics and keyboard interactions. See the `a11y` skill for project-specific conventions.

## Adding a New Component

First decide the tier with the "Primitive vs Composed" decision test (`<tier>` below is `primitive` or `composed`). Then follow the `shadcn` skill for the CLI add (registry lookup, `add`, post-add review). These repo-specific post-install steps are then required — the CLI writes a flat `src/components/<name>.tsx`:

1. Move the generated flat `src/components/<name>.tsx` into `src/components/<tier>/<name>/<name>.tsx` and delete the flat file
2. Create `src/components/<tier>/<name>/index.ts` with `export * from "./<name>";`
3. **JSDoc pass** -- shadcn files ship with no JSDoc, which feeds `react-docgen-typescript` → Storybook docs → MCP `get-documentation`. Add:
   - A descriptive JSDoc on every exported component (use `{@link}` for subcomponent relationships)
   - `/** Props for the {@link X} component. */` on every exported props type
   - Convert `function` declarations to arrow functions (repo convention)
4. Add an export line to `src/components/<tier>/index.ts`
5. Create/migrate `<name>.stories.tsx` with JSDoc on each story, titled `Primitives/<Name>` for primitives or `Composed/<Name>` for composed (form fields nest as `Composed/Form/<Name>`)
6. Add the component to the overview canvas: place it in the fitting `src/overview/sections/` module (hero, recipe form, brew log, feedback, navigation, overlays, typography, or a variant strip) so **Overview / Preview** keeps covering every public component — see "Overview Canvas"

## Common Pitfalls

- **Always add new components to the tier barrel export** (`src/components/primitive/index.ts` or `src/components/composed/index.ts`) -- if you forget, the component won't be available to consumers
- **`shadcn add` writes flat files and recreates registry dependencies** (e.g. `button.tsx` when adding a component that depends on button) -- after each add, delete any flat `src/components/*.tsx` whose directory version already exists (they are identical)
- **Const-asserted definition tuples infer literal ids** -- e.g. `FilterBar` infers `FilterBarFilterState<"status", …>` from `as const` definitions, which mismatches state typed `FilterBarFilterState<string, string>`. Widen demo/consumer definitions with an explicit `: FilterBarDefinition` / `: ReadonlyArray<FilterBarDefinition>` annotation. Render-only stories of a generic component still require `args`.
- **React Aria tabs/select use `id`, not `value`** -- `TabsTrigger id=...`/`TabsContent id=...`, `SelectItem id=...`/`Select selectedKey=...`
- **exactOptionalPropertyTypes is disabled** in `tsconfig.base.json` -- shadcn-generated components rely on standard optional semantics
- **Don't repeat styling a primitive already provides** -- e.g. `select` and `menu` must reuse `popoverVariants` and `Separator` rather than hand-rolling the same overlay animation, border, and separator classes
