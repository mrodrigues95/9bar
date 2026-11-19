# 9bar web verification map

This directory is the maintained source for verifying apps/web from a user's point of view. Read this index, then use the matching feature file as the recipe. Behaviour is specified in [`research/recipes-and-logs-flows.md`](../../../../../research/recipes-and-logs-flows.md); feature files link to its sections.

## Baseline

- `pnpm control web launch`, then `pnpm control web doctor` reports `ok: true`.
- Fresh mock data: launch resets it. Relaunch (`cleanup`, `launch`) after a run that changed state you depend on.
- Only drive an instance this run launched.

## Conventions

- `c="pnpm control web"` in the recipes below.
- Prefer `--role` + `--name` from `snapshot`. Commands are literal: keep names and flags as written.
- Start each recipe from its stated URL.
- Proof is the action's JSON (`url`, `focused`) plus a snapshot or screenshot of the resulting state, plus `console` for stubbed saves.
- Report an unreachable path with the command tried and the unmet precondition. A path skipped is not verified through another one.

## Feature entry contract

Each file has an H1, one paragraph of user-visible behaviour, then four H2s in order: `Sub-features`, `How to get to it (user POV)`, `Driving it with control`, `Gotchas`.

## Features

- [Recipes list](./recipes-list.md): search, filters, pagination, row links.
- [Log form](./log-form.md): log a shot, save and log another, edit, repeat.
- [Recipe form](./recipe-form.md): new recipe, edit, validation.
- [Recipe overview](./recipe-overview.md): overview, Logs tab, History tab.
- [Row actions](./row-actions.md): the per-row actions menu and its dialogs.
