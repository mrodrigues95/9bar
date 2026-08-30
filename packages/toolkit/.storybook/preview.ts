import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import "./styles.css";

const preview: Preview = {
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		options: {
			storySort: {
				// Pin the overview canvas (Overview / Preview) at the top of the sidebar.
				order: ["Overview", "*"],
			},
		},
	},
	decorators: [
		// Light/dark theme toolbar global. Applies the `.dark` class to <html>,
		// which drives the token overrides in src/styles/globals.css.
		withThemeByClassName({
			themes: {
				light: "",
				dark: "dark",
			},
			defaultTheme: "light",
		}),
	],
};

export default preview;
