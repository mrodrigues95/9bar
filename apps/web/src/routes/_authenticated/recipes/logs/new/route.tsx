import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogFormDialog } from "../../../recipes_/-form/log-form-dialog";
import { emptyLogFormValues } from "../../../recipes_/-form/schemas/log-schema";

const NewQuickLog = () => {
	const navigate = useNavigate();

	return (
		<LogFormDialog
			defaultValues={emptyLogFormValues()}
			mode="create"
			onDone={() => {
				navigate({ to: "/recipes", search: true });
			}}
		/>
	);
};

export const Route = createFileRoute("/_authenticated/recipes/logs/new")({
	component: NewQuickLog,
});
