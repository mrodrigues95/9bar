import type { Preview } from "@storybook/react-vite";
import "./styles.css";

const preview: Preview = {
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
