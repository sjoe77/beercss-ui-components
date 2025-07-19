import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'BeerCSSUIComponents',
      fileName: (format) => `ui-components.${format === 'es' ? 'esm' : format}.js`,
      formats: ['es', 'umd']
    },
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  }
});