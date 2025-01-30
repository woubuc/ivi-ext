import { invalidate, type VAny } from 'ivi';
import { type Route } from './route.ts';
import { provideRouterContext, type RouterContext } from './router-context.ts';
import { transformRoutePath } from './transform-routes.ts';
import { tryMatchPath } from './try-match-path.ts';

/**
 * Base router API.
 */
export interface Router {
	/**
	 * Navigates the router to a new path.
	 */
	navigate(path: string): void;

	/**
	 * Provides the router context for all components that need it.
	 *
	 * Router context is required for:
	 * - {@link routerLink}
	 * - {@link RouterOutlet}
	 *
	 * @param child - Child element(s) to render.
	 */
	provide(child: VAny): VAny;
}

/**
 * A router for ivi.
 *
 * Use the {@link RouterOutlet} component to render the matched route and
 * {@link routerLink} for
 *
 * @param routes - The route map for this router.
 *
 * @returns The router API.
 *
 * @example
 * ```ts
 * let router = createRouter([
 *   { path: '/', component: HomePageComponent },
 * ]);
 *
 * update(
 *   createRoot(document.body),
 *   router.provide(App())
 * );
 * ```
 */
export function createRouter(routes: Route[]): Router {
	// First we need to transform the route string syntax into matchers that
	// our router can handle.
	for (let route of routes) {
		route.path = transformRoutePath(route.path);
	}

	// Create the context for this router. This will be provided through
	// Router#provide, so other components and functions can access it.
	let ctx: RouterContext = {
		dependentComponents: new Set(),
		activeRoute: null,

		navigate(path: string) {
			this.setRoute(path);
			window.history.pushState(null, '', path);
		},
		setRoute(path: string) {
			this.activeRoute = tryMatchPath(path, routes);

			for (let c of this.dependentComponents) {
				invalidate(c);
			}
		},
	};

	// Set the initial current route.
	ctx.setRoute(window.location.pathname);

	// Handle browser route changes
	window.addEventListener('popstate', () => ctx.setRoute(window.location.pathname));

	return {
		navigate(path: string) {
			ctx.navigate(path);
		},
		provide(child: VAny): VAny {
			return provideRouterContext(ctx, child);
		},
	};
}
