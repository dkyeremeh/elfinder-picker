import { defineConfig } from 'vite';
import { resolve } from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// Check if building library or demo
const buildLibrary = process.env.BUILD_TARGET === 'lib';

export default defineConfig({
  plugins: buildLibrary ? [cssInjectedByJsPlugin()] : [],
  root: buildLibrary ? './' : 'demo',
  publicDir: buildLibrary ? false : 'demo',
  build: buildLibrary ? {
    // Library build configuration
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ElFinderPicker',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: [],
      output: {
        // Provide global variables for UMD build
        globals: {}
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true
  } : {
    // Demo build configuration (serve static files from demo/)
    outDir: 'dist-demo'
  },
  server: {
    port: 3000,
    open: '/index.html'
  },
});
