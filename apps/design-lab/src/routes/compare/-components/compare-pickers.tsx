import type { InferFullSearchSchema, RegisteredRouter, RouteById } from "@tanstack/react-router";
import { Picker } from "../../../components/picker";
import type { DesignGroup, DesignVariantEntry } from "../../../components/registry/registry";
import { PickerLink } from "./picker-link";

export const WIDTHS = [
	{ id: "full", label: "Full", className: undefined },
	{ id: "tablet", label: "Tablet 768", className: "mx-auto max-w-[768px]" },
	{ id: "mobile", label: "Mobile 390", className: "mx-auto max-w-[390px]" },
] as const;

type ComparePickersProps = {
	group: DesignGroup;
	a: DesignVariantEntry;
	b: DesignVariantEntry;
	activeWidthId: string;
	search: InferFullSearchSchema<RouteById<RegisteredRouter["routeTree"], "/compare">>;
};

export const ComparePickers = ({ group, a, b, activeWidthId, search }: ComparePickersProps) => {
	return (
		<>
			<div className="grid items-start gap-4 xl:grid-cols-2">
				{(["A", "B"] as const).map((slot) => {
					const active = slot === "A" ? a : b;
					const other = slot === "A" ? b : a;
					return (
						<Picker key={slot} label={`Variant ${slot}`}>
							{group.variants
								.filter((variant) => variant.id !== other.id)
								.map((variant) => {
									return (
										<PickerLink
											key={variant.id}
											active={variant.id === active.id}
											search={{
												...search,
												group: group.id,
												a: slot === "A" ? variant.id : a.id,
												b: slot === "B" ? variant.id : b.id,
											}}
										>
											{variant.title}
										</PickerLink>
									);
								})}
						</Picker>
					);
				})}
			</div>

			<Picker label="Width">
				{WIDTHS.map((preset) => {
					return (
						<PickerLink
							key={preset.id}
							active={preset.id === activeWidthId}
							search={{
								...search,
								group: group.id,
								w: preset.id === "full" ? undefined : preset.id,
							}}
						>
							{preset.label}
						</PickerLink>
					);
				})}
			</Picker>
		</>
	);
};
