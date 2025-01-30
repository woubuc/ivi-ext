import { expect, test } from 'bun:test';
import { normalisePath } from './normalise-path.ts';

test('normalise', () => {
	expect(normalisePath('/')).toEqual('/');
	expect(normalisePath('')).toEqual('/');
	expect(normalisePath('///')).toEqual('/');
	expect(normalisePath('//foo')).toEqual('/foo');
	expect(normalisePath('/foo//bar')).toEqual('/foo/bar');
	expect(normalisePath('foo/bar')).toEqual('/foo/bar');
	expect(normalisePath('foo/bar/baz/')).toEqual('/foo/bar/baz');
});
