import * as rollup from 'rollup';
import multiEntry from 'rollup-plugin-multi-entry';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import localResolve from 'rollup-plugin-local-resolve';
import html from 'rollup-plugin-html';
import json from 'rollup-plugin-json';

const core = require ('fit-cli');

let options;


function build () {
	// create a bundle
	let develop = core.args.env() === 'develop';

	if (develop) {
		const eventHandler = (event) => {
			switch (event.code) {
			case 'BUNDLE_END':
				console.log (`${event.input} bundled in ${event.duration}ms`.gray);
				break;
			case 'ERROR':
				console.log (`error: ${event.error}`);
				break;
			}
		};

		try {
			rollup.watch (options).on('event', eventHandler);
		}
		catch (e) {
			core.utils.error ('rollup-bundle', e);
			return false;
		}
		return;
	}
	else {
		let bundle;
		try {
			bundle = rollup.rollup (options);
		}
		catch (e) {
			core.utils.error ('rollup-bundle', e);
			return false;
		}

		// generate code and a sourcemap
		bundle.generate (options.output);

		// or write the bundle to disk
		bundle.write (options.output);
		return;
	}
}

export function init (config) {
	options = {
		input: config.source,
		output: {
			file: config.output,
			format: 'iife'
		},
		plugins: [
			multiEntry(),
			nodeResolve ({
				module: true,
				browser: true,
				jsnext: true,
				main: true,
				preferBuiltins: false
			}),
			localResolve(),
			commonjs ({
				include: 'node_modules/**',
				ignoreGlobal: false,
				sourceMap: false
			}),
			json(),
			html()
		]
	};

	return build();
}
