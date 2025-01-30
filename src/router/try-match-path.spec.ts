import { describe, expect, test } from 'bun:test';
import { transformRoutes } from './transform-routes.ts';
import { tryMatchPath } from './try-match-path.ts';

// Dummy components
const Foo = { foo: 'foo' } as any;
const Bar = { bar: 'bar' } as any;
const Baz = { bar: 'bar' } as any;

test('literal paths', () => {
	let routes = transformRoutes([
		{ path: '/', component: Foo },
	]);

	expect(tryMatchPath('/', routes)).toMatchObject({ component: Foo });
	expect(tryMatchPath('/foo', routes)).toBeNull();
});

test('wildcards', () => {
	let routes = transformRoutes([
		{ path: '/a', component: Foo },
		{ path: '/*', component: Bar },
		{ path: '/b', component: Baz },
	]);

	expect(tryMatchPath('/a', routes)).toMatchObject({ component: Foo });
	expect(tryMatchPath('/b', routes)).toMatchObject({ component: Bar });
	expect(tryMatchPath('/c', routes)).toMatchObject({ component: Bar });
});

test('param', () => {
	let routes = transformRoutes([
		{ path: '/:foo', component: Foo },
		{ path: '/foo/:bar', component: Bar },
		{ path: '/:foo/bar', component: Baz },
	]);

	expect(tryMatchPath('/foo', routes)).toMatchObject({ component: Foo, params: { foo: 'foo' } });
	expect(tryMatchPath('/bar', routes)).toMatchObject({ component: Foo, params: { foo: 'bar' } });

	expect(tryMatchPath('/foo/bar', routes)).toMatchObject({ component: Bar, params: { bar: 'bar' } });
	expect(tryMatchPath('/foo/baz', routes)).toMatchObject({ component: Bar, params: { bar: 'baz' } });
	expect(tryMatchPath('/bar/baz', routes)).toBeNull();

	expect(tryMatchPath('/bar/bar', routes)).toMatchObject({ component: Baz, params: { foo: 'bar' } });
	expect(tryMatchPath('/baz/bar', routes)).toMatchObject({ component: Baz, params: { foo: 'baz' } });
});
