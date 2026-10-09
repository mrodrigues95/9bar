import { DateFormatter, parseAbsolute } from "@internationalized/date";

const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const SHOT_AT_FORMATTER = new DateFormatter("en-GB", {
	day: "numeric",
	month: "short",
	hour: "numeric",
	minute: "2-digit",
	hour12: true,
	timeZone: TIME_ZONE,
});

export const formatShotAt = (shotAt: string): string => {
	const parts = SHOT_AT_FORMATTER.formatToParts(parseAbsolute(shotAt, TIME_ZONE).toDate());

	return parts
		.map((part) => (part.type === "dayPeriod" ? part.value.toUpperCase() : part.value))
		.join("");
};
