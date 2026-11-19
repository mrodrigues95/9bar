# Recipe form

A full-page form to create or edit a recipe. Required fields show inline errors on submit. Spec: [Create and edit](../../../../../research/recipes-and-logs-flows.md#create-and-edit), [Duplicate](../../../../../research/recipes-and-logs-flows.md#duplicate), [Feedback](../../../../../research/recipes-and-logs-flows.md#feedback).

## Sub-features

- `recipe-new` empty form at `/recipes/new`.
- `recipe-validate` submitting with missing required fields marks each invalid with an alert.
- `recipe-create` a valid submit returns to `/recipes`.
- `recipe-edit` the same form prefilled at `/recipes/<id>/edit`.
- `recipe-duplicate` `Duplicate` opens `/recipes/new?duplicateOf=<id>` prefilled with `Copy of <name>`.

## How to get to it (user POV)

- `New recipe` link in the Recipes list header.
- Row or overview actions menu: `Edit`, `Duplicate` (see [Row actions](./row-actions.md)).
- Addresses `/recipes/new`, `/recipes/<id>/edit`.

## Driving it with control

Preconditions: fresh launch; `$c console --clear`.

- **Open.** Run `$c goto /recipes`, `$c click --role link --name "New recipe"`. `url` is `/recipes/new`; heading `New Recipe`.
- **Validate.** Run `$c click --role button --name "Create Recipe"`. The snapshot marks `textbox "Name" [invalid]` with `alert: Name is required`, and the same for Beans, Grinder, Machine, Grind size.
- **Fill.** Run `$c type --role textbox --name Name --exact --value "Test recipe"`, the Beans/Grind Size textboxes the same way, `$c click --role button --name "Select a grinder"` then `$c click --role option --nth 0`, the same for `Select a machine`, and Dose/Yield as in [Log form](./log-form.md).
- **Create.** Run `$c click --role button --name "Create Recipe"`. `url` is `/recipes`.
- **Edit.** Run `$c goto /recipes/6/edit`. Heading `Edit Recipe`; `textbox "Name": House Espresso` and the other fields are prefilled.
- **Duplicate.** From `/recipes`, `$c click --role button --name "Actions for Costa Rica"`, `$c click --role menuitem --name Duplicate`. `url` is `/recipes/new?duplicateOf=12`; `textbox "Name": Copy of Costa Rica Tarrazú`.
- **Proof.** `$c console | jq '.events[] | select(.text | test("Recipe (created|updated)")) | .args[1]'` shows the submitted name, beans, grinder and machine ids, plus a screenshot of the validation state.

## Gotchas

- Saving is a stub: `Recipe created:` / `Recipe updated:` is logged and nothing is stored.
- After a failed submit, focus is lost (`focused: nothing (body)`) instead of moving to the first invalid field as the spec requires (`docs/todo.md` → recipe-form-invalid-focus). Do not report this feature's focus as verified until that is fixed.
- `--name Name` without `--exact` matches other fields whose names contain "name".
