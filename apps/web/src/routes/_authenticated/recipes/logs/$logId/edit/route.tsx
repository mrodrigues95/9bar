import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { buildLogGraph } from "../../../../../../utils/data";
import { LogSheet } from "../../../../recipes_/-form/log-sheet";
import { logToFormValues } from "../../../../recipes_/-form/schemas/log-schema";

const EditLog = () => {
	const { log } = Route.useLoaderData();
	const navigate = useNavigate();

	return (
		<LogSheet
			defaultValues={logToFormValues(log)}
			mode="edit"
			onDone={() => {
				navigate({ to: "/recipes", search: true });
			}}
		/>
	);
};

export const Route = createFileRoute("/_authenticated/recipes/logs/$logId/edit")({
	loader: ({ params }) => {
		const log = buildLogGraph(Number(params.logId));
		if (!log) {
			throw redirect({ to: "/recipes" });
		}
		return { log };
	},
	component: EditLog,
});
