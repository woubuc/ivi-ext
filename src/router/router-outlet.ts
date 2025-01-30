import { component, useState, useUnmount } from 'ivi';
import { MissingRouterError } from './error.ts';
import type { MatchedRoute } from './route.ts';
import { getRouterContext } from './router-context.ts';

const LOADING = Symbol('loading');

/**
 * Renders the currently matched route from the nearest provided router.
 */
export const RouterOutlet = component(c => {
	let router = getRouterContext(c);
	if (router == undefined) {
		throw new MissingRouterError('RouterOutlet');
	}

	router.dependentComponents.add(c);
	useUnmount(c, () => router.dependentComponents.delete(c));

	let currentRoute: MatchedRoute | null = null;
	let [props, setProps] = useState<any | symbol>(c, LOADING);

	return () => {
		let route = router.activeRoute;
		if (route == null) {
			return null;
		}

		if (route !== currentRoute) {
			currentRoute = route;

			if (route.load == undefined) {
				setProps(route.params);
			} else {
				setProps(LOADING);

				Promise.resolve(route.load(route.params))
					.then(p => setProps(p));
			}
		}

		let routeProps = props();
		if (routeProps === LOADING) {
			return null;
		}

		return route.component(routeProps);
	}
});
