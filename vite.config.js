import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base: '/beercss-ui-components/', // GitHub Pages base path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});