import { normalisePath } from './normalise-path.ts';
import type { MatchedRoute, Route } from './route.ts';

/**
 * Finds a route that matches a given path.
 *
 * @param path - The path to match against each route.
 * @param routes - The configured route map.
 *
 * @returns The first matching route and its extracted params, or `null` if no routes match.
 *
 * @internal
 */
export function tryMatchPath(path: string, routes: Route[]): MatchedRoute | null {
	path = normalisePath(path);

	// Go through the routes in order until we find one that matches.
	for (let route of routes) {
		if (route.path === '*') {
			return { ...route, params: {} };
		}

		if (route.path === path) {
			return { ...route, params: {} };
		}

		if (route.path instanceof RegExp && route.path.test(path)) {
			let matches = route.path.exec(path);
			return { ...route, params: matches?.groups ?? {} };
		}
	}

	return null;
}
