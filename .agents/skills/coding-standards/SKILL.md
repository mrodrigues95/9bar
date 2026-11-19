---
name: coding-standards
description: Judgment rules for 9bar TypeScript and TSX that no lint can check. Use when deciding where new code lives (in-file, colocated sibling, or shared), when a component's JSX should be split, or how shared UI takes content. Mechanical rules (naming, booleans, return types, comments, effects, memoization, imports, placement counts) are enforced by `pnpm check`; see the rules table in AGENTS.md.
---

# Coding Standards

Only judgment calls live here. Everything mechanical fails `pnpm check` with a message that names the fix.

## Placement

- Start in-file. Extract to a `-`-prefixed sibling (`-items-list.tsx`, `-components/`) only when the JSX stops reading as layout.
- Feature logic stays beside its feature. `src/utils/` holds pure helpers and app-wide contracts; `src/components/` holds UI with no domain. `check:structure` fails a shared module with fewer than two route consumers.
- Shared UI takes content through slot props (`actions`, `badge`, `footer`, `children`), not a growing list of flags and strings.
- A hook used by one route stays a colocated `use-*.ts` beside the code that uses it.

## JSX

A component's JSX reads top-down as structure: a reader infers what renders without opening helpers. Resolvers and data helpers sit above the component; extraction exists to reveal the shape, not hide it.

```tsx
<FeaturePage> (routes/feature/route.tsx)
  resolveSelection() / resolveLayout()  // above the component, not in JSX
  <SharedHeader title actions={<FeatureActions />}>
  <SharedPicker> (src/components/)
    <FeatureOption> (./-components/)
  <FeatureBoard> (./-components/)
  <SharedEmptyState> (src/components/)
```
