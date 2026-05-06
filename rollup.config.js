import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json' with { type: 'json' };

const srcEntry = './src/index.js';

export default [
  {
    input: srcEntry,
    output: [
      {
        format: 'es',
        file: pkg.exports['.'].default,
        sourcemap: true
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs()
    ]
  }
];
