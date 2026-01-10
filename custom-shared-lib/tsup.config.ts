import { defineConfig } from 'tsup'
import { enhanceConfigsWithMinimalOutput } from '../scripts/tsup-output-formatter.ts'
import { fileURLToPath } from 'node:url'

const configPath = fileURLToPath(import.meta.url)

export default defineConfig(
  enhanceConfigsWithMinimalOutput(configPath, [
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: false, // DTS generation via build:types script (OXC)
    tsconfig: 'tsconfig.tsup.json',
    clean: false,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    target: 'es2022',
    outDir: 'dist/esm',
    external: [
      '@wildo-ai/presets-components-models',
      '@wildo-ai/saas-models',
      '@wildo-ai/zod-decorators',
      'big.js',
      'date-fns',
      'inversify',
      'jsonwebtoken',
      'lodash',
      'mime',
      'reflect-metadata',
      'ufo',
      'uuid',
      'yaml',
      'zod',
    ],
  },
  ])
)
