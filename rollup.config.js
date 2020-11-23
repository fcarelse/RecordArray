const dist = 'dist';
const bundle = 'RecordArray';
const fs = require('fs');
const {version} = require('./package.json');
const json = require('@rollup/plugin-json');

if(!fs.existsSync(dist)) fs.mkdirSync(dist);

const production = !process.env.ROLLUP_WATCH
//rollup index.js --file nhm-client.js --format iife --name nhmIIFE
export default {
	// external: ['moment'],
	input: 'src/index.js',
	output: [
		{
			name: 'nhmIIFE',
			file: `${dist}/${bundle}.js`,
			format: 'iife',
			globals: {
				// 'moment': 'moment',
			}
		},
		{
			name: 'RecordArray',
			file: `${dist}/${bundle}-${version}.js`,
			format: 'iife',
			globals: {
				// 'moment': 'moment',
			}
		}
	],
	plugins:[json()]
}