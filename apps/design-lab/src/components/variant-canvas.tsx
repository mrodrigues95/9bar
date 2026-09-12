import { cn } from "@9bar/toolkit";
import type { DesignVariantEntry } from "./registry/registry";

export const VariantCanvas = ({ entry }: { entry: DesignVariantEntry }) => {
	const Variant = entry.component;
	return (
		<section
			aria-label={entry.title}
			className={cn(
				entry.surface !== "plain" && "rounded-md border border-border bg-white px-4 py-2",
			)}
		>
			<Variant />
		</section>
	);
};
