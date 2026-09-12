import { useId, type ReactNode } from "react";
import { Text } from "@9bar/toolkit/components";

export const Picker = ({ label, children }: { label: string; children: ReactNode }) => {
	const labelId = useId();
	return (
		<nav aria-labelledby={labelId} className="space-y-1">
			<Text variant="body-sm" id={labelId} className="font-semibold">
				{label}
			</Text>
			<div className="flex flex-wrap items-center gap-1">{children}</div>
		</nav>
	);
};
