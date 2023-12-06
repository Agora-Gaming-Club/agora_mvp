import { resolve } from 'path';
import react from '@vitejs/plugin-react';

module.exports = {
  // this was changed
  plugins: [
    react({
      include: '**/*.disabled',
    }),
  ],
  root: resolve('./frontend'),
  base: '/static/',
  server: {
    host: 'localhost',
    port: 5172,
    open: false,
    watch: {
      usePolling: true,
      disableGlobbing: false,
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: [{ find: '@', replacement: resolve(__dirname, './frontend/src') }],
  },
  build: {
    outDir: resolve(__dirname, './static/dist'), // Outputs the build files in /static/dist/js
    assetsDir: '',
    manifest: true,
    emptyOutDir: true,
    target: 'es2015',
    rollupOptions: {
      input: {
        main: resolve('./frontend/src/main.tsx'), // <- renamed from main.tsx
      },
      output: {
        chunkFileNames: undefined,
      },
    },
  },
};
