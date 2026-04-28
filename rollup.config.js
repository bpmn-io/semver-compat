import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json';

const srcEntry = './src/index.js';

export default [
  {
    input: srcEntry,
    output: [
      { file: pkg.exports['.'].require, format: 'cjs' },
      { file: pkg.exports['.'].import, format: 'es' }
    ],
    plugins: [
      nodeResolve(),
      commonjs()
    ]
  }
];
