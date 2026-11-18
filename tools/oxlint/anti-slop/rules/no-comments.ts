// Forked from https://github.com/interfere-inc/landmines/blob/92084b12872103b0f9245c0325ab571df00a574b/packages/landmines/src/rules/no-comments.ts (MIT, Interfere, Inc.).
// Local changes: SAFETY and EXTERNAL(<url>) comments, required reasons on disable and
// @ts-expect-error directives, @ts-ignore/@ts-nocheck banned, TODO routed to docs/todo.md,
// no WARNING exception, and publicApi is required for JSDoc to survive.
import { defineRule } from "@oxlint/plugins";
import type { Comment, ESTree, Scope } from "@oxlint/plugins";
import { z } from "zod";

const functionalDirectives = [
  /^(?:prettier|oxfmt)-ignore(?:-start|-end)?(?:\s|$)/u,
  /^(?:c8|v8|istanbul)\s+ignore\b/u,
  /^(?:@|#)__(?:PURE|NO_SIDE_EFFECTS|INLINE|NOINLINE)__$/u,
  /^@vite-ignore$/u,
  /^webpack(?:ChunkName|Mode|Prefetch|Preload|Ignore|Include|Exclude|Exports|FetchPriority):/u,
  /^(?:@jsx|@jsxFrag|@jsxImportSource|@jsxRuntime)\s+\S/u,
  /^\/\s*<(?:reference|amd-module|amd-dependency)\s/u,
  /^#\s*source(?:Mapping)?URL=/u,
  /^nosemgrep(?:\s|:|$)/u,
  /^(?:SPDX-License-Identifier:|@license\b)/mu,
  /^@ts-check(?:\s|$)/u,
];

const lintDisable = /^(?:eslint|oxlint)-disable(?:-next-line|-line)?(?:\s|$)/u;
const lintEnable = /^(?:eslint|oxlint)-enable(?:\s|$)/u;
const lintReason = /\s--\s*\S/u;
const tsBanned = /^@ts-(?:ignore|nocheck)(?:\s|$)/u;
const tsExpectError = /^@ts-expect-error(?:\s|$)/u;
const tsExpectErrorReason = /^@ts-expect-error\s+(?:--\s*)?\S/u;
const safety = /^SAFETY:\s*\S/u;
const external = /^EXTERNAL\(([^)\s]*)\):\s*\S/u;
const externalPrefix = /^EXTERNAL\b/u;
const deferred = /^(?:TODO|FIXME|XXX|HACK)\b/u;

type Verdict =
  | "allowed"
  | "explanation"
  | "forbidden"
  | "todo"
  | "directiveReason"
  | "tsIgnore"
  | "tsReason"
  | "externalUrl";

