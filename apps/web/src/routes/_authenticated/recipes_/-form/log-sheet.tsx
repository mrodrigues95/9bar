import { Heading, Text } from "@9bar/toolkit/components";
import { useAppForm } from "@9bar/toolkit/components/composed";
import { LogForm } from "./log-form";
import { logFormOpts, type TLogFormValues } from "./schemas/log-schema";

interface TLogSheetProps {
	defaultValues: TLogFormValues;
	mode: "create" | "edit";
	onDone: () => void;
}

export const LogSheet = ({ defaultValues, mode, onDone }: TLogSheetProps) => {
	const form = useAppForm({
		...logFormOpts,
		defaultValues,
		onSubmit: async ({ value }) => {
			// TODO(persistence): replace with the real save.
			console.log(mode === "create" ? "Log created:" : "Log updated:", value);
			onDone();
		},
	});

	return (
		<section>
			{/* TODO(sheet): wrap in the toolkit Dialog once it lands. */}
			<Heading as="h2" variant="heading">
				{mode === "create" ? "Log a shot" : "Edit log"}
			</Heading>
			<Text variant="body-sm" className="mb-6">
				Record the details of this shot. A recipe is optional.
			</Text>
			<LogForm form={form} onCancel={onDone} />
		</section>
	);
};
