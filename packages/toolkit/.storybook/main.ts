import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import babel from "@rolldown/plugin-babel";
import type { StorybookConfig } from "@storybook/react-vite";
import { reactCompilerPreset } from "@vitejs/plugin-react";

const require = createRequire(import.meta.url);

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
		getAbsolutePath("@storybook/addon-mcp"),
		getAbsolutePath("@storybook/addon-themes"),
	],
	framework: {
		name: getAbsolutePath("@storybook/react-vite"),
		options: { strictMode: true },
	},
	viteFinal: (config) => {
		config.plugins ??= [];
		config.plugins.push(babel({ presets: [reactCompilerPreset()] }));
		return config;
	},
	typescript: {
		reactDocgen: "react-docgen-typescript",
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			compilerOptions: {
				allowSyntheticDefaultImports: false,
				esModuleInterop: false,
			},
			propFilter: (prop) => !prop.name.startsWith("aria-") && !excludedProps.has(prop.name),
		},
	},
};

export default config;
