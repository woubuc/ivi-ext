import { type Component, useState } from 'ivi';

/**
 * Methods to add to the state function
 */
interface StateMethods<T> {
	/**
	 * Set the value of the state directly.
	 *
	 * @param value - The new value to set.
	 */
	set(value: T): void;

	/**
	 * Modify the state based on its current value.
	 *
	 * @param updater - Function that receives the current state and returns the new state.
	 */
	update(updater: (value: T) => T): void;
}

/**
 * A state signal
 */
export type State<T> = (() => T) & StateMethods<T>;

/**
 * Creates a new reactive state signal.
 *
 * @param c - The component
 * @param initialState - Initial value of the state.
 *
 * @example
 * ```ts
 * component(c => {
 * 	 let count = state(c, 0);
 *
 * 	 count();
 * 	 count.set(1);
 * 	 count.update(i => i + 1);
 * })
 * ```
 */
export function state<T>(c: Component, initialState: T): State<T> {
	let [get, set] = useState(c, initialState);

	return Object.assign(get, {
		set,
		update(updater) {
			set(updater(get()));
		},
	} satisfies StateMethods<T>);
}
