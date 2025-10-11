import * as fs from "node:fs";
import { Heading, Text } from "@9bar/toolkit";
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
			<Heading as="h1" variant="heading">
				Welcome to 9bar
			</Heading>
			<Text as="p" variant="body-lg" className="text-gray-600">
				This text is rendered using Geist Sans font from Vercel.
			</Text>
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
