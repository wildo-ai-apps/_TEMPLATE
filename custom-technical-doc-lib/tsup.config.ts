import { defineConfig } from 'tsup'
import { enhanceConfigsWithMinimalOutput } from '../../scripts/tsup-output-formatter.ts'
import { fileURLToPath } from 'url'

const configPath = fileURLToPath(import.meta.url)

export default defineConfig(
  enhanceConfigsWithMinimalOutput(configPath, [
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
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
      '@wildo-ai/saas-models',
      '@wildo-ai/zod-decorators',
    ],
  },
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    dts: false,
    tsconfig: 'tsconfig.tsup.json',
    clean: false,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    target: 'es2022',
    outDir: 'dist/cjs',
    outExtension: () => ({ js: '.js' }),
    external: [
      'zod',
      '@wildo-ai/custom-shared-lib',
      '@wildo-ai/saas-models',
      '@wildo-ai/zod-decorators',
    ],
  },
  ])
)

