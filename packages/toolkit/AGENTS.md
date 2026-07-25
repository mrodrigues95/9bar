# @9bar/toolkit

Primitive design system built on React Aria Components with Tailwind Variants (`tv()`) for styling.

## Commands

```bash
# Start Storybook dev server (port 6006)
pnpm toolkit storybook

# Build the toolkit
pnpm toolkit build

# Build Storybook as a static site
pnpm toolkit build-storybook

# Typecheck only
pnpm toolkit typecheck
```

## Architecture

### Component Conventions

- Each component lives in its own directory: `src/<component>/<component>.tsx`
- Stories are co-located: `src/<component>/<component>.stories.tsx`
- Components use `data-slot` attributes for identification
- All components are re-exported from the barrel file `src/index.ts`
- Component props extend React Aria props with variant types from `tailwind-variants`

### Form System

- A custom form hook is created via `@tanstack/react-form`'s `createFormHook`
- Pre-registered field components: Input, Textarea, Select, Checkbox, CheckboxGroup, InputGroupSelect
- Pre-registered form components: SubmitButton
- Error formatters handle Zod errors, HTML validation errors, and generic errors

### Styling

- Tailwind CSS v4 with plugins: `@tailwindcss/forms`, `tailwindcss-react-aria-components`, `tailwindcss-animate`
- Custom CSS theme variables defined in the Storybook `styles.css` (mirrors the web app's `globals.css`)
- Tailwind Variants (`tv()`) is used for all component variant styling

### Storybook

- Storybook 10 with addons for Chromatic, docs, a11y, and MCP
- Uses `react-docgen-typescript` for prop tables (aria-* props are filtered out)
- Autodocs enabled with centered layout

When the `toolkit-sb-mcp` MCP server is available, use its tools to verify component props before use:

- Query `get-documentation` for a component to see all available properties and examples -- never assume undocumented props
- Use `get-storybook-story-instructions` before writing stories
- Check your work with `run-story-tests`

### Accessibility

Components are built on React Aria Components for WAI-ARIA-compliant semantics and keyboard interactions. See [.agents/a11y.md](../../.agents/a11y.md) for project-specific conventions.

## Adding a New Component

1. Create a directory: `src/<component>/`
2. Create the component file: `<component>.tsx`
3. Create a story file: `<component>.stories.tsx`
4. Export the component from `src/index.ts`

## Common Pitfalls

- **Always add new components to the barrel export** -- if you forget to export from `src/index.ts`, the component won't be available to consumers.
