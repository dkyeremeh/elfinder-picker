import { defineConfig } from 'vite';
import { resolve } from 'path';

// Check if building library or demo
const buildLibrary = process.env.BUILD_TARGET === 'lib';

export default defineConfig({
  root: buildLibrary ? './' : './',
  publicDir: buildLibrary ? false : 'src/demo',
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
    // Demo build configuration
    outDir: 'dist-demo',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/demo/index.html'),
        basic: resolve(__dirname, 'src/demo/basic.html'),
        image: resolve(__dirname, 'src/demo/image.html'),
        custom: resolve(__dirname, 'src/demo/custom.html'),
        reusable: resolve(__dirname, 'src/demo/reusable.html'),
        mockElfinder: resolve(__dirname, 'src/demo/mock-elfinder.html'),
      }
    }
  },
  server: {
    port: 3000,
    open: '/src/demo/index.html'
  }
});
