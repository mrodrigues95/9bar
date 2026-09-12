---
name: mockup
disable-model-invocation: true
description: Workflow for @9bar/design-lab, the standalone dev-only mockup lab (port 3001). Use when the user asks to "mock up <thing>", explore a design direction, add a variant, or compare prototypes. Covers grouping, variant scaffolding, the toolkit-first rule with co-located _local/ scaffolds, the gallery → 2-up compare → annotate → copy-back loop, and the hard boundaries (throwaway variants, never touch apps/web, never abstract into toolkit).
---

# Mockup Lab

`@9bar/design-lab` (`apps/design-lab/`) is a standalone dev-only app for quick throwaway prototypes. It imports only `@9bar/toolkit` — never `@9bar/web`. Variants are disposable; the shell (registry, gallery, compare, annotate) is production-quality and must stay extractable to its own repo.

## Commands

```bash
# Start the lab (port 3001; web stays on 3000)
pnpm lab dev

# Typecheck only
pnpm lab typecheck
```

Never start servers when invoked — just print the URLs to open (gallery + pre-filled compare).

## Trigger and inputs

This skill never auto-invokes — it only runs when the user calls `/skill:mockup` (e.g. "mock up <thing>" or asking for a variant/prototype of a page or section). Once invoked, collect, in order:

1. **Target** — which page or section, and which surface (`page` full mock vs `section` scoped piece; `framed` default canvas vs `plain` for full-bleed/dark that paints its own background).
2. **Group** — existing group or new one. A group is one design question with 1+ competing directions; compare never crosses groups. New group needs a `title` plus the decision `question` (e.g. "Which density direction: quiet rows vs ledger vs sidebar?").
3. **Direction count** — default 2. Each direction becomes one variant file.

If any of these is already clear from context, don't ask — assume and state the assumption.

## Scaffolding

- Variant file: `apps/design-lab/src/components/registry/variants/<name>.tsx` exporting a named component with inline sample data, self-contained.
- Missing-piece scaffold: if the design wants a component the repo lacks, build it co-located at `apps/design-lab/src/components/registry/variants/_local/` — just get it working, no API design, no abstraction. It dies with the variant.
- Registry: append to the `variants` array of the matching group in `apps/design-lab/src/components/registry/registry.ts` (`id`, `title`, `kind`, `description`, `surface?`, `component`); add a group entry for a new design question. Gallery, compare, and isolated views pick it up with no routing changes.
- Reply with the gallery URL (`http://localhost:3001/`) plus the pre-filled compare URL: `http://localhost:3001/compare?group=<id>&a=<first>&b=<second>`.

## The loop

Gallery (grouped sections: title + question + cards) → per-group "Compare these" → 2-up compare (`?group=&a=&b=&w=`, A/B pickers scoped to the group — each slot hides the variant the other slot is showing, so A and B always differ; global width Full/768/390) → Annotate (click element, write pin, per-variant storage) → "Copy A+B for agent" → paste back here → revise the variant, keeping old versions for diffing.

## Hard rules

- **Toolkit-first**: compose from `@9bar/toolkit/components` (and `/composed`) wherever possible — check the toolkit skill and Storybook before hand-rolling.
- **Scaffold missing pieces locally** in `_local/`; never add to toolkit or `apps/web` as part of a mockup. Abstraction happens afterwards, outside this skill.
- **Throwaway quality**: variant files (including `_local/`) get no polish review — no nitpicks on composition, abstraction, or code quality. Typecheck/lint still run repo-wide and must stay green.
- **Never touch `apps/web`** and never import from `@9bar/web` — the lab's own `components/link.tsx` and `styles/globals.css` are copies, not imports, and that boundary is what keeps the lab extractable. The lab carries a `components.json` identical to web's so any `shadcn add` run from the lab still installs into toolkit — but installs happen from `apps/web` per the toolkit skill, never as part of a mockup.
- **Single-variant groups** render without a compare button; compare shows an "add another variant" empty state until a second direction lands.
