import { createFieldMap } from "@tanstack/react-form";
import { SelectItem } from "@9bar/toolkit/components";
import { withFieldGroup } from "@9bar/toolkit/components/composed";
import { GRINDER_OPTIONS, MACHINE_OPTIONS, METHOD_OPTIONS } from "../../../../../utils/data";
import type { BasicInformationValues } from "../schemas/field-schema";
import { FormSection } from "./form-section";

export const basicInformationDefaults: BasicInformationValues = {
	method: "espresso",
	beans: "",
	grinder: "",
	machine: "",
};

export const basicInformationFields = createFieldMap(basicInformationDefaults);

interface BasicInformationFieldsProps {
	isIdentityLocked?: boolean;
	isIdentityRequired?: boolean;
}

const basicInformationProps: BasicInformationFieldsProps = {
	isIdentityLocked: false,
	isIdentityRequired: false,
};

export const BasicInformationFields = withFieldGroup({
	defaultValues: basicInformationDefaults,
	props: basicInformationProps,
	render: function Render({ group, isIdentityLocked, isIdentityRequired, children }) {
		return (
			<FormSection title="Basic Information">
				{children}
				<group.AppField name="method">
					{(field) => (
						<field.Select
							label="Method"
							description="The method used to prepare this coffee."
							isRequired
							items={METHOD_OPTIONS}
						>
							{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
						</field.Select>
					)}
				</group.AppField>
				<group.AppField name="beans">
					{(field) => (
						<field.Input
							label="Beans"
							description="The coffee beans or blend used."
							maxLength={150}
							isDisabled={isIdentityLocked}
							isRequired={isIdentityRequired}
						/>
					)}
				</group.AppField>
				<group.AppField name="grinder">
					{(field) => (
						<field.Select
							label="Grinder"
							description="The grinder used to grind your coffee."
							placeholder="Select a grinder"
							items={GRINDER_OPTIONS}
							isDisabled={isIdentityLocked}
							isRequired={isIdentityRequired}
						>
							{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
						</field.Select>
					)}
				</group.AppField>
				<group.AppField name="machine">
					{(field) => (
						<field.Select
							label="Machine"
							description="The machine used to brew."
							placeholder="Select a machine"
							items={MACHINE_OPTIONS}
							isDisabled={isIdentityLocked}
							isRequired={isIdentityRequired}
						>
							{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
						</field.Select>
					)}
				</group.AppField>
			</FormSection>
		);
	},
});
