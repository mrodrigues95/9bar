# @9bar/design-lab

Dev-only playground for prototyping 9bar UI directions and deciding between them.

`pnpm lab dev` (from the repo root) serves it on **http://localhost:3001**. It is
never deployed and nothing here ships, it exists so design decisions can be made
against something real instead of a description.

## The loop

1. A variant is added under `src/components/registry/variants/` and registered in
   `registry.ts`. The gallery, compare, and isolated views pick it up automatically.
2. Open a variant (or Compare) and toggle **Annotate**. Click any element, write what
   should change, save the pins.
3. **Copy for agent** emits the pins as Markdown. Paste that back to an agent, which
   revises the variant. Old variants stay around so directions can be diffed.

Pins live in `localStorage`, so they survive reloads and are per-browser.

## Routes

| Route                   | What it does                                                   |
| ----------------------- | -------------------------------------------------------------- |
| `/`                     | Gallery — every group, every variant, with its design question |
| `/$variantId`           | One variant in isolation, at full page width                   |
| `/compare?group=&a=&b=` | Two variants side by side, optionally at tablet/mobile widths  |

## `src/components/registry/` is throwaway code

**Code quality does not matter in `registry/`.** These variants are sketches, they
exist to be looked at and iterated on, then deleted or rewritten once a direction
wins. Duplicate them freely, hardcode sample data, inline what should be abstracted,
and leave the structure ugly if that is faster.

The design decisions those sketches produce are what matter. Those get ported into
`apps/web` and `packages/toolkit` properly, on their own commits, outside this app.

Anything _outside_ `registry/` (the gallery shell, annotate, compare, routing) is
real tooling and should be held to normal standards, it is what makes the loop work.

## Toolkit note

Components come from `@9bar/toolkit` and are styled with the same Tailwind setup as
the rest of the monorepo. `components.json` points shadcn at the toolkit's `ui` alias,
so `pnpm dlx shadcn@latest add` drops new primitives into the toolkit rather than here.
When a variant needs something the toolkit does not have, scaffold it locally under
`variants/_local/`, and never add it to the toolkit or `apps/web` as part of a mockup.
