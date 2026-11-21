import type { Context, ESTree, Visitor } from "@oxlint/plugins";

const REACT_MODULES = new Set(["react"]);

function importedName(specifier: ESTree.ImportSpecifier): string {
  return specifier.imported.type === "Identifier" ? specifier.imported.name : specifier.imported.value;
}

/**
 * Visit every value use of the given React exports: named imports (`import { useEffect }`) and
 * member access on a default or namespace import (`React.useEffect`).
 */
export function createReactApiVisitor(
  context: Context,
  names: ReadonlySet<string>,
  messageId: string,
): Visitor {
  const reactBindings = new Set<string>();
  const report = (node: ESTree.Node, name: string) =>
    context.report({ node, messageId, data: { name } });

  return {
    ImportDeclaration(node) {
      if (!REACT_MODULES.has(node.source.value) || node.importKind === "type") return;
      for (const specifier of node.specifiers) {
        if (specifier.type === "ImportSpecifier") {
          const name = importedName(specifier);
          if (specifier.importKind !== "type" && names.has(name)) report(specifier, name);
        } else {
          reactBindings.add(specifier.local.name);
        }
      }
    },
    MemberExpression(node) {
      if (
        node.object.type === "Identifier" &&
        reactBindings.has(node.object.name) &&
        !node.computed &&
        node.property.type === "Identifier" &&
        names.has(node.property.name)
      ) {
        report(node, node.property.name);
      }
    },
  };
}
