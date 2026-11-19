---
name: correct
description: "Find the mistakes agents keep repeating in this repo and make each one impossible. Try architecture first, then types, then a lint whose error names the fix, then a test, and write docs last. Prove each check fails on a real past mistake. Use for /correct, or each time the operator corrects you."
disable-model-invocation: true
---

<!-- Forked from https://github.com/cursor/plugins/blob/93b916d4a1e806507e22f4716b352fa91f2b227e/pstack/skills/correct/SKILL.md (MIT, Lauren Tan). Local changes: collecting the operator's raw corrections and rewrites (from 9bar's former reflect skill), lint as its own level, 9bar commands, protected-path approval, propose before applying. -->

# Correct

The operator keeps correcting agents in this repo for the same mistakes. Change the repo so the next agent can't make them.

Assume every contributor is an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that compiles. Design the repo so a change that looks right from one file is right for the whole repo.

## Find the mistake classes

Read the operator's raw messages, not summaries; a correction rarely survives paraphrasing. Your own messages are context for what the operator reacted to, not evidence. Default to the current conversation. When a correction predates compaction or lives in another session, use whatever transcript access the harness gives (a session file, a history tool, or the operator's paste), and ask when none exists.

Read the operator's code too: `git diff` for uncommitted hunks that rewrite agent output, and `git log -p` where the operator fixed agent work after the fact. Their version is the target shape. Then read recent commits, reverts, review comments, `AGENTS.md`, the skills, and `docs/todo.md`.

Signals, strongest first: a correction ("no", "revert", a rewritten answer), a repeated instruction, a stated preference ("always", "never", "in this repo"), a re-ask in different words. Ignore task-specific choices.

Group the mistakes into classes. A class counts once it has happened twice. A single explicit correction counts when the operator runs `/correct` on it.

## Fix each class at the highest level that works

1. **Eliminate it with architecture.** Give each piece of state one owner and each task one supported way. Hide internals so the wrong import fails. Replace hand-synced lists with one source of truth. Delete old ways and dead code an agent would copy.
2. **Enforce it with types so the bad state can't be written.** Example: `cn` rejects React Aria render-prop classNames, so the only way to pass one compiles through `composeTailwindRenderProps`.
3. **Catch it with a lint or check whose error names the fix.** Use an oxlint rule (built-in, landmines, or a new `anti-slop` rule in `tools/oxlint/anti-slop/`), an `.oxlintrc.json` override, or a `tools/checks/` structure check. The message names the file, type, or function to use instead. If the pattern is already common, fail only when a change adds more.
4. **Test the behavior.** A property test for pure logic (`pnpm test --project web`), a story with a `play` function for a component. Fix or delete any test that still passes when the behavior it checks breaks, or that fails when only the internals change.
5. **Write docs or agent rules last, only for judgment calls.** Nothing fails when an agent skips them. Put them in the skill that owns the code, not a general list.

## Propose, then stop

Present each class with its evidence (the operator's exact words or the commit), the level you picked, why a higher level didn't work, and the change. Stop and wait for approval. Changes to `.oxlintrc.json`, `tools/oxlint/`, `tools/checks/`, or `.github/` also need the owner's `approved:checks` label on the PR, which agents never apply.

## Fix and prove

Fix the approved classes, one commit each. Prove each new check fails on a real past mistake: restore the offending file from `git show <commit>^:<path>` under a temporary name and show the check fail, then delete it. Run `pnpm check` and `pnpm test`, the same commands CI runs. An exception goes on the offending line as a disable directive with a reason after `--`; `anti-slop/no-comments` rejects one without.

## Keep the rule table

Last, keep the table in `AGENTS.md` that pairs each rule with what enforces it. When the operator corrects you, fix the mistake and add the rule. If the rule was already there and nothing enforces it, that's a repeat, so fix it at the highest level in the same change. Drop a rule once its mistake can't happen.

**Reply:** each class with its evidence, the level you picked, and why a higher level didn't work.
