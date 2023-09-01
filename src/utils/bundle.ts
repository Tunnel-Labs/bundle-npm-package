import { rollup } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import commonjs from '@rollup/plugin-commonjs';

export async function bundleNpmPackage(pkg: string) {
	const bundle = await rollup({
		input: 'pkg',
		plugins: [
			(virtual.default ?? virtual)({
				pkg: `export * from ${JSON.stringify(pkg)}`
			}),
			(esbuild.default ?? esbuild)({
				loaders: {
					'.ts': 'ts'
				},
				minify: true
			}),
			nodeResolve({ preferBuiltins: true, browser: false }),
			(commonjs.default ?? commonjs)()
		]
	});
	const { output } = await bundle.generate({ format: 'commonjs' });
	return output[0].code;
}
