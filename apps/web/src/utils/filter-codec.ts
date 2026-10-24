import { z } from "zod";
import type { FilterBarDefinition, FilterBarFilterState } from "@9bar/toolkit/components/composed";

export const FILTER_OPERATORS = [
	{ id: "is", label: "is" },
	{ id: "is-not", label: "is not" },
	{ id: "is-any-of", label: "is any of" },
	{ id: "is-none-of", label: "is none of" },
] as const;

export const FILTER_OPERATOR_PAIRS = [
	{ singular: "is", plural: "is-any-of" },
	{ singular: "is-not", plural: "is-none-of" },
] as const;

export const DEFAULT_FILTER_OPERATOR_ID = FILTER_OPERATORS[0].id;

export const filterParamSchema = z.string().optional().catch(undefined);

/**
 * Reads active filters from URL params written as `<operatorId>.<value>|<value>`,
 * dropping unknown definitions, operators, and values so a hand-edited URL
 * degrades instead of throwing.
 */
export const decodeFilters = <TFilterId extends string>(
	definitions: ReadonlyArray<FilterBarDefinition & { id: TFilterId }>,
	params: Partial<Record<TFilterId, string | undefined>>,
) => {
	const filters: Array<FilterBarFilterState> = [];
	for (const definition of definitions) {
		const param = params[definition.id];
		if (!param) {
			continue;
		}
		const operatorSeparator = param.indexOf(".");
		if (operatorSeparator < 0) {
			continue;
		}
		const operatorId = param.slice(0, operatorSeparator);
		if (!definition.operators.some((operator) => operator.id === operatorId)) {
			continue;
		}
		const values = param
			.slice(operatorSeparator + 1)
			.split("|")
			.filter((value) => definition.options.some((option) => option.id === value));
		if (!values.length) {
			continue;
		}
		filters.push({ filterId: definition.id, operatorId, values });
	}
	return filters;
};

/** Writes active filters into URL params; empty filters become `undefined` so a removed chip leaves the URL. */
export const encodeFilters = <TFilterId extends string>(
	definitions: ReadonlyArray<FilterBarDefinition & { id: TFilterId }>,
	filters: Array<FilterBarFilterState>,
) => {
	const params: Partial<Record<TFilterId, string | undefined>> = {};
	const filterByFilterId = new Map<string, FilterBarFilterState>(
		filters.map((filter) => [filter.filterId, filter]),
	);
	for (const definition of definitions) {
		const filter = filterByFilterId.get(definition.id);
		params[definition.id] = filter?.values.length
			? `${filter.operatorId}.${filter.values.join("|")}`
			: undefined;
	}
	return params;
};

/** Applies one filter's operator to a field value; rows with no value only match negative operators. */
export const matchesOperator = (
	operatorId: string,
	selected: Array<string>,
	value: string | null,
) => {
	if (value === null) {
		return operatorId === "is-not" || operatorId === "is-none-of";
	}
	const isSelected = selected.includes(value);
	if (operatorId === "is" || operatorId === "is-any-of") {
		return isSelected;
	}
	if (operatorId === "is-not" || operatorId === "is-none-of") {
		return !isSelected;
	}
	return true;
};
