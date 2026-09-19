---
name: mockup-convert
disable-model-invocation: true
description: Convert a winning design-lab variant into apps/web and/or packages/toolkit — triage the mockup into toolkit vs web changes, propose the full change set with show-me, and implement only after approval.
---

# Mockup Convert

A `@9bar/design-lab` variant — one direction from the mockup loop — is a throwaway sketch; the decisions inside it are what land in production. Converting reads a winning variant and writes production code in `packages/toolkit` and/or `apps/web`. Read the variant as a description of the design and write code that expresses it: the sketch's structure, sample data, and shortcuts stay in the lab.

```text
recon (read-only) → proposal (show-me) → GATE → land (writes, checks, commits)
```

**The gate:** recon and proposal read `apps/web`, `packages/toolkit`, and the lab without writing. The first write happens once the user approves the proposal.

## Inputs

Collect, in order — assume and state when context already answers:

1. **Winning variant(s)** — ids from `apps/design-lab/src/components/registry/registry.ts`. The decision can be a hybrid, so accept parts from several variants ("A's rows, B's pagination"). Pasted "Copy for agent" pins are decisions too: where a pin contradicts the variant file, the pin wins.
2. **Target** — the apps/web route(s) or screen(s) the design lands in, new or existing. A `page` variant names its target route; a `section` variant names the page it drops into.
3. **Pins** — annotations live in the browser's localStorage, so ask for the pasted Markdown when the decision used them and it is not already in hand.

## 1. Recon

Read the source and the targets before classifying anything.

**Source**

- Registry entry (group question, variant description, `kind`, `surface`), the variant file, and every `_local/` import.
- Every TODO, `className` override, and workaround — deliberate porting notes, e.g. an inline TODO above a `Menu` override naming the toolkit width variant it wants.
- Pins, where supplied.

**Targets**

- The apps/web route and its `-` siblings, or the absence of one for a new route.
- The toolkit components the variant imports, with their stories and overview section.

`_local/` pieces are candidate toolkit work: read each as a proposal for an API the toolkit lacks. A `_local/` copy of an existing component is a fork — diff it against the toolkit source to read the delta.

Load `toolkit`, `coding-standards`, `web`, and `a11y`, then classify every decision into the **manifest**, applying their tests:

| Decision | Home | Companion work |
| --- | --- | --- |
| Tweak to an existing toolkit component (variant, prop, token) | `packages/toolkit/src/components/<tier>/<name>/` | story + overview section, same commit |
| New reusable UI unit | toolkit — primitive or composed by the tier test | the full "Adding a New Component" flow |
| Composition shared by ≥2 web routes, no domain | `apps/web/src/components/` | — |
| Single-route composition, section, or screen | `apps/web/src/routes/...` (`route.tsx`, `-components/`, `-` siblings) | `web` route conventions |
| Sample data, placeholder copy, inline sketches | dropped | replaced by the app's real data contract |
| Lab-only shell (annotate, compare, routing, registry) | stays in the lab | — |

**Completion criterion:** the manifest accounts for every element of the winning variant — each surviving piece has a target file and a kind (new / edit / delete), and each dropped piece has a reason.

## 2. Proposal

Load the `show-me` skill (`~/.agents/skills/show-me/SKILL.md`) and follow it. Propose the smallest set of views that lets the user approve the whole change set without reading final code:

- **Manifest** — the reconciliation table: every design decision, its home, and its kind.
- **File tree diff** — every file created, edited, and deleted across toolkit and web.
- **Component tree diff** — the target route before/after, showing which pieces come from the toolkit and which are colocated.
- **Shape sketches** — new toolkit APIs (props, variants, slots) and new data/state contracts; sketch only what the variant does not already show, and keep its real labels and content.
- **Drops** — every piece left behind with its replacement, so each drop is explicit.
- **Commit plan** — one commit per package, toolkit first, then web, in the repo's Conventional Commits (`feat(toolkit): …`), naming what each commit carries.
- **Check plan** — `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm react-doctor`, plus the story + overview coverage rule and the `a11y` checklist for toolkit work; offer the visual check (`pnpm web dev` on 3000 against `pnpm lab dev` on 3001) for the user to run.
- **Open questions** — naming, API shape, placement, and anything the pins left ambiguous. Ask here, not mid-implementation.

Write show-me artifacts outside the repo (e.g. `/tmp/show-me-convert-<variant>.html`) so `git status` stays clean.

**The gate: stop after the proposal and wait for explicit approval.** The proposal is complete only when the manifest and commit plan cover every file and every commit the change will produce; the approved version is the contract for step 3.

## 3. Land

Follow the approved plan and the owning skill per piece:

- **New toolkit component** → the `toolkit` skill's "Adding a New Component": tier decision, shadcn CLI from `apps/web`, directory move, barrel, JSDoc, story, overview section.
- **Toolkit tweak** → extend the component's variants/props instead of overriding at the call site, then update its story and overview section.
- **Web route** → the `web` skill's conventions (file-based routes, `_` layouts, `-` colocated components, breadcrumbs via `staticData`); load the matching TanStack intent skills for routing, data, and server functions.
- **Every change** → `coding-standards` for placement, functions, types, booleans, and JSX; `a11y` for interactive pieces.

Replace the variant's literal world with the app's: real props in, rendered slots for composition, sample arrays swapped for the route's data contract, and web importing from `@9bar/toolkit` only.

Run the check plan, fix failures, then commit in the approved order.

**Completion criterion:** the approved proposal is realized — checks green, commits made, every item landed or explicitly dropped with the user.

## Retire the variant

Once the change lands, offer to retire the decided variant or its whole group in its own `chore(design-lab):` commit — variants are throwaway once a direction wins. Retire it when the user confirms.
