# Log form

The log sheet records a shot, with or without a recipe. It opens over the current page as a dialog. Save closes it; Save and log another keeps it open with the values prefilled. Spec: [Capture](../../../../../research/recipes-and-logs-flows.md#capture), [Feedback](../../../../../research/recipes-and-logs-flows.md#feedback).

## Sub-features

- `log-open` opens the `Log a shot` dialog from each entry point.
- `log-save` saves, closes the sheet, and returns focus to the opener.
- `log-another` saves, keeps the sheet open, announces `Logged at <time>`, focuses Grind Size.
- `log-edit` opens `Edit log` prefilled from a row.
- `log-cancel` Cancel, Close, or Escape discards and returns focus to the opener.

## How to get to it (user POV)

- `Log a shot` link in the Recipes list header.
- `New Log` link on a recipe's Logs tab.
- Row actions menu: `Edit` on any log row, `Repeat` on a quick log row (see [Row actions](./row-actions.md)).
- Address `/recipes/logs/new` (the router masks it back to `/recipes`).

## Driving it with control

Preconditions: fresh launch; `$c goto /recipes`; `$c console --clear`.

- **Open.** Run `$c click --role link --name "Log a shot"`. `focused` is in dialog `Log a shot`.
- **Fill.** Run `$c type --role textbox --name Beans --exact --value "Test beans"`, `$c type --role spinbutton --name "Dose (g)" --value 18`, `$c type --role spinbutton --name "Yield (g)" --value 36`, `$c type --role spinbutton --name "Brew time value" --value 28`.
- **Save.** Run `$c click --role button --name "Save Log"`. The dialog is gone from the snapshot and `focused` is `link "Log a shot"`.
- **Save and log another.** Reopen, then `$c click --role button --name "Save and log another"`. The dialog stays, the snapshot has `status: Logged at <time>`, and `focused` is `textbox "Grind Size"`.
- **Edit.** Run `$c click --role button --name "Actions for (Untitled)" --nth 0`, `$c click --role menuitem --name Edit`. Dialog `Edit log` shows the row's values (Beans, Dose).
- **Cancel.** Run `$c press Escape`. `focused` is the control that opened the sheet.
- **Proof.** `$c console | jq '.events[] | select(.text | test("Log (created|updated)")) | .args'` shows the submitted values, plus a screenshot of the list after closing.

## Gotchas

- Saving is a stub: the sheet logs `Log created:` / `Log updated:` with the form values and stores nothing, so the list does not change. Prove a save through `console`, not the list.
- Submitted values are raw form values: a typed Dose arrives as the string `"18"` while untouched numbers stay numbers (`docs/todo.md` → raw-form-values).
- The default values pass validation, so Save with no input succeeds.
- `--name Beans` without `--exact` also matches the Recipes search box behind the dialog.
- The URL stays `/recipes` while the sheet is open; assert on the dialog, not the URL.
