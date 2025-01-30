import { describe, expect, test } from 'bun:test';
import { transformRoutePath, transformRoutes } from './transform-routes.ts';

test('transformRoutes', () => {
	let transformed = transformRoutes([
		{ path: '/', component: {} as any },
		{ path: '/foo', component: {} as any },
		{ path: '/:bar', component: {} as any },
	]);

	expect(transformed).toBeArrayOfSize(3);
	expect(transformed[0].path).toEqual('/');
	expect(transformed[1].path).toEqual('/foo');
	expect(transformed[2].path).toEqual(/^\/(?<bar>[^/]+)\/?$/);
});

describe('transformRoutePath', () => {
	test('normalise', () => {
		expect(transformRoutePath('a')).toEqual('/a');
		expect(transformRoutePath('/a')).toEqual('/a');
		expect(transformRoutePath('/a/')).toEqual('/a');
		expect(transformRoutePath('a/')).toEqual('/a');
		expect(transformRoutePath('//a')).toEqual('/a');
		expect(transformRoutePath('//a///')).toEqual('/a');
	});

	test('literal paths', () => {
		expect(transformRoutePath('/foo')).toEqual('/foo');
		expect(transformRoutePath('/foo/bar')).toEqual('/foo/bar');

		expect(transformRoutePath('/')).toEqual('/');
		expect(transformRoutePath('')).toEqual('/');
	});

	test('wildcards', () => {
		expect(transformRoutePath('/*')).toEqual('*');
		expect(transformRoutePath('/**')).toEqual('*');

		expect(transformRoutePath('/foo/*')).toEqual(/^\/foo\/([^/]+)\/?$/);
		expect(transformRoutePath('/foo/*/bar')).toEqual(/^\/foo\/([^/]+)\/bar\/?$/);

		expect(transformRoutePath('/foo/**')).toEqual(/^\/foo\/(.+)\/?$/);
		expect(transformRoutePath('/foo/**/bar')).toEqual(/^\/foo\/(.+)\/bar\/?$/);
	});

	test('params', () => {
		expect(transformRoutePath('/:foo')).toEqual(/^\/(?<foo>[^/]+)\/?$/);
		expect(transformRoutePath('/foo/:bar')).toEqual(/^\/foo\/(?<bar>[^/]+)\/?$/);
		expect(transformRoutePath('/foo/:bar/baz')).toEqual(/^\/foo\/(?<bar>[^/]+)\/baz\/?$/);
	});

	test('regex', () => {
		expect(transformRoutePath(/a/)).toEqual(/a/);
		expect(transformRoutePath(/a(.?)b(.+)c/)).toEqual(/a(.?)b(.+)c/);
	});
});
