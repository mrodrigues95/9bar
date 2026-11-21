import cloudflare from "@cloudflare/oxlint-config";
import landmines from "@interfere/landmines/configs/recommended.json" with { type: "json" };
import { defineConfig } from "oxlint";
import type { OxlintOverride } from "oxlint";
import { ignorePatterns } from "./tools/config/ignore-patterns.ts";

const restrictImports = (files: Array<string>, group: Array<string>, message: string) =>
	({
		files,
		rules: { "no-restricted-imports": ["error", { patterns: [{ group, message }] }] },
	}) satisfies OxlintOverride;

const landminesRules = Object.fromEntries(
	Object.keys(landmines.rules).map((rule) => [rule, "error" as const]),
);

export default defineConfig({
	...cloudflare,
	categories: { correctness: "error" },
	jsPlugins: [
		...(cloudflare.jsPlugins ?? []),
		...landmines.jsPlugins,
		{ name: "anti-slop", specifier: "./tools/oxlint/anti-slop/index.ts" },
	],
	ignorePatterns: [...(cloudflare.ignorePatterns ?? []), ...ignorePatterns],
	rules: {
		...cloudflare.rules,
		...landminesRules,
		"landmines-style/no-comments": "off",
		"anti-slop/no-comments": ["error", { publicApi: ["/packages/toolkit/src/"] }],
		"anti-slop/no-effect": "error",
		"anti-slop/no-manual-memo": "error",
		"anti-slop/no-runtime-typeof": "error",
		"anti-slop/no-shape-in-symbol-names": "error",
		"anti-slop/no-unknown-parameters": "error",
		"anti-slop/require-safety-comment-for-type-assertion": "error",
		"anti-slop/type-naming": "error",
		"no-unused-vars": "error",
		"@typescript-eslint/await-thenable": "error",
		"@typescript-eslint/array-type": ["error", { default: "generic", readonly: "generic" }],
		"typescript/no-inferrable-types": "error",
		"typescript/no-unnecessary-condition": "error",
		"typescript/strict-boolean-expressions": ["error", { allowNullableBoolean: true }],
		"typescript/switch-exhaustiveness-check": "error",
		"eslint/arrow-body-style": ["error", "as-needed"],
		"eslint/func-style": ["error", "expression"],
		"unicorn/explicit-length-check": "error",
		"import/no-cycle": "error",
		// EXTERNAL(https://zod.dev/api#catch): Zod schemas end in `.catch(fallback)`, which this rule reads as a promise chain.
		"unicorn/prefer-top-level-await": "off",
	},
	overrides: [
		...(cloudflare.overrides ?? []),
		{
			files: ["**/*.{ts,tsx,mts,cts}"],
			rules: { "no-unreachable": "error" },
		},
		{
			files: ["packages/toolkit/src/**"],
			rules: {
				"anti-slop/react-aria-import-alias": "error",
				"anti-slop/max-class-string-length": "error",
				"anti-slop/require-export-jsdoc": "error",
			},
		},
		restrictImports(
			["apps/web/src/components/**", "apps/web/src/utils/**"],
			["**/routes/**", "**/routeTree.gen"],
			"Shared code never imports route code. Move the shared piece into src/components or src/utils.",
		),
		restrictImports(
			["packages/toolkit/src/components/primitive/**"],
			["#composed/*", "**/composed/**"],
			"Primitives never import composed components. Move the shared piece into a primitive.",
		),
		restrictImports(
			["packages/toolkit/src/components/composed/**"],
			["#composed/*"],
			"Inside composed, import sibling composed components relatively.",
		),
		{
			files: ["**/*"],
			rules: {
				"typescript/no-unsafe-member-access": "off",
				"typescript/no-unsafe-return": "off",
				"typescript/no-empty-object-type": "off",
				"typescript/only-throw-error": "off",
				"react/rules-of-hooks": "off",
				"react/no-unescaped-entities": "off",
				"eslint/eqeqeq": "off",
				"eslint/no-console": "off",
				"import/no-namespace": "off",
				"@nkzw/no-instanceof": "off",
				"unicorn/consistent-function-scoping": "off",
				"quality/no-array-filter-map": "off",
			},
		},
	],
});
