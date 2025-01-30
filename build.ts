import type { BuildConfig } from 'bun';
import dts from 'bun-plugin-dts';
import { rm } from 'node:fs/promises';

await rm('./dist', { recursive: true, force: true });

const defaultBuildConfig: BuildConfig = {
	entrypoints: [
		'src/state.ts',
		'src/router.ts',
	],
	outdir: './dist',
	sourcemap: 'linked',

	target: 'node',
	packages: 'external',

	throw: true,
};

await Promise.all([
	Bun.build({
		...defaultBuildConfig,
		plugins: [dts()], // We only need to generate the types once.
		format: 'esm',
		naming: '[dir]/[name].js',
	}),
	Bun.build({
		...defaultBuildConfig,
		format: 'cjs',
		naming: '[dir]/[name].cjs',
	}),
]);

console.log('Build completed.');
