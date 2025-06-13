import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        background: './src/background.js',
        content: './src/content.js',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
    minify: 'esbuild',
  },
  plugins: [
    eslint({
      cache: false,
      fix: true,
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
