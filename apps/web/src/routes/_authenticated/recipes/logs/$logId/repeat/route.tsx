import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { buildLogGraph } from "../../../../../../utils/data";
import { LogFormDialog } from "../../../../recipes_/-form/log-form-dialog";
import { nowAsCalendarDateTime } from "../../../../recipes_/-form/schemas/field-schema";
import { logToFormValues } from "../../../../recipes_/-form/schemas/log-schema";

const RepeatLog = () => {
	const { log } = Route.useLoaderData();
	const navigate = useNavigate();

	return (
		<LogFormDialog
			defaultValues={logToFormValues(log, nowAsCalendarDateTime())}
			mode="create"
			onDone={() => {
				navigate({ to: "/recipes", search: true });
			}}
		/>
	);
};

export const Route = createFileRoute("/_authenticated/recipes/logs/$logId/repeat")({
	loader: ({ params }) => {
		const log = buildLogGraph(Number(params.logId));
		if (!log) {
			throw redirect({ to: "/recipes" });
		}
		return { log };
	},
	component: RepeatLog,
});
