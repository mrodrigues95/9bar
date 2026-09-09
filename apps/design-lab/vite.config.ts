import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		port: 3001,
	},
	plugins: [
		// NOTE: @tanstack/router-plugin is pinned to 1.168.23 (see package.json).
		// Newer 1.168.x releases emit route HMR code that calls
		// `router._replaceRouteChunk`, an API that the installed
		// @tanstack/router-core no longer has. The call throws during HMR
		// re-evaluation, so every route edit falls back to a full page reload
		// instead of Fast Refresh. Do not unpin until the plugin and router-core
		// agree on the HMR API again.
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		viteReact(),
		tailwindcss(),
	],
});
