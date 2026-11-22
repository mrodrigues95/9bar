import { defineConfig } from "oxfmt";
import { ignorePatterns } from "./tools/config/ignore-patterns.ts";

export default defineConfig({
	useTabs: true,
	tabWidth: 2,
	printWidth: 100,
	singleQuote: false,
	jsxSingleQuote: false,
	quoteProps: "as-needed",
	trailingComma: "all",
	semi: true,
	arrowParens: "always",
	bracketSameLine: false,
	bracketSpacing: true,
	sortImports: {
		groups: [
			"builtin",
			"external",
			["internal", "subpath"],
			["parent", "sibling", "index"],
			"style",
			"unknown",
		],
		newlinesBetween: false,
		internalPattern: ["~/", "@/", "#", "@9bar/"],
	},
	sortTailwindcss: {
		stylesheet: "./packages/toolkit/src/styles/globals.css",
		functions: ["tv", "cn", "cva", "clsx"],
	},
	sortPackageJson: true,
	ignorePatterns,
});
