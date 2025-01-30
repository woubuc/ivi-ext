import type { VAny } from 'ivi';

/**
 * A route definition.
 */
export interface Route {
	/**
	 * Path to match.
	 *
	 * ### Matching
	 * This path is parsed into segments separated by `/`, with support for:
	 * - '*' to match any value in a segment.
	 * - `:myName` to extract the segment as a route param called `myName`.
	 *
	 * ### Regex
	 * If the value is a regex, all paths will be tested as-is. Named groups
	 * will be extracted as route params.
	 */
	path: string | RegExp;

	/**
	 * The component to render in {@link RouterOutlet} if the path matches.
	 */
	component: (...props: any) => VAny;

	/**
	 * Take the extracted route params and turn them into data.
	 *
	 * The result of this function will be passed as props to the route component.
	 */
	load?: (params: Record<string, string>) => any | Promise<any>;
}

/**
 * A matched route
 *
 * @internal
 */
export interface MatchedRoute extends Route {
	params: Record<string, any>;
}

