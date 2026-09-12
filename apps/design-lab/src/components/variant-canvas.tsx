import type { DesignVariantEntry } from "./registry/registry";

export const VariantCanvas = ({ entry }: { entry: DesignVariantEntry }) => {
	const Variant = entry.component;
	if (entry.surface === "plain") {
		return <Variant />;
	}
	return (
		<div className="rounded-md border border-border bg-white px-4 py-2">
			<Variant />
		</div>
	);
};
