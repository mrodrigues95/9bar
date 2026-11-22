export const logStubSave = <TValue>(label: string, value: TValue) => {
	// oxlint-disable-next-line no-console -- saves are stubs until their server fns land (docs/todo.md); verify-web proves a save through this console line.
	console.log(label, value);
};
