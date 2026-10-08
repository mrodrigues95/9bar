# Recipes and logs: behaviour spec

Use when changing how people log shots, manage recipes, or use the Recipes list, Home, Profile, or save feedback in the web app. Describes user-visible behaviour only.

Status: MVP confirmed. Items tagged [Assumed] are defaults not yet confirmed. Everything under Later is out of MVP.

## Concepts

| Term            | Meaning                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Recipe          | A named, committed set of settings, with its own logs.                                            |
| Log             | A record of one brew. Every brew is a log.                                                        |
| Quick log       | A log with no recipe. It has no name.                                                             |
| Attached log    | A log that belongs to a recipe.                                                                   |
| Identity fields | Beans, grinder, and machine. Fixed on attached logs.                                              |
| Variable fields | Grind size, dose, yield, brew time, temperature, and pressure. Each log sets its own.             |
| Method          | Espresso, Pour over, Immersion, or Other.                                                         |
| Verdict         | Optional taste result: Under-extracted (sour, thin), Balanced, or Over-extracted (bitter, harsh). |
| Status          | Dialing in, Dialed in, Needs retune, or Retired.                                                  |
| Reference shot  | The log that shows a recipe working.                                                              |
| Grind scale     | The unit a grinder's grind size is set in, such as dial numbers or clicks.                        |
| Equipment       | Machines and grinders the user owns.                                                              |

## Principles

1. **Capture is the fast path.** A shot takes a few taps. Detail can come later.
2. **A log is a record of what happened.**
3. **A recipe is a committed target.** It holds the settings someone repeats.
4. **A quick log needs no commitment.** It has no name and no recipe.
5. **The dial-in loop stays on one screen.** The user pulls a shot, tastes it, changes one variable, and pulls again. Save and log another, Log again, and Repeat keep that loop in place.
6. **Feedback persists until the user acts on it.** Every change is confirmed in text, and focus lands on the result.
7. **Every action works by keyboard and is announced by screen readers.** Meaning is carried by text as well as colour.
8. **Phone and desktop both support full logging.** Desktop suits bulk and complex editing.

## Actions by surface

Where each action appears. Later sections define what each action does.

- **Recipes list header:** Log a shot, New recipe.
- **Recipes list, recipe row:** Edit, Duplicate [Assumed], Log again, Delete.
- **Recipes list, quick log row:** Edit, Repeat, Save as recipe, Attach to recipe, Delete.
- **Recipes list, attached log row:** Edit, Set as reference shot, Detach from recipe, Delete.
- **Recipes list, multi-select:** Attach to recipe (quick logs), Delete (quick logs and recipes).
- **Recipe overview:** Log again (button). Actions menu: Log again, Edit, Duplicate [Assumed], Delete.
- **Recipe Logs tab:** New log (header). Log row: Edit, Set as reference shot, Detach from recipe, Delete.
- **Home:** Log a shot, Log again (most recent recipe), last five logs (tap to edit).
- **Profile:** Equipment, defaults, grind scale, units.

## Capture

### Fields

| Field       | Required | Starts as           | Notes                                                            |
| ----------- | -------- | ------------------- | ---------------------------------------------------------------- |
| Recipe      | No       | Empty               | Chooses identity and starting values. Locks identity fields.     |
| Method      | Yes      | Last used           | Changes which fields show. On first use, Espresso [Assumed].     |
| Beans       | No       | Last used           | Identity field.                                                  |
| Grinder     | No       | Default grinder     | Identity field.                                                  |
| Grind size  | No       | Recipe or last used | Number on the grinder's scale, such as 5.5. Free text for Other. |
| Machine     | No       | Default machine     | Identity field.                                                  |
| Dose        | Yes      | Recipe or last used | Labelled Coffee for pour over and immersion.                     |
| Yield       | Yes      | Recipe or last used | Labelled Water for pour over and immersion.                      |
| Brew time   | Yes      | Recipe or last used | Seconds or m:ss, per Profile.                                    |
| Temperature | No       | Recipe or last used | °C or °F, per Profile.                                           |
| Pressure    | No       | Recipe or last used | Espresso only.                                                   |
| Time        | Yes      | Now                 | Editable, so a shot can be backdated.                            |
| Verdict     | No       | Empty               | One of the three values under Concepts.                          |
| Notes       | No       | Empty               | Free text.                                                       |

