---
name: verify-web
description: Drive the 9bar web app (apps/web) in a real headless browser to prove a UI change works, using `pnpm control web`. Use after changing anything a user sees or does in apps/web (routes, forms, dialogs, lists, focus, URL state), before calling the change done.
---

# Verify web

`pnpm control web` launches its own dev server and headless Chromium, then drives them one command at a time. Every command prints JSON on stdout (`ok`, plus results or `error` and `hint`) and exits 1 on failure. `pnpm control web --help` lists commands; `<command> --help` lists flags.

Logic bugs start with a failing unit or property test (`pnpm test --project web`). This skill is for what only a browser shows: rendering, focus, URL state, dialogs, keyboard.

## Launch

```sh
pnpm control web launch     # vite dev on :3100, Chromium CDP on :9310; ~10s; idempotent
```

Ready means `launch` returned `ok: true`: the server answered with the 9bar home page and Chromium answers on CDP. The ports are separate from `pnpm web dev` (:3000), so a dev server the user has open is never driven. If a port is taken, launch refuses; pass `--port` / `--cdp-port`.

`goto`, `back` and `forward` also wait for hydration (TanStack Start removes `window.$_TSR`), so the first `goto` on a fresh server takes ~10s while Vite compiles. Clicking before hydration would follow the plain link instead of the app's handler.

Data is in-memory mock data (`apps/web/src/utils/data/`), reset on every launch. Saves are stubs today: they `console.log` the submitted values instead of storing them (see each feature's Gotchas).

## Doctor

```sh
pnpm control web doctor
```

Read-only. Checks Chromium is installed, the instance is recorded, both processes are alive, the URL serves 9bar, and CDP answers. Run it first, and again after any failed command. `fixes` says what to do for each failing check.

## Drive

```sh
pnpm control web goto /recipes
pnpm control web back                                   # and forward
pnpm control web snapshot | jq -r .snapshot            # ARIA tree: roles and accessible names
pnpm control web click --role button --name "Add recipe filter"
pnpm control web type --role textbox --name "Search recipes" --value kenya --keys
pnpm control web press Escape
pnpm control web press --role textbox --name "Search recipes" k Backspace
pnpm control web count --selector '[aria-busy="true"]'
pnpm control web wait-settle
```

- Find handles with `snapshot`, then use `--role` + `--name`. `--name` is a case-insensitive substring; add `--exact` when it matches more than one element, or `--nth <i>` when rows share a name. Use `--label`, `--text`, `--placeholder`, `--testid`, `--selector` only when no role fits.
- Every action waits for the DOM to settle and reports `url` and `focused` (the focused element's ARIA line), so focus rules can be checked from the action's own output.
- The page persists between commands. Each command connects, acts, and disconnects.
- `type` replaces the value (`--keys` types key by key, which fires debounced handlers like a user). `press` takes several keys, pressed in order within one command; use it for anything timing-sensitive.

## Evidence

- `pnpm control web screenshot [path] [--full]`: PNG, default `.control/artifacts/web/<time>.png`.
- `pnpm control web snapshot --path <file>`: ARIA tree as text.
- `pnpm control web console [--errors] [--clear]`: console messages and page errors recorded while commands ran, with logged values in `args`. This is the proof for stubbed saves.
- `pnpm control web network [--failed] [--clear]`: document and fetch responses, and failures.
- `pnpm control web a11y [--selector <css>]`: axe, same version as the story tests; `ok: false` with violations.

Proof standard:

- Drive the real user path from the feature map, not a direct setter or a convenient URL, unless the map lists that URL as an entry point.
- Capture the action and the resulting state (snapshot or screenshot after, `focused`, `url`), and side effects (`console` for stubbed saves).
- A proof covers every entry point the feature map lists for the behaviour changed.
- If a check still fails after 3 rounds of fixes, stop and report what fails and what you tried.

## Cleanup

```sh
pnpm control web cleanup --dry-run   # lists what it will stop and remove
pnpm control web cleanup
```

Stops only the server and browser process groups that `launch` recorded, and removes `.control/web/` (state, logs, browser profile). Never kill by process name. Artifacts in `.control/artifacts/web/` are kept.

## Feature map

[`references/features/`](references/features/README.md) has one file per feature: how a user reaches it, how to drive it, and what proves it. Behaviour is defined in [`research/recipes-and-logs-flows.md`](../../../research/recipes-and-logs-flows.md); the map links to it rather than restating it. Keep the map current with `/maintain-verification-skill`.

## Helpers

All helper code is in `tools/control/` (linted and typechecked like the app). Add a command there, never a script in this directory.
