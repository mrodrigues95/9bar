---
name: coding-standards
description: Coding standards for 9bar TypeScript and TSX. Use when writing, editing, or reviewing TS/TSX; placing shared vs colocated components, hooks, utils, or types; shaping boolean or type expressions; or structuring JSX.
---

# Coding Standards

Flat reference. Every rule applies to every change; the completion bar is every rule applied.

## Functions

- Write arrow functions with braces for the body; avoid inline returns.
- Rely on inference for return types; annotate only to narrow, widen, or resolve a type error.

## Types

- Inline simple unions at the usage site; name an interface only for a complex or large nested object.

## Booleans

- Write shorthand falsy checks (`!value.length`, `!items`) and `!!` coercion (`!!filter`, `!!state.items.length`).
- Exception in JSX: `value.length &&` renders `0` — write `value.length > 0 &&` or `!!value.length &&` instead.

## Placement

Decide placement for every new component, helper, hook, and type:

```text
on(new code)
  if used by ≥2 routes
    promote to src/components/ or src/utils/
  else keep in-file
  if JSX stops reading as layout
    extract to -name.tsx / -components/
  never barrel-export colocated code
```

Target shape — shared stays small, route-owned stays colocated:

```text
src/
├── components/      # ≥2 routes, no domain, no route imports
├── utils/           # pure helpers or app-wide contracts
└── routes/
    ├── _layout/-nav/                # layout-owned siblings
    │   ├── nav.tsx
    │   └── nav-menu.tsx
    ├── _layout/items/               # route.tsx reads as layout
    │   ├── route.tsx
    │   └── -items-list.tsx          # extracted only when route.tsx bloated
    └── _layout/items_/_form/-form-sections/  # schema + sections + use-*.ts
```

Growth path — stay in-file, then split sibling, then folder:

```diff
 routes/feature/
   route.tsx                 # helpers inline until JSX stops reading as layout
+  -components/
+    feature-board.tsx
+    feature-pickers.tsx
+    picker-link.tsx         # single-use is fine once the folder exists
```

Rules behind the visuals:

- Start in-file. Extract to a `-`-prefixed sibling only when the JSX stops reading as layout.
- Promote on second consumer. Shared entry is earned by ≥2 routes; a single use stays colocated with a relative import.
- Shared UI carries no domain and no route imports; compose through slot props (`actions`, `badge`, `footer`, `children`) rather than prop explosion.
- Shared utils are pure helpers or app-wide contracts. Feature-owned logic colocates beside its feature, never in `src/utils/`.
- Dependency direction is one-way: colocated may import shared, never the reverse.

## JSX

Every component's JSX reads top-down as structure — infer what renders without digging into helpers. Resolvers and data helpers sit above the component; extraction exists to reveal the shape, not hide it:

```tsx
<FeaturePage> (routes/feature/route.tsx)
  resolveSelection() / resolveLayout()  // above component, not in JSX
  <SharedHeader title actions={<FeatureActions />}>  // shared
  <SharedPicker> (src/components/, shared)
    <FeatureOption> (./-components/, feature-only)
  <FeaturePickers> (./-components/, feature-only)
  <FeatureBoard> (./-components/, feature-only)
  <SharedEmptyState> (src/components/, shared)
```

## Hooks

Hooks follow placement: inline until bloated, then a colocated `use-*.ts` (e.g. `use-feature-form-mode.ts` in `-form-sections/`). No top-level `src/hooks/` until a hook serves ≥2 routes.

## Lint

`eslint/curly` and `typescript/no-inferrable-types` enforce part of this. The rest is convention — oxlint has no rule for arrow style, return-type minimalism, `!!`, colocation, or layout readability, and its `explicit-length-check` / `strict-boolean-expressions` push the opposite way, so leave both off.
