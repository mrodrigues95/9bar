import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
	decodeFilters,
	encodeFilters,
	FILTER_OPERATOR_PAIRS,
	FILTER_OPERATORS,
} from "./filter-codec";

const slugArb = fc.stringMatching(/^[a-z0-9][a-z0-9-]{0,7}$/);

const definitionsArb = fc
	.uniqueArray(slugArb, { minLength: 1, maxLength: 4 })
	.chain((ids) =>
		fc.tuple(
			...ids.map((id) =>
				fc.tuple(fc.constant(id), fc.uniqueArray(slugArb, { minLength: 1, maxLength: 6 })),
			),
		),
	)
	.map((entries) =>
		entries.map(([id, optionIds]) => ({
			id,
			label: id,
			pluralLabel: id,
			operators: FILTER_OPERATORS,
			defaultOperatorId: "is",
			operatorPairs: FILTER_OPERATOR_PAIRS,
			options: optionIds.map((optionId) => ({ id: optionId, label: optionId })),
		})),
	);

const scenarioArb = definitionsArb.chain((definitions) =>
	fc.tuple(
		fc.constant(definitions),
		fc.tuple(
			...definitions.map((definition) =>
				fc.option(
					fc.record({
						filterId: fc.constant(definition.id),
						operatorId: fc.constantFrom(...FILTER_OPERATORS.map((operator) => operator.id)),
						values: fc.subarray(
							definition.options.map((option) => option.id),
							{ minLength: 1 },
						),
					}),
					{ nil: undefined },
				),
			),
		),
	),
);

describe("filter codec", () => {
	it("decodes what it encodes", () => {
		fc.assert(
			fc.property(scenarioArb, ([definitions, maybeFilters]) => {
				const filters = maybeFilters.filter((filter) => filter !== undefined);
				expect(decodeFilters(definitions, encodeFilters(definitions, filters))).toEqual(filters);
			}),
		);
	});

	it("drops params that name an unknown operator or option", () => {
		fc.assert(
			fc.property(definitionsArb, fc.string(), (definitions, param) => {
				const params = Object.fromEntries(definitions.map((definition) => [definition.id, param]));
				const decoded = decodeFilters(definitions, params);
				for (const filter of decoded) {
					const definition = definitions.find((candidate) => candidate.id === filter.filterId);
					expect(definition?.operators.map((operator) => operator.id)).toContain(filter.operatorId);
					expect(filter.values.length).toBeGreaterThan(0);
					for (const value of filter.values) {
						expect(definition?.options.map((option) => option.id)).toContain(value);
					}
				}
			}),
		);
	});
});
