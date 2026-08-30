import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Checkbox,
	Form,
	SelectItem,
	useAppForm,
} from "../../components";

/** A realistic "new recipe" form exercising every form-connected field in one composition. */
export const FormSection = () => {
	const form = useAppForm({
		defaultValues: {
			recipeName: "Honey Blend",
			notes: "Chocolate, caramel, and a bright citrus finish.",
			method: "espresso",
			dose: { inputValue: "18", selectValue: "g" },
			reminders: ["low-stock"] as Array<string>,
			shared: true,
		},
		validators: {
			onChange: ({ value }) => {
				const fields: { recipeName?: string; reminders?: string } = {};

				if (!value.recipeName) {
					fields.recipeName = "Give the recipe a name";
				}

				if (!value.reminders.length) {
					fields.reminders = "Pick at least one reminder";
				}

				return { fields };
			},
		},
		onSubmit: async ({ value }) => {
			alert(`Saved recipe: ${JSON.stringify(value, null, 2)}`);
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recipe details</CardTitle>
				<CardDescription>
					Every form-connected field composed in a single form.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					validationBehavior="aria"
				>
					<form.AppForm>
						<div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
							<form.AppField name="recipeName">
								{(field) => <field.Input label="Recipe name" isRequired />}
							</form.AppField>
							<form.AppField name="method">
								{(field) => (
									<field.Select
										label="Brew method"
										description="How this recipe is prepared"
										placeholder="Choose a method..."
										items={[
											{ id: "espresso", name: "Espresso" },
											{ id: "pour-over", name: "Pour over" },
											{ id: "aeropress", name: "AeroPress" },
											{ id: "moka-pot", name: "Moka pot" },
										]}
									>
										{(item) => (
											<SelectItem id={item.id}>{item.name}</SelectItem>
										)}
									</field.Select>
								)}
							</form.AppField>
							<form.AppField name="dose">
								{(field) => (
									<field.InputGroupSelect
										label="Dose"
										description="Ground coffee per shot"
										items={[
											{ id: "g", label: "grams" },
											{ id: "oz", label: "ounces" },
										]}
										inputProps={{ type: "number", min: "0", step: "0.1" }}
									/>
								)}
							</form.AppField>
							<form.AppField name="reminders">
								{(field) => (
									<field.CheckboxGroup
										label="Reminders"
										description="When should 9bar nudge you?"
										isRequired
									>
										<Checkbox value="morning-shot">Morning shot log</Checkbox>
										<Checkbox value="low-stock">Low bean stock alerts</Checkbox>
										<Checkbox value="grinder-check">
											Weekly grinder check
										</Checkbox>
									</field.CheckboxGroup>
								)}
							</form.AppField>
							<form.AppField name="notes">
								{(field) => (
									<field.Textarea
										label="Tasting notes"
										description="What to look for in the cup"
										className="sm:col-span-2"
									/>
								)}
							</form.AppField>
							<form.AppField name="shared">
								{(field) => (
									<field.Checkbox
										label="Share recipe with other brewers"
										description="Visible on your public profile"
									/>
								)}
							</form.AppField>
						</div>
						<div className="mt-5 flex justify-end gap-2">
							<Button type="button" variant="ghost">
								Cancel
							</Button>
							<form.SubmitButton>Save recipe</form.SubmitButton>
						</div>
					</form.AppForm>
				</Form>
			</CardContent>
		</Card>
	);
};
