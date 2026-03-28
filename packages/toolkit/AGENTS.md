# @9bar/toolkit

Primitive design system built on React Aria Components (headless accessible UI primitives from Adobe) with Tailwind Variants (`tv()`) for styling.

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
- Tailwind classes must be sorted (enforced by Biome's `useSortedClasses` rule)

### Storybook

- Storybook 10 with addons for Chromatic, docs, a11y, and MCP
- Uses `react-docgen-typescript` for prop tables (aria-* props are filtered out)
- Autodocs enabled with centered layout

When working on UI components, always use the `toolkit-sb-mcp` MCP tools to access Storybook's component and documentation knowledge before answering or taking any action.

- **CRITICAL: Never hallucinate component properties!** Before using ANY property on a component from a design system (including common-sounding ones like `shadow`, etc.), you MUST use the MCP tools to check if the property is actually documented for that component
- Query `list-all-documentation` to get a list of all components
- Query `get-documentation` for that component to see all available properties and examples
- Only use properties that are explicitly documented or shown in example stories
- If a property isn't documented, do not assume properties based on naming conventions or common patterns from other libraries. Check back with the user in these cases
- Use the `get-storybook-story-instructions` tool to fetch the latest instructions for creating or updating stories. This will ensure you follow current conventions and recommendations
- Check your work by running `run-story-tests`

Remember: A story name might not reflect the property name correctly, so always verify properties through documentation or example stories before using them.

## Accessibility

Components are built on React Aria Components which provide WAI-ARIA-compliant semantics, keyboard interactions, and focus management out of the box. The Storybook `@storybook/addon-a11y` addon runs axe-core audits on every story -- check the "Accessibility" panel for violations.

## Adding a New Component

1. Create a directory: `src/<component>/`
2. Create the component file: `<component>.tsx`
3. Create a story file: `<component>.stories.tsx`
4. Export the component from `src/index.ts`

## Common Pitfalls

- **This package exports raw TypeScript source** (`"main": "./src/index.ts"`). There is no build step needed during development -- the web app compiles it directly.
- **Always add new components to the barrel export** -- if you forget to export from `src/index.ts`, the component won't be available to consumers.
