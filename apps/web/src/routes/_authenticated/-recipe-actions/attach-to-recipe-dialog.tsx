import { Check, Info } from "lucide-react";
import { useId, useState } from "react";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Dialog,
	DialogCloseButton,
	DialogCloseIconButton,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	SelectItem,
	Text,
} from "@9bar/toolkit/components";
import { SelectField } from "@9bar/toolkit/components/composed";
import {
	BREW_FIELD_ICONS,
	BREW_FIELD_LABELS,
	formatBrewField,
	isSameBrewField,
} from "../../../utils/brew-fields";
import type { BrewField } from "../../../utils/brew-fields";
import { buildRecipeGraph, recipes } from "../../../utils/data";
import type { BrewSnapshot, LogGraph } from "../../../utils/data";
import { formatGrams, formatPressure } from "../../../utils/format";

const formatDelta = (difference: number, format: (value: number) => string) => {
	const rounded = Math.round(difference * 10) / 10;
	if (!rounded) {
		return null;
	}
	return `${rounded > 0 ? "+" : "−"}${format(Math.abs(rounded))}`;
};

const DELTAS: Partial<
	Record<BrewField, (recipe: BrewSnapshot, log: BrewSnapshot) => string | null>
> = {
	dose: (recipe, log) => formatDelta(log.dose - recipe.dose, formatGrams),
	yield: (recipe, log) => formatDelta(log.yield - recipe.yield, formatGrams),
	brewTime: (recipe, log) =>
		recipe.brewTimeUnit === log.brewTimeUnit
			? formatDelta(log.brewTime - recipe.brewTime, (value) => `${value}${log.brewTimeUnit}`)
			: null,
	temperature: (recipe, log) =>
		recipe.temperatureUnit === log.temperatureUnit
			? formatDelta(
					log.temperature - recipe.temperature,
					(value) => `${value}°${log.temperatureUnit}`,
				)
			: null,
	pressure: (recipe, log) => formatDelta(log.pressure - recipe.pressure, formatPressure),
};

const compareField = (field: BrewField, recipe: BrewSnapshot, log: BrewSnapshot) => {
	const isMismatched = !isSameBrewField(recipe, log, field);
	return {
		field,
		recipeValue: formatBrewField(recipe, field),
		logValue: formatBrewField(log, field),
		delta: isMismatched ? (DELTAS[field]?.(recipe, log) ?? null) : null,
		isMismatched,
	};
};

type ComparisonRow = ReturnType<typeof compareField>;

const ComparisonRowItem = ({ row }: { row: ComparisonRow }) => {
	const FieldIcon = BREW_FIELD_ICONS[row.field];

	return (
		<tr>
			<th scope="row" className="px-2 py-1.5 text-left align-top font-normal">
				<Text
					as="span"
					variant="caption"
					color="muted"
					className="flex items-center gap-1.5 leading-5"
				>
					<FieldIcon className="size-3.5 shrink-0" />
					{BREW_FIELD_LABELS[row.field]}
				</Text>
			</th>
			<td className="px-2 py-1.5 align-top break-words">
				<Text as="span" variant="body-sm" color="primary" className="leading-5 tabular-nums">
					{row.recipeValue}
				</Text>
			</td>
			<td className="px-2 py-1.5 align-top break-words">
				{row.isMismatched ? (
					<Text
						as="span"
						variant="body-sm"
						className="leading-5 font-medium text-amber-700 tabular-nums"
					>
						{row.logValue}
						{row.delta !== null && (
							<span className="ml-1.5 text-xs font-normal text-amber-700/75">{row.delta}</span>
						)}
					</Text>
				) : (
					<Text
						as="span"
						variant="caption"
						color="muted"
						className="inline-flex items-center gap-1 leading-5"
					>
						<Check className="size-3.5" />
						Same
					</Text>
				)}
			</td>
		</tr>
	);
};

interface ComparisonTableProps {
	setupRows: Array<ComparisonRow>;
	shotRows: Array<ComparisonRow>;
}

