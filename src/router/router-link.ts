import type { Component, ElementDirective } from 'ivi';
import { MissingRouterError } from './error.ts';
import { getRouterContext } from './router-context.ts';

/**
 * A directive to apply a same-page navigation link to an element. When clicked,
 * the active router will navigate to the `path` without needing a page reload.
 *
 * Requires a router context provided by {@link Router#provide}.
 *
 * Router links use a click event so this directive can be used on any element.
 * If used on an <a> tag, the directive will set its `href` attribute to match.
 *
 * @param c - Current component.
 * @param path - Path to navigate to.
 *
 * @example
 * ```ts
 * component(c => {
 *   return () => html`
 *     <a ${ routerLink(c, '/foo') }>Link to /foo</a>
 *     <button ${ routerLink(c, '/bar') }>Click me to go to /bar</button>
 *   `;
 * });
 * ```
 */
export function routerLink(c: Component, path: string): ElementDirective {
	return (el) => {
		if (el instanceof HTMLAnchorElement) {
			el.href = path;
		}

		let router = getRouterContext(c);
		if (router == undefined) {
			throw new MissingRouterError('routerLink');
		}

		el.addEventListener('click', evt => {
			evt.preventDefault();
			evt.stopImmediatePropagation();

			router.navigate(path);
		});
	};
}
