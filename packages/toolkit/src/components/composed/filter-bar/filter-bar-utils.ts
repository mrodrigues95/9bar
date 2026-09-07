import type { FilterBarDefinition, FilterBarOption } from "./filter-bar-types";

/** Swaps a paired operator when the selection count crosses the singular/plural boundary. */
export const resolveOperator = (
	currentOp: string,
	valueCount: number,
	operatorPairs?: ReadonlyArray<{ singular: string; plural: string }>,
): string => {
	if (!operatorPairs) return currentOp;
	for (const { singular, plural } of operatorPairs) {
		if (currentOp === singular && valueCount > 1) return plural;
		if (currentOp === plural && valueCount <= 1) return singular;
	}
	return currentOp;
};

/** Hides the inapplicable half of each operator pair for the current selection count. */
export const getVisibleOperators = (
	operators: ReadonlyArray<{ id: string; label: string }>,
	valueCount: number,
	operatorPairs?: ReadonlyArray<{ singular: string; plural: string }>,
): Array<{ id: string; label: string }> => {
	if (!operatorPairs) return [...operators];
	return operators.filter((op) => {
		const pair = operatorPairs.find(
			({ singular, plural }) => singular === op.id || plural === op.id,
		);
		if (!pair) return true;
		return valueCount > 1 ? op.id !== pair.singular : op.id !== pair.plural;
	});
};

/** Default chip label: the option label for one value, `"N <pluralLabel>"` for several. */
export const formatValuesDefault = (
	values: ReadonlyArray<string>,
	options: ReadonlyArray<FilterBarOption>,
	pluralLabel: string,
): string => {
	if (values.length === 0) return "";
	if (values.length === 1) {
		const firstValue = values[0] ?? "";
		const opt = options.find((o) => o.id === firstValue);
		return opt?.label ?? firstValue;
	}
	return `${values.length} ${pluralLabel}`;
};

/** Splits options into selected-first and unselected groups for the value menu. */
export const partitionFilterOptions = (
	options: ReadonlyArray<FilterBarOption>,
	values: ReadonlyArray<string>,
): [Array<FilterBarOption>, Array<FilterBarOption>] => {
	const selectedSet = new Set(values);
	const selected: Array<FilterBarOption> = [];
	const unselected: Array<FilterBarOption> = [];
	for (const opt of options) {
		if (selectedSet.has(opt.id)) {
			selected.push(opt);
		} else {
			unselected.push(opt);
		}
	}
	return [selected, unselected];
};

/** Reads a definition from the lookup map, throwing for unknown filter ids. */
export const getDefinition = (
	definitionById: ReadonlyMap<string, FilterBarDefinition>,
	filterId: string,
): FilterBarDefinition => {
	const def = definitionById.get(filterId);
	if (!def) {
		throw new Error(`Unknown filter definition: ${filterId}`);
	}
	return def;
};
