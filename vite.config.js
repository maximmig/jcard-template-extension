import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        background: './src/background.js',
        content: './src/content.js'
      },
      output: {
        entryFileNames: '[name].js',
      }
    }
  }
});