"Last used" means the value most recently entered in that field, on any log.

### Log a shot

1. Open the log sheet from any entry point under Actions by surface. Without a recipe, the log is a quick log.
2. Optional: choose a recipe. Its values fill the fields, and its identity fields lock.
3. Enter Dose, Yield, and Brew time.
4. Save.

Done when the log is stored with the entered values, and the sheet and focus follow the Save rule under Feedback.

**Save and log another** replaces step 4. Done when the log is stored, the sheet stays open with values prefilled from the saved log, focus is on Grind size, and "Logged at 14:32" appears above the form until the next save or until the user dismisses it.

Edit changes any field of a quick log. On an attached log, identity fields stay locked.

### Log again

1. Choose Log again on a recipe row or on the overview. Nothing opens.
2. A log is created now, using the recipe's current values.

Done when the log is stored, focus has not moved, and the row reads "Logged at 14:32". The overview reads "Last logged at 14:32" [Assumed]. Verdict and notes are added through Edit.

### Repeat

1. Choose Repeat on a quick log row.
2. The sheet opens with that log's values and the current time.
3. Save, or Save and log another.

Done when the log is stored, as in Log a shot.

### Feedback

| Situation         | Result                                                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Save              | The sheet closes, and a short confirmation is announced. Focus returns to the control that opened the sheet. If that control no longer exists, focus moves to the affected row. |
| Validation fails  | Errors appear beside their fields. Focus moves to the first invalid field.                                                                                                      |
| Saving fails      | An error banner appears above the form. Focus moves to it. Entered values are kept.                                                                                             |
| Delete confirmed  | The dialog closes, and a short confirmation is announced. Focus moves to the next row, or to the list heading if none remain.                                                   |
| Confirmation text | Stays until the next save, or until the user dismisses it.                                                                                                                      |

## Recipes

### Create and edit

