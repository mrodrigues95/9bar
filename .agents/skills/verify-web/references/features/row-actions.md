# Row actions

Each row in the Recipes list (and the overview header) has an actions menu whose items depend on the row type. Spec: [Actions by surface](../../../../../docs/recipes-and-logs-flows.md#actions-by-surface), [Delete](../../../../../docs/recipes-and-logs-flows.md#delete), [Attach to recipe](../../../../../docs/recipes-and-logs-flows.md#attach-to-recipe).

## Sub-features

- `actions-recipe` recipe row: Edit, Duplicate, Log again, Delete.
- `actions-quick-log` quick log row: Edit, Repeat, Save as recipe, Attach to recipe, Delete.
- `actions-attached-log` attached log row: Edit, Set as reference shot, Detach from recipe, Delete.
- `actions-delete` confirmation dialog named `Delete <name>?`.
- `actions-attach` dialog `Attach to recipe` with a recipe picker; `Attach` disabled until one is picked.
- `actions-focus` closing a menu or dialog returns focus to the row's actions button.

## How to get to it (user POV)

- Button `Actions for <name>` at the end of each Recipes list row.
- Button `Actions for <name>` on the recipe overview header.

## Driving it with control

Preconditions: fresh launch; `$c goto /recipes`; `$c console --clear`.

- **Recipe menu.** Run `$c click --role button --name "Actions for Costa Rica"`. The snapshot has menu `Actions for Costa Rica Tarrazú` with menuitems Edit, Duplicate, Log again, Delete.
- **Quick log menu.** `$c press Escape`, then `$c click --role button --name "Actions for (Untitled)" --nth 0`. Menuitems Edit, Repeat, Save as recipe, Attach to recipe, Delete.
- **Attached log menu.** `$c click --role button --name "Actions for House Espresso" --nth 1`. Menuitems Edit, Set as reference shot, Detach from recipe, Delete.
- **Delete dialog.** From the recipe menu, `$c click --role menuitem --name Delete`. Dialog `Delete Costa Rica Tarrazú?` with Cancel and Delete; `$c press Escape` returns `focused` to `button "Actions for Costa Rica Tarrazú"`.
- **Attach dialog.** From a quick log menu, `$c click --role menuitem --name "Attach to recipe"`. Dialog `Attach to recipe`, `button "Attach" [disabled]`.
- **Log again.** From the recipe menu, `$c click --role menuitem --name "Log again" --exact`. `console` has `Log again: {recipeId: 12, …}`.
- **Proof.** Snapshot of each menu and dialog; `console` for stubbed actions.

## Gotchas

- Several actions are stubs (`docs/todo.md` → unimplemented-actions, log-again, attach-to-recipe, set-reference-shot, detach-from-recipe, save-log-as-recipe): they log to the console or do nothing visible.
- The delete dialog does not yet name the log count or offer keeping logs as quick logs (spec Delete steps 2–3; `docs/todo.md` → delete-keeps-logs).
- Row names repeat; use `--nth`, and check the opened menu's name in the snapshot.