function normalize(comment: Comment) {
  return comment.value
    .replace(/^!/u, "")
    .replaceAll(/^\s*\*\s?/gmu, "")
    .trim();
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function classify(comment: Comment): Verdict {
  if (comment.type === "Shebang") return "allowed";
  const value = normalize(comment);
  if (functionalDirectives.some((pattern) => pattern.test(value))) return "allowed";
  if (lintEnable.test(value)) return "allowed";
  if (lintDisable.test(value)) return lintReason.test(value) ? "allowed" : "directiveReason";
  if (tsBanned.test(value)) return "tsIgnore";
  if (tsExpectError.test(value)) return tsExpectErrorReason.test(value) ? "allowed" : "tsReason";
  if (safety.test(value)) return "explanation";
  const externalMatch = external.exec(value);
  if (externalMatch) return isHttpUrl(externalMatch[1] ?? "") ? "explanation" : "externalUrl";
  if (externalPrefix.test(value)) return "externalUrl";
  if (deferred.test(value)) return "todo";
  return "forbidden";
}

function isDirective(comment: Comment) {
  const verdict = classify(comment);
  return verdict === "allowed" || verdict === "directiveReason" || verdict === "tsReason";
}

const noCommentsOptions = z
  .tuple([z.object({ publicApi: z.array(z.string()).optional() })])
  .or(z.tuple([]));

export const noCommentsRule = defineRule({
  meta: {
    type: "suggestion",
    schema: [
      {
        type: "object",
        properties: {
          publicApi: { type: "array", items: { type: "string" } },
        },
        additionalProperties: false,
      },
    ],
    docs: {
      description:
        "Allow only functional directives with reasons, SAFETY and EXTERNAL(<url>) explanations, and JSDoc on exported public API.",
    },
    messages: {
      forbidden:
        "Delete this comment. Encode the intent in a name, type, or test, and put rationale in the commit message. Allowed: `// SAFETY: …` before an assertion, `// EXTERNAL(<url>): …` for behavior a dependency forces, lint and TypeScript directives with a reason, and JSDoc on exported toolkit API.",
      todo: "Move this to docs/todo.md and delete the comment.",
      directiveReason:
        "Add a reason to this directive: `// oxlint-disable-next-line <rule> -- <why the rule is wrong here>`.",
      tsIgnore: "Replace this with `// @ts-expect-error <reason>`.",
      tsReason: "Add a reason after `@ts-expect-error`.",
      externalUrl:
        "EXTERNAL comments need a parseable http(s) link: `// EXTERNAL(https://…): <constraint the dependency imposes>`.",
    },
  },
  create(context) {
    const source = context.sourceCode;

    const [options] = noCommentsOptions.parse(context.options);
    const filename = context.physicalFilename.replaceAll("\\", "/");

    const publicFile = (options?.publicApi ?? []).some((pattern) =>
      new RegExp(pattern, "u").test(filename),
    );

    const documented = new Set<number>();
    const declarations = new Set<ESTree.Node>();
    const members: ESTree.Node[] = [];
    const references: ESTree.TSTypeReference[] = [];

    function document(node: ESTree.Node) {
      const comments = source.getCommentsBefore(node);
      let [start] = node.range;

      while (comments.length > 0) {
        const last = comments.at(-1);

        if (!last || !isDirective(last)) {
          break;
        }

        if (source.text.slice(last.range[1], start).trim() !== "") {
          return;
        }

        [start] = last.range;

        comments.pop();
      }

      const comment = comments.at(-1);

      if (
        comment?.type === "Block" &&
        comment.value.startsWith("*") &&
        !/@(?:internal|private)\b/u.test(comment.value) &&
        source.text.slice(comment.range[1], start).trim() === ""
      ) {
        documented.add(comment.range[0]);
      }
    }

    function collectMember(node: ESTree.Node) {
      members.push(node);
    }

    function isExposed(node: ESTree.Node) {
      let ancestor = node;

      while (!declarations.has(ancestor)) {
        if (
          ancestor.type === "Program" ||
          ancestor.type === "BlockStatement" ||
          ancestor.type === "StaticBlock" ||
          ("accessibility" in ancestor &&
            (ancestor.accessibility === "private" ||
              ancestor.accessibility === "protected")) ||
          ("key" in ancestor && ancestor.key.type === "PrivateIdentifier") ||
          (ancestor.parent.type === "ArrowFunctionExpression" &&
            ancestor.parent.body === ancestor)
        ) {
          return false;
        }

        ancestor = ancestor.parent;
      }

      return true;
    }

    function collectPublicDocumentation(program: ESTree.Program) {
      const exportedNames = new Set<string>();

      const ambientFile =
        /\.d\.[cm]?ts$/u.test(context.physicalFilename) &&
        program.body.every(
          (node) => node.type !== "ImportDeclaration" && !node.type.startsWith("Export"),
        );

      for (const node of program.body) {
        if (ambientFile || (node.type === "TSModuleDeclaration" && node.declare)) {
          declarations.add(node);
        }

        if (node.type === "ExportNamedDeclaration") {
          document(node);

          if (node.declaration) {
            declarations.add(node.declaration);
          } else if (node.source === null) {
            for (const specifier of node.specifiers) {
              if (specifier.local.type === "Identifier") {
                exportedNames.add(specifier.local.name);
              }
            }
          }
        } else if (node.type === "ExportDefaultDeclaration") {
          document(node);

          if (node.declaration.type === "Identifier") {
            exportedNames.add(node.declaration.name);
          } else {
            declarations.add(node.declaration);
          }
        } else if (node.type === "ExportAllDeclaration") {
          document(node);
        }
      }

      for (const node of program.body) {
        if (
          source.getDeclaredVariables(node).some((variable) => exportedNames.has(variable.name))
        ) {
          declarations.add(node);
        }
      }

      let previousSize = -1;

      while (previousSize !== declarations.size) {
        previousSize = declarations.size;

        for (const reference of references) {
          if (reference.typeName.type !== "Identifier" || !isExposed(reference)) {
            continue;
          }

          let scope: Scope | null = source.getScope(reference);

          while (scope) {
            const variable = scope.set.get(reference.typeName.name);

            if (variable) {
              for (const definition of variable.defs) {
                if (
                  definition.node.type === "TSInterfaceDeclaration" ||
                  definition.node.type === "TSTypeAliasDeclaration"
                ) {
                  declarations.add(definition.node);
                }
              }

              break;
            }

            scope = scope.upper;
          }
        }
      }

      for (const node of declarations) {
        document(node);
      }

      for (const node of members) {
        if (isExposed(node)) {
          document(node);
        }
      }
    }

    return {
      Property: collectMember,
      TSInterfaceDeclaration: collectMember,
      TSTypeAliasDeclaration: collectMember,
      TSPropertySignature: collectMember,
      TSMethodSignature: collectMember,
      TSCallSignatureDeclaration: collectMember,
      TSConstructSignatureDeclaration: collectMember,
      TSIndexSignature: collectMember,
      TSEnumMember: collectMember,
      MethodDefinition: collectMember,
      PropertyDefinition: collectMember,
      TSTypeReference(node) {
        references.push(node);
      },
      "Program:exit"(program) {
        if (publicFile) {
          collectPublicDocumentation(program);
        }

        let previous: Comment | null = null;
        let previousExplains = false;

        for (const comment of source.getAllComments()) {
          const verdict = classify(comment);
          const continuesExplanation =
            previousExplains &&
            previous !== null &&
            comment.type === "Line" &&
            previous.type === "Line" &&
            comment.loc.start.line === previous.loc.end.line + 1 &&
            source.text.slice(previous.range[1], comment.range[0]).trim() === "";

          if (verdict === "explanation" || continuesExplanation) {
            previousExplains = true;
          } else {
            previousExplains = false;

            if (verdict !== "allowed" && !documented.has(comment.range[0])) {
              context.report({ loc: comment.loc, messageId: verdict });
            }
          }

          previous = comment;
        }
      },
    };
  },
});
