import { useAppForm } from "@9bar/toolkit";
import {
	createFileRoute,
	redirect,
	useNavigate,
	useRouteContext,
} from "@tanstack/react-router";
import {
	recipeFormOpts,
	recipeToFormValues,
} from "../../../-form-sections/form-section";
import { RecipeForm } from "../../../-form-sections/recipe-form";

const NewLog = () => {
	const { recipe } = useRouteContext({
		from: "/_authenticated/recipes_/_form/$recipeId_",
	});
	const navigate = useNavigate();
	const { grindSize, grinder, machine, beans } = recipeToFormValues(recipe);

	const form = useAppForm({
		...recipeFormOpts,
		defaultValues: {
			...recipeFormOpts.defaultValues,
			grindSize,
			grinder,
			machine,
			beans,
		},
		onSubmit: async ({ value }) => {
			console.log("Log created:", value);
			navigate({
				to: "/recipes/$recipeId/logs",
				params: { recipeId: recipe.id },
			});
		},
	});

	return <RecipeForm form={form} />;
};

export const Route = createFileRoute(
	"/_authenticated/recipes_/_form/$recipeId_/logs/new",
)({
	beforeLoad: ({ context }) => {
		if (context.recipe.isStandalone) {
			throw redirect({ to: "/recipes/new" });
		}
	},
	component: NewLog,
});
