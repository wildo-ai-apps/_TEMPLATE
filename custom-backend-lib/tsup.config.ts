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
      'zod',
      '@wildo-ai/custom-shared-lib',
      '@wildo-ai/saas-backend-lib',
      '@wildo-ai/saas-models',
      '@wildo-ai/external-connectors',
      '@wildo-ai/external-connectors-models',
      '@wildo-ai/zod-decorators',
    ],
  },
  ])
)

