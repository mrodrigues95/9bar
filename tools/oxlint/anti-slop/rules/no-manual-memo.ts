import { defineRule } from "@oxlint/plugins";

import { createReactApiVisitor } from "../shared/react-api.ts";

const MEMO_APIS = new Set(["useMemo", "useCallback", "memo"]);

/** Ban manual memoization; the React Compiler memoizes every component and hook. */
export const noManualMemoRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow useMemo, useCallback, and memo; the React Compiler memoizes automatically.",
    },
    messages: {
      memo: "Remove `{{name}}`. The React Compiler memoizes this; delete the wrapper and use the value or function directly.",
    },
  },
  create(context) {
    return createReactApiVisitor(context, MEMO_APIS, "memo");
  },
});
