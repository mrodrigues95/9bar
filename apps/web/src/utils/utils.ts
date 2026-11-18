// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- SAFETY: Object.keys returns the object's own keys; the assertion recovers the key type the standard library erases.
export const objectKeys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>;

export const toLabels = <T extends string>(options: ReadonlyArray<{ id: T; name: string }>) => {
	const labels: Partial<Record<T, string>> = {};
	for (const option of options) {
		labels[option.id] = option.name;
	}
	return labels;
};
