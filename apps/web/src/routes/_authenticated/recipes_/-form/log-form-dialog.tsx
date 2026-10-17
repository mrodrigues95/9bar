import { useRef, useState } from "react";
import {
	Dialog,
	DialogCloseIconButton,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@9bar/toolkit/components";
import { useAppForm } from "@9bar/toolkit/components/composed";
import { formatTimeOfDay } from "../../../../utils/format";
import { LogForm } from "./log-form";
import { nowAsCalendarDateTime } from "./schemas/field-schema";
import { logFormOpts, type LogFormValues } from "./schemas/log-schema";
import { grindSizeFieldName } from "./sections/brew-parameters-fields";

interface LogFormDialogProps {
	defaultValues: LogFormValues;
	mode: "create" | "edit";
	onDone: () => void;
}

export const LogFormDialog = ({ defaultValues, mode, onDone }: LogFormDialogProps) => {
	const [loggedAt, setLoggedAt] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);

	const form = useAppForm({
		...logFormOpts,
		defaultValues,
		onSubmit: async ({ value, meta }) => {
			console.log(mode === "create" ? "Log created:" : "Log updated:", value);
			if (meta.intent === "log-another") {
				setLoggedAt(formatTimeOfDay(value.shotAt));
				form.reset({ ...value, shotAt: nowAsCalendarDateTime() });
				// TanStack Form has no focus API; its docs recommend querying the form element.
				formRef.current?.querySelector<HTMLInputElement>(`[name="${grindSizeFieldName}"]`)?.focus();
				return;
			}
			onDone();
		},
	});

	return (
		<Dialog
			defaultOpen
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					onDone();
				}
			}}
			className="max-h-[85vh] overflow-y-auto sm:max-w-2xl"
		>
			<DialogHeader>
				<DialogTitle>{mode === "create" ? "Log a shot" : "Edit log"}</DialogTitle>
				<DialogDescription>
					Record the details of this shot. A recipe is optional.
				</DialogDescription>
				<DialogCloseIconButton />
			</DialogHeader>
			<output className="sr-only">{loggedAt ? `Logged at ${loggedAt}` : ""}</output>
			<LogForm
				form={form}
				formRef={formRef}
				onCancel={onDone}
				onLogAnother={
					mode === "create" ? () => form.handleSubmit({ intent: "log-another" }) : undefined
				}
			/>
		</Dialog>
	);
};
