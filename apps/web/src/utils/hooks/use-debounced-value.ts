import { useEffect, useState } from "react";

export const useDebouncedValue = <T>(value: T, wait: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, wait);
		return () => {
			clearTimeout(timer);
		};
	}, [value, wait]);

	return debouncedValue;
};
