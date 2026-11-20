# Agent quality: principles

Use when deciding how to stop an agent mistake from coming back, or when adding a rule, lint, check, or skill. Describes the model behind the repo's checks, not the checks themselves. The enforcers are listed in `AGENTS.md`.

## The goal

You review evidence, not diffs. Every correction becomes a check that fails, so the next agent can't repeat the mistake. Prose remains only for judgment calls that no tool can test.

## Agent context pyramid

Each layer is less reliable than the one above it. Fix a problem at the highest layer that can hold it.

| Layer           | Job                                                                | In 9bar                                                                            |
| --------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 1. Codebase     | Make the wrong thing impossible to write.                          | Two-tier toolkit, colocated routes, strict tsconfig, `cn` rejects render props     |
| 2. Static       | Make the wrong thing fail in CI, with an error that names the fix. | oxlint + `anti-slop` + `landmines`, type-aware lint (tsrs), tsc, `check:structure` |
| 3. Verification | Make the agent prove the change on the running thing.              | Vitest + fast-check, Storybook story tests with axe, `pnpm control`, verify skills |
| 4. Prose        | Judgment calls only, phrased without "unless" or "only when".      | `AGENTS.md` rule table, skills                                                     |
| 5. Human review | The exception path.                                                | `/correct`, `/no-comments`                                                         |

## Principles by layer

### 1. Codebase

1. **One owner per piece of state.** Derive the rest during render. Nothing needs syncing, so nothing needs an effect.
2. **One supported way per task.** Two ways means agents pick the wrong one half the time.
3. **Design the API so misuse is a type error.** Avoid nuance; design a better API. A rule with an "except when" is a missing type.
4. **Hide internals so the wrong import fails.** Package exports and import boundaries say what is public.

### 2. Static analysis

1. **Ban categories, not instances.** `useEffect`, comments, and manual memoization are banned outright. Each real exception carries a disable directive with a reason.
2. **The error names the fix.** A lint message tells the agent what to write instead, so the fix lands in the same loop.
3. **Checks can't be weakened by the change they judge.** Lint config, custom rules, structure checks, and workflows need owner approval, and CI also lints with the base branch's config.
4. **Cheap checks first, in one command.** `pnpm check` runs in CI on every PR. No git hooks.
5. **Fix in the same commit.** A new rule lands with every fix it needs. No baseline files.

### 3. Verification

1. **Run the real thing.** End-to-end runs of the app are harder to fool than unit tests.
2. **Tools, not markdown.** Agents get a CLI (`pnpm control`) with JSON output and errors that say what to do, not a page of instructions.
3. **Properties over examples.** Round-trip, invariant, idempotency, and model-based tests with fast-check find the cases nobody wrote down.
4. **Tests can't lie.** No mocks of the thing under test, no fixed sleeps, no retries, no raised timeouts. Flaky tests are root-caused or deleted.
5. **Three rounds, then a human.** If a check still fails after three attempts, stop and report.
6. **A feature map, kept current.** One file per feature: how to reach it, how to drive it, its gotchas. Toolkit uses the Storybook story index, which can't drift.

### 4. Prose

1. **Prose is a symptom.** When a lesson can be a lint, type, test, or script, use only that. Written guidance means a structural fix is still missing.
2. **Every rule has an enforcer.** `AGENTS.md` pairs each rule with the check that enforces it.
3. **No hedges.** "Only when", "unless", and "~90 chars" are rules a tool can't check. Replace them with a threshold or delete them.

### 5. Human review

1. **Every correction becomes a check.** `/correct` fixes a mistake class at the highest layer: architecture, then types, then lint, then tests, then docs.
2. **A class counts once it recurs twice.** One-off mistakes don't earn a rule.
3. **Prove each new check fails on a real past mistake.** Find it in `git log` before shipping the check.
4. **Prune rules on a routine.** A rule that never fires, or fires only falsely, is deleted.

## How the original notes map

| Note                                      | Layer | Lands as                                                         |
| ----------------------------------------- | ----- | ---------------------------------------------------------------- |
| Ban useEffect and comments                | 2     | `anti-slop/no-effect`, `anti-slop/no-comments`, `/no-comments`   |
| Create a feature map                      | 3     | `verify-web` feature map; toolkit uses the Storybook story index |
| Avoid nuance, design better APIs          | 1     | `cn` type, import boundaries, React Compiler memo ban            |
| If you correct the agent, lint against it | 5→1–3 | `/correct` replaces `reflect`, enforcement table in `AGENTS.md`  |
| Verification article                      | 2–3   | `pnpm check` in CI, protected checks, verify skills              |

## Sources

- pstack: <https://github.com/cursor/plugins/tree/main/pstack>. Skills `correct`, `no-comments`, `create-verification-skill`, `maintain-verification-skill`, and the principle `encode-lessons-in-structure`.
- poteto, "The Complete Guide to pstack Pt. 1": <https://x.com/poteto/article/2094457600259842065>. Give agents tools rather than markdown.
- How the Claude Code team thinks about verification: <https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/>.
- Faster type-aware linting with tsrs: <https://oxc.rs/blog/2026-11-17-faster-type-aware-linting-with-tsrs>.
- landmines: <https://github.com/interfere-inc/landmines>. Oxlint rules for honest tests.
- anti-slop: <https://github.com/dmmulroy/anti-slop>. Type-level slop rules, vendored in `tools/oxlint/anti-slop/`.
