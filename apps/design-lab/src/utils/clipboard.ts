export const copyText = async (text: string) => {
	if (!("clipboard" in navigator)) {
		return false;
	}
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
};
