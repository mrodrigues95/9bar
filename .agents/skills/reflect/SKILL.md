---
name: reflect
disable-model-invocation: true
description: Manual session retro that turns your corrections into durable coding-standards rules.
---

# Reflect

Turn the user's own input into durable coding standards. This is not a session summary: the only output that matters is a rule the user will not have to repeat.

Scope: `.agents/skills/coding-standards/`. Process, git, tooling, and package-specific conventions belong in `AGENTS.md` or the skill that owns them; name the right home and leave them there.

Workflow: **collect → extract → gate → home → write → propose → apply**. Each step ends on a completion criterion.

## 1. Collect the user's input

Read the user's raw messages, not summaries; a correction rarely survives paraphrasing. The agent's messages are context for what the user reacted to, not evidence. If the user names a focus, restrict signals to it.

Default to the current conversation. When a correction predates compaction or the user points at another session, use whatever transcript access the harness provides: a session file, a history tool, or the user's own paste. Ask for the path or the relevant excerpt when none is exposed. Never hardcode a transcript location.

Also read the user's own code: `git diff` for uncommitted hunks that rewrite what the agent produced, and `git log -p` where the user fixed agent work after the fact. Their version is the target shape.

Signals, strongest first:

- **Correction** — "no", "not like that", "we don't", "revert", a rewritten answer, a rejected approach.
- **Repeated instruction** — the same guidance twice in this session, or once in each of two sessions. Repetition is the clearest durability proof.
- **Preference** — "always", "never", "I prefer", "in this repo".
- **Re-ask** — the user asks for the same outcome in different words. Mark the inferred rule as inferred.
- **Approval** — "exactly", "yes". Confirms a shape worth keeping; use it only to disambiguate.

Ignore task-specific choices ("make this one shorter"), facts about the task, and anything the standards already cover.

Done when every user message in scope is read and every signal has the user's exact words plus where it came from.

## 2. Extract rules

State each signal as one imperative rule in the user's voice. Keep the incident out.

**The gate** — keep the rule only when all four hold:

- **Durable** — it would change code in an unrelated future feature.
- **Generalizable** — it applies beyond the file or route that produced it.
- **Actionable** — a future agent can follow it without asking a question.
- **Non-obvious** — it changes behavior against the model's default, and `oxlint`, `oxfmt`, or `tsc` cannot enforce it. A mechanical rule belongs in the linter; say so and drop it from the standards.

Recurrence check — search any accessible past sessions for the same correction; when none are accessible, ask the user whether they have had to repeat it. Two occurrences make the rule top priority; one explicit correction still qualifies; an inferred rule is mentioned, not patched.

Done when each surviving rule is one line, marked `repeated` or `new`, with the evidence quoted beside it. If no rule survives the gate, report the dropped signals and stop.

## 3. Find the home

Read `.agents/skills/coding-standards/SKILL.md` in full before drafting. Every rule has exactly one home:

- **Covered** — an existing rule already prevents the mistake. Drop the candidate; if the old rule was read and missed, sharpen that rule's wording instead of adding a twin.
- **Contradicts or ambiguous** — rewrite the existing rule in place and quote the old line in the proposal.
- **Fits a section** — add one bullet to that section.
- **New axis** — add a `##` section when the rule concerns a new shape of code (error handling, data fetching, tests), not a variant of an existing one.
- **Branch** — put it in `references/<topic>.md` and add a one-line pointer in `SKILL.md` when the rule is narrow enough that most changes never need it, or when `SKILL.md` would pass ~120 lines.
- **Different artifact** — process, git, commits, tooling, or one package's domain: out of scope. Name the right file and leave it.

Prefer sharpening one existing rule over adding another. The file's value is its density.

Done when every rule has one destination and no destination duplicates another rule's meaning.

## 4. Write the patch

Match the file's existing shape: flat `-` bullets, imperative mood, one rule per line, positive phrasing ("write X") over prohibitions.

- Rationale only where the rule would otherwise look arbitrary.
- An example only where the rule is easy to misapply; the existing `Placement` and `JSX` blocks are the ceiling, not the template.
- Name sections for the code shape, not the incident.
- Update the skill `description` only when a new section changes what the skill covers.

Done when the proposed lines could sit in the file unnoticed.

## 5. Propose, then stop

Present a table, ranked by recurrence then impact, capped at five rules:

| # | User's words | Rule | Home | Action | Confidence |
|---|--------------|------|------|--------|------------|

Actions: add, refine, remove, new section, new reference file. Show the exact diff for refines and removals. List dropped signals in one line each with the reason.

Stop and wait for approval: all, letters, edited wording, or reject. Never edit the standards before approval.

## 6. Apply and verify

Apply only approved rules, with no drive-by edits.

Re-read the changed sections and confirm: no twin rules, no contradiction, the section still reads as flat reference.

`git diff -- .agents/skills/coding-standards` shows only approved lines. `.agents/skills` is excluded from `oxfmt`, so formatting is by hand — match the file.

Ask before committing; use a `docs:` conventional commit scoped to the standards.

Done when the standards contain only approved changes and the dropped signals are reported.

## File health

- Rewrite, don't append. A rule that overlaps an existing one merges into it; a near-duplicate is how the file turns into sediment.
- Remove a rule once tooling enforces it or newer evidence contradicts it — with approval, in the same proposal.
- Keep the standards `SKILL.md` under ~120 lines. When it passes that, move the narrowest whole section to `references/` and leave a pointer.
- Keep session history out: no dates, no "the user corrected this", no learnings log.

## Rule shapes

```text
Good: "Read search params through the route's `validateSearch`; never parse `location.search` by hand."
Good: "Match the nearest existing sibling component before inventing a new variant."
Bad: "In session 4 the user said the spacing was too tight."   (narrative, not a rule)
Bad: "Write clean code."                                        (no-op)
Bad: "Use `!!` on line 42."                                     (one-off, not generalizable)
Bad: "Use two-space indentation."                               (oxfmt owns it)
```

## Out of scope

- Editing `AGENTS.md`, other skills, git history, or lint config. Report the destination in the proposal instead.
- Summarizing what happened in the session.
- Adding preferences the user never stated, or inferring a rule from a single ambiguous reaction.
