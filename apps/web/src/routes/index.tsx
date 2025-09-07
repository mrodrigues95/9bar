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
		<div className="space-y-4 p-8">
			<h1 className="font-bold text-4xl">Welcome to 9bar</h1>
			<p className="text-gray-600 text-lg">
				This text is rendered using Geist Sans font from Vercel.
			</p>
			<button
				type="button"
				className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
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
