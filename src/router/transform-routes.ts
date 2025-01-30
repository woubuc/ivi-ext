import { normalisePath } from './normalise-path.ts';
import type { Route } from './route.ts';

/**
 * The regex used to match a path section. Each section is assumed to not
 * include path separators (`/`).
 *
 * Extracts several named groups:
 * - `param`: Set if the section is a named route parameter. The value
 *            will be the param name.
 * - `wildcard`: Set if the section is a wildcard. The value will be
 *               `*` (single-section wildcard) or `**` (glob wildcard).
 * - `literal`: A plain value to be matched literally.
 *
 * @internal
 */
const PATH_RE = /^(:(?<param>[a-zA-Z0-9]+))|(?<wildcard>\*\*?)|(?<literal>[a-zA-Z0-9_-]+)$/;

/**
 * Processes the routes for use by the router.
 *
 * @param routes - Input route map.
 *
 * @returns The processed route map.
 *
 * @internal
 */
export function transformRoutes(routes: Route[]): Route[] {
	for (let route of routes) {
		route.path = transformRoutePath(route.path);
	}

	return routes;
}

/**
 * Processes the input path of a route and returns a matcher that the router can use.
 *
 * @param path - The input path.
 *
 * @returns - A literal path or a regex to match.
 *
 * @internal
 */
export function transformRoutePath(path: string | RegExp): string | RegExp {
	// We pass regexes through unmodified.
	if (path instanceof RegExp) {
		return path;
	}

	path = normalisePath(path).slice(1); // Remove the leading slash

	// Return literal path shortcuts to avoid more expensive regex matching
	if (path === '') {
		return '/';
	}
	if (path === '*' || path === '**') {
		return '*';
	}

	// Keep track of dynamic sections, we don't need to make a RegExp if we're just testing a static route.
	let isRegex = false;

	// Split the path into sections based on the divider `/`. Then we can
	// process each section separately. This avoids the massive recursive regex
	// we'd need to parse an entire path in one go.
	let sections = path.split('/').map(section => {
		section = section.trim();

		let matches = PATH_RE.exec(section);

		// If the regex doesn't match, the most litely scenario is unsupported
		// characters in the path. We treat this as a regular literal value.
		if (matches == null || matches.groups == undefined) {
			console.warn(`Router: unrecognised path section: ${ section }`);
			return section;
		}

		// Return literal value if found.
		if (matches.groups.literal != undefined) {
			return matches.groups.literal;
		}

		// If this is a wildcard section, we return the regex corresponding to
		// which wildcard was used.
		if (matches.groups.wildcard !== undefined) {
			isRegex = true;
			if (matches.groups.wildcard === '**') {
				return '(.+)';
			} else {
				return '([^/]+)';
			}
		}

		// For named params, we return a named group for the output regex.
		if (matches.groups.param != undefined) {
			isRegex = true;
			let name = matches.groups.param;
			return `(?<${ name }>[^/]+)`;
		}

		throw new Error('unrecognised path match');
	});

	// If the sections contained any dynamic code, parse the returned sections
	// into a regex. Otherwise, we can just return the literal values as a string
	// for more efficient string comparison.
	if (isRegex) {
		return new RegExp(`^\\/${ sections.join('\\/') }\\/?$`);
	} else {
		return '/' + sections.join('/');
	}
}
