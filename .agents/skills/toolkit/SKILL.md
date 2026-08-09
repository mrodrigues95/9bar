---
name: toolkit
description: Conventions for @9bar/toolkit, the React Aria + shadcn (aria-mira, zinc) design system package. Use when adding, editing, reviewing, or styling toolkit components, writing Storybook stories, using the shadcn CLI in this monorepo, or working with the form system (createFormHook, field components). Covers component directory/barrel structure, cva/cn class string formatting, JSDoc requirements, the add-a-component workflow, and package pitfalls.
---

# @9bar/toolkit

Primitive design system built on React Aria Components, styled with shadcn/ui (React Aria base, `aria-mira` style, zinc theme).

## Commands

```bash
# Start Storybook dev server (port 6006)
pnpm toolkit storybook

# Build Storybook as a static site
pnpm toolkit build-storybook

# Typecheck only
pnpm toolkit typecheck
```

## Component Conventions

- Each component lives in its own directory: `src/components/<component>/<component>.tsx`
- Each component directory has an `index.ts` barrel (`export * from "./<component>"`) so the `#components/*` import alias and `@9bar/toolkit/components/*` exports resolve
- Public barrels: `src/components/index.ts` (all components, incl. the form system) and `src/utils/index.ts` (utilities). Consumers import from `@9bar/toolkit/components` and `@9bar/toolkit/utils`
- Components use `data-slot` attributes for identification
- Components are styled with shadcn class strings (`cn()` / `cva()`) using the theme tokens defined in `src/styles/globals.css`
- Component props extend React Aria props where applicable

## Class String Formatting

Long class strings in `cva()`/`cn()` calls are broken into arrays of shorter strings, grouped by selector (base layout, then `hover:`/`focus-visible:`/`active:`/`disabled:`/`aria-*`/`data-*`/`dark:*`/`group-*`/`has-*`/arbitrary `[&_...]` variants). Each array entry stays under ~90 chars. See `src/components/button/button.tsx` for the reference pattern. Never combine multiple selectors into a single unreadable line.

## shadcn / CLI

- `components.json` at the package root configures the CLI: `style: "aria-mira"`, baseColor `zinc`, icon library `lucide`, aliases `#components` / `#lib` / `#hooks`
- `imports` in `package.json` map `#components/*` → `./src/components/*/index.ts` and `#lib/*` → `./src/utils/*.ts`
- `exports` expose `./components`, `./components/*`, `./utils`, `./hooks/*`, `./globals.css`
- Monorepo routing: the CLI installs into this package via `apps/web/components.json` (`ui` → `@9bar/toolkit/components`) — run `pnpm dlx shadcn@latest add <name>` from `apps/web`, or with `-c packages/toolkit`. Follow the `shadcn` skill for CLI usage, then the post-install steps below

## Form System

- A custom form hook is created via `@tanstack/react-form`'s `createFormHook`
- Pre-registered field components: Input, Textarea, Select, Checkbox, CheckboxGroup, InputGroupSelect
- Pre-registered form components: SubmitButton
- Error formatters handle Zod errors, HTML validation errors, and generic errors
- Form fields compose shadcn `Field` / `FieldLabel` / `FieldDescription` / `FieldError` (the latter accepts `errors={field.state.meta.errors}` directly)

## Styling

- Tailwind CSS v4, single source of truth: `src/styles/globals.css` (zinc theme, Geist font via `@fontsource-variable/geist`, `shadcn/tailwind.css` + `tw-animate-css` imports)
- The web app imports this file from its own `globals.css`; Storybook imports it from `.storybook/styles.css`
- `tailwindcss-react-aria-components` plugin is retained for the legacy custom components that use `pressed:`/`selected:`/`current:` variants

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

Follow the `shadcn` skill for the CLI add (registry lookup, `add`, post-add review). These repo-specific post-install steps are then required — the CLI writes a flat `src/components/<name>.tsx`:

1. Move the generated flat `src/components/<name>.tsx` into `src/components/<name>/<name>.tsx` and delete the flat file
2. Create `src/components/<name>/index.ts` with `export * from "./<name>";`
3. **JSDoc pass** -- shadcn files ship with no JSDoc, which feeds `react-docgen-typescript` → Storybook docs → MCP `get-documentation`. Add:
   - A descriptive JSDoc on every exported component (use `{@link}` for subcomponent relationships)
   - `/** Props for the {@link X} component. */` on every exported props type
   - Convert `function` declarations to arrow functions (repo convention)
4. Add an export line to `src/components/index.ts`
5. Create/migrate `<name>.stories.tsx` with JSDoc on each story

## Common Pitfalls

- **Always add new components to the barrel export** (`src/components/index.ts`) -- if you forget, the component won't be available to consumers
- **`shadcn add` writes flat files and recreates registry dependencies** (e.g. `button.tsx` when adding a component that depends on button) -- after each add, delete any flat `src/components/*.tsx` whose directory version already exists (they are identical)
- **React Aria tabs/select use `id`, not `value`** -- `TabsTrigger id=...`/`TabsContent id=...`, `SelectItem id=...`/`Select selectedKey=...`
- **exactOptionalPropertyTypes is disabled** in `tsconfig.base.json` -- shadcn-generated components rely on standard optional semantics
