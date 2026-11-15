import type { ActionsMenuItem } from "./actions-menu";

export interface ActionDefinition<TContext> {
	isAvailable?: (context: TContext) => boolean;
	build: (context: TContext) => ActionsMenuItem;
}

export const resolveActionDefinitions = <TContext>(
	definitions: Array<ActionDefinition<TContext>>,
	context: NoInfer<TContext>,
) =>
	definitions
		.filter((definition) => definition.isAvailable?.(context) ?? true)
		.map((definition) => definition.build(context));
