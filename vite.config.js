import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig(({ mode }) => {
  const isDevMode = mode === 'dev';

  return {
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
      minify: isDevMode ? false : 'esbuild',
      sourcemap: isDevMode,
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
  };
});
