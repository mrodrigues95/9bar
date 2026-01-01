import optimizeLocales from "@react-aria/optimize-locales-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [
		{
			...optimizeLocales.vite({
				locales: ["en-US", "fr-FR"],
			}),
			enforce: "pre",
		},
		tsConfigPaths(),
		tanstackStart({ customViteReactPlugin: true }),
		viteReact({ babel: { plugins: [["babel-plugin-react-compiler", {}]] } }),
		tailwindcss(),
	],
});
