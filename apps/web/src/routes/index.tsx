import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const filePath = "count.txt";

async function readCount() {
	return parseInt(
		await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
		10,
	);
}

const getCount = createServerFn({
	method: "GET",
}).handler(() => {
	return readCount();
});

const updateCount = createServerFn({ method: "POST" })
	.validator((d: number) => d)
	.handler(async ({ data }) => {
		const count = await readCount();
		await fs.promises.writeFile(filePath, `${count + data}`);
	});

export const Route = createFileRoute("/")({
	component: Home,
	loader: async () => await getCount(),
});

function Home() {
	const router = useRouter();
	const state = Route.useLoaderData();

	return (
		<div className="p-8 space-y-4">
			<h1 className="text-4xl font-bold">Welcome to 9bar</h1>
			<p className="text-lg text-gray-600">
				This text is rendered using Geist Sans font from Vercel.
			</p>
			<button
				type="button"
				className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
				onClick={() => {
					updateCount({ data: 1 }).then(() => {
						router.invalidate();
					});
				}}
			>
				Add 1 to {state}?
			</button>
		</div>
	);
}
