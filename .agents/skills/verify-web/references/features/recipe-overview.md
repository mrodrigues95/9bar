# Recipe overview

A recipe page with three tabs: Overview (settings and status), Logs (attached logs, filterable, paginated), and History (each settings change, filterable, paginated). Each tab has its own URL. Spec: [Overview](../../../../../docs/recipes-and-logs-flows.md#overview), [Logs tab](../../../../../docs/recipes-and-logs-flows.md#logs-tab), [History tab](../../../../../docs/recipes-and-logs-flows.md#history-tab), [Status](../../../../../docs/recipes-and-logs-flows.md#status).

## Sub-features

- `overview-details` dose, yield, time, temperature, pressure, coffee, and status.
- `overview-tabs` tablist `Manage <name>` with `Overview`, `Logs · <n>`, `History · <n>`; each tab changes the URL.
- `overview-logs` attached logs with filters and pagination.
- `overview-history` change entries (`Grind changed from 9 to 8`) with filters and pagination.
- `overview-empty` empty Logs and History states.

## How to get to it (user POV)

- A recipe or attached log name in the Recipes list.
- Breadcrumb `Recipes` returns to the list.
- Addresses `/recipes/<id>/overview`, `/logs`, `/history`.

## Driving it with control

Preconditions: fresh launch. Recipe 6 (House Espresso) has 3 logs and 1 history entry; recipe 12 (Costa Rica Tarrazú) has none.

- **Overview.** Run `$c goto /recipes/6/overview`. The snapshot has heading `House Espresso`, `tab "Overview" [selected]`, and term/definition pairs (Dose, Yield, …).
- **Logs tab.** Run `$c click --role tab --name Logs`. `url` is `/recipes/6/logs`; the tabpanel has 3 `Actions for …` row buttons and a `New Log` link that opens the [Log form](./log-form.md).
- **History tab.** Run `$c click --role tab --name History`. `url` is `/recipes/6/history`; the list shows `Grind` with a deletion and an insertion.
- **Empty states.** Run `$c goto /recipes/12/history`. Text `No changes yet`.
- **Back to list.** Run `$c click --role link --name Recipes --exact --nth 1` (the breadcrumb; `--nth 0` is the main navigation). `url` is `/recipes`.
- **Proof.** Screenshot of each tab and `$c a11y` on each.

## Gotchas

- Tab names include counts (`Logs · 3`); match them with substring `--name Logs`, not `--exact`.
- Two links are named `Recipes`: main navigation (`--nth 0`) and the breadcrumb (`--nth 1`).
