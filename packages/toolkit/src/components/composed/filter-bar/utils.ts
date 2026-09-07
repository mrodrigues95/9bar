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
