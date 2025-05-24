import {defineConfig} from 'vite';
import {resolve} from 'path';

export default defineConfig({
  publicDir: 'public',
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.js'),
        content: resolve(__dirname, 'src/content.js')
      },
      output: {
        entryFileNames: '[name].js',
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  }
});
