import { defineRule } from "@oxlint/plugins";

import { createReactApiVisitor } from "../shared/react-api.ts";

const EFFECT_HOOKS = new Set(["useEffect", "useLayoutEffect", "useInsertionEffect"]);

/** Ban effect hooks; state is derived during render or changed in the event that causes it. */
export const noEffectRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow useEffect, useLayoutEffect, and useInsertionEffect; derive state during render or update it in the event handler.",
    },
    messages: {
      effect:
        "Remove `{{name}}`. Derive the value during render, update it in the event handler, reset state with `key`, read external stores with `useSyncExternalStore`, or load data in a route loader. If this truly syncs with an outside system, add `// oxlint-disable-next-line anti-slop/no-effect -- <system and why>`.",
    },
  },
  create(context) {
    return createReactApiVisitor(context, EFFECT_HOOKS, "effect");
  },
});
