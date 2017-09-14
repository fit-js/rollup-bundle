import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
	input: './module',
	output: {
		file: 'bundle.js',
		name: 'rollup-bundle',
		format: 'cjs'
	},
	external: [
		'matched',
		'resolve',
		'uglify-js',

		'fs',
		'path',
		'process',
		'events',
		'module',
		'http',
		'https',
		'os',
		'url'
	],
	plugins: [
		nodeResolve ({
			module: true,
			main: true,
			preferBuiltins: true
		}),
		commonjs ({
			include: 'node_modules/**',
			exclude: 'node_modules/resolve/**',
			ignoreGlobal: true,
			sourceMap: false,
			namedExports: {
				'minimatch': ['Minimatch']
			}
		}),
		json()
	]
};


/**
	node_modules/rollup-plugin-commonjs/dist/rollup-plugin-commonjs.es.js
	[@todo find & replace]
		line 5:
		import acorn from 'acorn';
	replace with
		import * as acorn from 'acorn';
*/
