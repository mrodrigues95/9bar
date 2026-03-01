import { createFileRoute, Outlet } from "@tanstack/react-router";
import { withBreadcrumb } from "../../../../../../components";

export const Route = createFileRoute(
	"/_authenticated/recipes_/_form/$recipeId_/logs",
)({
	component: () => <Outlet />,
	loader: ({ context }) => {
		return withBreadcrumb(
			{},
			{
				label: "Logs",
				disabled: context.recipe.isQuickBrew,
			},
		);
	},
});
