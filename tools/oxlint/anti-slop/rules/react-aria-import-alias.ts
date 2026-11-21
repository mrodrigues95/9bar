import { defineRule } from "@oxlint/plugins";

const ARIA_MODULE = "react-aria-components";

/** Alias colliding react-aria-components imports as `Aria<Name>`, never `<Name>Primitive` or another name. */
export const reactAriaImportAliasRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Require react-aria-components import aliases to use the Aria<Name> form.",
    },
    messages: {
      alias:
        "Import `{{imported}}` as `Aria{{imported}}` (or unaliased when it doesn't collide), not `{{local}}`.",
    },
  },
  createOnce(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== ARIA_MODULE) return;
        for (const specifier of node.specifiers) {
          if (specifier.type !== "ImportSpecifier") continue;
          const imported =
            specifier.imported.type === "Identifier" ? specifier.imported.name : specifier.imported.value;
          const local = specifier.local.name;
          if (local !== imported && local !== `Aria${imported}`) {
            context.report({ node: specifier, messageId: "alias", data: { imported, local } });
          }
        }
      },
    };
  },
});