const ComparisonTable = ({ setupRows, shotRows }: ComparisonTableProps) => (
	<div className="shrink-0 overflow-hidden rounded-lg border border-border">
		<table className="w-full table-fixed">
			<caption className="sr-only">Recipe compared with this log</caption>
			<colgroup>
				<col className="w-28" />
				<col />
				<col />
			</colgroup>
			<thead className="bg-muted/50">
				<tr className="border-b border-border">
					<th scope="col" className="px-2 py-1.5">
						<span className="sr-only">Field</span>
					</th>
					{["Recipe", "Log"].map((heading) => (
						<th key={heading} scope="col" className="px-2 py-1.5 text-left">
							<Text
								as="span"
								variant="caption"
								color="muted"
								className="font-medium tracking-wide uppercase"
							>
								{heading}
							</Text>
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{setupRows.map((row) => (
					<ComparisonRowItem key={row.field} row={row} />
				))}
			</tbody>
			<tbody className="border-t border-border">
				{shotRows.map((row) => (
					<ComparisonRowItem key={row.field} row={row} />
				))}
			</tbody>
		</table>
	</div>
);

interface AttachToRecipeDialogProps {
	log: LogGraph;
	onOpenChange: (isOpen: boolean) => void;
}

export const AttachToRecipeDialog = ({ log, onOpenChange }: AttachToRecipeDialogProps) => {
	const mismatchTitleId = useId();
	const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
	const recipe = selectedRecipeId === null ? undefined : buildRecipeGraph(selectedRecipeId);
	const compare = (fields: ReadonlyArray<BrewField>) =>
		recipe ? fields.map((field) => compareField(field, recipe.snapshot, log.snapshot)) : [];
	const setupRows = compare(["method", "beans", "machine", "grinder"]);
	const shotRows = compare(["grindSize", "dose", "yield", "brewTime", "temperature", "pressure"]);

	const onAttach = () => {
		console.log("Log attached to recipe:", {
			logId: log.id,
			recipeId: recipe?.id ?? null,
			mismatchedFields: [...setupRows, ...shotRows]
				.filter((row) => row.isMismatched)
				.map((row) => row.field),
		});
	};

	return (
		<Dialog defaultOpen className="sm:max-w-xl" onOpenChange={onOpenChange}>
			<DialogHeader>
				<DialogTitle>Attach to recipe</DialogTitle>
				<DialogDescription>
					{recipes.length > 0
						? "Pick the recipe this shot belongs to. It will be added to that recipe's logs."
						: "You don't have any recipes yet. Create a recipe first, then attach this log to it."}
				</DialogDescription>
				<DialogCloseIconButton />
			</DialogHeader>
			<SelectField
				label="Recipe"
				placeholder="Select a recipe"
				items={recipes}
				selectedKey={selectedRecipeId}
				onSelectionChange={(key) => setSelectedRecipeId(key === null ? null : Number(key))}
			>
				{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
			</SelectField>
			{!!recipe && (
				<div className="-mx-4 flex max-h-[calc(100dvh-20rem)] flex-col gap-3 overflow-y-auto px-4 sm:max-h-[calc(100dvh-16.5rem)]">
					{setupRows.some((row) => row.isMismatched) && (
						<Alert variant="warning" aria-labelledby={mismatchTitleId}>
							<Info />
							<AlertTitle id={mismatchTitleId}>
								This log doesn't match the recipe's setup
							</AlertTitle>
							<AlertDescription>
								It was brewed with a different method, beans, or gear, marked below. You can still
								attach it, and edit the log afterwards if you want to match the recipe.
							</AlertDescription>
						</Alert>
					)}
					<ComparisonTable setupRows={setupRows} shotRows={shotRows} />
				</div>
			)}
			<DialogFooter>
				<DialogCloseButton>Cancel</DialogCloseButton>
				<DialogCloseButton variant="default" isDisabled={!recipe} onPress={onAttach}>
					Attach
				</DialogCloseButton>
			</DialogFooter>
		</Dialog>
	);
};