- A full-page form with its own address. Edit uses the same form, and saving returns to the overview.
- Required: name, grind size, beans, grinder, machine, dose, and yield [Assumed: carried over from today's form]. Brew time, temperature, pressure, method, and notes are optional.
- Method is required and defaults to the last method used.
- Status starts as Dialing in.
- Each changed value is added to the change history. Existing logs keep their values.

Done when creating: the recipe exists with status Dialing in. Done when editing: the overview shows the new values, and the change history lists each changed value.

### Overview

- Shows name, beans, grinder, machine, dose, yield, brew time, temperature, pressure, notes, and status.
- **Reference shot:** the pinned log's values. Until a log is pinned, it is the latest Balanced log.
- **Change history:** newest first, such as "Grind 6 → 5.5 · 3 Jun".
- Any pending status suggestion (see Status).

### Logs tab

- Lists every log attached to the recipe, newest first [Assumed]. Filters: Method and Verdict [Assumed].
- Set as reference shot pins that log to the overview.

### Duplicate

- Creates "Copy of [name]" with the same settings, status Dialing in, and no logs.
- Opens the copy's edit form so the user can rename it [Assumed].

### Status

| Status       | Meaning                                                  | Set by                          |
| ------------ | -------------------------------------------------------- | ------------------------------- |
| Dialing in   | Still working out the settings. Default for new recipes. | Default                         |
| Dialed in    | Repeatable and good.                                     | User, or accepting a suggestion |
| Needs retune | Worked before, and results have drifted.                 | User, or accepting a suggestion |
| Retired      | No longer in use.                                        | User only                       |

- Suggestions come from verdicts. Examples, to tune later: three Balanced logs in a row suggest Dialed in. A run of Under- or Over-extracted logs after Dialed in suggests Needs retune.
- A suggestion appears on the overview as a question. The user accepts or dismisses it [Assumed placement].
- Status is changed from a control on the overview and in the edit form [Assumed].
- Retired recipes are hidden from the Recipes list by default. A status filter and a Show retired toggle bring them back. Search still finds them.

### Delete

1. Choose Delete.
2. The dialog names the recipe and states how many logs it has.
3. Choose what happens to the logs. Keeping them as quick logs is the default. Deleting them too is a separate, explicit option.
4. Confirm.

Done when the recipe is gone, its logs are quick logs or deleted as chosen, and focus follows the Feedback rule.

## Quick logs

### Save as recipe

1. Choose Save as recipe on a quick log.
2. Enter a name. It is required.
3. Save.

Done when a recipe exists with the log's values and status Dialing in. The log is the recipe's first log and keeps its verdict and notes.

### Attach to recipe

1. Choose Attach to recipe.
2. Pick a recipe.
3. Compare identity fields. If beans, grinder, or machine differ, stop. Show which field differs, and offer Save as new recipe instead.
4. Otherwise, attach.

Done when the log appears in the recipe's Logs tab with its values unchanged. Differences are measured against the recipe as it stood when the log was saved to it. For a quick log attached later, that is the attach time [Assumed].

### Detach from recipe

1. Choose Detach from recipe on an attached log.

Done when the log is a quick log with its values, verdict, and notes. Differences from the recipe no longer show.

### Bulk attach

1. Multi-select quick logs on the Recipes list.
2. Choose Attach to recipe, then the recipe.
3. Review the preview. It lists which logs will attach, and which are skipped with the reason, such as "grinder differs".
4. Confirm.

Done when the attached logs appear in the recipe's Logs tab. Skipped logs stay quick logs. Attaching happens only after confirmation.

## Recipes list

- One flat list of recipes, attached logs, and quick logs, ordered by last activity, most recent first. A recipe's last activity is its latest log or edit.
- Attached log rows show their recipe's name, linked to the overview.
- Tapping a recipe name opens its overview. Tapping a log row opens its edit sheet [Assumed].
- Search matches recipe name and beans only.
- Filters:
  - Type (multi-select): Recipes, Attached logs, Quick logs. All are on by default.
  - Recipe: pick one or more to show those recipes and their logs.
  - Method, Verdict, Status, Machine, and Grinder.
  - Method, verdict, and recipe filters show a recipe row only when that recipe is selected. A recipe row always has visible logs beneath it.
- Pagination: 10 per page.
- Empty states: with no recipes or logs, show Log a shot and New recipe. With no matches, show a message and a Clear filters action.

## Home

- Log a shot is the primary action.
- Log again is a shortcut on the most recent recipe.
- Last five logs, any type. Tapping one opens its edit sheet.
- Until at least one machine and one grinder are set, Home prompts the user to set them [Assumed].

## Profile

- Equipment: machines and grinders. Presets seed the list with today's six machines and five grinders. Users add their own, and any picker can add one inline. "Other" takes free text.
- Defaults: one default machine and one default grinder, used for new logs and recipes.
- Grind scale: each grinder has one, such as dial numbers, clicks, or whole numbers. Fractional values such as 5.5 are allowed.
- Units: metric or imperial, °C or °F, and time as seconds or m:ss. These apply everywhere.
- Removing equipment hides it from pickers. Existing logs keep its name [Assumed].

## Later

Out of MVP. Recorded here, not decided.

Decided as later:

- Logging without a connection. Not a priority now.
- Notes search. Added when the number of logs makes it necessary.
- Recently deleted. Restore deleted items for 30 days.
- Full recipe version history, with each log tied to the version it was logged against.
- Overview stats, such as averages and verdict split.
- Bulk value editing across many logs.
- Method-specific equipment roles, such as a dripper and a kettle for pour over.

Out of scope for this spec: accounts and sign-in (the flows assume a signed-in user), sharing, multiple users, recommendations, and import and export.

Ideas, undecided. Each needs a product decision before it is designed.

- **Dial-in assistant:** suggests the next grind change from the last verdict and the recipe's history.
- **Bean tracking:** bags as their own items, with roast date and rest days.
- **Hardware capture:** a timer or scale fills in dose, yield, and time.
- **Recipe sharing:** a read-only link to a recipe, and importing a shared recipe into your own list.
- **Equipment history:** burr changes and service dates, to explain drift.
