# TODO

Deferred work. Add an entry here instead of a `TODO` comment; `anti-slop/no-comments` rejects those. Delete an entry in the commit that finishes it.

## Product

### auth

Add the authentication check to the `beforeLoad` of `_authenticated` (redirect signed-out users to sign-in) and `_unauthenticated` (redirect signed-in users home). Files: `apps/web/src/routes/_authenticated/route.tsx`, `apps/web/src/routes/_unauthenticated/route.tsx`.

### log-again

Replace the "Log again" stub with a server fn that copies the recipe's current snapshot into a new log (recipeId set, verdict null, shotAt now). The Recipes list then shows the new "· Logged <time>" dose line, announces "Logged at <time>" in a polite live region, and keeps focus on the menu trigger. File: `apps/web/src/routes/_authenticated/-recipe-actions/recipe-actions-menu.tsx`.

### attach-to-recipe

Server fn that points a log at the chosen recipe. Mismatches stay advisory. File: `apps/web/src/routes/_authenticated/-recipe-actions/attach-to-recipe-dialog.tsx`.

### log-comparison-api

Move `DELTAS`, `compareField`, and `isSameBrewField` into the API once it exists. The API returns raw values, deltas, and mismatch flags per field; the client keeps only formatting. File: `apps/web/src/routes/_authenticated/-recipe-actions/attach-to-recipe-dialog.tsx`.

### set-reference-shot

Server fn that pins a log as its recipe's reference. File: `apps/web/src/routes/_authenticated/-recipe-actions/log-actions-menu.tsx`.

### detach-from-recipe

Server fn that clears the log's `recipeId` and the recipe's `pinnedLogId`. File: `apps/web/src/routes/_authenticated/-recipe-actions/log-actions-menu.tsx`.

### save-log-as-recipe

Server fn that creates the recipe and attaches the source log to it. File: `apps/web/src/routes/_authenticated/recipes_/_form/new/route.tsx`.

### unimplemented-actions

Recipe and log menu actions still call `notImplemented`. Wire each one once its flow is decided. Files: `apps/web/src/routes/_authenticated/-recipe-actions/recipe-actions-menu.tsx`, `log-actions-menu.tsx`.

### logo

Replace the "9" avatar with the real logo graphic. File: `apps/web/src/components/logo/logo.tsx`.

### profile-menu

Replace the placeholder avatar with a real profile menu. File: `apps/web/src/routes/_authenticated/-nav/profile-menu.tsx`.

## Tooling

### code-splitting

Look into code splitting routes. File: `apps/web/src/routes/__root.tsx`.

### unauthenticated-rendering

Decide whether unauthenticated pages lazy load or render on the server. File: `apps/web/src/routes/_unauthenticated/route.tsx`.

### design-lab-router-plugin-pin

`@tanstack/router-plugin` is pinned to 1.168.23 in `apps/design-lab/package.json`. Newer 1.168.x releases emit route HMR code that calls `router._replaceRouteChunk`, which the installed `@tanstack/router-core` no longer has, so every route edit falls back to a full reload. Unpin once the plugin and router-core agree on the HMR API.

### api-logic-tests

When the real API replaces mock data, add tests for pagination and the log-to-recipe field comparison at the API route, not in the client.

### web-journeys-in-ci

Run `verify-web` journeys headless in CI once the dev setup seeds data reproducibly.

### tsrs-type-check

Replace `tsc` with `oxlint --type-check` once tsrs leaves beta and the false TS2882 on the side-effect CSS import in `packages/toolkit/.storybook/preview.ts` is fixed.
