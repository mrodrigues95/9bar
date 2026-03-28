# General Guidelines

## Code Style

- **Formatter:** Biome, configured in the root `biome.json`
- **Indent style:** Tabs
- **Quote style:** Double quotes
- **Module system:** ESM everywhere (`"type": "module"`)
- **Imports:** Auto-organized by Biome on save. Unused imports and variables are errors.
- **Tailwind classes:** Must be sorted (enforced by Biome's `useSortedClasses` rule, configured for the `tv()` function from `tailwind-variants`)

## Comments

- Do not use decorative separator comments (e.g. `// ---- Section ----`, `// === Section ===`, `// ***`). Let the code structure speak for itself. JSDoc comments and brief inline comments are fine.
