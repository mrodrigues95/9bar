# Recipes list

One flat list of recipes, attached logs, and quick logs, 10 per page, with search and filters whose state lives in the URL. Spec: [Recipes list](../../../../../research/recipes-and-logs-flows.md#recipes-list).

## Sub-features

- `list-search` filters by recipe name or beans; the URL gains `?q=` after a 250ms debounce.
- `list-filter` adds, edits, and removes filters; each lives in the URL (`?verdict=is.balanced`).
- `list-page` paginates with first, previous, numbered, next, last links.
- `list-history` back and forward restore the earlier search, filters, and page.
- `list-open` a recipe or attached log name opens the recipe overview.

## How to get to it (user POV)

- Main navigation link `Recipes`.
- Address `/recipes`, with or without search params.

## Driving it with control

Preconditions: fresh launch; `$c goto /recipes`.

- **Search.** Type in the search box. Run `$c type --role textbox --name "Search recipes" --value kenya --keys`. `url` ends `?q=kenya`; the snapshot list shows only Kenya rows.
- **Pending draft clears.** Type and delete a letter inside the debounce. Run `$c press --role textbox --name "Search recipes" k Backspace`, then after a second `$c count --selector '[aria-busy="true"]'`. `count` is 0: the list is not left busy.
- **Add a filter.** Run `$c click --role button --name "Add recipe filter"`, `$c click --role menuitem --name Verdict`, `$c click --role menuitemcheckbox --name Balanced`, then `$c press Escape Escape`. `url` gains `verdict=is.balanced`; `focused` is `button "Add recipe filter"`; the snapshot has toolbar `Active recipe filters` with group `Verdict is Balanced`.
- **Remove filters.** Run `$c click --role button --name "Remove Verdict filter"` for one, or `$c click --role button --name Clear --exact` for all. `url` drops the param.
- **Paginate.** Run `$c click --role link --name "Go to page 2"`. `url` has `page=2`; the text reads `Showing 11 to 20 of …`.
- **Back and forward.** After a search, run `$c back`. `url` is the URL before the search, and the snapshot's search box and `Showing …` text match it. `$c forward` restores `?q=kenya`.
- **Open a recipe.** Run `$c click --role link --name "Kenya Kirinyaga"`. `url` is `/recipes/14/overview`.
- **Proof.** `$c screenshot` after the final state, and `$c a11y`.

## Gotchas

- `--name Beans` also matches this search box (`Search recipes by name or beans`); use `--exact` for form fields named Beans.
- Many rows share a name (quick logs are `(Untitled)`, several `House Espresso` rows). Row buttons need `--nth`.
- After choosing a filter option two layers stay open (the value menu and `Add recipe filter`); `press Escape Escape` closes both. Clicking anything while they are open fails with a hint about a covering overlay.
- Typed search is written with history replace, so `back` after a search skips the page it was typed on (`?page=2` → type → `back` lands on `/recipes`).
- Browser key chords like Alt+ArrowLeft do not navigate in headless Chromium; use `back` and `forward`.
- Separate commands are 300ms+ apart, longer than the debounce. Timing-sensitive sequences must be one `press` command.
