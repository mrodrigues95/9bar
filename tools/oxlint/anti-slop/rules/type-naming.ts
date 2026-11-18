import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";

const T_PREFIX = /^T[A-Z]/u;
const COMPONENT_NAME = /^[A-Z][A-Za-z0-9]*$/u;

function propsTypeName(param: ESTree.Node | undefined): ESTree.IdentifierReference | null {
  if (param === undefined) return null;
  if (param.type !== "Identifier" && param.type !== "ObjectPattern") return null;
  const annotation = param.typeAnnotation?.typeAnnotation;
  if (annotation?.type !== "TSTypeReference" || annotation.typeName.type !== "Identifier") return null;
  return annotation.typeName;
}

/** Reserve the `T` prefix for type parameters and name component props `<Component>Props`. */
export const typeNamingRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow T-prefixed concrete types and require a component's local props type to be named <Component>Props.",
    },
    messages: {
      tPrefix:
        "Rename `{{name}}` to `{{suggestion}}`. The `T` prefix is reserved for generic type parameters (`T`, `TValue`).",
      propsName:
        "Rename `{{name}}` to `{{expected}}`. A component's props type is named `<Component>Props`.",
    },
  },
  create(context) {
    const localTypes = new Set<string>();
    const components: Array<{ name: string; reference: ESTree.IdentifierReference }> = [];

    const checkTypeName = (id: ESTree.BindingIdentifier) => {
      localTypes.add(id.name);
      if (T_PREFIX.test(id.name)) {
        context.report({
          node: id,
          messageId: "tPrefix",
          data: { name: id.name, suggestion: id.name.slice(1) },
        });
      }
    };

    return {
      TSInterfaceDeclaration(node) {
        checkTypeName(node.id);
      },
      TSTypeAliasDeclaration(node) {
        checkTypeName(node.id);
      },
      VariableDeclarator(node) {
        if (node.id.type !== "Identifier" || !COMPONENT_NAME.test(node.id.name)) return;
        const init = node.init;
        if (init?.type !== "ArrowFunctionExpression" && init?.type !== "FunctionExpression") return;
        const reference = propsTypeName(init.params[0]);
        if (reference?.name.endsWith("Props")) components.push({ name: node.id.name, reference });
      },
      "Program:exit"() {
        for (const { name, reference } of components) {
          const expected = `${name}Props`;
          if (reference.name !== expected && localTypes.has(reference.name)) {
            context.report({
              node: reference,
              messageId: "propsName",
              data: { name: reference.name, expected },
            });
          }
        }
      },
    };
  },
});
