---
name: verify-toolkit
description: Prove a @9bar/toolkit component change in a real browser, through story tests (render, play, axe) and `pnpm control toolkit` for driving a story by hand. Use after adding or changing any component, style, or story in packages/toolkit, before calling the change done.
---

# Verify toolkit

The toolkit's map is Storybook's story index. It is generated from the stories, so there is no hand-written feature map to keep in sync. A component change is proven by its stories.

## 1. Stories cover the change

- Every state the change touches has a story (variant, size, disabled, invalid, empty, long content).
- Every interaction the change touches has a `play` function that drives it and asserts the result (open, select, type, keyboard, focus).
- `pnpm check:structure` fails when a component directory has no stories file.

## 2. Story tests pass

```sh
pnpm test --project storybook                       # every story, in Chromium, ~45s
pnpm test --project storybook primitive/select      # only files whose path matches
```

Each story renders in Chromium, runs its `play` function, then runs axe with `a11y.test: "error"`, so a render error, a failed assertion, or an accessibility violation fails the test. Agents with the Storybook MCP can call `run-story-tests` for the same results. Fix violations in the component. Do not turn a rule off for a story unless the violation is in the story's demo markup and not in the component.

## 3. Look at it

Story tests prove behaviour, not looks. For a visual change, open the story and screenshot it in both themes.

```sh
pnpm control toolkit launch                         # storybook dev on :6106, Chromium CDP on :9311; ~12s
pnpm control toolkit doctor
pnpm control toolkit stories --filter select        # ids, titles, names from /index.json
pnpm control toolkit story composed-form-selectfield--with-placeholder
pnpm control toolkit screenshot                     # .control/artifacts/toolkit/<time>.png
pnpm control toolkit screenshot --theme dark        # reloads the open story in dark first
pnpm control toolkit click --role button --name "Favorite Fruit"
pnpm control toolkit snapshot | jq -r .snapshot
pnpm control toolkit a11y --selector "#storybook-root"
pnpm control toolkit cleanup
```

- `screenshot --theme` reloads the story, which resets interaction state. To capture an interacted state in dark, open it with `story <id> --theme dark`, drive it, then `screenshot` without `--theme`.
- `story <id>` waits for Storybook to finish rendering and fails with the error if the story throws. Use ids from `stories`; the filter ignores case and punctuation.
- Driving commands (`click`, `type`, `press`, `count`, `snapshot`, `console`, `network`) work as in the verify-web skill: JSON out, `--role` + `--name` handles, `focused` in every action result. `pnpm control toolkit --help` lists them.
- Control uses its own ports, separate from `pnpm toolkit storybook` (:6006), and refuses to start on a port it did not open. `cleanup` stops only what `launch` started and keeps `.control/artifacts/toolkit/`.

## Proof

- Story test output for the changed component's stories file, with the count passed.
- For visual changes: light and dark screenshots of each changed story.
- For app-facing changes, also run the verify-web skill on a screen that uses the component.
- If a check still fails after 3 rounds of fixes, stop and report what fails and what you tried.
