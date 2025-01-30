/**
 * Normalises a given URL path.
 *
 * - Removes double slashes
 * - Removes trailing slash
 * - Adds leading slash
 *
 * @param path - The path to normalise
 */
export function normalisePath(path: string): string {
	path = path.trim();

	if (path.includes('//')) {
		path = path.replaceAll(/\/+/g, '/');
	}

	if (path.endsWith('/')) {
		path = path.slice(0, path.length - 1);
	}
	if (!path.startsWith('/')) {
		path = '/' + path;
	}

	return path;
}
