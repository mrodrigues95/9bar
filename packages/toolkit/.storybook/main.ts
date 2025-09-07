import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const excludedProps = new Set([
	"id",
	"slot",
	"onCopy",
	"onCut",
	"onPaste",
	"onCompositionStart",
	"onCompositionEnd",
	"onCompositionUpdate",
	"onSelect",
	"onBeforeInput",
	"onInput",
]);

function getAbsolutePath(value: string) {
	return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		getAbsolutePath("@chromatic-com/storybook"),
		getAbsolutePath("@storybook/addon-docs"),
		getAbsolutePath("@storybook/addon-a11y"),
	],
	framework: {
		name: getAbsolutePath("@storybook/react-vite"),
		options: {},
	},
	typescript: {
		reactDocgen: "react-docgen-typescript",
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			compilerOptions: {
				allowSyntheticDefaultImports: false,
				esModuleInterop: false,
			},
			propFilter: (prop) =>
				!prop.name.startsWith("aria-") && !excludedProps.has(prop.name),
		},
	},
};

export default config;
