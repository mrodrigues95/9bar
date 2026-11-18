const LATENCY_MIN_MS = 100;
const LATENCY_MAX_MS = 750;

export const simulateLatency = (): Promise<void> => {
	const delay = LATENCY_MIN_MS + Math.random() * (LATENCY_MAX_MS - LATENCY_MIN_MS);
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
};
