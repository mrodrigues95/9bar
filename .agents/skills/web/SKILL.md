---
name: web
description: Repo-specific conventions for @9bar/web (TanStack Start + Router + React 19 app) that the TanStack Intent skills do not cover. Use when working in apps/web — file-based routes, layout route and co-located component prefix conventions, breadcrumbs via staticData, the pre-registered form hook, and styling setup. For framework-level TanStack guidance (routing, data loading, server functions, routeTree.gen.ts), load the matching intent skill first.
---

# @9bar/web conventions

Repo-specific conventions on top of TanStack Start/Router. For framework-level guidance — routing, data loading, server functions, search params, `routeTree.gen.ts` — load the matching TanStack Intent skill (`@tanstack/router-core#router-core`, `@tanstack/start-client-core#start-core`, etc.) per the intent-skills block in the root `AGENTS.md`.

## Routing

- Routes live in `src/routes/`; the route tree is auto-generated into `routeTree.gen.ts` — never edit it manually
- Layout routes use the `_` prefix convention (e.g. `_authenticated`, `_unauthenticated`)
- Pathless layout routes group related routes without affecting the URL (e.g. `recipes_/_form/`)
- Private/co-located components use the `-` prefix convention (e.g. `-nav/nav.tsx`, `-form-sections/`)
- Breadcrumb data is attached to routes via `staticData`

## Forms

- TanStack React Form with a custom form hook (`createFormHook`) that pre-registers toolkit field components — see the `toolkit` skill
- Zod v4 for schema validation

## Localization

- React Aria locale optimization configured for `en-US` and `fr-FR`

## Styling

- Tailwind CSS v4; `src/styles/globals.css` imports the toolkit's theme (`../../packages/toolkit/src/styles/globals.css`) and adds a `@source` directive pointing at the toolkit source so Tailwind scans toolkit components for class usage
- Geist is the primary typeface (bundled via `@fontsource-variable/geist` in the toolkit)
