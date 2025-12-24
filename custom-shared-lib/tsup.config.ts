import { defineConfig } from 'tsup'

export default defineConfig([
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
      '@wildo-ai/saas-models',
      '@wildo-ai/presets-components-models',
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
      '@wildo-ai/saas-models',
      '@wildo-ai/presets-components-models',
      '@wildo-ai/zod-decorators',
    ],
  },
])

