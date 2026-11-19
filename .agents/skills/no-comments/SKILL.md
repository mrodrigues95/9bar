---
name: no-comments
description: "Run Comment Sicko on a diff or files, fix accepted findings, and offer encodings for claimed constraints. Use for /no-comments, \"review the comments\", or before opening a PR that adds SAFETY, EXTERNAL, directive, or JSDoc comments."
disable-model-invocation: true
---

<!-- Forked from https://github.com/cursor/plugins/blob/93b916d4a1e806507e22f4716b352fa91f2b227e/pstack/skills/no-comments/SKILL.md (MIT, Lauren Tan). Local changes: harness-agnostic reviewer wording, 9bar keep list enforced by anti-slop/no-comments, git history in place of /why, no poteto-mode or /architect steps. -->

# No comments

Run Comment Sicko. Act on accepted findings.

Defer to Comment Sicko's fresh perspective.

`anti-slop/no-comments` already rejects every comment outside the keep list, so `pnpm lint` handles narration, banners, TODOs, and commented-out code. This review judges what the lint lets through: whether each `SAFETY:`, `EXTERNAL(<url>):`, directive reason, and toolkit JSDoc tells the truth, and which code the comments are covering for.

## Scope

Use the caller's files or diff. Otherwise use the current diff against the base branch, default `main`, including the working tree.

## Steps

1. Run Comment Sicko with the persona in [`references/comment-sicko.md`](references/comment-sicko.md). Run it as a fresh subagent if your harness has them, otherwise in a fresh session, so the reviewer has not seen the code being written. Pass the scope and the persona file. Do not restate its rules.
2. Inspect its report and diff. Reject application-code edits, scope escapes, exception-protected deletions, misstated `MUST KILL` reasons, and flags that treat kept intentional code as guilty. Reshape flags on our-code surprises stay actionable. Do not restore those comments. A keep survives only with proof it is about something we cannot change. Audit missed scoped lint and TypeScript suppressions. Correctness or safety suppressions stay actionable `MUST KILL`s. Restore deletions only with exact exceptions and scoped proof. Before accepting thin `IMPORTANT` or `do not remove` kills or keeps, trace their symbol and read its history (`git log -L`, `git blame`, the commit that added it). If a kill is ambiguous, do not restore. If a keep is refuted or still ambiguous, delete it. Revert and rerun one rejected report with the failure named. Reject a second, report it open, and fail `/no-comments`.
3. Fix trivial accepted flags directly by deleting a dead path, dropping a parameter, or using the real API. If a fix needs a new shape, sketch it once for the accepted set and surrounding code before writing it.
4. Implement the smallest root-cause fix in scope. Remove every named workaround. If the root cause is out of scope, land the smallest in-scope fix and add the rest to `docs/todo.md`. Never bolt on symptom guards.
5. Constraint comments say `do not remove`, `do not change wording`, or `talk to X before changing`. Leave keeps about things we cannot change. Offer the cheapest in-scope type, runtime check, test, or lint. Wait for interactive approval; unattended runs need the caller's pre-approval. A new lint under `tools/oxlint/` or a change to `.oxlintrc.json` also needs the owner's `approved:checks` label on the PR. If approved, encode then delete. Otherwise delete, add the constraint to `docs/todo.md`, and report it open.
6. Report the deletion count, restored comments, reruns, fixes, encoding offers, encodings, unenforced constraints, and other open work.
