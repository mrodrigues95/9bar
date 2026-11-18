import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";

const CLASS_FUNCTIONS = new Set(["cn", "cva", "clsx", "tv", "composeTailwindRenderProps"]);
const MAX_LENGTH = 90;

function calleeName(node: ESTree.CallExpression): string | null {
  return node.callee.type === "Identifier" ? node.callee.name : null;
}

/** Keep each class string in cn/cva calls short enough to read: one selector group per entry. */
export const maxClassStringLengthRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: `Limit class strings inside cn/cva calls to ${MAX_LENGTH} characters.`,
    },
    messages: {
      tooLong:
        `This class string is {{length}} characters (max ${MAX_LENGTH}). Split it into an array of strings grouped by selector: base layout, then hover:, focus-visible:, disabled:, aria-*, data-*, dark:.`,
    },
  },
  createOnce(context) {
    let depth = 0;
    const isClassCall = (node: ESTree.CallExpression) => {
      const name = calleeName(node);
      return name !== null && CLASS_FUNCTIONS.has(name);
    };
    const check = (node: ESTree.Node, value: string) => {
      if (depth > 0 && value.length > MAX_LENGTH) {
        context.report({ node, messageId: "tooLong", data: { length: String(value.length) } });
      }
    };
    return {
      CallExpression(node) {
        if (isClassCall(node)) depth += 1;
      },
      "CallExpression:exit"(node) {
        if (isClassCall(node)) depth -= 1;
      },
      Literal(node) {
        if (typeof node.value === "string") check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.cooked ?? node.value.raw);
      },
    };
  },
});
