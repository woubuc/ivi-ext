import { test, expect, mock } from 'bun:test';

test('state', async () => {
	// Mock ivi's `useState` function which `state` uses internally,
	// since we assume it works correctly.
	let value: any;
	let get = mock(() => value);
	let set = mock((v) => value = v);
	mock.module('ivi', () => ({
		useState(_: any, initialValue: any) {
			value = initialValue;
			return [get, set];
		},
	}));

	// We can only import state after mocking the ivi module, because ivi
	// tries to access browser-specific globals that aren't available in
	// the bun runtime.
	const { state } = await import('./state.ts');


	let s = state(undefined as any, 1);

	expect(s).toBeFunction();
	expect(s.set).toBeFunction();
	expect(s.update).toBeFunction();

	expect(s()).toEqual(1);
	expect(get).toHaveBeenCalled();

	s.set(2);
	expect(s()).toEqual(2);
	expect(set).toHaveBeenCalled();

	s.update(i => i + 1);
	expect(s()).toEqual(3);
});
