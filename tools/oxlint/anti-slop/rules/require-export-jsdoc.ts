import { defineRule } from "@oxlint/plugins";
import type { Comment, ESTree } from "@oxlint/plugins";

const DIRECTIVE = /^\s*(?:eslint|oxlint)-(?:disable|enable)|^\s*@ts-|^\s*SAFETY:|^\s*EXTERNAL\(/u;

function isJsDoc(comment: Comment) {
  return comment.type === "Block" && comment.value.startsWith("*");
}

function declaredNames(node: ESTree.Node): Array<ESTree.Node> {
  switch (node.type) {
    case "VariableDeclaration":
      return node.declarations.map((declarator) => declarator.id);
    case "FunctionDeclaration":
    case "ClassDeclaration":
    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration":
    case "TSEnumDeclaration":
      return node.id ? [node.id] : [];
    default:
      return [];
  }
}

/** Require JSDoc on every exported declaration; it feeds Storybook docgen and the Storybook MCP. */
export const requireExportJsdocRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Require a JSDoc block on every exported declaration.",
    },
    messages: {
      missing:
        "Add a JSDoc block above `{{name}}`. Components describe what they render, props types use `/** Props for the {@link {{name}}} component. */`-style summaries, and stories say what state they show.",
    },
  },
  createOnce(context) {
    const hasJsDoc = (node: ESTree.Node) => {
      const comments = context.sourceCode.getCommentsBefore(node);
      for (let index = comments.length - 1; index >= 0; index -= 1) {
        const comment = comments[index];
        if (comment === undefined) return false;
        if (isJsDoc(comment)) return true;
        if (!DIRECTIVE.test(comment.value)) return false;
      }
      return false;
    };
    return {
      ExportNamedDeclaration(node) {
        if (node.declaration === null || node.declaration.type === "TSModuleDeclaration") return;
        if (hasJsDoc(node)) return;
        for (const id of declaredNames(node.declaration)) {
          const name = id.type === "Identifier" ? id.name : "declaration";
          context.report({ node: id, messageId: "missing", data: { name } });
        }
      },
    };
  },
});
