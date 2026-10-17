import { fromDateToLocal, toCalendarDateTime } from "@internationalized/date";
import z from "zod";
import type { InputGroupSelectFieldValue } from "@9bar/toolkit/components/composed";
import type { BrewSnapshot, Method } from "../../../../../utils/data";

export interface BasicInformationValues {
	method: Method;
	beans: string;
	grinder: string;
	machine: string;
}

export interface BrewParametersValues {
	grindSize: string;
	dose: number;
	yield: number;
	brewTime: InputGroupSelectFieldValue<number, "s" | "m">;
	temperature: InputGroupSelectFieldValue<number, "C" | "F">;
	pressure: number;
}

export interface AdditionalDetailsValues {
	notes: string;
}

export type BrewFormFields = BasicInformationValues &
	BrewParametersValues &
	AdditionalDetailsValues;

/**
 * Coerces a string (from an HTML input) to a number while preserving the `number`
 * input type for StandardSchema compatibility.
 */
export const coercedNumber = (checks: (n: z.ZodNumber) => z.ZodNumber = (n) => n) =>
	z.pipe(
		z.transform<number, number>((val) => Number(val)),
		checks(z.number()),
	);

export const inputGroupSelectValue = <const T extends readonly [string, ...Array<string>]>(
	selectValue: T,
	message: string,
) =>
	z
		.object({
			inputValue: coercedNumber(),
			selectValue: z.enum(selectValue),
		})
		.refine(({ inputValue }) => inputValue >= 0, { message });

export const toFormDateTime = (date: Date) => {
	return toCalendarDateTime(fromDateToLocal(date)).set({ millisecond: 0 });
};

export const nowAsCalendarDateTime = () => {
	return toFormDateTime(new Date());
};

export const snapshotToFormFields = (snapshot: BrewSnapshot): BrewFormFields => {
	return {
		method: snapshot.method,
		beans: snapshot.beans,
		grinder: snapshot.grinder,
		machine: snapshot.machine,
		grindSize: snapshot.grindSize,
		dose: snapshot.dose,
		yield: snapshot.yield,
		brewTime: {
			inputValue: snapshot.brewTime,
			selectValue: snapshot.brewTimeUnit,
		},
		temperature: {
			inputValue: snapshot.temperature,
			selectValue: snapshot.temperatureUnit,
		},
		pressure: snapshot.pressure,
		notes: snapshot.notes ?? "",
	};
};
