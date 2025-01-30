import { type Component, context } from 'ivi';
import type { MatchedRoute } from './route.ts';

/**
 * Provided context for the router components.
 *
 * @internal
 */
export interface RouterContext {
	/**
	 * Currently matched route.
	 */
	activeRoute: MatchedRoute | null;

	/**
	 * Components that are dependent on the active route in some way.
	 *
	 * These will be invalidated when the route changes.
	 */
	dependentComponents: Set<Component>;

	/**
	 * Navigates to a path.
	 */
	navigate(path: string): void;

	/**
	 * Sets the active route and updates the router outlet, but does not
	 * manipulate the browser's history. For most use cases, you'll want
	 * {@link RouterContext#navigate} instead.
	 */
	setRoute(path: string): void;
}

export const [getRouterContext, provideRouterContext] = context<RouterContext>();
