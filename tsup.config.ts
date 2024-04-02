import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'scripts/build-uno.ts',
    tailwind: 'scripts/build-tailwind.ts',
  },
  format: ['esm', 'cjs'],
  outExtension({ format }) {
    return {
      js: `.${format === 'esm' ? 'mjs' : 'cjs'}`,
    }
  },
  publicDir: 'public',
  dts: true,
  minify: true,
  splitting: false,
  clean: true,
})
