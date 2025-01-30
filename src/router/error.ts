/**
 * A component tried to access router context, but it wasn't provided.
 */
export class MissingRouterError extends Error {
	public constructor(where: string) {
		super(`Could not find router context for ${ where }. Make sure the router is provided in the component tree.`);
	}
}
